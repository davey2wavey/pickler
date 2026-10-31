import type { ReactNode } from "react";
import { cx } from "@pickler/ui";

/** Bands bleed to the viewport edge. What sits in them stays inside this column. */
export const columnClasses = "mx-auto w-full max-w-[1180px]";

export function Column({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx(columnClasses, className)}>{children}</div>;
}
