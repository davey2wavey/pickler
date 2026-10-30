import { describe, expect, test } from "vitest";
import { byFeatured, byNewest, featured, findProject, newestDate } from "./select";
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
  {
    ...base,
    slug: "b",
    name: "B",
    headline: "H",
    whatItDoes: "W",
    underTheHood: "U",
    featured: true,
  },
  { ...base, slug: "c", name: "C" },
  {
    ...base,
    slug: "d",
    name: "D",
    headline: "H",
    whatItDoes: "W",
    underTheHood: "U",
    featured: true,
  },
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

describe("byNewest", () => {
  const dated = parseProjects([
    { ...base, slug: "old", name: "Old", updatedAt: "2026-01-05" },
    { ...base, slug: "shipped", name: "Shipped", shippedAt: "2026-10-01", updatedAt: "2026-03-01" },
    { ...base, slug: "tie-a", name: "Tie A", updatedAt: "2026-06-15" },
    { ...base, slug: "tie-b", name: "Tie B", updatedAt: "2026-06-15" },
  ]);

  test("shippedAt counts as the date when present, else updatedAt", () => {
    expect(newestDate(dated[1]!)).toBe("2026-10-01");
    expect(newestDate(dated[0]!)).toBe("2026-01-05");
  });

  test("sorts newest first and keeps file order on ties", () => {
    expect(byNewest(dated).map((p) => p.slug)).toEqual(["shipped", "tie-a", "tie-b", "old"]);
  });

  test("does not mutate the input", () => {
    const before = dated.map((p) => p.slug);
    byNewest(dated);
    expect(dated.map((p) => p.slug)).toEqual(before);
  });
});

test("featured keeps only the featured projects, in file order", () => {
  expect(featured(projects).map((p) => p.slug)).toEqual(["b", "d"]);
});
