import type { ReactNode, TableHTMLAttributes } from "react";
import { cx } from "./cx";

export type Column<Row> = {
  key: keyof Row & string;
  header: string;
  /** Right-aligned, mono, tabular figures. */
  numeric?: boolean;
};

export type TableProps<Row extends Record<string, ReactNode>> = Omit<
  TableHTMLAttributes<HTMLTableElement>,
  "children"
> & {
  columns: Column<Row>[];
  rows: Row[];
  /** Visually hidden table name for screen readers. */
  caption?: string;
  /** Stable row key. Falls back to the row index. */
  rowKey?: (row: Row, index: number) => string;
};

export function Table<Row extends Record<string, ReactNode>>({
  columns,
  rows,
  caption,
  rowKey,
  className,
  ...props
}: TableProps<Row>) {
  return (
    <table className={cx("w-full border-collapse text-body", className)} {...props}>
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <thead>
        <tr className="border-b border-line">
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              className={cx(
                "px-3 py-2 text-left font-mono text-label font-normal uppercase tracking-label text-grey",
                column.numeric && "text-right",
              )}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={rowKey ? rowKey(row, index) : index} className="border-b border-line-soft">
            {columns.map((column) => (
              <td
                key={column.key}
                className={cx("px-3 py-2", column.numeric && "text-right font-mono tabular-nums")}
              >
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
