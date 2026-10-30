import type { ComponentType } from "react";
import type { Project } from "@/data/project";
import { Grid } from "./grid/grid";

export type ViewProps = { projects: Project[] };
export type View = { id: string; name: string; Component: ComponentType<ViewProps> };

/** Every view the switch can show. Add a line here; nothing else changes. */
export const views = [
  { id: "grid", name: "Grid", Component: Grid },
] as const satisfies readonly View[];

export type RegisteredView = (typeof views)[number];
export type ViewId = RegisteredView["id"];
export const defaultViewId: ViewId = "grid";

export function findView(id: string | null | undefined): RegisteredView | undefined {
  return views.find((view) => view.id === id);
}
