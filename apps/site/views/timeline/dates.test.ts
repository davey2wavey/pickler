import { expect, test } from "vitest";
import { monthLabel } from "./dates";

test("monthLabel keeps year and month", () => {
  expect(monthLabel("2026-10-29")).toBe("2026-10");
  expect(monthLabel("2025-01-01")).toBe("2025-01");
});
