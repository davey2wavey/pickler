// @vitest-environment node
// Fails the unit job when a token pair drops below WCAG AA in either theme.
// Node environment: it reads tokens.css from disk and needs no DOM.
import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { contrastRatio } from "./contrast";
import { parseColorTokens } from "./parse";

const css = readFileSync(new URL("../tokens.css", import.meta.url), "utf8");
const themes = parseColorTokens(css);

const AA_BODY = 4.5;
const AA_LARGE = 3;

// [foreground, background, minimum ratio]
const pairs: Array<[string, string, number]> = [
  ["fg", "bg", AA_BODY],
  ["grey", "bg", AA_BODY],
  ["acc-ink", "acc", AA_BODY],
  ["ok", "bg", AA_LARGE],
  ["warn", "bg", AA_LARGE],
  ["bad", "bg", AA_LARGE],
  ["line", "bg", AA_LARGE],
];

test("the two dark blocks carry the same values", () => {
  expect(themes.darkMedia).toEqual(themes.dark);
});

describe.each(["light", "dark"] as const)("%s theme", (theme) => {
  const colors = themes[theme];

  test("defines every color token", () => {
    for (const name of [
      "bg",
      "fg",
      "grey",
      "line",
      "line-soft",
      "acc",
      "acc-ink",
      "ok",
      "warn",
      "bad",
    ]) {
      expect(colors[name], name).toMatch(/^#/);
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
