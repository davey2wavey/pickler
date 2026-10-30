"use client";

import { useEffect, useState } from "react";
import { Button } from "@pickler/ui";

/** Copies the address. Says so for a moment. A blocked clipboard is a silent no-op; the text is still selectable. */
export function CopyEmail({
  email,
  resetAfterMs = 2000,
}: {
  email: string;
  resetAfterMs?: number;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), resetAfterMs);
    return () => clearTimeout(timer);
  }, [copied, resetAfterMs]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // No clipboard access. Nothing to show; the address sits right there as text.
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={copy} aria-live="polite">
      {copied ? "copied" : "copy"}
    </Button>
  );
}
