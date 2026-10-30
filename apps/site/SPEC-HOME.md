# apps/site — SPEC (slice: home page + project pages, from the approved mock)

Reference: the approved mock is saved at `apps/site/design/home-mock.html`. Build to it. Where the mock and this file differ, this file wins.

## Core idea

Home is a scroll experience: a hero, then one band per featured project with a working demo inside it, then how I work, then contact. The page sinks "into the water" as you scroll. Clicking a project goes to its own page for depth: full write-up, metrics, screenshots, links. Project pages support phone apps and native apps with screenshots and video, not just web demos.

## Tokens

- Accent token changes repo-wide: `--acc` from lime to sky blue `#7fd1f2` (both themes), `--acc-ink` stays `#0b0b0c`. Update `packages/ui`, its contrast test, and the `/ui` route. Runway and Company Log inherit automatically.
- New token `--water`: `color-mix(in srgb, var(--acc) 40%, var(--bg))`.
- Ground: light `--bg` becomes `#f1f1ec` (warm off-white), `--panel #f8f8f5`, `--ground #e9e9e3`, `--soft #dcdcd6`. Dark unchanged.

## Home (`/`)

Sections, in order, each a component under `apps/site/components/home/`:

1. `Nav` — bordered strip: name + `// BUILDS TOOLS`, anchors to each project and How I work, black "Get in touch" cell.
2. `Hero` — eyebrow, headline, one paragraph, two buttons, then `SystemWindow`: the three-column system diagram (project nodes → one builder box → live-now list). Values come from `projects.json` (`status`, `name`, `kind`). No invented counts: the node value column shows `status` text, not numbers, until real metrics exist.
3. `Doodles` — inline SVG sun, palm, two wave sets behind the hero window. Hand-drawn style from the mock. Stroke draws on with scroll progress; waves drift with parallax; sun turns slightly. All driven by one `useScrollDepth()` hook. Under `prefers-reduced-motion`, everything renders fully drawn and static.
4. `Waterline` — page background is a gradient split at `--wl`; the split rises at 1.75× scroll speed from just under the hero window. Wavy blue edge at the line. Sections below the line sit on `--water`.
5. `ProofStrip` — four cells. Only real facts: tools live, PRs merged (read at build time from GitHub API or hardcoded and dated), one person, days since repo init. Drop any cell without a real number.
6. `ProjectBand` ×3 — for each `featured` project in `projects.json`: label `01 · Name`, headline (from a new `headline` field, with the mono-emphasized tail as `headlineMono`), problem paragraph, stack + status row, section doodle (wave / palm / sun by index), wave rule, then a two-column body: demo on the left, facts on the right (big metric if one exists, "What it does", "Under the hood", links row). The second band is inverted (black). Demo slot:
   - `kind: web` with `links.live`: an `<iframe>` of the live app inside the window chrome, lazy-loaded when in view, with a "Open full screen" link. Runway and later Company Log.
   - `kind: mac | ios`: a `<video>` poster + play if `links.video` exists, else the first screenshot, else a labeled "Demo coming" panel. Mail Room now.
   - The headline and the first link both go to `/p/[slug]`.
7. `HowIWork` — solid accent band, four cells, copy from the mock.
8. `Contact` — email as selectable mono text with a copy button, stack grid. GitHub link. LinkedIn when a URL exists.
9. `Footer`.

The old view switch moves to `/views` (grid and timeline keep working there). Home no longer shows the switch.

## Project page (`/p/[slug]`), restyled

Same bands language. Top: label, headline, one-liner, stack + status, links. Then:
- `Demo` — same demo slot as home, full width.
- `Story` — Problem / Built / Changed, three columns on desktop, stacked on phone.
- `Metrics` — big mono numbers, only when present.
- `Screens` — screenshot grid. Phone screenshots render in a 9:19.5 frame, desktop in 16:10, from a `screenshots[].frame` field (`phone | desktop | none`). Captions from `alt`.
- `Links` — live, TestFlight, App Store, repo, case study.

Data additions to `projects.json` and the Zod schema: `headline`, `headlineMono`, `whatItDoes`, `underTheHood`, `links.video?`, `links.testflight?`, `links.appstore?`, `screenshots[].frame`. Existing fields stay.

## Copy

From the mock, verbatim, for the three featured projects. No taglines. David rewrites later.

## Tests

- Vitest: schema accepts the new fields; `useScrollDepth` math (waterline position for a few scroll values; progress clamps 0.4–1).
- Testing Library: home renders one `ProjectBand` per featured project; demo slot picks iframe / video / screenshot / placeholder correctly for each `kind` and links combination; reduced-motion renders fully drawn SVGs.
- Playwright smoke: `/` shows the three headlines; Runway band contains an iframe pointing at the live URL; clicking the first headline lands on `/p/runway` showing its Problem text; `/views?view=timeline` still renders; `/ui` shows the blue accent.
- Screenshots at 1280 and 400, light and dark, both themes checked by David on the preview.

## Out of scope

Other views. Analytics. Blog. Real metrics wiring beyond what exists. Mail Room video (David records it). Company Log demo (not built yet; its band shows the placeholder panel).
