import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Table } from "./table";

const columns = [
  { key: "name", header: "Name" },
  { key: "amount", header: "Amount", numeric: true },
] as const;

const rows = [
  { name: "Rent", amount: "1,200" },
  { name: "Power", amount: "80" },
];

test("renders a header cell per column and a row per item", () => {
  render(<Table columns={[...columns]} rows={rows} />);
  expect(screen.getAllByRole("columnheader")).toHaveLength(2);
  expect(screen.getAllByRole("row")).toHaveLength(3);
  expect(screen.getByText("Rent")).toBeInTheDocument();
});

test("right-aligns numeric columns with tabular figures", () => {
  render(<Table columns={[...columns]} rows={rows} />);
  expect(screen.getByRole("columnheader", { name: "Amount" })).toHaveClass("text-right");
  expect(screen.getByText("1,200")).toHaveClass("text-right");
  expect(screen.getByText("1,200")).toHaveClass("tabular-nums");
  expect(screen.getByText("Rent")).not.toHaveClass("text-right");
});

test("renders a caption and forwards className", () => {
  render(<Table columns={[...columns]} rows={rows} caption="Costs" className="mt-4" />);
  expect(screen.getByRole("table", { name: "Costs" })).toHaveClass("mt-4");
});
