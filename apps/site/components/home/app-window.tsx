import type { ReactNode } from "react";
import { cx } from "@pickler/ui";

type Props = {
  /** Mono title in the bar, rendered as //TITLE//. */
  title: string;
  /** Larger chrome for the hero window. */
  size?: "md" | "lg";
  className?: string;
  children: ReactNode;
};

/** Window chrome around a demo or diagram: three dot cells, a title, a hard offset shadow. */
export function AppWindow({ title, size = "md", className, children }: Props) {
  const cell = size === "lg" ? "w-[34px]" : "w-7";
  const bar = size === "lg" ? "h-[34px]" : "h-7";
  return (
    <div
      className={cx(
        "border border-line bg-panel text-fg",
        size === "lg" ? "shadow-[6px_6px_0_var(--fg)]" : "shadow-[4px_4px_0_var(--fg)]",
        className,
      )}
    >
      <div className={cx("grid grid-cols-[auto_1fr_auto] border-b border-line", bar)}>
        <div aria-hidden className="flex font-mono text-label">
          {["×", "–", "□"].map((glyph) => (
            <span key={glyph} className={cx("grid place-items-center border-r border-line", cell)}>
              {glyph}
            </span>
          ))}
        </div>
        <div className="grid place-items-center font-mono text-label uppercase tracking-[0.1em]">
          {`//${title}//`}
        </div>
        <div className={cx("grid place-items-center border-l border-line", cell)}>
          {size === "lg" ? <span aria-hidden className="size-2 bg-acc" /> : null}
        </div>
      </div>
      {children}
    </div>
  );
}
