"use client";

import { Suspense } from "react";
import { findView, views } from "./index";
import type { ViewProps } from "./index";
import { useActiveView } from "./use-active-view";

const Default = views[0].Component;

function Live({ projects }: ViewProps) {
  const view = findView(useActiveView()) ?? views[0];
  return <view.Component projects={projects} />;
}

/** Renders the active view. The default view is the prerendered fallback, so / stays static. */
export function ActiveView({ projects }: ViewProps) {
  return (
    <Suspense fallback={<Default projects={projects} />}>
      <Live projects={projects} />
    </Suspense>
  );
}
