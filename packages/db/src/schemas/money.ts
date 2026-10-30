import { z } from "zod";

function hasAtMostTwoDecimals(value: number): boolean {
  return Math.abs(value * 100 - Math.round(value * 100)) < 1e-9;
}

/** numeric(14,2): finite, at most two decimals, within 12 integer digits. */
export const money = z
  .number()
  .finite()
  .refine(hasAtMostTwoDecimals, "at most two decimal places")
  .refine((v) => Math.abs(v) < 1e12, "too large");

export const positiveMoney = money.positive();

/** YYYY-MM-DD. */
export const isoDate = z.iso.date();

/** YYYY-MM-01. */
export const firstOfMonth = isoDate.refine(
  (d) => d.endsWith("-01"),
  "must be the first of a month",
);
