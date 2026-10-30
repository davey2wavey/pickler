import { describe, expect, test } from "vitest";
import { MAX_PARALLAX, MIN_PROGRESS, parallaxFor, progressFor, waterlineFor } from "./scroll-depth";

describe("waterlineFor", () => {
  test("starts at the anchor and rises 0.75px per scrolled px", () => {
    expect(waterlineFor(900, 0)).toBe(900);
    expect(waterlineFor(900, 100)).toBe(825);
    expect(waterlineFor(900, 400)).toBe(600);
  });

  test("never goes above the top of the page", () => {
    expect(waterlineFor(900, 1200)).toBe(0);
    expect(waterlineFor(900, 5000)).toBe(0);
  });
});

describe("progressFor", () => {
  test("is the minimum when the element is a full viewport below the fold", () => {
    expect(progressFor(1000, 1000)).toBe(MIN_PROGRESS);
    expect(progressFor(1000, 3000)).toBe(MIN_PROGRESS);
  });

  test("grows as the element rises and clamps at 1", () => {
    expect(progressFor(1000, 500)).toBeCloseTo(0.4 + 500 / 1100, 6);
    expect(progressFor(1000, 0)).toBe(1);
    expect(progressFor(1000, -2000)).toBe(1);
  });

  test("a shorter reach finishes sooner", () => {
    expect(progressFor(1000, 500, 0.6)).toBe(1);
  });

  test("a zero viewport draws everything", () => {
    expect(progressFor(0, 0)).toBe(1);
  });
});

describe("parallaxFor", () => {
  test("is zero while the hero is still 120px or more below the top", () => {
    expect(parallaxFor(400)).toBe(0);
    expect(parallaxFor(120)).toBe(0);
  });

  test("grows as the hero leaves and caps", () => {
    expect(parallaxFor(0)).toBe(120);
    expect(parallaxFor(-200)).toBe(320);
    expect(parallaxFor(-5000)).toBe(MAX_PARALLAX);
  });
});
