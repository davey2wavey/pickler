import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getDbEnv } from "./env";
import type { Database } from "./types";

export type DbClient = SupabaseClient<Database>;

/** Typed Supabase client using the anon key. Server and browser safe. */
export function createClient(): DbClient {
  const env = getDbEnv();
  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
