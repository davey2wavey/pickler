import type { AnchorHTMLAttributes } from "react";
import { buttonClasses } from "@pickler/ui";

/** An anchor that looks like a secondary Button. Not a sixth primitive; the look comes from ui. */
export function LinkButton({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classes = className
    ? `${buttonClasses("secondary")} ${className}`
    : buttonClasses("secondary");
  return <a className={classes} {...props} />;
}
