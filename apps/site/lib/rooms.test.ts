import { describe, expect, test } from "vitest";
import { parseProjects } from "@/data/project";
import { activeRoomFor, groupByRoom, hashFor, roomFromHash, roomOf } from "./rooms";

const base = {
  oneLiner: "x",
  headline: "H",
  status: "live",
  kind: "web",
  role: "r",
  year: "2026",
  stack: ["a"],
  problem: "p",
  built: "b",
  changed: "c",
  updatedAt: "2026-10-29",
};
const projects = parseProjects([
  { ...base, slug: "a", name: "A", tags: ["web"], updatedAt: "2026-01-01" },
  { ...base, slug: "b", name: "B", tags: ["iphone"] },
  { ...base, slug: "c", name: "C", tags: ["automation", "web"] },
  { ...base, slug: "d", name: "D", tags: ["web"], featured: true, updatedAt: "2025-01-01" },
  { ...base, slug: "e", name: "E", tags: ["web"], updatedAt: "2026-06-01" },
]);

describe("roomOf / groupByRoom", () => {
  test("the first tag is the room", () => {
    expect(roomOf(projects[2]!)).toBe("automation");
  });

  test("every room is present; each is in room order", () => {
    const groups = groupByRoom(projects);
    expect(Object.keys(groups)).toEqual(["web", "iphone", "mac", "automation"]);
    expect(groups.web.map((p) => p.slug)).toEqual(["d", "e", "a"]);
    expect(groups.iphone.map((p) => p.slug)).toEqual(["b"]);
    expect(groups.mac).toEqual([]);
    expect(groups.automation.map((p) => p.slug)).toEqual(["c"]);
  });
});

describe("hash helpers", () => {
  test("round-trips known rooms with or without the hash", () => {
    expect(roomFromHash("#iphone")).toBe("iphone");
    expect(roomFromHash("touch")).toBe("touch");
    expect(hashFor("mac")).toBe("#mac");
    expect(roomFromHash(hashFor("home"))).toBe("home");
  });

  test("unknown or empty hashes are undefined", () => {
    expect(roomFromHash("#ios")).toBeUndefined();
    expect(roomFromHash("")).toBeUndefined();
    expect(roomFromHash("#")).toBeUndefined();
    expect(roomFromHash("#runway")).toBeUndefined();
  });
});

describe("activeRoomFor", () => {
  const vh = 1000;
  test("the last room above the 40% line is active", () => {
    expect(
      activeRoomFor(
        [
          ["home", -2000],
          ["web", -300],
          ["iphone", 399],
          ["mac", 900],
        ],
        vh,
      ),
    ).toBe("iphone");
  });

  test("at the top the first room is active even if it has not crossed", () => {
    expect(
      activeRoomFor(
        [
          ["home", 0],
          ["web", 1500],
        ],
        vh,
      ),
    ).toBe("home");
    expect(activeRoomFor([], vh)).toBe("home");
  });

  test("exactly on the line does not count", () => {
    expect(
      activeRoomFor(
        [
          ["home", -100],
          ["web", 400],
        ],
        vh,
      ),
    ).toBe("home");
  });
});
