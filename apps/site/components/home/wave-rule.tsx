import { cx } from "@pickler/ui";
import styles from "./home.module.css";

/** A wavy hairline. Takes the current text color. */
export function WaveRule({ className }: { className?: string }) {
  return <div aria-hidden className={cx(styles.waveMask, "text-fg", className)} />;
}
