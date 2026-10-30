import { describe, expect, test } from "vitest";
import { byFeatured, findProject } from "./select";
import { parseProjects } from "./project";

const base = {
  oneLiner: "x",
  status: "live",
  kind: "web",
  stack: ["a"],
  problem: "p",
  built: "b",
  changed: "c",
  updatedAt: "2026-10-29",
};
const projects = parseProjects([
  { ...base, slug: "a", name: "A" },
  { ...base, slug: "b", name: "B", featured: true },
  { ...base, slug: "c", name: "C" },
  { ...base, slug: "d", name: "D", featured: true },
]);

describe("byFeatured", () => {
  test("puts featured first and keeps file order within each group", () => {
    expect(byFeatured(projects).map((p) => p.slug)).toEqual(["b", "d", "a", "c"]);
  });

  test("does not mutate the input", () => {
    const before = projects.map((p) => p.slug);
    byFeatured(projects);
    expect(projects.map((p) => p.slug)).toEqual(before);
  });
});

describe("findProject", () => {
  test("finds by slug, undefined otherwise", () => {
    expect(findProject(projects, "c")?.name).toBe("C");
    expect(findProject(projects, "nope")).toBeUndefined();
  });
});
