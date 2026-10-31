"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { MIN_PROGRESS, parallaxFor, progressFor } from "./scroll-depth";

export type ScrollDepth = {
  /** True under prefers-reduced-motion. Everything renders drawn and still. */
  reduced: boolean;
  /** window.scrollY at the last frame. */
  scrollY: number;
  /** Stroke draw-on for the element, 0.4 to 1. */
  progress: number;
  /** Pixels of travel for parallax transforms. */
  parallax: number;
  /** Top of the first `anchorSelector` match, measured from the element's top. */
  anchorOffset: number;
};

const still: ScrollDepth = { reduced: true, scrollY: 0, progress: 1, parallax: 0, anchorOffset: 0 };
const initial: ScrollDepth = { ...still, reduced: false, progress: MIN_PROGRESS };

function prefersReducedMotion(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One scroll listener per caller, throttled to animation frames. Measures the element
 * in `ref` and returns the numbers the home page animates with. Under reduced motion
 * it measures once (for the waterline) and reports everything fully drawn.
 */
export function useScrollDepth(
  ref: RefObject<HTMLElement | null>,
  anchorSelector?: string,
  reach?: number,
): ScrollDepth {
  const [depth, setDepth] = useState<ScrollDepth>(initial);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = prefersReducedMotion();
    let frame = 0;

    function measure() {
      frame = 0;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const anchor = anchorSelector ? element.querySelector(anchorSelector) : null;
      const anchorOffset = anchor ? anchor.getBoundingClientRect().top - rect.top : 0;
      setDepth(
        reduced
          ? { ...still, anchorOffset }
          : {
              reduced,
              scrollY: window.scrollY,
              progress: progressFor(window.innerHeight, rect.top, reach),
              parallax: parallaxFor(rect.top),
              anchorOffset,
            },
      );
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }

    measure();
    if (reduced) {
      window.addEventListener("resize", schedule);
      return () => {
        window.removeEventListener("resize", schedule);
        if (frame) cancelAnimationFrame(frame);
      };
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, anchorSelector, reach]);

  return depth;
}
