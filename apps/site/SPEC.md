# apps/site — SPEC (slice A: data file + minimal grid view)

## Core idea

One data file describes every project. Views are renderers over that file. This slice ships the file, one view, and the switch that later views plug into. A recruiter can open the site and understand what David builds without talking to him.

## Data file

`apps/site/content/projects.ts`, typed with Zod and exported as `projects`.

Per project:
- `slug`, `name`
- `oneLiner` — what it does and the problem it solves. No taglines.
- `status`: `live | beta | in-progress | case-study | archived`
- `kind`: `web | ios | mac | worker | static`
- `stack`: string[] (e.g. `["next.js","supabase","vercel"]`)
- `links`: `{ live?, repo?, testflight?, caseStudy? }`
- `problem`, `built`, `changed` — one short paragraph each (case study shape)
- `metrics`: `{ label, value, note? }[]` — real numbers only; estimates say "est." in note
- `screenshots`: `{ src, alt }[]` — stored in `apps/site/public/shots/<slug>/`
- `shippedAt`: ISO date; `updatedAt`: ISO date
- `featured`: boolean (the three core ones)

Seed with the three core projects plus Matchday, Mead Hall, Dekk, Skins & Pins as honest `status` values. Missing screenshots render a labeled placeholder, never a broken image.

## View switch

`apps/site/app/(views)/layout.tsx` holds a `ViewSwitch`: a mono `//VIEW//` label and a segmented control listing registered views. Views register in `apps/site/views/index.ts` as `{ id, name, Component }`. This slice registers one: `grid`. Later slices add more without touching the switch.

Route: `/` renders the active view. Active view is read from `?view=` and remembered in localStorage (try/catch, default `grid`).

## View: minimal grid (direction 6)

- Header: name, one line about what David builds, email as selectable mono text with a copy button.
- Grid of featured projects first, then the rest. Tiles are `Panel` from `@pickler/ui` with: screenshot or placeholder, name, oneLiner, status `Label`, stack in mono.
- Click opens `/p/[slug]`: problem, built, changed, metrics in big mono, screenshots, links as secondary `Button`s.
- Footer: GitHub, LinkedIn, email. Mono, hairline above.

## Rules

- All styling through `@pickler/ui` tokens. No raw colors.
- Copy written like a person wrote it. No "crafted," "passionate," "seamless."
- Light and dark both work.
- Works at 400px wide.

## Tests

- Vitest: `projects` parses against the Zod schema; every slug unique; every featured project has at least one metric and one screenshot entry.
- Testing Library: grid renders N tiles for N projects; status label matches.
- Playwright smoke: `/` shows the three featured names; clicking the first tile lands on its `/p/` page and shows its `problem` text.

## Out of scope

Other views. Contact form. Analytics. Blog. CMS.
