// @vitest-environment node
// Fails the unit job when a token pair drops below WCAG AA in either theme.
// Node environment: it reads tokens.css from disk and needs no DOM.
import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { contrastRatio } from "./contrast";
import { mixHex, parseColorTokens } from "./parse";

const css = readFileSync(new URL("../tokens.css", import.meta.url), "utf8");
const themes = parseColorTokens(css);

const AA_BODY = 4.5;
const AA_LARGE = 3;

const names = [
  "bg",
  "fg",
  "grey",
  "line",
  "line-soft",
  "panel",
  "ground",
  "acc",
  "acc-ink",
  "grey-on-water",
  "ok",
  "warn",
  "bad",
];

// [foreground, background, minimum ratio]
const pairs: Array<[string, string, number]> = [
  ["fg", "bg", AA_BODY],
  ["fg", "panel", AA_BODY],
  ["fg", "ground", AA_BODY],
  ["fg", "water", AA_BODY],
  ["grey", "bg", AA_BODY],
  ["grey", "panel", AA_BODY],
  ["grey", "ground", AA_BODY],
  ["grey-on-water", "water", AA_BODY],
  ["acc-ink", "acc", AA_BODY],
  ["ok", "bg", AA_LARGE],
  ["warn", "bg", AA_LARGE],
  ["bad", "bg", AA_LARGE],
  ["line", "bg", AA_LARGE],
];

test("the two dark blocks carry the same values", () => {
  expect(themes.darkMedia).toEqual(themes.dark);
});

test("the forced light block matches :root", () => {
  expect(themes.lightForced).toEqual(themes.light);
});

test("the inverted block is dark, and flips to light when the OS is dark", () => {
  expect(themes.invert).toEqual(themes.dark);
  expect(themes.invertInDark).toEqual(themes.light);
});

test("water is 40% accent over the ground", () => {
  expect(css).toMatch(/--water:\s*color-mix\(in srgb, var\(--acc\) 40%, var\(--bg\)\)/);
});

describe.each(["light", "dark"] as const)("%s theme", (theme) => {
  const colors = { ...themes[theme] };
  colors.water = mixHex(colors.acc ?? "", colors.bg ?? "", 0.4);

  test("defines every color token", () => {
    for (const name of names) {
      expect(colors[name], name).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  test.each(pairs)("%s on %s reaches %s:1", (fg, bg, minimum) => {
    const ratio = contrastRatio(colors[fg] ?? "", colors[bg] ?? "");
    expect(
      ratio,
      `${fg} ${colors[fg]} on ${bg} ${colors[bg]} is ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(minimum);
  });
});
