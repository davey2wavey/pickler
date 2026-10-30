import type { ButtonHTMLAttributes } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  "inline-flex items-center justify-center gap-2 border font-mono uppercase tracking-label whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acc disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "border-acc bg-acc text-acc-ink hover:border-fg hover:bg-fg hover:text-bg",
  secondary: "border-line bg-bg text-fg hover:bg-fg hover:text-bg",
  ghost: "border-transparent bg-transparent text-fg hover:border-line",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-7 px-2 text-label",
  md: "h-9 px-4 text-small",
};

/** The Button look as a class string, for anchors that must look like buttons. */
export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md"): string {
  return cx(base, variants[variant], sizes[size]);
}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return <button type={type} className={cx(buttonClasses(variant, size), className)} {...props} />;
}
