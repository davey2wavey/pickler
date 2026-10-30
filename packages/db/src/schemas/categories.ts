import { z } from "zod";

export const categoryKind = z.enum(["spend", "income"]);
/** A ui token, never a hex. Matches packages/ui Tone. */
export const colorToken = z.enum(["acc", "ok", "warn", "bad"]);

export const categoryInsert = z.object({
  name: z.string().trim().min(1),
  kind: categoryKind,
  color_token: colorToken.optional(),
  sort: z.int().optional(),
});

export type CategoryInsert = z.infer<typeof categoryInsert>;
