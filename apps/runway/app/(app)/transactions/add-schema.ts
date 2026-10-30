import { isoDate, money, transactionInsert } from "@pickler/db";
import type { Database, TransactionInsert } from "@pickler/db";
import { z } from "zod";

const blankToNull = (v: unknown) => (v === "" || v === undefined ? null : v);

const addForm = z
  .object({
    occurred_at: isoDate,
    payee: z.string().trim().min(1, "Enter a payee."),
    amount: z.coerce
      .number({ error: "Enter an amount." })
      .pipe(money)
      .refine((v) => v !== 0, "Amount cannot be zero."),
    account_id: z.uuid({ error: "Choose an account." }),
    category_id: z.preprocess(blankToNull, z.uuid().nullable()),
    transfer: z.preprocess((v) => v === "on" || v === true, z.boolean()),
    to_account_id: z.preprocess(blankToNull, z.uuid().nullable()),
  })
  .check((ctx) => {
    const { transfer, account_id, to_account_id } = ctx.value;
    if (!transfer) return;
    if (!to_account_id) {
      ctx.issues.push({
        code: "custom",
        path: ["to_account_id"],
        message: "Choose the other account.",
        input: to_account_id,
      });
    } else if (to_account_id === account_id) {
      ctx.issues.push({
        code: "custom",
        path: ["to_account_id"],
        message: "Pick two different accounts.",
        input: to_account_id,
      });
    }
  });

export type AddInput = z.infer<typeof addForm>;
export type FieldErrors = Partial<Record<keyof AddInput, string>>;

export type InsertRow = Database["public"]["Tables"]["transactions"]["Insert"];
export type ParseResult = { ok: true; rows: InsertRow[] } | { ok: false; errors: FieldErrors };

/** Validates through the shared insert schema and drops undefined keys for the typed insert. */
function toInsertRow(candidate: unknown): InsertRow {
  const v: TransactionInsert = transactionInsert.parse(candidate);
  const row: InsertRow = { account_id: v.account_id, occurred_at: v.occurred_at, amount: v.amount };
  if (v.payee !== undefined) row.payee = v.payee;
  if (v.memo !== undefined) row.memo = v.memo;
  if (v.category_id !== undefined) row.category_id = v.category_id;
  if (v.transfer_group !== undefined) row.transfer_group = v.transfer_group;
  if (v.source !== undefined) row.source = v.source;
  return row;
}

/** Form values to insert rows. A transfer becomes two rows sharing a group. */
export function toRows(input: AddInput, group: string): InsertRow[] {
  const base = { occurred_at: input.occurred_at, payee: input.payee, source: "manual" as const };
  if (!input.transfer) {
    return [
      toInsertRow({
        ...base,
        account_id: input.account_id,
        amount: input.amount,
        category_id: input.category_id,
      }),
    ];
  }
  const magnitude = Math.abs(input.amount);
  return [
    toInsertRow({
      ...base,
      account_id: input.account_id,
      amount: -magnitude,
      category_id: null,
      transfer_group: group,
    }),
    toInsertRow({
      ...base,
      account_id: input.to_account_id,
      amount: magnitude,
      category_id: null,
      transfer_group: group,
    }),
  ];
}

export function parseAddForm(formData: FormData, group: string): ParseResult {
  const raw = Object.fromEntries(
    [
      "occurred_at",
      "payee",
      "amount",
      "account_id",
      "category_id",
      "transfer",
      "to_account_id",
    ].map((k) => [k, formData.get(k) ?? undefined]),
  );
  const parsed = addForm.safeParse(raw);
  if (!parsed.success) {
    const errors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof AddInput | undefined;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors };
  }
  return { ok: true, rows: toRows(parsed.data, group) };
}
