# packages/ui — SPEC

## Core idea

One visual language for every web app in this repo. Tokens are the vocabulary. Five primitives are the first sentences. Nothing in an app sets a color, font, or radius directly; it uses a token.

## Direction (decided 2026-10-29)

Reference: wahooservices.co.uk lean. Systems, terminals, hard grid. Not their pixel art.

- Sans: Space Grotesk. Headlines, body, controls.
- Mono: JetBrains Mono. Labels, numbers, nav, code.
- Colors: black, warm off-white, one grey, sky blue. Nothing else except three semantic colors. (Lime until 2026-10-30; see DECISIONS.md.)
- Radius: 0. Everywhere.
- Lines: 1px hairlines. Grid lines are allowed to show.
- Labels: uppercase mono, letter-spaced, often wrapped `//LIKE THIS//`.
- Numbers: mono, tabular, large when they matter.
- Tools (Runway, Company Log): same rules, denser, no flourish, no photos.
- Overview surfaces (portfolio): same rules, bigger type, real screenshots.
- Dark mode: yes, v1. Same tokens, inverted ground. Blue stays blue.

## Tokens

Ship as CSS variables on `:root` and a Tailwind preset that maps to them.

Color (light / dark):

- `--bg` #f1f1ec (warm off-white) / #0b0b0c
- `--fg` #0b0b0c / #f2f2f0
- `--grey` #606060 / #9a9a96 (secondary text; #6b6b6b measured 4.37:1 on `--ground`, so it darkened)
- `--line` #0b0b0c at 100% for structural rules / #f2f2f0; `--line-soft` #dcdcd6 / #262628 for table rows and grid lines
- `--panel` #f8f8f5 / #0b0b0c (window and card fill); `--ground` #e9e9e3 / #131315 (recessed areas)
- `--acc` #7fd1f2 (sky blue) both themes; `--acc-ink` #0b0b0c
- `--water` `color-mix(in srgb, var(--acc) 40%, var(--bg))`: the ground below the waterline on the portfolio home. `--grey-on-water` #606060 / #d4d4d0 replaces `--grey` on it, because grey on dark water measures 2.6:1.
- `--ok` #1f9d55 / #3fd27f; `--warn` #b07a00 / #f0b429 (#c48800 measures 2.70:1 on the off-white; moved to the nearest shade that passes 3:1); `--bad` #c62828 / #ff5f56
- `[data-invert]` on any element flips its subtree to the other theme's values. Used for the black band on the home page.

Type:

- `--font-sans` "Space Grotesk", system-ui, sans-serif
- `--font-mono` "JetBrains Mono", ui-monospace, monospace
- Scale (rem): 0.6875 label, 0.8125 small, 0.9375 body, 1.125 lead, 1.5 h3, 2 h2, 3 h1, 4.5 display
- Label style: mono, 0.6875rem, uppercase, letter-spacing 0.08em

Space: 4, 8, 12, 16, 24, 32, 48, 64, 96 px.
Radius: 0.
Shadow: none. Depth comes from lines and fills.
Grid: 12 columns, 24px gutter, max 1200px.

## Primitives (v1, exactly five)

1. `Button` — variants: primary (blue fill, black text), secondary (panel fill, 1px black border), ghost (no border). Square. Mono uppercase label. Sizes: sm, md.
2. `Label` — the `//TAG//` eyebrow. Props: text, optional leading square dot in `ok | warn | bad | acc`.
3. `Panel` — bordered box with optional title bar (mono title, optional right-side meta). Window-chrome feel without the fake traffic lights.
4. `Field` — text input with label above. Square, 1px border, blue focus ring.
5. `Table` — header in mono uppercase, numeric columns right-aligned and tabular, row rules in `--line-soft`.

No Card, no Badge, no Avatar, no Modal in v1.

## Tests

- Vitest + Testing Library: each primitive renders, accepts variants, forwards className.
- Token contrast test: fg on bg, acc-ink on acc, grey on bg must pass WCAG AA (4.5:1 body, 3:1 large) in both themes. Fails the build if not.
- One Playwright smoke in apps/site: a `/ui` route renders every primitive once in light and dark (screenshot both, no visual diff tooling yet).

## Docs

`packages/ui/README.md`: how to import the preset, the five primitives with one example each, the token table. Under 150 lines.

## Out of scope

Animation. Icons library. Charts. Layout components beyond Panel. Any sixth primitive.
