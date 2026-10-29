import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cx } from "./cx";

export type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** Small mono line under the input. */
  hint?: string;
};

export function Field({ label, hint, id, className, ...props }: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return (
    <div className={cx("flex flex-col gap-1", className)}>
      <label htmlFor={inputId} className="font-mono text-label uppercase tracking-label text-grey">
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={hintId}
        className="h-9 border border-line bg-bg px-3 font-sans text-body text-fg placeholder:text-grey focus:outline-2 focus:-outline-offset-1 focus:outline-acc disabled:opacity-50"
        {...props}
      />
      {hint ? (
        <span id={hintId} className="font-mono text-label text-grey">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
