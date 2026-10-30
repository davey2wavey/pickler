import { z } from "zod";
import { firstOfMonth, money } from "./money";

export const budgetInsert = z.object({
  category_id: z.uuid(),
  month: firstOfMonth,
  amount: money,
});

export type BudgetInsert = z.infer<typeof budgetInsert>;
