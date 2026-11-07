import { describe, expect, test } from "vitest";
import { parseProjects } from "./project";

const runway = {
  slug: "runway",
  name: "Runway",
  oneLiner: "Shows where money goes.",
  headline: "Where the money goes",
  status: "in-progress",
  kind: "web",
  tags: ["web"],
  role: "Spec, design, build. Solo.",
  year: "2026, beta",
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
    expect(parsed?.features).toEqual([]);
    expect(parsed?.featured).toBe(false);
    expect(parsed?.shippedAt).toBeUndefined();
    expect(parsed?.headlineMono).toBeUndefined();
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

  test("headline, role, and year are required for every project", () => {
    const { headline: _h, ...noHeadline } = runway;
    expect(() => parseProjects([noHeadline])).toThrow(/headline/);
    expect(() => parseProjects([{ ...runway, role: "" }])).toThrow(/role/);
    const { year: _y, ...noYear } = runway;
    expect(() => parseProjects([noYear])).toThrow(/year/);
  });

  test("tags need at least one known room; the first one is the room", () => {
    expect(() => parseProjects([{ ...runway, tags: [] }])).toThrow(/tags/);
    expect(() => parseProjects([{ ...runway, tags: ["ios"] }])).toThrow(/tags/);
    const [ok] = parseProjects([{ ...runway, tags: ["automation", "web"] }]);
    expect(ok?.tags[0]).toBe("automation");
  });

  test("features carry glyph, title, text, optional metric; at most four", () => {
    const feature = { glyph: "$", title: "One ledger", text: "Transfers excluded." };
    const [ok] = parseProjects([
      { ...runway, features: [feature, { ...feature, metric: "65 rows" }] },
    ]);
    expect(ok?.features[1]?.metric).toBe("65 rows");
    expect(ok?.features[0]?.metric).toBeUndefined();
    expect(() => parseProjects([{ ...runway, features: [{ glyph: "$", title: "T" }] }])).toThrow(
      /text/,
    );
    expect(() =>
      parseProjects([{ ...runway, features: [feature, feature, feature, feature, feature] }]),
    ).toThrow(/features/);
  });

  test("rejects an unknown status or kind", () => {
    expect(() => parseProjects([{ ...runway, status: "building" }])).toThrow(/status/);
    expect(() => parseProjects([{ ...runway, kind: "native" }])).toThrow(/kind/);
  });

  test("rejects a link that is not a url", () => {
    expect(() => parseProjects([{ ...runway, links: { repo: "github" } }])).toThrow(/repo/);
    expect(() => parseProjects([{ ...runway, links: { video: "clip" } }])).toThrow(/video/);
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

  test("screenshots default to no frame and reject an unknown one", () => {
    const [ok] = parseProjects([
      {
        ...runway,
        screenshots: [
          { src: "/shots/runway/home.png", alt: "Home" },
          { src: "/shots/runway/phone.svg", alt: "Phone", frame: "phone" },
        ],
      },
    ]);
    expect(ok?.screenshots.map((shot) => shot.frame)).toEqual(["none", "phone"]);
    expect(() =>
      parseProjects([
        { ...runway, screenshots: [{ src: "/shots/a.png", alt: "A", frame: "tablet" }] },
      ]),
    ).toThrow(/frame/);
  });

  test("rejects a slug with spaces or capitals", () => {
    expect(() => parseProjects([{ ...runway, slug: "Run way" }])).toThrow(/slug/);
  });

  test("rejects duplicate slugs and an empty dataset", () => {
    expect(() => parseProjects([runway, runway])).toThrow(/duplicate slug runway/);
    expect(() => parseProjects([])).toThrow();
  });
});

describe("brand", () => {
  test("is optional, validates hex, and defaults radius to 0", () => {
    const base = {
      slug: "a",
      name: "A",
      oneLiner: "x",
      headline: "x",
      status: "beta",
      kind: "ios",
      tags: ["iphone"],
      role: "x",
      year: "2026",
      stack: ["Swift"],
      problem: "p",
      built: "b",
      changed: "c",
      updatedAt: "2026-11-03",
    };
    expect(parseProjects([base])[0]?.brand).toBeUndefined();
    const ok = parseProjects([
      { ...base, brand: { ground: "#0A1118", accent: "#35D0E0", eyebrow: "e", lede: "l" } },
    ])[0]?.brand;
    expect(ok?.radius).toBe(0);
    expect(() =>
      parseProjects([
        { ...base, brand: { ground: "blue", accent: "#35D0E0", eyebrow: "e", lede: "l" } },
      ]),
    ).toThrow(/hex/);
  });
});
