import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { TransactionsTable } from "./table";

const rows = [
  { id: "1", occurred_at: "2026-10-01", payee: "Acme Payroll", amount: 3200, transfer_group: null, account: "Checking", category: "Salary" },
  { id: "2", occurred_at: "2026-10-03", payee: "Landlord", amount: -1450.25, transfer_group: null, account: "Checking", category: "Rent" },
  { id: "3", occurred_at: "2026-10-05", payee: "Transfer", amount: -500, transfer_group: "t1", account: "Checking", category: null },
  { id: "4", occurred_at: "2026-10-05", payee: "Transfer", amount: 500, transfer_group: "t1", account: "Savings", category: null },
];

test("renders rows, labels transfers, and totals exclude them", () => {
  render(<TransactionsTable rows={rows} month="2026-10" />);
  expect(screen.getByRole("cell", { name: "Landlord" })).toBeInTheDocument();
  expect(screen.getByRole("cell", { name: "Salary" })).toBeInTheDocument();
  expect(screen.getAllByText("//transfer//")).toHaveLength(2);

  const inRow = screen.getByRole("row", { name: /^In/ });
  expect(within(inRow).getByText("3,200.00")).toBeInTheDocument();
  const outRow = screen.getByRole("row", { name: /^Out/ });
  expect(within(outRow).getByText("-1,450.25")).toBeInTheDocument();
  const netRow = screen.getByRole("row", { name: /^Net/ });
  expect(within(netRow).getByText("1,749.75")).toBeInTheDocument();
});

test("colors money out bad and money in ok, transfers neither", () => {
  render(<TransactionsTable rows={rows} month="2026-10" />);
  const rent = screen.getByRole("row", { name: /Landlord/ });
  expect(within(rent).getByText("-1,450.25")).toHaveClass("text-bad");
  const salary = screen.getByRole("row", { name: /Acme Payroll/ });
  expect(within(salary).getByText("3,200.00")).toHaveClass("text-ok");
  expect(screen.getByText("-500.00")).not.toHaveClass("text-bad");
});

test("empty month says so in one line", () => {
  render(<TransactionsTable rows={[]} month="2026-02" />);
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
  expect(screen.getByText("Nothing recorded for February 2026.")).toBeInTheDocument();
});
