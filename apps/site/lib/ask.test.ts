import { describe, expect, test } from "vitest";
import { ask } from "@/content/site";
import { replyFor } from "./ask";

const canned = [
  { keywords: ["stack", "tech"], reply: "STACK" },
  { keywords: ["available"], reply: "AVAILABLE" },
] as const;

describe("replyFor", () => {
  test("matches a keyword anywhere in the question, ignoring case", () => {
    expect(replyFor("What STACK do you use?", canned, "FB")).toBe("STACK");
    expect(replyFor("so... what tech?", canned, "FB")).toBe("STACK");
    expect(replyFor("are you available", canned, "FB")).toBe("AVAILABLE");
  });

  test("first matching entry wins", () => {
    expect(replyFor("is your stack available?", canned, "FB")).toBe("STACK");
  });

  test("falls back when nothing matches or the question is blank", () => {
    expect(replyFor("hello", canned, "FB")).toBe("FB");
    expect(replyFor("   ", canned, "FB")).toBe("FB");
  });

  test("every suggested question in content has a canned reply", () => {
    for (const question of ask.suggestions) {
      expect(replyFor(question, ask.canned, ask.fallback)).not.toBe(ask.fallback);
    }
  });
});
