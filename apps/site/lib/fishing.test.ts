import { describe, expect, test } from "vitest";
import {
  canCast,
  initialState,
  pickFrom,
  readCatches,
  storageKey,
  tapEvent,
  transition,
  writeCatches,
} from "./fishing";
import type { Fish, FishingEvent, FishingState } from "./fishing";

const pool: Fish[] = [
  { slug: "a", name: "A" },
  { slug: "b", name: "B" },
  { slug: "c", name: "C" },
];
const first = () => 0;

function run(events: FishingEvent[], state = initialState()): FishingState {
  return events.reduce((s, e) => transition(s, e, pool, first), state);
}

describe("the happy path", () => {
  test("cast → wait → bite → reel → caught, logging the fish", () => {
    const s1 = run(["cast"]);
    expect(s1.phase).toBe("cast");
    expect(s1.current?.slug).toBe("a");
    const s2 = run(["landed"], s1);
    expect(s2.phase).toBe("wait");
    const s3 = run(["bite"], s2);
    expect(s3.phase).toBe("bite");
    const s4 = run(["reel"], s3);
    expect(s4.phase).toBe("reel");
    const s5 = run(["reeled"], s4);
    expect(s5.phase).toBe("caught");
    expect(s5.caught).toEqual(["a"]);
    expect(s5.current?.slug).toBe("a");
  });

  test("a bite not reeled gets away and clears the line", () => {
    const s = run(["cast", "landed", "bite", "escaped"]);
    expect(s.phase).toBe("missed");
    expect(s.current).toBeNull();
    expect(s.caught).toEqual([]);
  });

  test("a miss or a catch can cast again; mid-cast taps do nothing", () => {
    expect(canCast("idle")).toBe(true);
    expect(canCast("missed")).toBe(true);
    expect(canCast("caught")).toBe(true);
    expect(canCast("wait")).toBe(false);
    expect(run(["cast", "cast"]).phase).toBe("cast");
    expect(run(["cast", "landed", "cast"]).phase).toBe("wait");
    expect(run(["cast", "landed", "bite", "cast"]).phase).toBe("bite");
  });

  test("events out of order change nothing", () => {
    const idle = initialState();
    for (const event of ["landed", "bite", "reel", "reeled", "escaped"] as const) {
      expect(transition(idle, event, pool)).toBe(idle);
    }
    const waiting = run(["cast", "landed"]);
    expect(transition(waiting, "reel", pool)).toBe(waiting);
    expect(transition(waiting, "reeled", pool)).toBe(waiting);
  });

  test("tapEvent maps a tap to cast or reel, else nothing", () => {
    expect(tapEvent("idle")).toBe("cast");
    expect(tapEvent("caught")).toBe("cast");
    expect(tapEvent("bite")).toBe("reel");
    expect(tapEvent("wait")).toBeNull();
    expect(tapEvent("reel")).toBeNull();
  });
});

describe("the pool", () => {
  test("picks among the uncaught first", () => {
    expect(pickFrom(pool, ["a"], first)?.slug).toBe("b");
    expect(pickFrom(pool, ["a", "b"], () => 0.99)?.slug).toBe("c");
  });

  test("once everything is caught, anything can bite again without re-logging", () => {
    expect(pickFrom(pool, ["a", "b", "c"], () => 0.5)?.slug).toBe("b");
    const all = initialState(["a", "b", "c"]);
    const again = run(["cast", "landed", "bite", "reel", "reeled"], all);
    expect(again.phase).toBe("caught");
    expect(again.caught).toEqual(["a", "b", "c"]);
  });

  test("an empty pool casts nothing", () => {
    expect(pickFrom([], [], first)).toBeNull();
    const s = transition(initialState(), "cast", [], first);
    expect(s.phase).toBe("cast");
    expect(s.current).toBeNull();
  });

  test("reset empties the log", () => {
    expect(run(["reset"], initialState(["a"]))).toEqual(initialState());
  });
});

describe("storage", () => {
  function memory() {
    const map = new Map<string, string>();
    return {
      map,
      storage: {
        getItem: (k: string) => map.get(k) ?? null,
        setItem: (k: string, v: string) => void map.set(k, v),
      },
    };
  }

  test("round-trips the caught slugs under one key", () => {
    const { map, storage } = memory();
    writeCatches(["a", "c"], storage);
    expect(JSON.parse(map.get(storageKey) ?? "")).toEqual(["a", "c"]);
    expect(readCatches(storage)).toEqual(["a", "c"]);
  });

  test("malformed, missing, or blocked storage reads as nothing", () => {
    const { storage } = memory();
    storage.setItem(storageKey, "{not json");
    expect(readCatches(storage)).toEqual([]);
    storage.setItem(storageKey, JSON.stringify({ a: 1 }));
    expect(readCatches(storage)).toEqual([]);
    expect(readCatches(memory().storage)).toEqual([]);
    expect(readCatches(undefined)).toEqual([]);
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readCatches(broken)).toEqual([]);
    expect(() => writeCatches(["a"], broken)).not.toThrow();
  });
});
