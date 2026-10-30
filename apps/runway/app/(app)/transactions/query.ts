import type { DbClient } from "@pickler/db";
import { monthRange } from "../../../lib/month";
import type { Month } from "../../../lib/month";

export type TransactionRow = {
  id: string;
  occurred_at: string;
  payee: string;
  amount: number;
  transfer_group: string | null;
  account: string;
  category: string | null;
};

export type AccountOption = { id: string; name: string };
export type CategoryOption = { id: string; name: string; kind: "spend" | "income" };

/** One month of the signed-in user's transactions, newest first. RLS scopes the rows. */
export async function readTransactions(db: DbClient, month: Month): Promise<TransactionRow[]> {
  const { from, to } = monthRange(month);
  const { data, error } = await db
    .from("transactions")
    .select("id, occurred_at, payee, amount, transfer_group, accounts(name), categories(name)")
    .gte("occurred_at", from)
    .lt("occurred_at", to)
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data.map((row) => ({
    id: row.id,
    occurred_at: row.occurred_at,
    payee: row.payee,
    amount: row.amount,
    transfer_group: row.transfer_group,
    account: row.accounts?.name ?? "",
    category: row.categories?.name ?? null,
  }));
}

export async function readAccountOptions(db: DbClient): Promise<AccountOption[]> {
  const { data, error } = await db
    .from("accounts")
    .select("id, name")
    .eq("archived", false)
    .order("sort");
  if (error) throw new Error(error.message);
  return data;
}

export async function readCategoryOptions(db: DbClient): Promise<CategoryOption[]> {
  const { data, error } = await db.from("categories").select("id, name, kind").order("sort");
  if (error) throw new Error(error.message);
  return data;
}
