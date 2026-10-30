import { expect, test } from "vitest";
import { parseAddForm } from "./add-schema";

const CHECKING = "10000000-0000-4000-8000-000000000001";
const SAVINGS = "10000000-0000-4000-8000-000000000002";
const RENT = "20000000-0000-4000-8000-000000000001";
const GROUP = "30000000-0000-4000-8000-000000000001";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const valid = { occurred_at: "2026-10-12", payee: "Landlord", amount: "-1450.25", account_id: CHECKING, category_id: RENT };

test("a plain transaction becomes one row with its category", () => {
  const result = parseAddForm(form(valid), GROUP);
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.rows).toEqual([
    { occurred_at: "2026-10-12", payee: "Landlord", amount: -1450.25, account_id: CHECKING, category_id: RENT, source: "manual" },
  ]);
});

test("empty category becomes null", () => {
  const result = parseAddForm(form({ ...valid, category_id: "" }), GROUP);
  expect(result.ok && result.rows[0]?.category_id).toBeNull();
});

test("rejects empty payee and zero amount", () => {
  const result = parseAddForm(form({ ...valid, payee: "   ", amount: "0" }), GROUP);
  expect(result).toEqual({ ok: false, errors: { payee: "Enter a payee.", amount: "Amount cannot be zero." } });
});

test("rejects a missing amount and a bad date", () => {
  const result = parseAddForm(form({ ...valid, amount: "", occurred_at: "12/10/2026" }), GROUP);
  expect(result.ok).toBe(false);
  if (result.ok) return;
  expect(result.errors.amount).toBeDefined();
  expect(result.errors.occurred_at).toBeDefined();
});

test("a transfer splits into two rows, same group, opposite signs, no category", () => {
  const result = parseAddForm(form({ ...valid, amount: "500", transfer: "on", to_account_id: SAVINGS }), GROUP);
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.rows).toHaveLength(2);
  expect(result.rows[0]).toMatchObject({ account_id: CHECKING, amount: -500, category_id: null, transfer_group: GROUP });
  expect(result.rows[1]).toMatchObject({ account_id: SAVINGS, amount: 500, category_id: null, transfer_group: GROUP });
});

test("a transfer needs a different second account", () => {
  expect(parseAddForm(form({ ...valid, transfer: "on" }), GROUP)).toMatchObject({ ok: false, errors: { to_account_id: "Choose the other account." } });
  expect(parseAddForm(form({ ...valid, transfer: "on", to_account_id: CHECKING }), GROUP)).toMatchObject({ ok: false, errors: { to_account_id: "Pick two different accounts." } });
});
