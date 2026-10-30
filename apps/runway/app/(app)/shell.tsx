import { Button, Label } from "@pickler/ui";
import type { ReactNode } from "react";
import { signOut } from "../auth/sign-out/actions";
import { formatAmount } from "../../lib/money";
import { Nav } from "./nav";
import { SETTINGS, TABS } from "./tabs";

export type AccountSummary = { id: string; name: string; balance: number };

type Props = { accounts: AccountSummary[]; children: ReactNode };

function Accounts({ accounts }: { accounts: AccountSummary[] }) {
  if (accounts.length === 0) {
    return <p className="font-mono text-label text-grey">No accounts yet.</p>;
  }
  return (
    <ul className="flex flex-col gap-1">
      {accounts.map((account) => (
        <li key={account.id} className="flex items-baseline justify-between gap-3 text-small">
          <span>{account.name}</span>
          <span className="font-mono tabular-nums text-grey">{formatAmount(account.balance)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Desktop: left sidebar with tabs, accounts, settings pinned at the bottom.
 * Phone: tabs across the top, accounts behind an //ACCOUNTS// toggle.
 */
export function Shell({ accounts, children }: Props) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[14rem_1fr]">
      <aside className="flex flex-col gap-4 border-b border-line px-4 py-4 md:sticky md:top-0 md:h-screen md:border-r md:border-b-0">
        <Label text="runway" dot="acc" />
        <Nav tabs={TABS} label="Tabs" />
        <details className="group md:hidden">
          <summary className="cursor-pointer list-none font-mono text-label uppercase tracking-label text-grey">
            {"//accounts//"}
          </summary>
          <div className="pt-2">
            <Accounts accounts={accounts} />
          </div>
        </details>
        <div className="hidden md:block">
          <Label text="accounts" />
          <div className="pt-2">
            <Accounts accounts={accounts} />
          </div>
        </div>
        <div className="hidden flex-1 md:block" />
        <div className="hidden items-center justify-between gap-3 md:flex">
          <Nav tabs={[SETTINGS]} label="Settings" />
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-col">
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
        <footer className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 md:hidden">
          <Nav tabs={[SETTINGS]} label="Settings" />
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
}
