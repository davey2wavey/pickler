"use client";

import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { cx } from "@pickler/ui";
import styles from "./home.module.css";
import { waterlineFor } from "./scroll-depth";
import { useScrollDepth } from "./use-scroll-depth";

export const anchorAttribute = "data-waterline-anchor";

/** Zero-height marker. Put it where the water should start: just under the hero window. */
export function WaterlineAnchor() {
  return <div {...{ [anchorAttribute]: "" }} aria-hidden />;
}

/**
 * The content column. Its background is ground above --wl and water below; outside its
 * borders the page stays plain --bg. The line starts at the anchor and rises as the page
 * scrolls. Under reduced motion it stays put.
 */
export function Waterline({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const depth = useScrollDepth(ref, `[${anchorAttribute}]`);
  const level = depth.reduced
    ? depth.anchorOffset
    : waterlineFor(depth.anchorOffset, depth.scrollY);
  const style = { "--wl": `${Math.round(level)}px` } as CSSProperties;
  return (
    <main
      ref={ref}
      style={style}
      className={cx(styles.page, "mx-auto max-w-[1180px] border-x border-line", className)}
    >
      <div aria-hidden className={cx(styles.waterline, styles.waveMask)} />
      {children}
    </main>
  );
}
