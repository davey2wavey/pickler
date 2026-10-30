// Reads color tokens out of tokens.css so tests check the real values, not a copy.

export type ColorTokens = {
  /** Values in the :root block. */
  light: Record<string, string>;
  /** Values in the [data-theme="dark"] block. */
  dark: Record<string, string>;
  /** Values in the prefers-color-scheme: dark block. Must equal `dark`. */
  darkMedia: Record<string, string>;
  /** Values in the [data-theme="light"] block. Must equal `light`. */
  lightForced: Record<string, string>;
  /** Values in the [data-invert] block. Must equal `dark`. */
  invert: Record<string, string>;
  /** Values for [data-invert] when the OS is dark. Must equal `light`. */
  invertInDark: Record<string, string>;
};

const declaration = /--([a-z0-9-]+)\s*:\s*(#[0-9a-f]{3,6})\s*;/gi;

function block(css: string, selector: string): string {
  const start = css.indexOf(selector);
  if (start === -1) return "";
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  return open === -1 || close === -1 ? "" : css.slice(open + 1, close);
}

function colors(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(declaration)) {
    if (name && value) out[name] = value.toLowerCase();
  }
  return out;
}

export function parseColorTokens(css: string): ColorTokens {
  return {
    light: colors(block(css, ":root {")),
    dark: colors(block(css, '[data-theme="dark"] {')),
    darkMedia: colors(block(css, ':root:not([data-theme="light"]) {')),
    lightForced: colors(block(css, '[data-theme="light"] {')),
    invert: colors(block(css, "\n[data-invert] {")),
    invertInDark: colors(block(css, ':root:not([data-theme="light"]) [data-invert] {')),
  };
}

/** Hex result of `color-mix(in srgb, a p%, b)`, the way --water is defined. */
export function mixHex(a: string, b: string, p: number): string {
  const channels = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
  const A = channels(a);
  const B = channels(b);
  return `#${A.map((v, i) =>
    Math.round(v * p + (B[i] ?? 0) * (1 - p))
      .toString(16)
      .padStart(2, "0"),
  ).join("")}`;
}
