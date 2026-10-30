import { describe, expect, test } from "vitest";
import { firstOfMonth, isoDate, money, positiveMoney } from "./money";

describe("money", () => {
  test("accepts two decimals and negatives", () => {
    expect(money.parse(-1650)).toBe(-1650);
    expect(money.parse(12.34)).toBe(12.34);
  });

  test("rejects three decimals, NaN, and oversize", () => {
    expect(money.safeParse(1.005).success).toBe(false);
    expect(money.safeParse(Number.NaN).success).toBe(false);
    expect(money.safeParse(1e12).success).toBe(false);
  });

  test("positiveMoney rejects zero and negatives", () => {
    expect(positiveMoney.safeParse(0).success).toBe(false);
    expect(positiveMoney.safeParse(-5).success).toBe(false);
    expect(positiveMoney.parse(5)).toBe(5);
  });
});

describe("dates", () => {
  test("isoDate wants YYYY-MM-DD", () => {
    expect(isoDate.parse("2026-10-29")).toBe("2026-10-29");
    expect(isoDate.safeParse("10/29/2026").success).toBe(false);
  });

  test("firstOfMonth rejects any other day", () => {
    expect(firstOfMonth.parse("2026-10-01")).toBe("2026-10-01");
    expect(firstOfMonth.safeParse("2026-10-02").success).toBe(false);
  });
});
