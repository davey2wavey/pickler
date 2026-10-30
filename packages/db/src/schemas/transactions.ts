import { z } from "zod";
import { isoDate, money } from "./money";

export const transactionSource = z.enum(["manual", "import"]);

export const transactionInsert = z.object({
  account_id: z.uuid(),
  occurred_at: isoDate,
  /** Negative is money out. */
  amount: money.refine((v) => v !== 0, "amount cannot be zero"),
  payee: z.string().trim().optional(),
  memo: z.string().trim().optional(),
  category_id: z.uuid().nullable().optional(),
  transfer_group: z.uuid().nullable().optional(),
  source: transactionSource.optional(),
});

export type TransactionInsert = z.infer<typeof transactionInsert>;
