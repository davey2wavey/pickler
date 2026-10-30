import { z } from "zod";
import { isoDate, money } from "./money";

export const accountType = z.enum(["checking", "savings", "credit", "cash", "other"]);

export const accountInsert = z.object({
  name: z.string().trim().min(1),
  type: accountType,
  currency: z.string().length(3).toUpperCase().optional(),
  opening_balance: money.optional(),
  opening_at: isoDate.optional(),
  archived: z.boolean().optional(),
  sort: z.int().optional(),
});

export type AccountInsert = z.infer<typeof accountInsert>;
