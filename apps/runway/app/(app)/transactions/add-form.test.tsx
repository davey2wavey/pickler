import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { AddForm } from "./add-form";
import { parseAddForm } from "./add-schema";
import type { AddState } from "./actions";

vi.mock("./actions", () => ({ addTransaction: vi.fn() }));

const accounts = [
  { id: "10000000-0000-4000-8000-000000000001", name: "Checking" },
  { id: "10000000-0000-4000-8000-000000000002", name: "Savings" },
];
const categories = [
  { id: "20000000-0000-4000-8000-000000000001", name: "Rent", kind: "spend" as const },
];

/** Stands in for the server action: validates, never touches a database. */
async function fakeAction(_prev: AddState, formData: FormData): Promise<AddState> {
  const parsed = parseAddForm(formData, "30000000-0000-4000-8000-000000000001");
  return parsed.ok ? { added: 1 } : { errors: parsed.errors };
}

test("rejects empty payee and zero amount", async () => {
  render(
    <AddForm accounts={accounts} categories={categories} today="2026-10-12" action={fakeAction} />,
  );
  fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "0" } });
  fireEvent.submit(screen.getByRole("button", { name: "Add" }).closest("form")!);
  expect(await screen.findByText("Enter a payee.")).toBeInTheDocument();
  expect(screen.getByText("Amount cannot be zero.")).toBeInTheDocument();
});

test("transfer swaps the category select for a second account select", () => {
  render(
    <AddForm accounts={accounts} categories={categories} today="2026-10-12" action={fakeAction} />,
  );
  expect(screen.getByLabelText("Category")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Transfer"));
  expect(screen.queryByLabelText("Category")).not.toBeInTheDocument();
  expect(screen.getByLabelText("To account")).toBeInTheDocument();
});
