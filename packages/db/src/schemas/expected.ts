import { z } from "zod";
import { isoDate, positiveMoney } from "./money";

export const repeatKind = z.enum(["none", "monthly", "yearly"]);

export const expectedInsert = z.object({
  name: z.string().trim().min(1),
  amount: positiveMoney,
  due_at: isoDate,
  repeat: repeatKind.optional(),
  account_id: z.uuid().nullable().optional(),
  category_id: z.uuid().nullable().optional(),
  plan_item_id: z.uuid().nullable().optional(),
  active: z.boolean().optional(),
});

export type ExpectedInsert = z.infer<typeof expectedInsert>;
