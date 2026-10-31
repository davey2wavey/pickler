# apps/site — SPEC (slice: home additions from mock v12)

Reference: `apps/site/design/home-mock.html` (updated). Build these seven additions onto the merged home page. Spec wins on conflicts.

## Core idea

Same page, more life and more depth. A dock nav that follows you, one big sentence that says what David does, a fishing side-quest in the water, richer facts per project, bleeding screenshots, more air, and a drawn face by the contact block.

## 1. Dock nav

- Fixed, bottom center, respects safe-area inset. Square corners, 1px border, 4px hard shadow in `--fg`.
- Items: home, one per featured project (mono glyph `$ @ #`), how I work (`//`), then an accent-filled "Get in touch" cell.
- Active item follows scroll: the last section whose top is above 40% of the viewport.
- Top nav shrinks to brand + "Get in touch". No section links there.
- Keyboard reachable, visible focus.

## 2. Thesis section

- After the proof strip. One paragraph, `clamp(1.5rem, 3.6vw, 2.6rem)`, max 30ch, one phrase in `--acc`.
- Copy from the mock. Content lives in `apps/site/content/site.ts` (new file for non-project copy: hero lines, thesis, how-I-work cells, contact lines) so David edits text without touching components.

## 3. Fishing side-quest

- Band between the thesis and the first project, full-bleed water ground.
- Left: SVG scene, line-drawn boat + fisherman, bobbing. Right: title, one-line rules, catch log, `n / 3 caught`.
- States: idle → cast (line drops) → wait (fish swims) → bite (1.4 s window) → reel → caught (card with project name; tapping it scrolls to that band). Miss the window: "it got away".
- Fish pulled from `featured` projects not yet caught; after all three, any.
- Input: tap/click, Space, Enter. `aria-live` status text.
- Reduced motion: no bobbing, no swimming; states still work with instant transitions.
- Catch log persists in localStorage (try/catch), reset button in the log.
- Component `components/home/Fishing.tsx`; game logic in `lib/fishing.ts` as a pure state machine, test-first.

## 4. Case depth per project

- Data additions in `projects.json` + schema: `role`, `year`, `features: { text, metric? }[]`.
- Project band facts column: Role / Year / Stack key-value block, then "What it does" as a list, one row per feature with its mono metric on the right (omit the metric cell when absent, never show "example").
- Project page `/p/[slug]` gets the same block under the story.
- Fill real values for Runway (65 seeded rows, 180-day horizon, 30 RLS tests), Mail Room (five views, two-way sync), Company Log (5 platforms, Zod per record). Leave metrics empty where nothing is true yet.

## 5. Bleeding screenshots / demo windows

- In each band's demo cell: window is 112% wide, offset top-left, overflow hidden, masked to fade at the bottom 30% and right 15%.
- Iframes (Runway) keep full interactivity inside the visible area; the "Open full screen" link stays visible under the mask.
- Phone width: 120%, smaller offset.

## 6. Air

- Section heads 72px top / 40px bottom. How-I-work cells 40px. Contact 72px. Hero top 110px, CTA bottom 84px.

## 7. Self-portrait

- Line-drawn face SVG in the doodle style beside the contact heading. Use the mock's placeholder drawing now; a `portrait.svg` file in `public/` can replace it without code changes.

## Tests

- Vitest: `lib/fishing.ts` state machine (cast → wait → bite → reel → caught; miss path; all-caught path; localStorage round-trip mocked); schema accepts `role`, `year`, `features`.
- Testing Library: dock renders one item per featured project; active class follows a mocked scroll position; feature list hides the metric cell when absent.
- Playwright smoke: dock visible at 400 and 1280; thesis text present; fishing scene responds to a click (status text changes); first project band shows the Role row.

## Out of scope

Real portrait. Sound. Scores or leaderboards. Any new project content.
