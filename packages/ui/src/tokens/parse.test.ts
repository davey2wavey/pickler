import { describe, expect, test } from "vitest";
import { parseColorTokens } from "./parse";

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
`;

describe("parseColorTokens", () => {
  test("reads each theme block", () => {
    expect(parseColorTokens(css)).toEqual({
      light: { bg: "#ffffff" },
      dark: { bg: "#0b0b0c" },
      darkMedia: { bg: "#0b0b0c" },
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
    });
  });
});
