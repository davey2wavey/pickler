// Scroll math for the home page. Pure functions; the hook in use-scroll-depth.ts feeds them.

/** The waterline climbs the viewport this many times faster than the page scrolls. */
export const WATER_RATE = 1.75;
/** Strokes start this far drawn so nothing is ever invisible. */
export const MIN_PROGRESS = 0.4;
/** Parallax offsets stop growing past this many pixels of hero travel. */
export const MAX_PARALLAX = 600;

/**
 * Where the waterline sits inside the page wrapper, in px from its top. It starts at
 * `start` (just under the hero window) and, because the page itself already moves at
 * 1x, rises an extra (WATER_RATE - 1) px per scrolled px. Never above the top.
 */
export function waterlineFor(start: number, scrollY: number): number {
  return Math.max(0, start - scrollY * (WATER_RATE - 1));
}

/**
 * How much of a stroke is drawn, 0.4 to 1, from how far an element has come up the
 * viewport. `reach` is the share of the viewport height over which it finishes.
 */
export function progressFor(viewportHeight: number, elementTop: number, reach = 1.1): number {
  if (viewportHeight <= 0) return 1;
  const raw = MIN_PROGRESS + (viewportHeight - elementTop) / (viewportHeight * reach);
  return Math.min(1, Math.max(MIN_PROGRESS, raw));
}

/** Pixels of hero travel to drive parallax from. Zero until the hero starts leaving. */
export function parallaxFor(elementTop: number): number {
  return Math.min(MAX_PARALLAX, Math.max(0, -elementTop + 120));
}
