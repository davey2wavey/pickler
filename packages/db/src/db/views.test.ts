// The three views do the money math. Each test owns its data through a throwaway user.
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { deleteUser, makeUser } from "../test/users";
import type { TestUser } from "../test/users";
import { daysAgo } from "./dates";

const users: TestUser[] = [];

async function user(): Promise<TestUser> {
  const u = await makeUser();
  users.push(u);
  return u;
}

async function account(u: TestUser, name: string, type: "checking" | "credit", opening: number) {
  const { data, error } = await u.db
    .from("accounts")
    .insert({ name, type, opening_balance: opening, opening_at: daysAgo(120) })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

async function spend(
  u: TestUser,
  accountId: string,
  amount: number,
  occurredAt: string,
  extra = {},
) {
  const { error } = await u.db
    .from("transactions")
    .insert({ account_id: accountId, amount, occurred_at: occurredAt, ...extra });
  if (error) throw error;
}

afterAll(async () => {
  await Promise.all(users.map(deleteUser));
});

describe("account_balances", () => {
  let u: TestUser;
  let withTxns: string;
  let empty: string;

  beforeAll(async () => {
    u = await user();
    withTxns = await account(u, "Checking", "checking", 100);
    empty = await account(u, "Idle", "checking", 42.5);
    await spend(u, withTxns, 50, daysAgo(3));
    await spend(u, withTxns, -20, daysAgo(2));
  });

  test("opening plus every transaction", async () => {
    const { data } = await u.db.from("account_balances").select("id, balance").eq("id", withTxns);
    expect(data?.[0]?.balance).toBe(130);
  });

  test("no transactions means the opening balance", async () => {
    const { data } = await u.db.from("account_balances").select("balance").eq("id", empty);
    expect(data?.[0]?.balance).toBe(42.5);
  });
});

describe("monthly_spend", () => {
  test("sums money out and ignores transfers and income", async () => {
    const u = await user();
    const checking = await account(u, "Checking", "checking", 1000);
    const credit = await account(u, "Card", "credit", 0);
    const { data: cat } = await u.db
      .from("categories")
      .insert({ name: "Groceries", kind: "spend" })
      .select("id")
      .single();
    const day = daysAgo(1);
    const group = crypto.randomUUID();
    await spend(u, checking, -20, day, { category_id: cat!.id });
    await spend(u, checking, -15.5, day, { category_id: cat!.id });
    await spend(u, checking, 300, day);
    await spend(u, checking, -500, day, { transfer_group: group });
    await spend(u, credit, 500, day, { transfer_group: group });

    const { data } = await u.db.from("monthly_spend").select("month, category_id, spend");
    expect(data).toEqual([{ month: `${day.slice(0, 7)}-01`, category_id: cat!.id, spend: 35.5 }]);
  });
});

describe("runway_days", () => {
  test("null with fewer than 30 days of data", async () => {
    const u = await user();
    const checking = await account(u, "Checking", "checking", 5000);
    await spend(u, checking, -100, daysAgo(10));
    await spend(u, checking, -100, daysAgo(1));

    const { data } = await u.db.from("runway_days").select("days, days_of_data").single();
    expect(data?.days_of_data).toBeLessThan(30);
    expect(data?.days).toBeNull();
  });

  test("cash over trailing average daily outflow, credit excluded", async () => {
    const u = await user();
    const checking = await account(u, "Checking", "checking", 9000);
    const credit = await account(u, "Card", "credit", -100);
    await spend(u, checking, -900, daysAgo(89));
    await spend(u, checking, -900, daysAgo(45));
    await spend(u, checking, -900, daysAgo(1));
    await spend(u, credit, -50, daysAgo(2));

    const { data } = await u.db
      .from("runway_days")
      .select("days, days_of_data, cash, daily_outflow")
      .single();
    const daysOfData = data!.days_of_data!;
    expect(daysOfData).toBeGreaterThanOrEqual(88);
    expect(daysOfData).toBeLessThanOrEqual(90);
    // Checking only: 9000 - 2700. The card's -100 opening and -50 charge do not count as cash.
    expect(data!.cash).toBe(6300);
    const outflow = 2700 + 50;
    expect(data!.days).toBe(Math.round(6300 / (outflow / Math.min(90, daysOfData))));
  });
});
