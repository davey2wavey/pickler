"use client";

import { Button, Field } from "@pickler/ui";
import { useActionState } from "react";
import { sendMagicLink, signInAsDemo } from "./actions";
import type { SignInState } from "./actions";

const initial: SignInState = {};

export function SignInForm() {
  const [linkState, sendLink, sending] = useActionState(sendMagicLink, initial);
  const [demoState, tryDemo, starting] = useActionState(signInAsDemo, initial);
  const error = linkState.error ?? demoState.error;

  return (
    <div className="flex flex-col gap-6">
      <form action={sendLink} className="flex flex-col gap-3">
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          {...(linkState.sent ? { hint: `Link sent to ${linkState.sent}. Check your inbox.` } : {})}
        />
        <div>
          <Button type="submit" disabled={sending}>
            {sending ? "Sending" : "Send link"}
          </Button>
        </div>
      </form>
      <form action={tryDemo} className="flex flex-col gap-2">
        <Button type="submit" variant="secondary" disabled={starting}>
          {starting ? "Opening" : "Try the demo"}
        </Button>
        <p className="font-mono text-label text-grey">Seeded data. No email needed.</p>
      </form>
      {error ? (
        <p role="alert" className="font-mono text-small text-bad">
          {error}
        </p>
      ) : null}
    </div>
  );
}
