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

## 2026-10-30 — Accent moves to sky blue, light ground to warm off-white

- `--acc` is `#7fd1f2` in both themes. `--acc-ink` stays black. Light `--bg` is `#f1f1ec`, with `--panel #f8f8f5` for windows and `--ground #e9e9e3` for recessed areas. Dark ground unchanged.
- Why: the approved home mock (apps/site/design/home-mock.html) reads as sun, water, and paper. Lime fought the water. One token change, every app follows.
- Side effects measured, not guessed: `--warn` light darkens to `#b07a00` (the old value fails 3:1 on the off-white), `--grey` light darkens to `#606060` (the old value fails 4.5:1 on `--ground`). `--grey-on-water` exists because grey on dark water measures 2.6:1.
- `--water` mixes 40% accent into the ground in light and 15% in dark. The same 40% over near-black read navy on the first preview.
- `[data-invert]` flips a subtree to the other theme's values, so one band on a page can be black without a second copy of the tokens.
- Rejected: keeping lime and only recoloring the home page. Two accents is two design systems.

## 2026-11-02 — The site is rooms by platform, not views

- One page: Home, Web, iPhone, Mac, Automation, Get in touch. A project's room is its first `tags` entry in `projects.json`; adding a project is a JSON edit. `/views`, the grid, the timeline, and the view switch are deleted, with `apps/site/SPEC.md`'s view-switch section superseded by `SPEC-ROOMS.md`.
- A fixed dock replaces the top nav. It follows scroll and writes the room hash with `replaceState`, only after scrolling settles and never across a pointer or key press, so a tap after a scroll navigates cleanly. Dock clicks are plain hash links; the browser does the scrolling.
- Every string on the home page lives in `apps/site/content/site.ts` or `projects.json`. Components hold no copy.
- Fishing is a side quest in Home: a pure state machine in `lib/fishing.ts`, catches in localStorage, each catch opening its project's block. The ask box answers from a static keyword map until there is an API.
- Placeholder iPhone screenshots are generated SVGs under `public/shots/<slug>/`, replaced later under the same names.
- Rejected: a dock on project pages too. They keep the "All projects" strip; one scroll model is enough.

## 2026-11-03 — Consumer apps get their own skin in the iPhone room

- The five consumer apps (Dekk, Snaphour, Skillet, Divot, Regiment) render as full-bleed bands in their own two tones: one dark ground tinted toward one accent. Name plus its icon glyph on the left, an animated object (the thing the app is about) on the right, status, and a link to `/p/[slug]`.
- Type inside a band is the system font (SF Pro on Apple devices). The apps use it, so the band does. The rest of the site stays on Space Grotesk. If the system font wins on sight, it spreads site-wide as its own decision.
- Brand lives on the project in `projects.json` as an optional `brand` field. No brand, no band: the project renders as a normal block. Add an app = add an entry plus its glyph and object in `components/rooms/app-art.tsx`.
- The glyph is the app icon. Same drawing goes to the App Store and the home screen. The object is the hero visual for the site and the app's own `name.so` page.
- Renames: Skins & Pins → Divot, Fit → Regiment, Nourish → Skillet (new entry). Slugs follow.
- Status line is driven by `status`: beta reads "On TestFlight", in-progress reads "Building", live reads "On the App Store". No store links until an app is live.
- Rejected: stick-figure people doing the activity (first pass, looked crude); glyph-only heroes (too static); object-only (icons would be a separate job).

## 2026-11-04 — Glyph grid replaces the hero and the fishing game

- The home page opens on a dark grid of every branded project's icon, name top-left, "Hi, I make apps." bottom-left. Tap an icon, jump to its band. Then the rooms.
- Rejected for now: the system-window hero with room map and doodles, the waterline, and the fishing side quest (kept on branch `feat/site-catch-wheel`). A cinematic scroll hero (overhead lake, fish pulled up, color flood into the first band) was mocked and shelved; it only earns its place photoreal, which means generated video frames, and that is a later upgrade if ever.
- Hero copy lives in `content/site.ts` under `glyphHero`.

## 2026-11-07 — The whole site in the glyph grid style

- Home is one dark scroll: two lines ("Hi, I'm David." crossfading into "I make apps."), the glyph grid, then every room as a divider band (the room's word in its accent, its icons under it) followed by its project bands, then Connect (one word, Email me, GitHub, the address). Dark only, system font everywhere.
- Gone from code: the system-window hero, room map, doodles, waterline, fishing side quest, the Ask box, the bottom dock, the per-page footer on home. Project pages keep the footer. Everything removed is in git history and on the older `feat/site-*` branches.
- Rejected: a numbered "Room 1 of 4" eyebrow on dividers (leftover numbering), grey blurbs under divider words (flat next to the bands), a top bar with name and "Builds tools" (redundant with the first line).
- Grid lists every branded project. The band order inside a room is the dataset order.

## 2026-11-07 — PR smoke for Runway runs on a local database

- The Runway smoke job in CI now starts Supabase local and builds the app against it, the same way the nightly full e2e does. The hosted demo project is never touched by CI.
- Why: the hosted demo was seeded relative to a day in October, so on November 1 "this month" had no rows and every PR went red. The Runway preview lookup was also coming back empty, so the job was already building locally, just pointed at the wrong database.
- Cost: the Runway smoke no longer exercises the Vercel preview. Site and Company Log still do. If Runway needs preview coverage later, reseed the hosted demo on a schedule first.
