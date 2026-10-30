import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { parseProjects } from "@/data/project";
import { ActiveView } from "./active-view";
import { storageKey } from "./resolve";

let search = "";
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(search) }));

const projects = parseProjects([
  {
    slug: "a",
    name: "Alpha",
    oneLiner: "x",
    status: "live",
    kind: "web",
    stack: ["a"],
    problem: "p",
    built: "b",
    changed: "c",
    updatedAt: "2026-10-29",
  },
]);

beforeEach(() => {
  localStorage.clear();
  search = "";
});

describe("ActiveView", () => {
  test("renders the default view with the projects", async () => {
    await act(async () => {
      render(<ActiveView projects={projects} />);
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("David Pickler");
    expect(screen.getByRole("link", { name: /Alpha/ })).toBeInTheDocument();
    expect(localStorage.getItem(storageKey)).toBeNull();
  });

  test("remembers a valid ?view= and ignores an unknown one", async () => {
    search = "view=grid";
    await act(async () => {
      render(<ActiveView projects={projects} />);
    });
    expect(localStorage.getItem(storageKey)).toBe("grid");

    localStorage.clear();
    search = "view=nope";
    await act(async () => {
      render(<ActiveView projects={projects} />);
    });
    expect(screen.getAllByRole("heading", { level: 1 })[0]).toHaveTextContent("David Pickler");
    expect(localStorage.getItem(storageKey)).toBeNull();
  });
});
