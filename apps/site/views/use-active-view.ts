"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { findView } from "./index";
import type { ViewId } from "./index";
import { readStoredView, resolveViewId, storeView } from "./resolve";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

const noStoredView = () => null;

/** The view to show: ?view= first, then what the browser remembers, then the default.
 * A valid ?view= is remembered for next time. Callers sit under a Suspense boundary. */
export function useActiveView(): ViewId {
  const param = useSearchParams().get("view");
  const stored = useSyncExternalStore(subscribe, readStoredView, noStoredView);
  const active = resolveViewId(param, stored);

  useEffect(() => {
    if (findView(param)) storeView(active);
  }, [param, active]);

  return active;
}
