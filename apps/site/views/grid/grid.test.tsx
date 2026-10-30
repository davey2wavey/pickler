import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { parseProjects } from "@/data/project";
import { Grid } from "./grid";

const base = {
  stack: ["Next.js"],
  problem: "p",
  built: "b",
  changed: "c",
  updatedAt: "2026-10-29",
};
const projects = parseProjects([
  { ...base, slug: "site", name: "This site", oneLiner: "Portfolio.", status: "live", kind: "web" },
  {
    ...base,
    slug: "runway",
    name: "Runway",
    oneLiner: "Shows where money goes.",
    status: "in-progress",
    kind: "web",
    stack: ["Next.js", "Supabase"],
    headline: "H",
    whatItDoes: "W",
    underTheHood: "U",
    featured: true,
  },
  {
    ...base,
    slug: "old",
    name: "Old thing",
    oneLiner: "Retired.",
    status: "archived",
    kind: "static",
  },
]);

describe("Grid", () => {
  test("renders the name and one tile per project, featured first", () => {
    render(<Grid projects={projects} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("David Pickler");
    const items = within(screen.getByRole("list", { name: "Projects" })).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("Runway");
  });

  test("every tile links to its case study page", () => {
    render(<Grid projects={projects} />);
    expect(screen.getByRole("link", { name: /Runway/ })).toHaveAttribute("href", "/p/runway");
    expect(screen.getByRole("link", { name: /This site/ })).toHaveAttribute("href", "/p/site");
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  test("shows status with a dot, except archived, and the stack", () => {
    render(<Grid projects={projects} />);
    expect(screen.getByText("//in-progress//")).toBeInTheDocument();
    expect(screen.getByText("Next.js / Supabase")).toBeInTheDocument();
    expect(screen.getAllByTestId("label-dot")).toHaveLength(3); // portfolio, live, in-progress
  });
});
