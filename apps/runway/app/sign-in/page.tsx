import { Label, Panel } from "@pickler/ui";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { SignInForm } from "./form";

export const dynamic = "force-dynamic";

export default async function Page() {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (user) redirect("/transactions");

  return (
    <main className="mx-auto flex w-full max-w-sm flex-col gap-4 px-4 py-16">
      <Label text="runway" dot="acc" />
      <h1 className="text-h1 font-medium">Sign in</h1>
      <p className="text-lead text-grey">Shows where money goes and how long it lasts.</p>
      <Panel title="sign in">
        <SignInForm />
      </Panel>
    </main>
  );
}
