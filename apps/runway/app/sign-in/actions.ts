"use server";

import { DEMO_EMAIL } from "@pickler/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { env } from "../../env";
import { createClient } from "../../lib/supabase/server";

export type SignInState = { sent?: string; error?: string };

const emailSchema = z.object({ email: z.email("Enter an email address.") });

/** Origin of the current request, so the magic link comes back to this deployment. */
async function origin(): Promise<string> {
  if (env.NEXT_PUBLIC_APP_URL) return env.NEXT_PUBLIC_APP_URL;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3001";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function sendMagicLink(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Enter an email address." };

  const db = await createClient();
  const { error } = await db.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${await origin()}/auth/callback?next=/transactions` },
  });
  if (error) return { error: error.message };
  return { sent: parsed.data.email };
}

export async function signInAsDemo(): Promise<SignInState> {
  if (!env.RUNWAY_DEMO_PASSWORD) return { error: "Demo sign-in is not configured." };
  const db = await createClient();
  const { error } = await db.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: env.RUNWAY_DEMO_PASSWORD,
  });
  if (error) return { error: error.message };
  redirect("/transactions");
}
