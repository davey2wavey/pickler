import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "inline-flex items-center rounded-md bg-ink px-3 py-2 text-sm font-medium text-paper hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50";

export function Button({ className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={className ? `${base} ${className}` : base} {...props} />;
}
