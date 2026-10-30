// Every table is owner-only. Proven behaviorally through the API, one table at a time.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, inject, test } from "vitest";
import type { Database } from "../types";
import { deleteUser, makeUser } from "../test/users";
import type { TestUser } from "../test/users";
import { daysAgo } from "./dates";

type TableName = keyof Database["public"]["Tables"];

let owner: TestUser;
let other: TestUser;
const ids: Partial<Record<TableName, string>> = {};

async function insertOne<T extends TableName>(
  table: T,
  row: Database["public"]["Tables"][T]["Insert"],
): Promise<string> {
  // The cast keeps one helper for seven tables. Every table has an id column.
  const { data, error } = await owner.db
    .from(table as "accounts")
    .insert(row as never)
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

beforeAll(async () => {
  owner = await makeUser();
  other = await makeUser();
  ids.accounts = await insertOne("accounts", { name: "Checking", type: "checking" });
  ids.categories = await insertOne("categories", { name: "Rent", kind: "spend" });
  ids.transactions = await insertOne("transactions", {
    account_id: ids.accounts,
    occurred_at: daysAgo(1),
    amount: -10,
  });
  ids.plans = await insertOne("plans", { name: "Trips" });
  ids.plan_items = await insertOne("plan_items", { plan_id: ids.plans, name: "Japan" });
  ids.expected = await insertOne("expected", { name: "Rent", amount: 1650, due_at: daysAgo(-10) });
  ids.budgets = await insertOne("budgets", {
    category_id: ids.categories,
    month: `${daysAgo(0).slice(0, 7)}-01`,
    amount: 400,
  });
});

afterAll(async () => {
  await deleteUser(owner);
  await deleteUser(other);
});

const tables: TableName[] = [
  "accounts",
  "categories",
  "transactions",
  "plans",
  "plan_items",
  "expected",
  "budgets",
];

describe.each(tables)("%s", (table) => {
  // All seven tables share id and user_id; the cast keeps the loop generic.
  const as = table as "accounts";

  test("owner reads their row", async () => {
    const { data, error } = await owner.db.from(as).select("id").eq("id", ids[table]!);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  test("another user sees nothing", async () => {
    const { data, error } = await other.db.from(as).select("id").eq("id", ids[table]!);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  test("another user cannot take it over", async () => {
    const { data, error } = await other.db
      .from(as)
      .update({ user_id: other.id })
      .eq("id", ids[table]!)
      .select("id");
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  test("another user cannot delete it", async () => {
    const { data, error } = await other.db.from(as).delete().eq("id", ids[table]!).select("id");
    expect(error).toBeNull();
    expect(data).toEqual([]);
    const still = await owner.db.from(as).select("id").eq("id", ids[table]!);
    expect(still.data).toHaveLength(1);
  });
});

test("a user cannot insert a row owned by someone else", async () => {
  const { error } = await other.db
    .from("accounts")
    .insert({ user_id: owner.id, name: "Not mine", type: "cash" });
  expect(error?.code).toBe("42501");
});

test("anonymous sees nothing", async () => {
  const { API_URL, ANON_KEY } = inject("supabase");
  const anon = createSupabaseClient<Database>(API_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data } = await anon.from("accounts").select("id").eq("id", ids.accounts!);
  expect(data).toEqual([]);
});
