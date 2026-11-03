"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@pickler/ui";
import type { RoomId } from "@/lib/rooms";
import { hashFor } from "@/lib/rooms";
import styles from "./rooms.module.css";
import { useRooms } from "./use-rooms";

export type DockItem = {
  id: RoomId;
  label: string;
  glyph: string;
  /** Names shown in the strip above the dock after a hover. Empty shows no strip. */
  preview: readonly string[];
};

/** How long a pointer rests on a room before the strip appears. */
export const PREVIEW_DELAY_MS = 350;

const item =
  "flex items-center gap-2 border-r border-line-soft px-3.5 font-mono text-label uppercase tracking-label text-grey hover:bg-ground hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-acc whitespace-nowrap max-md:px-2 max-md:text-[0.58rem]";

/**
 * Fixed strip of rooms at the bottom of the viewport. The active one follows scroll;
 * the last item is the accent "Get in touch". Resting on a room for a moment lists
 * its projects in one shared strip above.
 */
export function Dock({ items, cta }: { items: readonly DockItem[]; cta: DockItem }) {
  const active = useRooms();
  const [preview, setPreview] = useState<DockItem | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clear() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setPreview(null);
  }

  function arm(next: DockItem) {
    clear();
    if (next.preview.length === 0) return;
    timer.current = setTimeout(() => setPreview(next), PREVIEW_DELAY_MS);
  }

  useEffect(() => clear, []);

  return (
    <>
      <nav aria-label="Rooms" className={styles.dock}>
        {items.map((room) => (
          <a
            key={room.id}
            href={hashFor(room.id)}
            data-room={room.id}
            aria-current={active === room.id ? "location" : undefined}
            onMouseEnter={() => arm(room)}
            onMouseLeave={clear}
            onFocus={() => arm(room)}
            onBlur={clear}
            className={cx(item, "h-11", active === room.id && "bg-ground text-fg")}
          >
            <i aria-hidden className={cx(styles.glyph, "not-italic text-acc")}>
              {room.glyph}
            </i>
            {room.label}
          </a>
        ))}
        <a
          href={hashFor(cta.id)}
          data-room={cta.id}
          aria-current={active === cta.id ? "location" : undefined}
          className="flex h-11 items-center gap-2 bg-acc px-4 font-mono text-label uppercase tracking-label text-acc-ink hover:bg-fg hover:text-bg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fg whitespace-nowrap max-md:px-2 max-md:text-[0.58rem]"
        >
          <span aria-hidden className="size-1.5 bg-current" />
          {cta.label}
        </a>
      </nav>
      <div
        aria-hidden
        data-testid="dock-strip"
        {...(preview ? { "data-show": "" } : {})}
        className={cx(styles.strip, "text-small")}
      >
        {preview ? (
          <>
            <span className="font-mono text-label uppercase tracking-label text-grey">
              {preview.label}
            </span>
            {preview.preview.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
}
