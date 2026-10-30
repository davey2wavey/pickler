import { expect, test } from "vitest";
import { formatMonth, monthRange, nextMonth, parseMonth, prevMonth, todayIso } from "./month";

test("prev and next cross year boundaries", () => {
  expect(prevMonth("2026-01")).toBe("2025-12");
  expect(nextMonth("2026-12")).toBe("2027-01");
  expect(prevMonth("2026-10")).toBe("2026-09");
  expect(nextMonth("2026-10")).toBe("2026-11");
});

test("month range is first of month to first of next month", () => {
  expect(monthRange("2026-02")).toEqual({ from: "2026-02-01", to: "2026-03-01" });
  expect(monthRange("2026-12")).toEqual({ from: "2026-12-01", to: "2027-01-01" });
});

test("parseMonth accepts YYYY-MM and falls back otherwise", () => {
  expect(parseMonth("2026-03", "2026-10")).toBe("2026-03");
  expect(parseMonth("2026-13", "2026-10")).toBe("2026-10");
  expect(parseMonth("march", "2026-10")).toBe("2026-10");
  expect(parseMonth(undefined, "2026-10")).toBe("2026-10");
});

test("formatMonth reads like a person wrote it", () => {
  expect(formatMonth("2026-10")).toBe("October 2026");
  expect(formatMonth("2025-01")).toBe("January 2025");
});

test("todayIso is YYYY-MM-DD and its month parses", () => {
  const today = todayIso();
  expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(parseMonth(today.slice(0, 7), "0000-00")).toBe(today.slice(0, 7));
});
