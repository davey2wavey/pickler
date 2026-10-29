import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Label } from "./label";

test("wraps the text in slashes", () => {
  render(<Label text="status" />);
  expect(screen.getByText("//status//")).toBeInTheDocument();
});

test("renders no dot by default", () => {
  render(<Label text="status" />);
  expect(screen.queryByTestId("label-dot")).not.toBeInTheDocument();
});

test("renders a toned dot when asked", () => {
  render(<Label text="status" dot="ok" />);
  expect(screen.getByTestId("label-dot")).toHaveClass("bg-ok");
});

test("forwards className", () => {
  render(<Label text="x" className="mb-2" />);
  expect(screen.getByText("//x//")).toHaveClass("mb-2");
  expect(screen.getByText("//x//")).toHaveClass("font-mono");
});
