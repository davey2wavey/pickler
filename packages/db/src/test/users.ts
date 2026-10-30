// Throwaway users for db tests. Each gets its own signed-in client.
import { randomUUID } from "node:crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { inject } from "vitest";
import type { DbClient } from "../client";
import type { Database } from "../types";

const noSession = { auth: { persistSession: false, autoRefreshToken: false } };

export function serviceClient(): DbClient {
  const { API_URL, SERVICE_ROLE_KEY } = inject("supabase");
  return createSupabaseClient<Database>(API_URL, SERVICE_ROLE_KEY, noSession);
}

export type TestUser = { id: string; db: DbClient };

/** Creates a confirmed user and returns a client signed in as them. */
export async function makeUser(): Promise<TestUser> {
  const { API_URL, ANON_KEY } = inject("supabase");
  const email = `test-${randomUUID()}@runway.test`;
  const password = randomUUID();

  const created = await serviceClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (created.error || !created.data.user) throw created.error ?? new Error("no user created");

  const db = createSupabaseClient<Database>(API_URL, ANON_KEY, noSession);
  const signedIn = await db.auth.signInWithPassword({ email, password });
  if (signedIn.error) throw signedIn.error;

  return { id: created.data.user.id, db };
}

/** Deletes the user. Every row they own cascades away. */
export async function deleteUser(user: TestUser): Promise<void> {
  const { error } = await serviceClient().auth.admin.deleteUser(user.id);
  if (error) throw error;
}
