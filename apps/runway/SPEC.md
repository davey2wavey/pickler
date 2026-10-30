# apps/runway — SPEC (slice A: data model + first migration)

## Core idea

Runway shows where money goes and how long it lasts. This slice builds the ground: the Postgres schema in Supabase, typed access from the app, and seed data. No screens beyond a health page. Everything later (Home, Transactions, Expected, Reports, Plan) reads from this.

The web version mirrors the existing Runway 1.5.0 artifact's model so data can be migrated later. Nothing here invents new concepts.

## Entities

- `accounts` — id, user_id, name, type (`checking | savings | credit | cash | other`), currency (default USD), opening_balance (numeric 14,2), opening_at (date), archived (bool), sort (int).
- `categories` — id, user_id, name, kind (`spend | income`), color_token (one of the ui semantic/accent tokens, not a hex), sort.
- `transactions` — id, user_id, account_id, occurred_at (date), amount (numeric 14,2; negative = money out), payee, memo, category_id (nullable), transfer_group (uuid nullable; two rows with the same group are one transfer, excluded from spend and income), source (`manual | import`), created_at.
- `plans` — id, user_id, name (e.g. Trips), sort. The bucket.
- `plan_items` — id, user_id, plan_id, name (e.g. Japan), note.
- `expected` — id, user_id, name, amount (positive), due_at (date), repeat (`none | monthly | yearly`), account_id (nullable, where it hits), category_id (nullable), plan_item_id (nullable), active (bool). Fixed upcoming payments. Not spend until they occur.
- `budgets` — id, user_id, category_id, month (date, first of month), amount.

All tables: RLS on, policy `user_id = auth.uid()`. `user_id` defaults to `auth.uid()`.

## Derived values (SQL views, not app code)

- `account_balances` — per account: opening + sum(transactions).
- `monthly_spend` — per user, month, category: sum of negative non-transfer amounts.
- `runway_days` — per user: current cash (checking + savings + cash) divided by trailing 90-day average daily non-transfer outflow. Null when fewer than 30 days of data.

## Package layout

- `supabase/migrations/0001_init.sql` — tables, RLS, views, indexes on (user_id, occurred_at) and (user_id, due_at).
- `supabase/seed.sql` — one demo user, two accounts, twelve categories, ~60 transactions over three months including two transfers, three expected items, one plan with two items, budgets for the current month. Numbers plausible, not David's real ones.
- `packages/db` — Supabase client factory (server and browser), generated `Database` types, Zod schemas for insert payloads, `pnpm db:types` wired.
- `apps/runway/app/health/page.tsx` — reads `account_balances` for the seeded user and prints a mono table. Proves the pipe end to end.

## Auth

Supabase Auth, email magic link. One user for now. Sign-in page is a `Field` + primary `Button`. No signup flow beyond that.

## Tests

- Vitest against Supabase local (Docker): migration applies clean; RLS blocks cross-user reads; `account_balances` matches a hand-computed sum; transfers excluded from `monthly_spend`; `runway_days` null under 30 days of data.
- Zod insert schemas reject negative `expected.amount` and non-first-of-month `budgets.month`.
- Playwright smoke: `/health` renders the seeded account rows.

## Out of scope

Every real screen. CSV/screenshot import. Charts. Horizon curve. Pulse theme. Multi-user sharing.
