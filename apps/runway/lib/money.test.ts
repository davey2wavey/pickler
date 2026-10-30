import { expect, test } from "vitest";
import { formatAmount, moneyIn, moneyOut, net } from "./money";

const rows = [
  { amount: 3200, transfer_group: null }, // salary
  { amount: -1450.25, transfer_group: null }, // rent
  { amount: -42.1, transfer_group: null }, // groceries
  { amount: -500, transfer_group: "t1" }, // transfer out of checking
  { amount: 500, transfer_group: "t1" }, // transfer into savings
];

test("money in sums positive amounts and excludes transfers", () => {
  expect(moneyIn(rows)).toBe(3200);
});

test("money out sums negative amounts, stays negative, excludes transfers", () => {
  expect(moneyOut(rows)).toBe(-1492.35);
});

test("net is in plus out and keeps its sign", () => {
  expect(net(rows)).toBe(1707.65);
  expect(net([{ amount: -10, transfer_group: null }])).toBe(-10);
  expect(net([])).toBe(0);
});

test("sums do not drift on cents", () => {
  const cents = Array.from({ length: 10 }, () => ({ amount: 0.1, transfer_group: null }));
  expect(moneyIn(cents)).toBe(1);
});

test("formatAmount uses grouping and two decimals, no symbol", () => {
  expect(formatAmount(1234.5)).toBe("1,234.50");
  expect(formatAmount(-20)).toBe("-20.00");
  expect(formatAmount(0)).toBe("0.00");
});
