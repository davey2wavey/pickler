import { createServerClient } from "@pickler/db";
import type { DbClient } from "@pickler/db";
import { cookies } from "next/headers";

/**
 * Supabase client for server components, server actions, and route handlers.
 * Reads the session from request cookies. Writes land in the response when the
 * caller is an action or handler; a server component cannot set cookies, and
 * proxy.ts refreshes the session there instead.
 */
export async function createClient(): Promise<DbClient> {
  const store = await cookies();
  return createServerClient({
    getAll: () => store.getAll(),
    setAll: (list) => {
      try {
        for (const { name, value, options } of list) store.set(name, value, options);
      } catch {
        // Server component render: cookies are read-only here. proxy.ts handles refresh.
      }
    },
  });
}
