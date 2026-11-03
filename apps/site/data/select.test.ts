import { describe, expect, test } from "vitest";
import { byFeatured, byNewest, byRoomOrder, featured, findProject, newestDate } from "./select";
import { parseProjects } from "./project";

const base = {
  oneLiner: "x",
  headline: "H",
  status: "live",
  kind: "web",
  tags: ["web"],
  role: "r",
  year: "2026",
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

describe("byRoomOrder", () => {
  const room = parseProjects([
    { ...base, slug: "older", name: "Older", updatedAt: "2026-02-01" },
    { ...base, slug: "newer", name: "Newer", updatedAt: "2026-09-01" },
    { ...base, slug: "star-old", name: "Star old", featured: true, updatedAt: "2026-01-01" },
    { ...base, slug: "star-new", name: "Star new", featured: true, updatedAt: "2026-08-01" },
    { ...base, slug: "tie", name: "Tie", updatedAt: "2026-09-01" },
  ]);

  test("featured first, then updatedAt descending, file order on ties", () => {
    expect(byRoomOrder(room).map((p) => p.slug)).toEqual([
      "star-new",
      "star-old",
      "newer",
      "tie",
      "older",
    ]);
  });

  test("does not mutate the input", () => {
    const before = room.map((p) => p.slug);
    byRoomOrder(room);
    expect(room.map((p) => p.slug)).toEqual(before);
  });
});

test("featured keeps only the featured projects, in file order", () => {
  expect(featured(projects).map((p) => p.slug)).toEqual(["b", "d"]);
});
