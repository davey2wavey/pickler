# pickler

Monorepo for David Pickler's web work: portfolio site, Runway, Company Log, shared design system. Read `DECISIONS.md` before changing architecture. Decided means decided.

## Stack

Next.js (App Router), TypeScript strict, Tailwind, Supabase (Postgres, auth, storage), Vercel. Turborepo + pnpm workspaces. Vitest, Testing Library, Playwright, Zod, ESLint, Prettier.

## Layout

```
apps/site          portfolio (one dataset, many views)
apps/runway        where money goes
apps/company-log   every post from a company's socials, one place
packages/ui        design system (components, tokens)
packages/db        Supabase client, generated types, migrations
packages/config    shared eslint, tsconfig, prettier
workers/           scheduled jobs (GitHub Actions cron), e.g. company-log scraper
```

## Commands

```
pnpm dev                 all apps
pnpm dev --filter site   one app
pnpm typecheck
pnpm lint
pnpm test                vitest, all packages
pnpm test:e2e            playwright full suite
pnpm test:smoke          playwright critical flows only
pnpm db:start            supabase local (needs Docker Desktop running)
pnpm db:reset            wipe local db, rerun migrations + seed
pnpm db:types            regenerate TS types from schema
```

## How to work

- One vertical slice per branch. Small enough to review in minutes.
- Plan first in plan mode. State the core idea and each feature in a few plain sentences. Wait for approval. Then build without pausing to ask.
- Fewer things per turn. Do not present 15 generated items at once.
- Tests are written with the code, not after. Logic (money math, parsers, sorters) is test-first.
- Zod at every boundary: API input, scraper output, env vars.
- Read a file before editing it. Never rebuild a file from memory.
- Keep files small. Prefer many small modules over one large one.
- No new dependency without a one-line reason in the PR.
- Do not touch `main` directly. Branch, PR, CI green, merge.

## Definition of done (every slice)

1. `pnpm typecheck` passes.
2. `pnpm lint` passes.
3. New and affected `pnpm test` pass.
4. `pnpm test:smoke` passes if the slice touches a user flow.
5. Vercel preview opened and checked by David.
6. Then merge. Not before. Never say "done" early.

## Hooks

A PostToolUse hook runs `pnpm typecheck` and affected tests after edits. A failing hook stops work; fix before continuing.

## CI

GitHub Actions on every PR: typecheck, lint, unit, smoke e2e against Vercel preview. Branch protection on `main`: red cannot merge. Full Playwright suite runs on merge to `main` and nightly.

## Background jobs

Never run scrapers or long jobs in Vercel functions. They go in `workers/` on a GitHub Actions cron, writing to Supabase. Upgrade to a Railway/Render worker only if a job must run live rather than on a schedule.

## Style

- Copy: lead with what the thing does and the problem it solves. No taglines. Reads like a person wrote it.
- 12-hour clock everywhere (7:45 am, 4:45 pm).
- Responses to David: short sentences, no preamble, no narration, ready-to-paste commands.

## Out of scope here

iPhone apps (Swift), Mail Room (native Mac), Pi media player (Kodi), Matchday (static). Separate repos.
