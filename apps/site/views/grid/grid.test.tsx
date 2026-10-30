import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import type { Project } from "@/data/project";
import { Grid } from "./grid";

const projects: Project[] = [
  {
    slug: "site",
    name: "This site",
    oneLiner: "Portfolio.",
    status: "live",
    stack: ["Next.js"],
    url: "https://pickler-site.vercel.app",
  },
  {
    slug: "runway",
    name: "Runway",
    oneLiner: "Shows where money goes.",
    status: "building",
    stack: ["Next.js", "Supabase"],
    url: "https://pickler-runway.vercel.app",
  },
  {
    slug: "mail-room",
    name: "Mail Room",
    oneLiner: "Inbox sorts itself.",
    status: "native",
    stack: ["Swift"],
  },
];

describe("Grid", () => {
  test("renders the name and one tile per project", () => {
    render(<Grid projects={projects} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("David Pickler");
    const list = screen.getByRole("list", { name: "Projects" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });

  test("a live tile links to its url", () => {
    render(<Grid projects={projects} />);
    const link = screen.getByRole("link", { name: /This site/ });
    expect(link).toHaveAttribute("href", "https://pickler-site.vercel.app");
  });

  test("building and native tiles do not link, even with a url", () => {
    render(<Grid projects={projects} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByText("Runway")).toBeInTheDocument();
    expect(screen.getByText("Mail Room")).toBeInTheDocument();
  });

  test("shows status and stack in the tile", () => {
    render(<Grid projects={projects} />);
    expect(screen.getByText("//building//")).toBeInTheDocument();
    expect(screen.getByText("Next.js / Supabase")).toBeInTheDocument();
  });
});
