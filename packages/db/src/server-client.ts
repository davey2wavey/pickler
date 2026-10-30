import { createServerClient as createSsrClient } from "@supabase/ssr";
import type { CookieMethodsServer } from "@supabase/ssr";
import type { DbClient } from "./client";
import { getDbEnv } from "./env";
import type { Database } from "./types";

/** How the host framework reads and writes request cookies. */
export type CookieAdapter = CookieMethodsServer;

/**
 * Typed client whose session lives in cookies. Anon key plus the signed-in
 * user's session, so RLS does the filtering. The host passes its cookie store;
 * this package never imports a framework.
 */
export function createServerClient(cookies: CookieAdapter): DbClient {
  const env = getDbEnv();
  return createSsrClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies,
    },
  );
}
