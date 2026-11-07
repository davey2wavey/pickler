import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Intro, linesFor, progressFor } from "./intro";

describe("intro math", () => {
  test("progress runs 0 to 1 across the pinned stage", () => {
    expect(progressFor(0, 2000, 1000)).toBe(0);
    expect(progressFor(-500, 2000, 1000)).toBe(0.5);
    expect(progressFor(-5000, 2000, 1000)).toBe(1);
    expect(progressFor(0, 800, 1000)).toBe(1);
  });

  test("the first line is full at the top, the second full at the bottom, both mid-way", () => {
    expect(linesFor(0)).toEqual({ first: 1, second: 0 });
    expect(linesFor(1)).toEqual({ first: 0, second: 1 });
    const mid = linesFor(0.5);
    expect(mid.first).toBeGreaterThan(0);
    expect(mid.second).toBeGreaterThan(0);
  });
});

test("Intro renders both lines, the first as the page heading", () => {
  render(<Intro />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hi, I'm David.");
  expect(screen.getByTestId("intro")).toHaveTextContent("I make apps.");
});
