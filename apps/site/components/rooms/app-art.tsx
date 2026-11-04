import type { CSSProperties, ReactNode } from "react";
import styles from "./app-art.module.css";

/**
 * Vector art per app, keyed by slug. Each app has a glyph (its icon, an iOS tile) and an
 * object (the thing the app is about, animated). Colors come from the band via CSS vars.
 * Add an app: add a key to both maps. Unknown slugs render nothing.
 */

const TILE =
  "M40 20 h140 a30 30 0 0 1 30 30 v140 a30 30 0 0 1 -30 30 h-140 a30 30 0 0 1 -30 -30 v-140 a30 30 0 0 1 30 -30 z";

const glyphs: Record<string, ReactNode> = {
  dekk: (
    <>
      <path className="tile" d={TILE} />
      <rect
        className={`mark ${styles.eq} ${styles.eq1}`}
        x="62"
        y="70"
        width="26"
        height="100"
        rx="13"
      />
      <rect
        className={`mark ${styles.eq} ${styles.eq2}`}
        x="97"
        y="70"
        width="26"
        height="100"
        rx="13"
      />
      <rect
        className={`mark ${styles.eq} ${styles.eq3}`}
        x="132"
        y="70"
        width="26"
        height="100"
        rx="13"
      />
    </>
  ),
  snaphour: (
    <>
      <path className="tile" d={TILE} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          className={`mark ${styles.tick}`}
          x="106"
          y="36"
          width="8"
          height="18"
          rx="4"
          transform={`rotate(${i * 30} 110 120)`}
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}
      <circle className={`mark ${styles.lens}`} cx="110" cy="120" r="34" />
      <circle className="tile" cx="110" cy="120" r="16" />
    </>
  ),
  skillet: (
    <>
      <path className="tile" d={TILE} />
      <g className={styles.gpan}>
        <circle className="mark" cx="100" cy="120" r="48" />
        <circle className="tile" cx="100" cy="120" r="34" />
        <path className="markLn" d="M140 84 L178 46" />
      </g>
    </>
  ),
  divot: (
    <>
      <path className="tile" d={TILE} />
      <path className="markLn" d="M96 184 L96 56" />
      <path className={`mark ${styles.gflag}`} d="M96 56 L156 74 L96 92 z" />
      <ellipse className="mark" cx="104" cy="186" rx="34" ry="10" />
    </>
  ),
  regiment: (
    <>
      <path className="tile" d={TILE} />
      {[62, 94, 126, 158].map((y, i) => (
        <rect
          key={y}
          className={`mark ${styles.row}`}
          x="54"
          y={y}
          width="112"
          height="22"
          rx="11"
          style={{ animationDelay: `${i}s` }}
        />
      ))}
    </>
  ),
};

