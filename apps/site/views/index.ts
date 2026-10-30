import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Project } from "@/data/project";

export type ViewProps = { projects: Project[] };
export type View = { id: string; name: string; Component: ComponentType<ViewProps> };

/** Every view the switch can show. Add a line here; nothing else changes.
 * Each view is its own chunk, loaded only when it is the active one. */
export const views = [
  {
    id: "grid",
    name: "Grid",
    Component: dynamic(() => import("./grid/grid").then((m) => m.Grid)),
  },
  {
    id: "timeline",
    name: "Timeline",
    Component: dynamic(() => import("./timeline/timeline").then((m) => m.Timeline)),
  },
] as const satisfies readonly View[];

export type RegisteredView = (typeof views)[number];
export type ViewId = RegisteredView["id"];
export const defaultViewId: ViewId = "grid";

export function findView(id: string | null | undefined): RegisteredView | undefined {
  return views.find((view) => view.id === id);
}
