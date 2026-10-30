import type { User } from "@pickler/db";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/** The signed-in user, or a redirect to /sign-in. Call from layouts and pages under (app). */
export async function requireUser(): Promise<User> {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/sign-in");
  return user;
}
