"use client";

import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useScrollDepth } from "./use-scroll-depth";

type Props = {
  /** Share of the viewport over which the strokes finish drawing. */
  reach?: number;
  /** Also expose the parallax offset as --sy (the hero wants it; bands do not). */
  parallax?: boolean;
  className?: string;
  children: ReactNode;
};

/** Sets --p (and optionally --sy) on a wrapper from its own scroll position. One hook, one listener. */
export function DrawOn({ reach, parallax = false, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const depth = useScrollDepth(ref, undefined, reach);
  const style = {
    "--p": depth.progress.toFixed(3),
    ...(parallax ? { "--sy": String(depth.parallax) } : {}),
  } as CSSProperties;
  return (
    <div
      ref={ref}
      style={style}
      className={className}
      data-reduced-motion={depth.reduced || undefined}
    >
      {children}
    </div>
  );
}
