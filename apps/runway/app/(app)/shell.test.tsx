import { render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { Shell } from "./shell";

vi.mock("next/navigation", () => ({ usePathname: () => "/transactions" }));
vi.mock("../auth/sign-out/actions", () => ({ signOut: vi.fn() }));

const accounts = [
  { id: "a", name: "Checking", balance: 4200 },
  { id: "b", name: "Savings", balance: 12500.5 },
];

test("renders the five tabs and marks the active one", () => {
  render(
    <Shell accounts={accounts}>
      <p>content</p>
    </Shell>,
  );
  const tabs = screen.getByRole("navigation", { name: "Tabs" });
  for (const name of ["Home", "Transactions", "Expected", "Reports", "Plan"]) {
    expect(within(tabs).getByRole("link", { name })).toBeInTheDocument();
  }
  const active = within(tabs).getByRole("link", { name: "Transactions" });
  expect(active).toHaveAttribute("aria-current", "page");
  expect(within(active).getByTestId("label-dot")).toBeInTheDocument();
  expect(within(tabs).queryAllByTestId("label-dot")).toHaveLength(1);
});

test("lists accounts with balances and shows settings and sign out", () => {
  render(
    <Shell accounts={accounts}>
      <p>content</p>
    </Shell>,
  );
  expect(screen.getAllByText("Checking").length).toBeGreaterThan(0);
  expect(screen.getAllByText("12,500.50").length).toBeGreaterThan(0);
  expect(screen.getAllByRole("link", { name: "Settings" }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole("button", { name: "Sign out" }).length).toBeGreaterThan(0);
  expect(screen.getByText("content")).toBeInTheDocument();
});
