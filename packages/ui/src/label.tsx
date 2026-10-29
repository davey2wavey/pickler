import type { HTMLAttributes } from "react";
import { cx } from "./cx";

export type Tone = "ok" | "warn" | "bad" | "acc";

export type LabelProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Rendered as //TEXT//. Uppercase comes from CSS, so pass it as written. */
  text: string;
  /** Optional leading square dot. */
  dot?: Tone;
};

const dots: Record<Tone, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  bad: "bg-bad",
  acc: "bg-acc",
};

export function Label({ text, dot, className, ...props }: LabelProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 font-mono text-label uppercase tracking-label text-grey",
        className,
      )}
      {...props}
    >
      {dot ? (
        <span aria-hidden data-testid="label-dot" className={cx("size-2", dots[dot])} />
      ) : null}
      {`//${text}//`}
    </span>
  );
}
