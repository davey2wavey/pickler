import { Label, Panel } from "@pickler/ui";
import { formatMonth } from "../../../lib/month";
import type { Month } from "../../../lib/month";
import { AddForm } from "./add-form";
import { MonthSwitcher } from "./month-switcher";
import type { AccountOption, CategoryOption, TransactionRow } from "./query";
import { TransactionsTable } from "./table";

type Props = {
  month: Month;
  rows: TransactionRow[];
  accounts: AccountOption[];
  categories: CategoryOption[];
  today: string;
};

export function TransactionsView({ month, rows, accounts, categories, today }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label text="transactions" />
        <h1 className="text-h1 font-medium">Transactions</h1>
        <MonthSwitcher month={month} />
      </div>
      <Panel title={formatMonth(month)} meta={`${rows.length} rows`}>
        <TransactionsTable rows={rows} month={month} />
      </Panel>
      <Panel title="add">
        <AddForm accounts={accounts} categories={categories} today={today} />
      </Panel>
    </div>
  );
}
