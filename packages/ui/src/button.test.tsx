import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Button } from "./button";

test("renders a button with its label", () => {
  render(<Button>Save</Button>);
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
});

test("defaults to primary and md", () => {
  render(<Button>Go</Button>);
  const button = screen.getByRole("button", { name: "Go" });
  expect(button).toHaveClass("bg-acc");
  expect(button).toHaveClass("h-9");
});

test("switches variant and size", () => {
  render(
    <Button variant="ghost" size="sm">
      Go
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Go" });
  expect(button).toHaveClass("bg-transparent");
  expect(button).toHaveClass("h-7");
});

test("forwards className and native props", () => {
  render(
    <Button className="mt-4" disabled type="submit">
      Go
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Go" });
  expect(button).toHaveClass("mt-4");
  expect(button).toHaveClass("font-mono");
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute("type", "submit");
});
