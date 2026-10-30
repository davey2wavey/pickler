import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { HealthView } from "./view";

const rows = [
  { id: "a", name: "Checking", type: "checking", currency: "USD", balance: 4200 },
  { id: "b", name: "Savings", type: "savings", currency: "USD", balance: 12500.5 },
];

test("lists every account with a formatted balance", () => {
  render(<HealthView rows={rows} />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("health");
  expect(screen.getByRole("cell", { name: "Checking" })).toBeInTheDocument();
  expect(screen.getByRole("cell", { name: "$12,500.50" })).toBeInTheDocument();
  expect(screen.getByText("2 rows")).toBeInTheDocument();
});

test("shows the problem instead of the table when the read failed", () => {
  render(<HealthView rows={[]} problem="SUPABASE_SERVICE_ROLE_KEY is not set" />);
  expect(screen.queryByRole("table")).not.toBeInTheDocument();
  expect(screen.getByText(/SERVICE_ROLE_KEY/)).toBeInTheDocument();
});
