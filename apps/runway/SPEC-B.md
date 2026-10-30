# apps/runway — SPEC (slice B: sign-in, shell, transactions)

## Core idea

A person signs in, lands in the app, and sees their money moving. Sign-in, the five-tab shell, and one working tab: Transactions. Other tabs show their name and nothing else. This is the first screen a recruiter can click around in.

## Sign-in

- Route `/sign-in`. One `Field` (email), one primary `Button` ("Send link"). Supabase magic link.
- Demo path: a secondary `Button` "Try the demo" signs in as the seeded demo user with `RUNWAY_DEMO_PASSWORD` via a server action. Recruiters never type an email.
- After sign-in, redirect to `/transactions`. Unauthenticated visits to app routes redirect to `/sign-in`.
- Sign-out link in the shell footer.

## Shell

- Five tabs, mirroring Runway 1.5.0: Home · Transactions · Expected · Reports · Plan.
- Desktop: left sidebar, mono uppercase labels, account list under the tabs (name + balance from `account_balances`). Settings pinned at bottom.
- Phone: tabs become a top bar, account list collapses behind a `//ACCOUNTS//` toggle.
- Active tab marked with the lime square dot from `Label`.
- Tabs other than Transactions render a `Panel` with the tab name and "Not built yet." Honest, not blank.

## Transactions tab

- Month switcher: `//MONTH//` label, prev/next secondary buttons, current month in mono. Default: current month.
- `Table`: date, payee, category, account, amount. Amount right-aligned, mono, negative in `--bad`, positive in `--ok`. Transfers shown with a `//TRANSFER//` label and no color.
- Footer row: money in, money out, net for the month. Transfers excluded.
- Add: a `Panel` titled `//ADD//` with Fields: date (default today), payee, amount, account (select), category (select), and a "Transfer" checkbox that reveals a second account select. Submit via server action; Zod validates; row appears without reload.
- Empty month: one line, "Nothing recorded for <month>."

## Rules

- All data through `@pickler/db` with the user's session. RLS does the filtering; app code never filters by user_id itself.
- Server components for reads, server actions for writes. No client-side Supabase calls in this slice.
- Money math in one module `lib/money.ts`: sum, net, format. Test-first.
- Dates are plain `YYYY-MM-DD` strings end to end. No timezone math in the UI.

## Tests

- Vitest: `money.ts` (sum excludes transfers, net sign, format 1234.5 → "1,234.50"); month switcher helper (prev/next across year boundary).
- Testing Library: table renders rows, footer totals match fixture; add form rejects empty payee and zero amount.
- Playwright smoke: "Try the demo" lands on `/transactions` with seeded rows visible; add a transaction, see it in the table; sign out returns to `/sign-in`.

## Out of scope

Home, Expected, Reports, Plan content. Editing or deleting transactions. CSV import. Charts. Pulse theme.
