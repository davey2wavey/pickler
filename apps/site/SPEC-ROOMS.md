# apps/site — SPEC: rooms (v2, decided Nov 2)

Supersedes SPEC-ROOMS v1 and SPEC-HOME-2. Visual reference: `apps/site/design/rooms-proto.html`. Where this file and the prototype differ, this file wins.

## Decisions (all approved)

1. Dock replaces the top nav and the view switch. `/views` and the timeline view are deleted.
2. One page, rooms by platform: Home, Web, iPhone, Mac, Automation, then Get in touch. Hash per room (`#home #web #iphone #mac #automation #touch`). Dock follows scroll and sets the hash; a hash on load scrolls there.
3. Hero system window is a clickable room map: four room nodes left (with project counts from data), count box center ("9" + one line), two action nodes right: Go fishing, Get in touch.
4. Proof strip and thesis are gone.
5. Each project block: demo slot left (iframe / video / screenshot / "Demo coming"), info right: name label, headline, one-liner, tag chips, Role / Year / Stack, Learn more → `/p/[slug]`. Under it, up to four feature cards (glyph, title, line, optional mono metric). Blocks alternate ground within a room (plain, inverted). Numbering removed everywhere.
6. Fishing lives in Home, in the water. Pool = every project in `projects.json`. Catch card opens that project's block. Catch log in localStorage with reset. Pure state machine in `lib/fishing.ts`, test-first.
7. Get in touch is the last section, not a tab: ask box (canned replies from a static map, no API yet), stack grid, email with copy button.
8. iPhone room holds Dekk, Skins & Pins, Fit, Snaphour, Loot. Each gets placeholder screenshots generated as SVG in `public/shots/<slug>/` (phone frame, app name, a few UI strokes in the doodle style), replaced by real ones later via the same filenames.
9. Dock: Home · Web · iPhone · Mac · Automation · Get in touch (accent). Word labels with a small blue glyph. Hover a room 350 ms → one shared strip above the dock listing that room's projects. Phone: labels only, no strip.
10. All copy is placeholder. Every string lives in `content/site.ts` or `projects.json` so David can rewrite without touching components.

## Data

`projects.json` + Zod additions: `tags: string[]` (`web | iphone | mac | automation`), `role`, `year`, `features: { glyph, title, text, metric? }[]`. Add Fit, Snaphour, Loot entries. Room membership = first tag. Order inside a room: `featured` first, then `updatedAt` desc.

## Components

`components/rooms/`: `Dock`, `RoomMap`, `Room`, `ProjectBlock`, `FeatureCards`, `DemoSlot` (exists, reuse), `Fishing`, `Touch`. Scroll logic in one `useRooms()` hook (active room, hash sync, reduced-motion aware).

## Tests

- Vitest: schema; `lib/fishing.ts` (cast → wait → bite → reel → caught; miss; pool excludes caught until all caught; localStorage round-trip); room grouping and ordering helper; hash ↔ room helper.
- Testing Library: dock renders six items; active follows mocked scroll; room map counts match data; ProjectBlock hides feature row when empty and metric cell when absent.
- Playwright smoke: `/#iphone` lands on the iPhone room with five blocks; dock click to `#mac` updates hash; fishing scene responds to a click; `/p/runway` still renders; `/views` returns 404.

## Out of scope

Ask API. Real screenshots. Real copy. Runway changes of any kind.
