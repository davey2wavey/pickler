import { describe, expect, test } from "vitest";
import { parseEnv } from "./env";

describe("parseEnv", () => {
  test("defaults NODE_ENV to development", () => {
    expect(parseEnv({}).NODE_ENV).toBe("development");
  });

  test("rejects a malformed public url", () => {
    expect(() => parseEnv({ NEXT_PUBLIC_APP_URL: "not a url" })).toThrow(/NEXT_PUBLIC_APP_URL/);
  });

  test("accepts a public url", () => {
    expect(parseEnv({ NEXT_PUBLIC_APP_URL: "https://example.com" }).NEXT_PUBLIC_APP_URL).toBe(
      "https://example.com",
    );
  });
});
