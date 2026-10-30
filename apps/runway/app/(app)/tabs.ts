export type Tab = { label: string; href: string };

/** The five tabs, in order. Mirrors Runway 1.5.0. */
export const TABS: readonly Tab[] = [
  { label: "Home", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Expected", href: "/expected" },
  { label: "Reports", href: "/reports" },
  { label: "Plan", href: "/plan" },
];

export const SETTINGS: Tab = { label: "Settings", href: "/settings" };

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
