import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AppGlyph, AppObject, hasArt } from "./app-art";

describe("app art", () => {
  test("known slugs render an svg; unknown render nothing", () => {
    const { container } = render(
      <>
        <AppGlyph slug="dekk" />
        <AppObject slug="dekk" />
        <AppGlyph slug="nope" />
        <AppObject slug="nope" />
      </>,
    );
    expect(container.querySelectorAll("svg")).toHaveLength(2);
    expect(hasArt("dekk")).toBe(true);
    expect(hasArt("nope")).toBe(false);
  });

  test("the five apps all have both pieces", () => {
    for (const slug of ["dekk", "snaphour", "skillet", "divot", "regiment"])
      expect(hasArt(slug)).toBe(true);
  });
});
