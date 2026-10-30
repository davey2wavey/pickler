import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "../../../lib/supabase/server";

/** Magic link lands here. Trades the code for a session cookie, then goes to the app. */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/transactions";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/transactions";

  if (code) {
    const db = await createClient();
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safeNext, url.origin));
  }
  return NextResponse.redirect(new URL("/sign-in?error=link", url.origin));
}
