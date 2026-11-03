import { z } from "zod";

// The fishing side quest as a pure machine. The component owns the clock and calls
// `transition` with what happened; nothing here touches the DOM or timers.

export type Phase = "idle" | "cast" | "wait" | "bite" | "reel" | "caught" | "missed";
export type Fish = { slug: string; name: string };
export type FishingState = {
  phase: Phase;
  /** What is on the line, from cast until it is caught or gets away. */
  current: Fish | null;
  /** Slugs caught so far, oldest first. */
  caught: readonly string[];
};
export type FishingEvent = "cast" | "landed" | "bite" | "reel" | "reeled" | "escaped" | "reset";

export function initialState(caught: readonly string[] = []): FishingState {
  return { phase: "idle", current: null, caught };
}

/** Phases where a tap on the water casts. */
export function canCast(phase: Phase): boolean {
  return phase === "idle" || phase === "caught" || phase === "missed";
}

/**
 * Picks the next fish: one not yet caught when any remain, else any of them, so the
 * game keeps going after a full log. `random` is in [0, 1).
 */
export function pickFrom(
  pool: readonly Fish[],
  caught: readonly string[],
  random: () => number = Math.random,
): Fish | null {
  const left = pool.filter((fish) => !caught.includes(fish.slug));
  const from = left.length > 0 ? left : pool;
  if (from.length === 0) return null;
  return from[Math.min(from.length - 1, Math.floor(random() * from.length))] ?? null;
}

/** The next state for an event. Events that do not apply in the current phase change nothing. */
export function transition(
  state: FishingState,
  event: FishingEvent,
  pool: readonly Fish[],
  random: () => number = Math.random,
): FishingState {
  switch (event) {
    case "cast":
      if (!canCast(state.phase)) return state;
      return { ...state, phase: "cast", current: pickFrom(pool, state.caught, random) };
    case "landed":
      return state.phase === "cast" ? { ...state, phase: "wait" } : state;
    case "bite":
      return state.phase === "wait" ? { ...state, phase: "bite" } : state;
    case "reel":
      return state.phase === "bite" ? { ...state, phase: "reel" } : state;
    case "reeled": {
      if (state.phase !== "reel" || !state.current) return state;
      const slug = state.current.slug;
      const caught = state.caught.includes(slug) ? state.caught : [...state.caught, slug];
      return { ...state, phase: "caught", caught };
    }
    case "escaped":
      return state.phase === "bite" ? { ...state, phase: "missed", current: null } : state;
    case "reset":
      return initialState();
  }
}

/** How a tap on the water reads in each phase. */
export function tapEvent(phase: Phase): FishingEvent | null {
  if (canCast(phase)) return "cast";
  if (phase === "bite") return "reel";
  return null;
}

export const storageKey = "site.catches";
const stored = z.array(z.string());
type StorageLike = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): StorageLike | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/** Caught slugs from storage. Anything missing, blocked, or malformed reads as none. */
export function readCatches(storage: StorageLike | undefined = browserStorage()): string[] {
  try {
    const raw = storage?.getItem(storageKey);
    if (!raw) return [];
    const parsed = stored.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function writeCatches(
  caught: readonly string[],
  storage: StorageLike | undefined = browserStorage(),
): void {
  try {
    storage?.setItem(storageKey, JSON.stringify(caught));
  } catch {
    // Storage blocked. The log still shows for this visit.
  }
}
