# @pickler/ui

One visual language for every web app in this repo. Tokens are the vocabulary, five primitives are the first sentences. Apps never set a color, font, or radius directly. Direction and rationale: [SPEC.md](SPEC.md) and the "UI direction" entry in [DECISIONS.md](../../DECISIONS.md).

## Install in an app

In the app's `globals.css`:

```css
@import "tailwindcss";
@import "@pickler/ui/styles.css";
@source "../../../packages/ui/src";
```

`styles.css` pulls in `tokens.css` (CSS variables), `preset.css` (the Tailwind theme that maps utilities to those variables and removes Tailwind's own palette, type scale, radii, and shadows), and a few base element styles. The `@source` line lets Tailwind see the classes used inside this package.

Load the fonts once in the app's root layout so the `--font-sans` and `--font-mono` tokens resolve:

```tsx
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

<html lang="en" className={`${sans.variable} ${mono.variable}`}>
```

Dark mode follows the OS. Put `data-theme="dark"` or `data-theme="light"` on any element to force its subtree, or `data-invert` to flip it relative to the OS theme.

## Primitives

```tsx
import { Button, Field, Label, Panel, Table } from "@pickler/ui";
```

**Button.** `variant`: `primary` (blue fill), `secondary` (1px border), `ghost`. `size`: `sm`, `md`. Square, mono, uppercase.

```tsx
<Button variant="secondary" size="sm" onClick={save}>
  Save
</Button>
```

**Label.** The `//TAG//` eyebrow. Pass the text without slashes. Optional `dot` in `ok | warn | bad | acc`.

```tsx
<Label text="status" dot="ok" />
```

**Panel.** Bordered box. Give it a `title` to get the bar; `meta` sits on the right of the bar.

```tsx
<Panel title="Runway" meta="30 days">
  ...
</Panel>
```

**Field.** Text input with the label above. Every `<input>` prop passes through. `className` lands on the wrapper.

```tsx
<Field label="Email" type="email" placeholder="you@example.com" hint="Work address" />
```

**Table.** Data-driven. Mark numeric columns and they right-align with tabular figures.

```tsx
<Table
  caption="Costs"
  columns={[
    { key: "name", header: "Name" },
    { key: "amount", header: "Amount", numeric: true },
  ]}
  rows={[{ name: "Rent", amount: "1,200" }]}
/>
```

No Card, Badge, Avatar, or Modal. Compose these five first.

## Tokens

Utilities map one to one: `bg-bg`, `bg-panel`, `bg-ground`, `bg-water`, `text-fg`, `text-grey`, `border-line`, `font-mono`, `text-label`, `tracking-label`, `max-w-grid`.

| Token                 | Light                             | Dark                              | Use                        |
| --------------------- | --------------------------------- | --------------------------------- | -------------------------- |
| `bg`                  | `#f1f1ec`                         | `#0b0b0c`                         | page ground                |
| `fg`                  | `#0b0b0c`                         | `#f2f2f0`                         | text, structural lines     |
| `grey`                | `#606060`                         | `#9a9a96`                         | secondary text             |
| `line`                | `#0b0b0c`                         | `#f2f2f0`                         | borders, rules             |
| `line-soft`           | `#dcdcd6`                         | `#262628`                         | table rows, grid lines     |
| `panel`               | `#f8f8f5`                         | `#0b0b0c`                         | windows, cards             |
| `ground`              | `#e9e9e3`                         | `#131315`                         | recessed areas             |
| `acc`                 | `#7fd1f2`                         | `#7fd1f2`                         | blue fills and focus rings |
| `acc-ink`             | `#0b0b0c`                         | `#0b0b0c`                         | text on blue               |
| `water`               | 40% `acc` over `bg`               | 15% `acc` over `bg`               | below the home waterline   |
| `grey-on-water`       | `#606060`                         | `#d4d4d0`                         | secondary text on water    |
| `ok` / `warn` / `bad` | `#1f9d55` / `#b07a00` / `#c62828` | `#3fd27f` / `#f0b429` / `#ff5f56` | semantic dots and text     |

| Type         | Size           | Utility                                                       |
| ------------ | -------------- | ------------------------------------------------------------- |
| label        | 0.6875rem      | `text-label` (pair with `font-mono uppercase tracking-label`) |
| small        | 0.8125rem      | `text-small`                                                  |
| body         | 0.9375rem      | `text-body`                                                   |
| lead         | 1.125rem       | `text-lead`                                                   |
| h3 / h2 / h1 | 1.5 / 2 / 3rem | `text-h3` `text-h2` `text-h1`                                 |
| display      | 4.5rem         | `text-display`                                                |

Fonts: `font-sans` is Space Grotesk, `font-mono` is JetBrains Mono. Space: the Tailwind scale at 4px steps, use 1, 2, 3, 4, 6, 8, 12, 16, 24. Radius: none, `rounded-*` does not exist here. Shadow: none. Grid: `max-w-grid` is 1200px, gutter `gap-6`.

## Tests

`pnpm --filter @pickler/ui test` runs the primitive tests and the contrast test. The contrast test parses `tokens.css` and fails if any pair drops below WCAG AA in either theme. The `/ui` route in `apps/site` renders every primitive in both themes and has a smoke test.
