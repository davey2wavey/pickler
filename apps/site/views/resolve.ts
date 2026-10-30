import { defaultViewId, findView } from "./index";
import type { ViewId } from "./index";

export const storageKey = "site.view";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

/** The browser's localStorage, or undefined where touching it throws (private windows, blocked storage). */
function browserStorage(): StorageLike | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/** First registered id among the URL param, the stored id, and the default. */
export function resolveViewId(
  param: string | null | undefined,
  stored: string | null | undefined,
): ViewId {
  for (const candidate of [param, stored]) {
    const view = findView(candidate);
    if (view) return view.id;
  }
  return defaultViewId;
}

export function readStoredView(storage: StorageLike | undefined = browserStorage()): string | null {
  try {
    return storage?.getItem(storageKey) ?? null;
  } catch {
    return null;
  }
}

export function storeView(id: ViewId, storage: StorageLike | undefined = browserStorage()): void {
  try {
    storage?.setItem(storageKey, id);
  } catch {
    // Storage blocked. The view still shows; it just is not remembered.
  }
}
