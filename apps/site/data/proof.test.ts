import { describe, expect, test } from "vitest";
import { daysSince, proof } from "./proof";

describe("daysSince", () => {
  test("counts whole days", () => {
    expect(daysSince("2026-10-29", new Date("2026-10-30T12:00:00Z"))).toBe(1);
    expect(daysSince("2026-10-29", new Date("2026-11-05T03:00:00Z"))).toBe(7);
  });

  test("the same day is zero, and the future is clamped to zero", () => {
    expect(daysSince("2026-10-29", new Date("2026-10-29T23:59:00Z"))).toBe(0);
    expect(daysSince("2026-10-29", new Date("2026-10-01T00:00:00Z"))).toBe(0);
  });

  test("rejects a date that is not ISO", () => {
    expect(() => daysSince("Oct 29")).toThrow(/ISO/);
  });
});

test("the facts carry dates so a stale number is visible", () => {
  expect(proof.prsAsOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(proof.firstCommit).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(proof.prsMerged).toBeGreaterThan(0);
});
