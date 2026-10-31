import { cx } from "@pickler/ui";
import styles from "./home.module.css";

// Hand-drawn marks from the approved mock. Every path carries pathLength="1" so the
// draw-on in home.module.css can treat the whole path as one dash.
const L = { pathLength: 1 } as const;

export function Sun({ className }: { className?: string | undefined }) {
  return (
    <svg className={cx(styles.stroke, className)} viewBox="0 0 120 120" aria-hidden>
      <circle className={styles.blue} cx="60" cy="60" r="26" {...L} />
      <path
        d="M60 8v14M60 98v14M8 60h14M98 60h14M23 23l10 10M87 87l10 10M97 23l-10 10M33 87l-10 10"
        {...L}
      />
      <path className={styles.blue} d="M46 56q4-10 14-11" {...L} />
    </svg>
  );
}

export function Palm({ className }: { className?: string | undefined }) {
  return (
    <svg className={cx(styles.stroke, className)} viewBox="0 0 150 200" aria-hidden>
      <path d="M78 196c-4-40-6-90 2-130" {...L} />
      <path d="M72 110h12M70 130h14M68 150h16M66 170h18" {...L} />
      <path d="M80 66c-30-14-56-6-66 10 18-6 40-4 66-2" {...L} />
      <path d="M80 66c-10-30 4-52 26-58-8 14-10 32-6 50" {...L} />
      <path d="M82 64c22-20 48-18 62-2-18-2-40 2-60 10" {...L} />
      <path d="M80 68c-26 2-46 16-52 38 14-14 32-22 54-26" {...L} />
      <path d="M84 68c26 4 42 20 46 40-12-14-28-24-48-28" {...L} />
      <circle className={styles.blue} cx="84" cy="70" r="6" {...L} />
      <circle className={styles.blue} cx="74" cy="74" r="5" {...L} />
    </svg>
  );
}

export function WavesLeft({ className }: { className?: string | undefined }) {
  return (
    <svg className={cx(styles.stroke, className)} viewBox="0 0 600 120" aria-hidden>
      <path
        className={styles.blue}
        d="M10 80c40-60 80-70 120-40-20-10-36-4-44 10 30-10 60 10 90 20"
        {...L}
      />
      <path
        className={styles.blue}
        d="M200 90c50-70 100-72 150-36-24-10-44-6-56 8 36-8 74 10 110 24"
        {...L}
      />
      <path
        d="M10 108c20-14 40-14 60 0s40 14 60 0 40-14 60 0 40 14 60 0 40-14 60 0 40 14 60 0 40-14 60 0 40 14 60 0 40-14 60 0"
        {...L}
      />
    </svg>
  );
}

export function WavesRight({ className }: { className?: string | undefined }) {
  return (
    <svg className={cx(styles.stroke, className)} viewBox="0 0 500 110" aria-hidden>
      <path
        className={styles.blue}
        d="M40 70c40-56 90-60 130-30-20-8-38-4-48 10 32-8 64 10 96 22"
        {...L}
      />
      <path
        d="M10 98c20-14 40-14 60 0s40 14 60 0 40-14 60 0 40 14 60 0 40-14 60 0 40 14 60 0 40-14 60 0 40 14 60 0"
        {...L}
      />
    </svg>
  );
}

/** The four marks behind the hero window. Parallax and draw-on come from --sy and --p on the parent. */
export function HeroDoodles() {
  return (
    <div className={styles.doodle} aria-hidden data-testid="hero-doodles">
      <Sun className={styles.sun} />
      <Palm className={styles.palm} />
      <WavesLeft className={styles.w1} />
      <WavesRight className={styles.w2} />
    </div>
  );
}

export type SectionMark = "wave" | "palm" | "sun";

/** Small marks for the project bands, one per index. */
export function sectionMarkFor(index: number): SectionMark {
  return (["wave", "palm", "sun"] as const)[index % 3] ?? "wave";
}

export function SectionMarkSvg({ mark, className }: { mark: SectionMark; className?: string }) {
  const classes = cx(styles.stroke, styles.sectionDoodle, className);
  if (mark === "palm") {
    return (
      <svg className={classes} viewBox="0 0 84 84" aria-hidden>
        <path d="M44 80c-2-22-2-44 2-62" {...L} />
        <path d="M46 20c-16-8-30-4-36 6 10-4 22-2 36 0" {...L} />
        <path d="M46 20c-4-14 4-24 14-26-4 8-6 16-4 24" {...L} />
        <path d="M48 20c12-10 26-8 34 0-10-2-22 0-32 6" {...L} />
        <circle className={styles.blue} cx="47" cy="23" r="4" {...L} />
      </svg>
    );
  }
  if (mark === "sun") {
    return (
      <svg className={classes} viewBox="0 0 84 84" aria-hidden>
        <circle className={styles.blue} cx="42" cy="42" r="16" {...L} />
        <path
          d="M42 8v10M42 66v10M8 42h10M66 42h10M18 18l7 7M59 59l7 7M66 18l-7 7M25 59l-7 7"
          {...L}
        />
      </svg>
    );
  }
  return (
    <svg className={classes} viewBox="0 0 84 84" aria-hidden>
      <path
        className={styles.blue}
        d="M8 44c12-26 30-30 46-16-8-4-16-2-20 4 14-2 28 6 40 12"
        {...L}
      />
      <path d="M6 68c8-8 16-8 24 0s16 8 24 0 16-8 24 0" {...L} />
    </svg>
  );
}
