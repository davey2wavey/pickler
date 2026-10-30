import { z } from "zod";

export const planInsert = z.object({
  name: z.string().trim().min(1),
  sort: z.int().optional(),
});

export const planItemInsert = z.object({
  plan_id: z.uuid(),
  name: z.string().trim().min(1),
  note: z.string().trim().optional(),
});

export type PlanInsert = z.infer<typeof planInsert>;
export type PlanItemInsert = z.infer<typeof planItemInsert>;
