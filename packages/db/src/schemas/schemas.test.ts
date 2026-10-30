import { describe, expect, test } from "vitest";
import {
  accountInsert,
  budgetInsert,
  categoryInsert,
  expectedInsert,
  planInsert,
  planItemInsert,
  transactionInsert,
} from "./index";

const uuid = "10000000-0000-4000-8000-000000000001";

describe("insert schemas", () => {
  test("expected rejects a negative or zero amount", () => {
    const base = { name: "Rent", due_at: "2026-11-01" };
    expect(expectedInsert.safeParse({ ...base, amount: -10 }).success).toBe(false);
    expect(expectedInsert.safeParse({ ...base, amount: 0 }).success).toBe(false);
    expect(expectedInsert.parse({ ...base, amount: 1650 }).amount).toBe(1650);
  });

  test("budget rejects a month that is not the first", () => {
    const base = { category_id: uuid, amount: 400 };
    expect(budgetInsert.safeParse({ ...base, month: "2026-10-15" }).success).toBe(false);
    expect(budgetInsert.parse({ ...base, month: "2026-10-01" }).month).toBe("2026-10-01");
  });

  test("account accepts the minimum and uppercases currency", () => {
    const parsed = accountInsert.parse({ name: "Checking", type: "checking", currency: "usd" });
    expect(parsed.currency).toBe("USD");
    expect(accountInsert.safeParse({ name: "", type: "checking" }).success).toBe(false);
  });

  test("category only takes ui tokens for color", () => {
    expect(
      categoryInsert.parse({ name: "Rent", kind: "spend", color_token: "bad" }).color_token,
    ).toBe("bad");
    expect(
      categoryInsert.safeParse({ name: "Rent", kind: "spend", color_token: "#ff0000" }).success,
    ).toBe(false);
  });

  test("transaction needs an account, a date, and a non-zero amount", () => {
    expect(
      transactionInsert.parse({ account_id: uuid, occurred_at: "2026-10-29", amount: -12.5 })
        .amount,
    ).toBe(-12.5);
    expect(
      transactionInsert.safeParse({ account_id: uuid, occurred_at: "2026-10-29", amount: 0 })
        .success,
    ).toBe(false);
  });

  test("plan and plan item accept the minimum", () => {
    expect(planInsert.parse({ name: "Trips" }).name).toBe("Trips");
    expect(planItemInsert.parse({ plan_id: uuid, name: "Japan" }).plan_id).toBe(uuid);
  });
});
