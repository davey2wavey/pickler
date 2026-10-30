import { Label, Panel, Table } from "@pickler/ui";
import { formatMoney } from "./format";

export type BalanceRow = {
  id: string;
  name: string;
  type: string;
  currency: string;
  balance: number;
};

type Props = {
  rows: BalanceRow[];
  /** Set when the database could not be read. Shown instead of the table. */
  problem?: string | undefined;
};

const columns = [
  { key: "name", header: "Account" },
  { key: "type", header: "Type" },
  { key: "balance", header: "Balance", numeric: true },
] as const;

/** Seeded account balances in a mono table. Proves the pipe from Postgres to the page. */
export function HealthView({ rows, problem }: Props) {
  return (
    <main className="mx-auto flex max-w-grid flex-col gap-4 px-6 py-16">
      <Label text="health" dot={problem ? "bad" : "ok"} />
      <h1 className="text-h1 font-medium">health</h1>
      <p className="text-lead text-grey">
        Account balances for the demo user, read from the <code>account_balances</code> view.
      </p>
      {problem ? (
        <Panel title="database" meta="unreachable">
          <p className="font-mono text-small">{problem}</p>
        </Panel>
      ) : (
        <Panel title="account_balances" meta={`${rows.length} rows`}>
          <Table
            caption="Account balances"
            columns={[...columns]}
            rowKey={(row) => String(row.id)}
            rows={rows.map((row) => ({
              id: row.id,
              name: row.name,
              type: row.type,
              balance: formatMoney(row.balance, row.currency),
            }))}
          />
        </Panel>
      )}
    </main>
  );
}
