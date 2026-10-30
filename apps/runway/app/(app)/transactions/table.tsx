import { Label } from "@pickler/ui";
import { formatAmount, moneyIn, moneyOut, net } from "../../../lib/money";
import { formatMonth } from "../../../lib/month";
import type { Month } from "../../../lib/month";
import type { TransactionRow } from "./query";

type Props = { rows: TransactionRow[]; month: Month };

const th =
  "px-3 py-2 text-left font-mono text-label font-normal uppercase tracking-label text-grey";
const td = "px-3 py-2";
const num = "text-right font-mono tabular-nums";
// Category and account step aside on phones so date, payee, and amount fit.
const wide = "hidden sm:table-cell";

function Amount({ amount, transfer }: { amount: number; transfer: boolean }) {
  if (transfer) return <span>{formatAmount(amount)}</span>;
  return <span className={amount < 0 ? "text-bad" : "text-ok"}>{formatAmount(amount)}</span>;
}

/** Month table with a totals row. Transfers are labelled and excluded from totals. */
export function TransactionsTable({ rows, month }: Props) {
  if (rows.length === 0) {
    return <p className="text-body text-grey">Nothing recorded for {formatMonth(month)}.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-body">
        <caption className="sr-only">Transactions for {formatMonth(month)}</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className={th}>
              Date
            </th>
            <th scope="col" className={th}>
              Payee
            </th>
            <th scope="col" className={`${th} ${wide}`}>
              Category
            </th>
            <th scope="col" className={`${th} ${wide}`}>
              Account
            </th>
            <th scope="col" className={`${th} text-right`}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const transfer = row.transfer_group !== null;
            return (
              <tr key={row.id} className="border-b border-line-soft">
                <td className={`${td} font-mono tabular-nums whitespace-nowrap`}>
                  {row.occurred_at}
                </td>
                <td className={td}>{row.payee}</td>
                <td className={`${td} ${wide}`}>
                  {transfer ? <Label text="transfer" /> : (row.category ?? "")}
                </td>
                <td className={`${td} ${wide}`}>{row.account}</td>
                <td className={`${td} ${num}`}>
                  <Amount amount={row.amount} transfer={transfer} />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-line font-mono text-small">
            <th scope="row" colSpan={2} className={`${td} text-left font-normal text-grey`}>
              In
            </th>
            <td className={`${td} ${wide}`} />
            <td className={`${td} ${wide}`} />
            <td className={`${td} ${num} text-ok`}>{formatAmount(moneyIn(rows))}</td>
          </tr>
          <tr className="font-mono text-small">
            <th scope="row" colSpan={2} className={`${td} text-left font-normal text-grey`}>
              Out
            </th>
            <td className={`${td} ${wide}`} />
            <td className={`${td} ${wide}`} />
            <td className={`${td} ${num} text-bad`}>{formatAmount(moneyOut(rows))}</td>
          </tr>
          <tr className="font-mono text-small">
            <th scope="row" colSpan={2} className={`${td} text-left font-normal text-grey`}>
              Net
            </th>
            <td className={`${td} ${wide}`} />
            <td className={`${td} ${wide}`} />
            <td className={`${td} ${num}`}>{formatAmount(net(rows))}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
