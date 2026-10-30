import { createClient, DEMO_EMAIL } from "@pickler/db";
import { env } from "../../env";
import { HealthView } from "./view";
import type { BalanceRow } from "./view";

// Reads live on every request. Nothing here is static.
export const dynamic = "force-dynamic";

type Result = { rows: BalanceRow[]; problem?: string };

/**
 * Anon key plus a real session, so RLS does the filtering. No service role in
 * any app route. The session lives only for this request.
 */
async function readBalances(): Promise<BalanceRow[]> {
  if (!env.RUNWAY_DEMO_PASSWORD) throw new Error("RUNWAY_DEMO_PASSWORD is not set.");
  const db = createClient();
  const signedIn = await db.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: env.RUNWAY_DEMO_PASSWORD,
  });
  if (signedIn.error) throw new Error(signedIn.error.message);
  try {
    const { data, error } = await db
      .from("account_balances")
      .select("id, name, type, currency, balance")
      .order("sort");
    if (error) throw new Error(error.message);
    return data.map((row) => ({
      id: row.id ?? "",
      name: row.name ?? "",
      type: row.type ?? "",
      currency: row.currency ?? "USD",
      balance: row.balance ?? 0,
    }));
  } finally {
    await db.auth.signOut();
  }
}

/** Never throws. A failed read becomes a message on the page. */
async function load(): Promise<Result> {
  try {
    return { rows: await readBalances() };
  } catch (cause) {
    return { rows: [], problem: cause instanceof Error ? cause.message : String(cause) };
  }
}

export default async function Page() {
  const { rows, problem } = await load();
  return <HealthView rows={rows} problem={problem} />;
}
