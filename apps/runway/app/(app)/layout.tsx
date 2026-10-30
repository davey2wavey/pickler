import type { ReactNode } from "react";
import { requireUser } from "../../lib/auth";
import { createClient } from "../../lib/supabase/server";
import { Shell } from "./shell";
import type { AccountSummary } from "./shell";

export const dynamic = "force-dynamic";

async function readAccounts(): Promise<AccountSummary[]> {
  const db = await createClient();
  const { data, error } = await db
    .from("account_balances")
    .select("id, name, balance, archived")
    .eq("archived", false)
    .order("sort");
  if (error) throw new Error(error.message);
  return data.map((row) => ({ id: row.id, name: row.name, balance: row.balance ?? 0 }));
}

export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireUser();
  const accounts = await readAccounts();
  return <Shell accounts={accounts}>{children}</Shell>;
}
