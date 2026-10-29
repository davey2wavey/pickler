import { describe, expect, test } from "vitest";
import { contrastRatio, hexToRgb, relativeLuminance } from "./contrast";

describe("hexToRgb", () => {
  test("reads six digit hex", () => {
    expect(hexToRgb("#0b0b0c")).toEqual([11, 11, 12]);
  });

  test("reads three digit hex", () => {
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
  });

  test("rejects anything else", () => {
    expect(() => hexToRgb("white")).toThrow(/hex/);
  });
});

describe("relativeLuminance", () => {
  test("white is 1 and black is 0", () => {
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 5);
    expect(relativeLuminance([0, 0, 0])).toBeCloseTo(0, 5);
  });
});

describe("contrastRatio", () => {
  test("black on white is 21", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
  });

  test("is symmetric", () => {
    expect(contrastRatio("#c62828", "#ffffff")).toBeCloseTo(contrastRatio("#ffffff", "#c62828"), 6);
  });

  test("same color is 1", () => {
    expect(contrastRatio("#6b6b6b", "#6b6b6b")).toBe(1);
  });
});
