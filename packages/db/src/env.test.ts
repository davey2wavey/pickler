import { describe, expect, test } from "vitest";
import { parseDbEnv } from "./env";

describe("parseDbEnv", () => {
  test("accepts a url and a key", () => {
    const env = parseDbEnv({
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
    });
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("http://127.0.0.1:54321");
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe("anon");
  });

  test("names every missing variable", () => {
    expect(() => parseDbEnv({})).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    expect(() => parseDbEnv({})).toThrow(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  });

  test("rejects a url that is not a url", () => {
    expect(() =>
      parseDbEnv({ NEXT_PUBLIC_SUPABASE_URL: "nope", NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon" }),
    ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });
});
