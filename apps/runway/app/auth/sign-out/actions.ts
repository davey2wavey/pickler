"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

/**
 * Ends this browser's session only. The default scope revokes every session
 * for the user, which would sign out every demo visitor at once.
 */
export async function signOut(): Promise<void> {
  const db = await createClient();
  await db.auth.signOut({ scope: "local" });
  redirect("/sign-in");
}
