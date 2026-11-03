import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { parseProjects } from "@/data/project";
import { ProjectBlock } from "./project-block";

function make(overrides: Record<string, unknown>) {
  const [project] = parseProjects([
    {
      slug: "x",
      name: "X",
      oneLiner: "Does the thing.",
      headline: "Head",
      headlineMono: "line",
      status: "beta",
      kind: "ios",
      tags: ["iphone", "web"],
      role: "Solo.",
      year: "2026",
      stack: ["Swift", "SwiftUI"],
      problem: "p",
      built: "b",
      changed: "c",
      updatedAt: "2026-10-29",
      ...overrides,
    },
  ]);
  if (!project) throw new Error("fixture");
  return project;
}

const features = [
  { glyph: "$", title: "One", text: "First.", metric: "65 rows" },
  { glyph: "#", title: "Two", text: "Second." },
];

describe("ProjectBlock", () => {
  test("shows the headline, one-liner, tags, role, year, stack, and a Learn more link", () => {
    render(<ProjectBlock project={make({})} room="iphone" />);
    const block = screen.getByTestId("project-block");
    expect(block).toHaveAttribute("id", "x");
    expect(block).toHaveAttribute("data-room", "iphone");
    expect(within(block).getByRole("heading", { level: 3 })).toHaveTextContent("Head line");
    expect(within(block).getByText("Does the thing.")).toBeInTheDocument();
    expect(
      within(within(block).getByRole("list", { name: "Tags" }))
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(["iphone", "web"]);
    expect(within(block).getByText("Solo.")).toBeInTheDocument();
    expect(within(block).getByText("2026")).toBeInTheDocument();
    expect(within(block).getByText("Swift · SwiftUI")).toBeInTheDocument();
    expect(within(block).getByRole("link", { name: /Learn more/ })).toHaveAttribute("href", "/p/x");
  });

  test("hides the feature row when there are no features", () => {
    render(<ProjectBlock project={make({})} room="iphone" />);
    expect(screen.queryByRole("list", { name: "X features" })).not.toBeInTheDocument();
  });

  test("renders one card per feature and the metric only where present", () => {
    render(<ProjectBlock project={make({ features })} room="iphone" />);
    const cards = within(screen.getByRole("list", { name: "X features" })).getAllByRole("listitem");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("65 rows");
    expect(cards[1]).not.toHaveTextContent("rows");
  });

  test("invert flips the ground; self swaps the demo for a marker", () => {
    render(
      <ProjectBlock
        project={make({ kind: "web", status: "live", links: { live: "https://x.test" } })}
        room="web"
        invert
        self
      />,
    );
    expect(screen.getByTestId("project-block")).toHaveAttribute("data-invert");
    expect(screen.queryByTitle("X demo")).not.toBeInTheDocument();
    expect(screen.getByText("//YOU ARE HERE//")).toBeInTheDocument();
  });
});
