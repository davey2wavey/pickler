# Decisions

Repo notes for the web monorepo. Each entry: what we chose, why, what we rejected. Update when a decision changes; do not delete history.

## 2026-10-29 — Purpose of this repo

Portfolio first, then income. Goal is a site a recruiter or hiring manager can open and understand without talking to David. Three working demos plus case studies. Then recruiter and practitioner coffee chats to learn what the ideal candidate looks like. Applications run in parallel.

Target roles, ranked: forward deployed engineer, solutions engineer, internal tools developer, AI automation consultant, RevOps/systems. Floors: $80K W-2, $2,000 per project.

## Stack

- Next.js, TypeScript, Tailwind, Supabase (Postgres, auth, storage), Vercel.
- Why: standard production stack hiring managers recognize. Signals full-stack skill.
- Prisma: optional later. Supabase client first. One data layer, not two.
- Vercel hobby is free but non-commercial. Paid client work moves to Pro (~$20/month).
- Supabase free tier is fine for demos.

### Scope boundary

This stack is for web only.

- iPhone apps stay Swift (Dekk, Skins & Pins, Fit, Snaphour).
- Mail Room is a Mac app. Stays native. Case study links out.
- Pi media player stays Kodi.
- Matchday stays static GitHub Pages.

Rule: web tools and client dashboards live here. Native stays native.

## Monorepo

- One repo for the web suite: portfolio, design system, Runway (web), Company Log.
- Tooling: Turborepo + pnpm workspaces.
- Why: shared design system and shared types. Portfolio's multi-view layout needs shared components. One pipeline. Signals systems thinking.
- Rejected: repo per project. Cleaner to skim, but design system drifts and gets copy-pasted.
- Mitigation for skimmability: top-level README links each app with one line and a live URL.
- iOS apps stay in separate repos.

## Background jobs and scraping

- Vercel functions time out. Scrapers do not run there.
- Default: GitHub Actions on a cron. Free. Runs a Node script on a schedule, writes to Supabase. Six-hour job limit.
- Upgrade path: Railway or Render always-on worker (~$5/month) if jobs must run live rather than scheduled.
- Not for this: Supabase Edge Functions (short jobs only), Vercel cron (pings, not crawls).
- Caution: Instagram, TikTok, X block scrapers. Prefer official APIs. Scraping is the fallback and breaks often.

Analogy to remember: Vercel is the storefront, the worker is the warehouse.

## Portfolio: one dataset, many views

- Projects live in one data file (JSON first; Supabase only if a contact form or view counts need it).
- Each layout direction is a renderer over that file. Visitor can switch views. The switcher itself is a portfolio piece.
- Rejected: ten separate sites. Scope creep before income.
- Views depend on content. Empty views look empty. Demos ship before views.

Phases:

1. Data file, design system, views 1 (live demos embedded) and 6 (minimal grid). Ship.
2. Views 2 (split screen), 4 (dashboard home), 8 (build timeline), 9 (inbox of projects).
3. Views 3 (scroll story), 5 (flow map), 7 (command palette).
4. View 10 (game world). Only if bored and paid.

Design plates for all ten: see the Portfolio Directions artifact in Claude.

## Case studies

Three core demos, each business-facing:

- Runway: shows where money goes. Full web rebuild in this stack.
- Mail Room: inbox sorts itself. Native Mac app; portfolio links out with video and case study.
- Company Log: paste a company's socials, get every post in one place. Scraper runs as a worker (see above).

Finish order: Runway, Mail Room, Company Log. Runway is closest; Company Log's scraper takes longest.

Case study shape: problem, what was built, what changed. One page each. Real metrics where they exist; honest estimates labeled as such.

Other projects get built in silence and added when live.

## Pitch (draft)

"I build internal tools, dashboards, and automations. Fast. Alone."

Hiring managers read labels. Lead with one sentence, not "I do everything."

## 2026-10-29 — Repo name

- Repo is `pickler`, not `bool`.
- Why: David is being hired, not the studio. A recruiter opens a repo with his name on it and knows whose work it is.
- Rejected: naming it after Bool. Adds a brand to explain before the work speaks.

## 2026-10-29 — Testing stack and process

- TypeScript strict. No `any` without a comment saying why.
- ESLint and Prettier from `packages/config`. One config, every package.
- Vitest with Testing Library for unit and component tests. Logic (money math, parsers, sorters) is test-first.
- Playwright for end to end. Smoke suite (critical flows only) runs on every PR against the Vercel preview. Full suite runs on merge to `main` and nightly.
- Zod at every boundary: API input, scraper output, env vars. Bad data fails loudly at the edge, not deep in a component.
- Supabase runs locally through Docker for development and tests. No test touches the hosted project.
- PostToolUse hook runs `pnpm typecheck` and affected tests after every edit. A red hook stops work until fixed.
- GitHub Actions on every PR: typecheck, lint, unit, smoke e2e. Branch protection on `main`: red cannot merge, no direct pushes.
- Why: tests written with the code keep the hook and CI cheap to trust. Smoke on PR keeps feedback under a few minutes; the full suite catches the rest overnight.
- Rejected: Jest (Vitest shares the Vite toolchain and is faster). Cypress (Playwright covers more browsers, one API). Full e2e on every PR (too slow, blocks small slices).

## UI direction

Reference: wahooservices.co.uk lean. Systems, terminals, hard grid. Not their pixel art.

- Sans: Space Grotesk. Headlines, body, controls.
- Mono: JetBrains Mono. Labels, numbers, nav, code.
- Colors: black, white, one grey, lime. Nothing else except three semantic colors.
- Radius: 0. Everywhere.
- Lines: 1px hairlines. Grid lines are allowed to show.
- Labels: uppercase mono, letter-spaced, often wrapped `//LIKE THIS//`.
- Numbers: mono, tabular, large when they matter.
- Tools (Runway, Company Log): same rules, denser, no flourish, no photos.
- Overview surfaces (portfolio): same rules, bigger type, real screenshots.
- Dark mode: yes, v1. Same tokens, inverted ground. Lime stays lime.

## 2026-10-29 — Service role stays out of app routes

- The Supabase service role key never ships in a Next.js app route or server component. App reads use the anon key with a real signed-in session, so RLS does the filtering.
- Service role is allowed in two places: tests (admin API for throwaway users) and `workers/`.
- Why: bypassing RLS in app code is a footgun even behind an explicit `user_id` filter. One forgotten filter leaks every user's rows.
- Rejected: a server-only service client for the Runway `/health` page. Replaced with a per-request sign-in as the seeded demo user over the anon key.
