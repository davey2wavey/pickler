import { parseMonth, todayIso } from "../../../lib/month";
import { createClient } from "../../../lib/supabase/server";
import { readAccountOptions, readCategoryOptions, readTransactions } from "./query";
import { TransactionsView } from "./view";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ month?: string | string[] }> };

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const today = todayIso();
  const requested = Array.isArray(params.month) ? params.month[0] : params.month;
  const month = parseMonth(requested, today.slice(0, 7));

  const db = await createClient();
  const [rows, accounts, categories] = await Promise.all([
    readTransactions(db, month),
    readAccountOptions(db),
    readCategoryOptions(db),
  ]);

  return <TransactionsView month={month} rows={rows} accounts={accounts} categories={categories} today={today} />;
}
