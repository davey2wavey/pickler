// Removes rows the smoke test added, through the demo user's own session.
// Anon key plus sign-in, so RLS scopes the delete. No service role anywhere.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient, DEMO_EMAIL } from "@pickler/db";

type Env = { url: string; anonKey: string; password: string };

/** Playwright does not load .env.local; read it for local runs when the vars are not set. */
function envFromFile(): Record<string, string> {
  try {
    // Playwright runs from apps/runway.
    const text = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    return Object.fromEntries(
      text
        .split("\n")
        .filter((line) => line.includes("=") && !line.startsWith("#"))
        .map((line) => {
          const i = line.indexOf("=");
          return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
        }),
    );
  } catch {
    return {};
  }
}

function readEnv(): Env {
  const file = envFromFile();
  const get = (name: string) => process.env[name] ?? file[name];
  const url = get("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = get("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const password = get("RUNWAY_DEMO_PASSWORD");
  if (!url || !anonKey || !password) {
    throw new Error(
      "Smoke cleanup needs NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and RUNWAY_DEMO_PASSWORD so it can delete the rows it added.",
    );
  }
  // @pickler/db reads these from process.env.
  process.env.NEXT_PUBLIC_SUPABASE_URL = url;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey;
  return { url, anonKey, password };
}

/** Deletes every demo-user transaction with this payee. Returns how many went. */
export async function deleteByPayee(payee: string): Promise<number> {
  const { password } = readEnv();
  const db = createClient();
  const signedIn = await db.auth.signInWithPassword({ email: DEMO_EMAIL, password });
  if (signedIn.error) throw signedIn.error;
  try {
    const { data, error } = await db.from("transactions").delete().eq("payee", payee).select("id");
    if (error) throw error;
    return data.length;
  } finally {
    await db.auth.signOut();
  }
}
