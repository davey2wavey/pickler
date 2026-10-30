import { createServerClient } from "@pickler/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Keeps the Supabase session fresh. getUser() refreshes an expiring token and
 * the new cookies go out on this response. No auth decisions here; the (app)
 * layout redirects signed-out visitors.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const db = createServerClient({
    getAll: () => request.cookies.getAll(),
    setAll: (list) => {
      for (const { name, value } of list) request.cookies.set(name, value);
      response = NextResponse.next({ request });
      for (const { name, value, options } of list) response.cookies.set(name, value, options);
    },
  });
  await db.auth.getUser();
  return response;
}

export const config = {
  // Everything except static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
