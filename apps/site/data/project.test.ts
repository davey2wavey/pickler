import { describe, expect, test } from "vitest";
import { parseProjects } from "./project";

const runway = {
  slug: "runway",
  name: "Runway",
  oneLiner: "Shows where money goes.",
  status: "building",
  stack: ["Next.js", "Supabase"],
  url: "https://pickler-runway.vercel.app",
};

describe("parseProjects", () => {
  test("accepts a valid entry and keeps optional fields optional", () => {
    const { url: _url, ...noUrl } = runway;
    const parsed = parseProjects([runway, { ...noUrl, slug: "mail-room", name: "Mail Room" }]);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.url).toBe("https://pickler-runway.vercel.app");
    expect(parsed[1]?.url).toBeUndefined();
  });

  test("rejects a missing name", () => {
    const { name: _name, ...noName } = runway;
    expect(() => parseProjects([noName])).toThrow(/name/);
  });

  test("rejects a url that is not a url", () => {
    expect(() => parseProjects([{ ...runway, url: "pickler-runway" }])).toThrow(/url/);
  });

  test("rejects an unknown status", () => {
    expect(() => parseProjects([{ ...runway, status: "soon" }])).toThrow(/status/);
  });

  test("rejects a slug with spaces or capitals", () => {
    expect(() => parseProjects([{ ...runway, slug: "Run way" }])).toThrow(/slug/);
  });

  test("rejects an empty stack", () => {
    expect(() => parseProjects([{ ...runway, stack: [] }])).toThrow(/stack/);
  });

  test("rejects duplicate slugs", () => {
    expect(() => parseProjects([runway, runway])).toThrow(/duplicate slug runway/);
  });

  test("rejects an empty dataset", () => {
    expect(() => parseProjects([])).toThrow();
  });
});
