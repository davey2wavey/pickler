import { describe, expect, test } from "vitest";
import { parseProjects } from "./project";

const runway = {
  slug: "runway",
  name: "Runway",
  oneLiner: "Shows where money goes.",
  status: "in-progress",
  kind: "web",
  stack: ["Next.js", "Supabase"],
  links: { live: "https://pickler-runway.vercel.app" },
  problem: "Money leaves in small pieces.",
  built: "A ledger with a burn line.",
  changed: "Nothing yet. Still building.",
  updatedAt: "2026-10-29",
};

describe("parseProjects", () => {
  test("accepts a full entry and fills defaults", () => {
    const [parsed] = parseProjects([runway]);
    expect(parsed?.links.live).toBe("https://pickler-runway.vercel.app");
    expect(parsed?.metrics).toEqual([]);
    expect(parsed?.screenshots).toEqual([]);
    expect(parsed?.featured).toBe(false);
    expect(parsed?.shippedAt).toBeUndefined();
  });

  test("links may be absent entirely", () => {
    const { links: _links, ...noLinks } = runway;
    expect(parseProjects([noLinks])[0]?.links).toEqual({});
  });

  test("rejects a missing case study paragraph", () => {
    const { problem: _problem, ...noProblem } = runway;
    expect(() => parseProjects([noProblem])).toThrow(/problem/);
    expect(() => parseProjects([{ ...runway, built: "   " }])).toThrow(/built/);
  });

  test("rejects an unknown status or kind", () => {
    expect(() => parseProjects([{ ...runway, status: "building" }])).toThrow(/status/);
    expect(() => parseProjects([{ ...runway, kind: "native" }])).toThrow(/kind/);
  });

  test("rejects a link that is not a url", () => {
    expect(() => parseProjects([{ ...runway, links: { repo: "github" } }])).toThrow(/repo/);
  });

  test("rejects a date that is not ISO", () => {
    expect(() => parseProjects([{ ...runway, updatedAt: "Oct 29" }])).toThrow(/updatedAt/);
    expect(() => parseProjects([{ ...runway, shippedAt: "29/10/2026" }])).toThrow(/shippedAt/);
  });

  test("metrics need a label and value; screenshots live under /shots/", () => {
    expect(() => parseProjects([{ ...runway, metrics: [{ label: "Posts" }] }])).toThrow(/value/);
    expect(() =>
      parseProjects([{ ...runway, screenshots: [{ src: "/img/a.png", alt: "A" }] }]),
    ).toThrow(/src/);
    const [ok] = parseProjects([
      {
        ...runway,
        metrics: [{ label: "Posts", value: "1,204", note: "est." }],
        screenshots: [{ src: "/shots/runway/home.png", alt: "Runway home" }],
      },
    ]);
    expect(ok?.metrics[0]?.note).toBe("est.");
  });

  test("rejects a slug with spaces or capitals", () => {
    expect(() => parseProjects([{ ...runway, slug: "Run way" }])).toThrow(/slug/);
  });

  test("rejects duplicate slugs and an empty dataset", () => {
    expect(() => parseProjects([runway, runway])).toThrow(/duplicate slug runway/);
    expect(() => parseProjects([])).toThrow();
  });
});
