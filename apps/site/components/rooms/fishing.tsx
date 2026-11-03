"use client";

import { useEffect, useReducer, useRef } from "react";
import type { KeyboardEvent } from "react";
import { Button, cx } from "@pickler/ui";
import { fishing as copy } from "@/content/site";
import { Column } from "@/components/home/column";
import type { Fish, FishingEvent, FishingState } from "@/lib/fishing";
import { initialState, readCatches, tapEvent, transition, writeCatches } from "@/lib/fishing";
import styles from "./rooms.module.css";

/** How long each automatic step takes, in ms. The bite comes at a random point in its range. */
export const TIMING = {
  landed: 600,
  biteMin: 1800,
  biteSpread: 2200,
  escaped: 1400,
  reeled: 600,
} as const;

type Action = { event: FishingEvent } | { loaded: string[] };

function reducer(pool: readonly Fish[]) {
  return (state: FishingState, action: Action): FishingState =>
    "loaded" in action
      ? { ...state, caught: action.loaded }
      : transition(state, action.event, pool);
}

function depthFor(phase: FishingState["phase"]): "up" | "down" | "bite" {
  if (phase === "cast" || phase === "wait") return "down";
  if (phase === "bite") return "bite";
  return "up";
}

/** The side quest: tap the water, wait for a bite, tap to reel, open what you caught. */
export function Fishing({ pool }: { pool: readonly Fish[] }) {
  const [state, dispatch] = useReducer(reducer(pool), undefined, () => initialState());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { phase, current, caught } = state;

  useEffect(() => {
    dispatch({ loaded: readCatches() });
  }, []);

  // Every automatic step is one timer from the phase it follows.
  useEffect(() => {
    const after = (ms: number, event: FishingEvent) => {
      timer.current = setTimeout(() => dispatch({ event }), ms);
    };
    if (phase === "cast") after(TIMING.landed, "landed");
    if (phase === "wait") after(TIMING.biteMin + Math.random() * TIMING.biteSpread, "bite");
    if (phase === "bite") after(TIMING.escaped, "escaped");
    if (phase === "reel") after(TIMING.reeled, "reeled");
    if (phase === "caught") writeCatches(caught);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [phase, caught]);

  function tap() {
    const event = tapEvent(phase);
    if (event) dispatch({ event });
  }

  function onKey(event: KeyboardEvent) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      tap();
    }
  }

  function reset() {
    writeCatches([]);
    dispatch({ event: "reset" });
  }

  const status = phase === "caught" && !current ? copy.status.idle : copy.status[phase];
  const total = pool.length;

  return (
    <section
      id="fish"
      aria-labelledby="fish-title"
      className="border-t border-line"
      data-testid="fishing"
    >
      <Column className="grid md:grid-cols-[1.4fr_1fr]">
        <div className="relative border-b border-line md:border-b-0 md:border-r">
          <div
            role="button"
            tabIndex={0}
            aria-label={copy.scene}
            onClick={tap}
            onKeyDown={onKey}
            className={cx(styles.scene, "h-full text-fg")}
          >
            <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
              <rect className={styles.sky} x="0" y="0" width="600" height="118" />
              <path
                className={styles.blue}
                d="M0 118c20-10 40-10 60 0s40 10 60 0 40-10 60 0 40 10 60 0 40-10 60 0 40 10 60 0 40-10 60 0 40 10 60 0 40-10 60 0 40 10 60 0"
              />
              <g className={styles.bob}>
                <path d="M80 118l18 30h110l18-30" />
                <path d="M86 118h134" />
                <circle cx="160" cy="70" r="12" />
                <path d="M160 82v26M160 92l-16 12M160 92l18-6M152 108l-6 12M168 108l4 12" />
                <path d="M178 86l60-40" />
              </g>
              <g className={styles.line} data-depth={depthFor(phase)}>
                <line x1="238" y1="46" x2="238" y2="206" />
              </g>
              <g className={styles.tackle} data-depth={depthFor(phase)}>
                <circle cx="238" cy="46" r={phase === "bite" ? 6 : 4} className={styles.blue} />
              </g>
              <g
                className={styles.swimmer}
                {...(phase === "wait" || phase === "bite" || phase === "reel"
                  ? { "data-swim": phase }
                  : {})}
                style={
                  phase === "bite" || phase === "reel"
                    ? { transform: "translate(238px, 206px)" }
                    : undefined
                }
              >
                <path
                  className={styles.fish}
                  d="M0 0c-14-12-30-12-44 0 14 12 30 12 44 0zM-44 0l-14-10v20z"
                />
              </g>
            </svg>
            <p
              aria-live="polite"
              data-testid="fishing-status"
              className="absolute bottom-3 left-4 font-mono text-label uppercase tracking-label"
            >
              {status}
            </p>
          </div>
          {phase === "caught" && current ? (
            <a
              href={`#${current.slug}`}
              data-testid="catch-card"
              className="absolute right-6 top-1/2 flex min-w-[220px] -translate-y-1/2 flex-col gap-1 border border-line bg-panel px-3.5 py-3 font-mono text-label uppercase tracking-label text-fg shadow-[4px_4px_0_var(--fg)] hover:bg-fg hover:text-bg"
            >
              <span>
                {copy.card.caught} {current.name}
              </span>
              <span className="text-grey">{copy.card.open}</span>
            </a>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 px-5 py-6">
          <p className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-label text-grey">
            <span aria-hidden className="size-[7px] bg-acc" />
            {copy.eyebrow}
          </p>
          <h3 id="fish-title" className="text-[1.3rem] font-semibold tracking-[-0.02em]">
            {copy.title}
          </h3>
          <p className="text-grey">{copy.lead}</p>
          <ul aria-label="Catch log" className="mt-1 grid gap-1.5">
            {pool.map((fish) => {
              const got = caught.includes(fish.slug);
              return (
                <li
                  key={fish.slug}
                  data-caught={got || undefined}
                  className={cx(
                    "flex items-center justify-between border px-2.5 py-2 font-mono text-label uppercase tracking-label",
                    got ? "border-line bg-panel" : "border-line-soft",
                  )}
                >
                  <span>{fish.name}</span>
                  <span className={got ? "text-acc" : "text-grey"}>
                    {got ? copy.log.caught : copy.log.inWater}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center justify-between gap-3">
            <p
              data-testid="fishing-hint"
              className="font-mono text-label uppercase tracking-label text-grey"
            >
              {caught.length} / {total} {copy.log.caught}
              {caught.length >= total && total > 0 ? ` · ${copy.allCaught}` : ""}
            </p>
            {caught.length > 0 ? (
              <Button variant="ghost" size="sm" onClick={reset}>
                {copy.reset}
              </Button>
            ) : null}
          </div>
        </div>
      </Column>
    </section>
  );
}
