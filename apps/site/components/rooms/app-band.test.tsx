import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { parseProjects } from "@/data/project";
import { AppBand } from "./app-band";
import { hasArt } from "./app-art";

const brand = {
  ground: "#0A1118",
  accent: "#35D0E0",
  radius: 14,
  eyebrow: "Programs & routines",
  lede: "Build workouts. Stack them into a program.",
};

function make(overrides: Record<string, unknown>) {
  const [project] = parseProjects([
    {
      slug: "regiment",
      name: "Regiment",
      oneLiner: "Does the thing.",
      headline: "Head",
      status: "beta",
      kind: "ios",
      tags: ["iphone"],
      role: "Solo.",
      year: "2026",
      stack: ["Swift"],
      problem: "p",
      built: "b",
      changed: "c",
      updatedAt: "2026-11-03",
      brand,
      ...overrides,
    },
  ]);
  if (!project?.brand) throw new Error("fixture");
  return { ...project, brand: project.brand };
}

describe("AppBand", () => {
  test("renders the band in its two tones with eyebrow, name, lede, and status", () => {
    render(<AppBand project={make({})} room="iphone" />);
    const band = screen.getByTestId("project-block");
    expect(band).toHaveAttribute("data-band");
    expect(band.style.getPropertyValue("--ground")).toBe("#0A1118");
    expect(band.style.getPropertyValue("--accent")).toBe("#35D0E0");
    expect(band.style.getPropertyValue("--radius")).toBe("14px");
    expect(screen.getByText("Programs & routines")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Regiment" })).toBeInTheDocument();
    expect(screen.getByText(brand.lede)).toBeInTheDocument();
    expect(screen.getByText("On TestFlight")).toBeInTheDocument();
  });

  test("status reads Building while in progress and links to the project page", () => {
    render(<AppBand project={make({ status: "in-progress" })} room="iphone" />);
    expect(screen.getByText("Building")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /learn more/i })).toHaveAttribute(
      "href",
      "/p/regiment",
    );
  });

  test("shows the app site host when the brand has one", () => {
    render(
      <AppBand
        project={make({ brand: { ...brand, site: "https://regiment.so" } })}
        room="iphone"
      />,
    );
    expect(screen.getByText("regiment.so")).toBeInTheDocument();
  });

  test("every branded app in the dataset has art", async () => {
    const { projects } = await import("@/data/projects");
    for (const project of projects) if (project.brand) expect(hasArt(project.slug)).toBe(true);
  });
});
