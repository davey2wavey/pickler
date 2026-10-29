import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export type PanelProps = HTMLAttributes<HTMLElement> & {
  /** Mono title in the bar. No title, no bar. */
  title?: string;
  /** Right side of the bar: a count, a date, a Label. */
  meta?: ReactNode;
};

export function Panel({ title, meta, className, children, ...props }: PanelProps) {
  return (
    <section className={cx("border border-line bg-bg text-fg", className)} {...props}>
      {title ? (
        <div className="flex items-center justify-between gap-4 border-b border-line px-3 py-2 font-mono text-label uppercase tracking-label">
          <span>{title}</span>
          {meta ? <span className="text-grey">{meta}</span> : null}
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}