const objects: Record<string, ReactNode> = {
  dekk: (
    <>
      <g className={styles.record}>
        <circle className="fg" cx="110" cy="120" r="92" />
        <circle className="bgf" cx="110" cy="120" r="80" />
        <circle className="ln dim" cx="110" cy="120" r="70" style={{ strokeWidth: 2 }} />
        <circle className="ln dim" cx="110" cy="120" r="58" style={{ strokeWidth: 2 }} />
        <circle className="ln dim" cx="110" cy="120" r="46" style={{ strokeWidth: 2 }} />
        <circle className="ac" cx="110" cy="120" r="30" />
        <circle className="bgf" cx="110" cy="120" r="4" />
        <rect className="bgf" x="108" y="92" width="4" height="12" rx="2" />
      </g>
      <g className={styles.tonearm}>
        <circle className="fg" cx="196" cy="36" r="10" />
        <path className="ln" d="M196 36 L150 110" style={{ strokeWidth: 5 }} />
        <rect
          className="ac"
          x="140"
          y="106"
          width="20"
          height="10"
          rx="3"
          transform="rotate(-57 150 111)"
        />
      </g>
    </>
  ),
  snaphour: (
    <>
      {Array.from({ length: 16 }, (_, i) => (
        <rect
          key={i}
          className={`ac ${styles.cell}`}
          x={20 + (i % 4) * 46}
          y={40 + Math.floor(i / 4) * 46}
          width="40"
          height="40"
          rx="8"
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}
    </>
  ),
  skillet: (
    <>
      <g className={styles.pan}>
        <path className="ln" d="M20 130 L70 130" style={{ strokeWidth: 10 }} />
        <path
          className="fg"
          d="M70 118 h110 a8 8 0 0 1 8 8 v8 a20 20 0 0 1 -20 20 h-86 a20 20 0 0 1 -20 -20 v-8 a8 8 0 0 1 8 -8 z"
        />
        <path
          className="bgf"
          d="M76 124 h98 v6 a12 12 0 0 1 -12 12 h-74 a12 12 0 0 1 -12 -12 z"
          opacity=".35"
        />
      </g>
      <g className={styles.food}>
        <ellipse className="ac" cx="130" cy="116" rx="22" ry="9" />
        <ellipse className="bgf" cx="130" cy="114" rx="13" ry="5" opacity=".3" />
      </g>
      {[112, 130, 148].map((x, i) => (
        <g key={x} className={styles[`steam${i + 1}` as "steam1"]}>
          <path
            className="ln"
            d={`M${x} 100 q-4 -8 0 -16 q4 -8 0 -16`}
            opacity=".5"
            style={{ strokeWidth: 5 }}
          />
        </g>
      ))}
      <line className="ln dim" x1="40" y1="200" x2="180" y2="200" style={{ strokeWidth: 4 }} />
    </>
  ),
  divot: (
    <>
      <path className="fg" d="M10 176 Q110 160 210 176 L210 200 L10 200 z" opacity=".18" />
      <ellipse className="bgf" cx="174" cy="176" rx="14" ry="5" />
      <path className="ln" d="M174 176 L174 60" style={{ strokeWidth: 4 }} />
      <path className={`ac ${styles.flag}`} d="M174 60 L214 72 L174 84 z" />
      <circle className={`fg ${styles.ball}`} cx="40" cy="168" r="8" />
    </>
  ),
  regiment: (
    <>
      <g className={styles.bend}>
        <path className="ln" d="M14 120 Q110 120 206 120" style={{ strokeWidth: 8 }} />
      </g>
      <rect className="fg" x="62" y="108" width="8" height="24" rx="2" />
      <rect className="fg" x="150" y="108" width="8" height="24" rx="2" />
      {(
        [
          ["ac", 48, 84, 72, -60, 0],
          ["ac", 158, 84, 72, 60, 0],
          ["fg", 32, 90, 60, -60, 0.5],
          ["fg", 174, 90, 60, 60, 0.5],
          ["ac", 16, 98, 44, -60, 1],
          ["ac", 190, 98, 44, 60, 1],
        ] as const
      ).map(([tone, x, y, h, dx, delay]) => (
        <rect
          key={`${x}-${y}`}
          className={`${tone} ${styles.plate}`}
          x={x}
          y={y}
          width="14"
          height={h}
          rx="4"
          style={{ "--dx": `${dx}px`, animationDelay: `${delay}s` } as CSSProperties}
        />
      ))}
    </>
  ),
};

export function hasArt(slug: string): boolean {
  return slug in glyphs && slug in objects;
}

/** The app icon: an iOS tile in the accent with the mark cut out in the ground. */
export function AppGlyph({ slug, className }: { slug: string; className?: string | undefined }) {
  const art = glyphs[slug];
  if (!art) return null;
  return (
    <svg className={`${styles.art} ${className ?? ""}`} viewBox="10 10 200 200" aria-hidden>
      {art}
    </svg>
  );
}

/** The hero object: the thing the app is about, in motion. */
export function AppObject({ slug, className }: { slug: string; className?: string | undefined }) {
  const art = objects[slug];
  if (!art) return null;
  return (
    <svg className={`${styles.art} ${className ?? ""}`} viewBox="0 0 220 240" aria-hidden>
      {art}
    </svg>
  );
}
