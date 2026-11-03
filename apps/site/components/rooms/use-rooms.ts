"use client";

import { useEffect, useState } from "react";
import type { RoomId } from "@/lib/rooms";
import { activeRoomFor, hashFor, roomFromHash, roomIds } from "@/lib/rooms";

/** The hash is written this long after scrolling settles, so it never races a click. */
export const HASH_DELAY_MS = 120;

/** The room id a hash points at, directly or through a block inside it. */
function roomOfHash(hash: string): RoomId | undefined {
  const room = roomFromHash(hash);
  if (room || !hash) return room;
  const target = document.getElementById(hash.slice(1));
  return roomFromHash(target?.closest("[data-room]")?.getAttribute("data-room") ?? "");
}

/**
 * Which room the viewport is in. One scroll listener, throttled to frames. After the
 * user scrolls, the hash follows once scrolling settles, with replaceState so the back
 * button and the browser's own hash scroll are left alone. A pointer or key cancels a
 * pending write, so a tap right after a scroll navigates cleanly. A hash that names a
 * block keeps while its room is the active one.
 */
export function useRooms(): RoomId {
  const [active, setActive] = useState<RoomId>("home");

  useEffect(() => {
    const path = window.location.pathname;
    let frame = 0;
    let pending: ReturnType<typeof setTimeout> | null = null;
    let scrolled = false;
    let current: RoomId | undefined;

    function cancelWrite() {
      if (pending) clearTimeout(pending);
      pending = null;
    }

    function writeHash() {
      pending = null;
      if (!current || window.location.pathname !== path) return;
      if (roomOfHash(window.location.hash) === current) return;
      window.history.replaceState(null, "", hashFor(current));
    }

    function measure() {
      frame = 0;
      const tops = roomIds.flatMap((id) => {
        const element = document.getElementById(id);
        return element ? [[id, element.getBoundingClientRect().top] as const] : [];
      });
      const next = activeRoomFor(tops, window.innerHeight);
      if (next === current) return;
      current = next;
      setActive(next);
      if (scrolled) {
        cancelWrite();
        pending = setTimeout(writeHash, HASH_DELAY_MS);
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }

    function onScroll() {
      scrolled = true;
      schedule();
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("pointerdown", cancelWrite, true);
    document.addEventListener("keydown", cancelWrite, true);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("pointerdown", cancelWrite, true);
      document.removeEventListener("keydown", cancelWrite, true);
      if (frame) cancelAnimationFrame(frame);
      cancelWrite();
    };
  }, []);

  return active;
}
