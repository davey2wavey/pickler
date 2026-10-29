import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type DbEnv = z.infer<typeof schema>;

/** Validates Supabase connection variables. Throws with every problem listed. */
export function parseDbEnv(source: Record<string, string | undefined>): DbEnv {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid Supabase env:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

let cached: DbEnv | undefined;

/** Reads and validates process.env once. Lazy so importing this package never throws. */
export function getDbEnv(): DbEnv {
  cached ??= parseDbEnv(process.env);
  return cached;
}
