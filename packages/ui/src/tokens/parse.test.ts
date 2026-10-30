import { describe, expect, test } from "vitest";
import { mixHex, parseColorTokens } from "./parse";

const css = `
:root {
  --bg: #ffffff;
  --text-body: 0.9375rem;
  --font-sans: "X", sans-serif;
}
[data-theme="dark"] {
  --bg: #0B0B0C;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0b0b0c;
  }
}
[data-theme="light"] {
  --bg: #ffffff;
}
[data-invert] {
  --bg: #0b0b0c;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) [data-invert] {
    --bg: #ffffff;
  }
}
`;

describe("parseColorTokens", () => {
  test("reads each theme block", () => {
    expect(parseColorTokens(css)).toEqual({
      light: { bg: "#ffffff" },
      dark: { bg: "#0b0b0c" },
      darkMedia: { bg: "#0b0b0c" },
      lightForced: { bg: "#ffffff" },
      invert: { bg: "#0b0b0c" },
      invertInDark: { bg: "#ffffff" },
    });
  });

  test("ignores tokens that are not colors", () => {
    expect(parseColorTokens(css).light).not.toHaveProperty("text-body");
    expect(parseColorTokens(css).light).not.toHaveProperty("font-sans");
  });

  test("returns empty maps when a block is missing", () => {
    expect(parseColorTokens(":root { --fg: #000; }")).toEqual({
      light: { fg: "#000" },
      dark: {},
      darkMedia: {},
      lightForced: {},
      invert: {},
      invertInDark: {},
    });
  });
});

describe("mixHex", () => {
  test("40% blue over off-white matches the browser's srgb mix", () => {
    expect(mixHex("#7fd1f2", "#f1f1ec", 0.4)).toBe("#c3e4ee");
  });

  test("0% is the second color, 100% the first", () => {
    expect(mixHex("#7fd1f2", "#0b0b0c", 0)).toBe("#0b0b0c");
    expect(mixHex("#7fd1f2", "#0b0b0c", 1)).toBe("#7fd1f2");
  });
});
