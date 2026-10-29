import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Button } from "./button";

test("renders its label as a button", () => {
  render(<Button>Save</Button>);
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
});

test("keeps caller classes alongside its own", () => {
  render(<Button className="mt-4">Go</Button>);
  const button = screen.getByRole("button", { name: "Go" });
  expect(button).toHaveClass("mt-4");
  expect(button).toHaveClass("bg-ink");
});
