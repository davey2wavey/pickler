"use client";

import { cx } from "@pickler/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Tab } from "./tabs";
import { isActive } from "./tabs";

type Props = { tabs: readonly Tab[]; label: string; className?: string };

/** Tab links. The active one gets the lime square dot. */
export function Nav({ tabs, label, className }: Props) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex gap-x-4 gap-y-1 overflow-x-auto md:flex-col">
        {tabs.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "inline-flex h-8 items-center gap-2 whitespace-nowrap font-mono text-label uppercase tracking-label hover:text-fg",
                  active ? "text-fg" : "text-grey",
                )}
              >
                <span
                  aria-hidden
                  data-testid={active ? "label-dot" : undefined}
                  className={cx("size-2", active ? "bg-acc" : "bg-transparent")}
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
