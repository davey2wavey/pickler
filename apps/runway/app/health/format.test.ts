import { expect, test } from "vitest";
import { formatMoney } from "./format";

test("two decimals, thousands separator, currency sign", () => {
  expect(formatMoney(1234.5)).toBe("$1,234.50");
  expect(formatMoney(4200)).toBe("$4,200.00");
});

test("negative keeps the sign in front of the symbol", () => {
  expect(formatMoney(-20)).toBe("-$20.00");
});

test("other currencies use their own symbol", () => {
  expect(formatMoney(10, "EUR")).toBe("€10.00");
});
