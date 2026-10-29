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
  };
}
