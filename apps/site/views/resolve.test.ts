import { describe, expect, test } from "vitest";
import { readStoredView, resolveViewId, storageKey, storeView } from "./resolve";

describe("resolveViewId", () => {
  test("param wins, then stored, then default", () => {
    expect(resolveViewId("grid", null)).toBe("grid");
    expect(resolveViewId(null, "grid")).toBe("grid");
    expect(resolveViewId(null, null)).toBe("grid");
    expect(resolveViewId(undefined, undefined)).toBe("grid");
  });

  test("skips ids that are not registered", () => {
    expect(resolveViewId("nope", "grid")).toBe("grid");
    expect(resolveViewId("nope", "also-nope")).toBe("grid");
    expect(resolveViewId("", "")).toBe("grid");
  });
});

describe("storage", () => {
  test("round-trips through a storage under the one key", () => {
    const map = new Map<string, string>();
    const storage = {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
    };
    storeView("grid", storage);
    expect(map.get(storageKey)).toBe("grid");
    expect(readStoredView(storage)).toBe("grid");
  });

  test("a storage that throws reads as nothing and writes silently", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readStoredView(broken)).toBeNull();
    expect(() => storeView("grid", broken)).not.toThrow();
  });

  test("no storage at all reads as nothing", () => {
    expect(readStoredView(undefined)).toBeNull();
    expect(() => storeView("grid", undefined)).not.toThrow();
  });
});
