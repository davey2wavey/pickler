// Vitest global setup: reads the local Supabase stack's keys and hands them to tests.
// Fails loudly when the stack is down. No test touches the hosted project.
import { spawnSync } from "node:child_process";
import path from "node:path";
import type { TestProject } from "vitest/node";
import { z } from "zod";

const status = z.object({
  API_URL: z.url(),
  ANON_KEY: z.string().min(1),
  SERVICE_ROLE_KEY: z.string().min(1),
});

export type LocalSupabase = z.infer<typeof status>;

declare module "vitest" {
  export interface ProvidedContext {
    supabase: LocalSupabase;
  }
}

export default function setup(project: TestProject) {
  const cwd = path.resolve(import.meta.dirname, "../..");
  const result = spawnSync("pnpm", ["exec", "supabase", "status", "-o", "json"], {
    cwd,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`Local Supabase is not running. Run \`pnpm db:start\`.\n${result.stderr}`);
  }
  const parsed = status.safeParse(JSON.parse(result.stdout));
  if (!parsed.success) {
    throw new Error(`Unexpected \`supabase status\` output:\n${z.prettifyError(parsed.error)}`);
  }
  project.provide("supabase", parsed.data);
}
