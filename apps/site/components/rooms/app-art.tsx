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
  runway: (
    <>
      <path className="tile" d={TILE} />
      <rect className="mark" x="46" y="98" width="128" height="44" rx="6" />
      <rect className={`tile ${styles.gfuel}`} x="54" y="106" width="112" height="28" rx="3" />
    </>
  ),
  site: (
    <>
      <path className="tile" d={TILE} />
      <rect className="mark" x="46" y="56" width="128" height="128" rx="8" />
      <rect className="tile" x="46" y="56" width="128" height="18" rx="8" />
      <rect className="tile" x="46" y="66" width="128" height="8" />
      <rect className={`tile ${styles.cursor}`} x="62" y="96" width="6" height="28" />
      {[96, 120, 144].map((y, i) => (
        <rect
          key={y}
          className={`tile ${styles.roomrow}`}
          x="78"
          y={y}
          width="78"
          height="12"
          rx="2"
          style={{ animationDelay: `${i * 1.33}s` }}
        />
      ))}
    </>
  ),
  loot: (
    <>
      <path className="tile" d={TILE} />
      <path className="mark" d="M60 92 h100 l-10 70 h-80 z" />
      <rect className="mark" x="86" y="70" width="48" height="24" rx="6" />
      <rect className="tile" x="94" y="78" width="32" height="8" rx="4" />
    </>
  ),
  "mail-room": (
    <>
      <path className="tile" d={TILE} />
      <rect className="mark" x="50" y="86" width="120" height="76" rx="8" />
      <path
        className={`tile ${styles.flap}`}
        d="M50 94 L110 134 L170 94"
        style={{ fill: "none", stroke: "var(--accent)", strokeWidth: 10, strokeLinejoin: "round" }}
      />
    </>
  ),
  "company-log": (
    <>
      <path className="tile" d={TILE} />
      {[64, 96, 128, 160].map((y, i) => (
        <g key={y} className={styles.logrow} style={{ animationDelay: `${i * 0.75}s` }}>
          <circle className="mark" cx="62" cy={y + 9} r="9" />
          <rect className="mark" x="82" y={y} width="78" height="18" rx="4" />
        </g>
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
  runway: (
    <>
      <path
        className={`ln ${styles.burn}`}
        d="M20 60 C80 70, 120 110, 200 200"
        style={{ strokeWidth: 4, stroke: "var(--accent)" }}
      />
      <rect className="fg" x="20" y="208" width="180" height="22" rx="4" opacity=".18" />
      <rect className={`ac ${styles.fuel}`} x="24" y="212" width="172" height="14" rx="2" />
      {[20, 65, 110, 155, 200].map((x) => (
        <line
          key={x}
          className="ln dim"
          x1={x}
          y1="200"
          x2={x}
          y2="236"
          style={{ strokeWidth: 2 }}
        />
      ))}
    </>
  ),
  site: (
    <>
      <rect className="fg" x="16" y="30" width="188" height="180" rx="6" opacity=".12" />
      <rect className="fg" x="16" y="30" width="188" height="22" rx="6" opacity=".3" />
      <circle className="ac" cx="30" cy="41" r="4" />
      <circle className="fg" cx="44" cy="41" r="4" opacity=".4" />
      <circle className="fg" cx="58" cy="41" r="4" opacity=".4" />
      {[72, 104, 136, 168].map((y, i) => (
        <g key={y} className={styles.roomrow} style={{ animationDelay: `${i}s` }}>
          <rect className="ac" x="32" y={y} width="10" height="18" rx="2" />
          <rect className="fg" x="52" y={y + 3} width={120 - i * 14} height="12" rx="2" />
        </g>
      ))}
      <rect className={`ac ${styles.cursor}`} x="32" y="196" width="8" height="6" />
    </>
  ),
  loot: (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} className={styles.card} style={{ animationDelay: `${i}s` }}>
          <rect
            className="fg"
            x={40 + i * 36}
            y={70 + i * 10}
            width="90"
            height="120"
            rx="6"
            opacity={i === 2 ? 1 : 0.5}
          />
          <rect className="bgf" x={52 + i * 36} y={84 + i * 10} width="66" height="60" rx="4" />
          <rect className="ac" x={52 + i * 36} y={154 + i * 10} width="40" height="8" rx="2" />
        </g>
      ))}
    </>
  ),
  "mail-room": (
    <>
      {[28, 88, 148].map((x, i) => (
        <g key={x}>
          <path className="fg" d={`M${x} 150 h50 v60 h-50 z`} opacity=".18" />
          <path className="ln" d={`M${x} 150 v60 h50 v-60`} style={{ strokeWidth: 4 }} />
          <g className={styles.env} style={{ animationDelay: `${i * 1.5}s` }}>
            <rect className="ac" x={x + 9} y="160" width="32" height="22" rx="3" />
            <path
              className="bgf"
              d={`M${x + 9} 162 L${x + 25} 174 L${x + 41} 162 v-2 h-32 z`}
              opacity=".5"
            />
          </g>
        </g>
      ))}
      <path className="ln dim" d="M30 60 H190" style={{ strokeWidth: 3 }} />
      <path className="ln dim" d="M110 60 V130" style={{ strokeWidth: 3 }} />
    </>
  ),
  "company-log": (
    <>
      <rect className="fg" x="70" y="30" width="80" height="190" rx="6" opacity=".14" />
      {(
        [
          [-90, 46, 0],
          [90, 98, 1],
          [-90, 150, 2],
        ] as const
      ).map(([dx, y, i]) => (
        <g
          key={y}
          className={styles.post}
          style={{ "--dx": `${dx}px`, animationDelay: `${i * 0.6}s` } as CSSProperties}
        >
          <rect className="fg" x="80" y={y} width="60" height="40" rx="4" />
          <circle className="ac" cx="92" cy={y + 12} r="6" />
          <rect className="bgf" x="104" y={y + 8} width="28" height="6" rx="2" opacity=".7" />
          <rect className="bgf" x="88" y={y + 24} width="44" height="6" rx="2" opacity=".5" />
        </g>
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
