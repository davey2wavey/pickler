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
