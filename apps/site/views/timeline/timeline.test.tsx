import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { parseProjects } from "@/data/project";
import { Timeline } from "./timeline";

const base = { oneLiner: "x", kind: "web", stack: ["a"], problem: "p", built: "b", changed: "c" };
const projects = parseProjects([
  { ...base, slug: "old", name: "Old", status: "archived", updatedAt: "2026-01-05" },
  {
    ...base,
    slug: "shipped",
    name: "Shipped",
    status: "live",
    shippedAt: "2026-10-01",
    updatedAt: "2026-03-01",
  },
  { ...base, slug: "mid", name: "Mid", status: "in-progress", updatedAt: "2026-10-20" },
]);

describe("Timeline", () => {
  test("lists every project newest first with a link to its page", () => {
    render(<Timeline projects={projects} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("David Pickler");
    const items = within(screen.getByRole("list", { name: "Projects, newest first" })).getAllByRole(
      "listitem",
    );
    expect(items.map((li) => within(li).getByRole("link").textContent)).toEqual([
      "Mid",
      "Shipped",
      "Old",
    ]);
    expect(within(items[1]!).getByRole("link")).toHaveAttribute("href", "/p/shipped");
  });

  test("shows a month label once per month, dates in both forms, and the status", () => {
    render(<Timeline projects={projects} />);
    expect(screen.getAllByText("2026-10")).toHaveLength(1);
    expect(screen.getByText("2026-01")).toBeInTheDocument();
    expect(screen.getByText("shipped 2026-10-01")).toBeInTheDocument();
    expect(screen.getByText("updated 2026-03-01")).toBeInTheDocument();
    expect(screen.getByText("//archived//")).toBeInTheDocument();
    expect(screen.getAllByTestId("label-dot")).toHaveLength(3); // portfolio, live, in-progress
  });
});
