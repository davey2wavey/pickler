"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Label } from "@pickler/ui";
import { defaultViewId, views } from "./index";
import type { ViewId } from "./index";
import { useActiveView } from "./use-active-view";

function Segments({ active }: { active: ViewId }) {
  return (
    <nav aria-label="View" className="flex flex-wrap items-center gap-4">
      <Label text="view" />
      <ul className="flex border border-line font-mono text-label uppercase tracking-label">
        {views.map((view) => {
          const current = view.id === active;
          return (
            <li key={view.id} className="border-r border-line last:border-r-0">
              <Link
                href={`/?view=${view.id}`}
                aria-current={current ? "page" : undefined}
                className={
                  current
                    ? "block bg-acc px-3 py-1.5 text-acc-ink"
                    : "block px-3 py-1.5 hover:bg-fg hover:text-bg"
                }
              >
                {view.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Live() {
  return <Segments active={useActiveView()} />;
}

/** //VIEW// and a segmented control of registered views. One segment today; that is the point. */
export function ViewSwitch() {
  return (
    <Suspense fallback={<Segments active={defaultViewId} />}>
      <Live />
    </Suspense>
  );
}
