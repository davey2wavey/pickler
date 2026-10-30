import { z } from "zod";

// Every variable this app reads goes through here. Add to the schema, never read process.env elsewhere.
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.url().optional(),
  // Server only. Lets /health sign in as the seeded demo user. Never NEXT_PUBLIC_.
  RUNWAY_DEMO_PASSWORD: z.string().min(1).optional(),
});

export type Env = z.infer<typeof schema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid env for runway:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const env: Env = parseEnv(process.env);
