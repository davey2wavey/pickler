"use client";

import { useEffect, useRef } from "react";
import { intro } from "@/content/site";
import styles from "./intro.module.css";

/** Progress through a pinned stage, 0 at its top to 1 where it unpins. */
export function progressFor(top: number, height: number, viewport: number): number {
  const total = height - viewport;
  if (total <= 0) return 1;
  return Math.max(0, Math.min(1, -top / total));
}

/** Where each line sits for a progress value: the first fades out, the second fades in. */
export function linesFor(p: number): { first: number; second: number } {
  const seg = (a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)));
  return { first: 1 - seg(0.25, 0.55), second: seg(0.45, 0.75) };
}

/**
 * The page opens on one line. Scrolling crossfades it into the second. Two screens of
 * scroll, the text pinned. CSS scroll-driven animation does the work where supported;
 * the frame loop below covers older browsers. Under reduced motion both lines show, stacked.
 */
export function Intro() {
  const wrap = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLHeadingElement>(null);
  const second = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()")) return;
    let frame = 0;
    const draw = () => {
      const el = wrap.current;
      if (el && first.current && second.current) {
        const p = progressFor(el.getBoundingClientRect().top, el.offsetHeight, window.innerHeight);
        const { first: a, second: b } = linesFor(p);
        first.current.style.opacity = String(a);
        first.current.style.transform = `translateY(${(1 - a) * -28}px)`;
        second.current.style.opacity = String(b);
        second.current.style.transform = `translateY(${(1 - b) * 28}px)`;
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={wrap} className={styles.intro} data-testid="intro">
      <div className={styles.stage}>
        <h1 ref={first} className={styles.first}>
          {intro.first}
        </h1>
        <p ref={second} className={styles.second} aria-hidden>
          {intro.second}
        </p>
      </div>
    </div>
  );
}
