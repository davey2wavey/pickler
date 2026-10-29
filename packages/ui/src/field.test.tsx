import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Field } from "./field";

test("labels its input", () => {
  render(<Field label="Email" />);
  expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
});

test("uses a given id", () => {
  render(<Field label="Email" id="email" />);
  expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
});

test("forwards input props", () => {
  render(<Field label="Email" type="email" placeholder="you@example.com" required />);
  const input = screen.getByLabelText("Email");
  expect(input).toHaveAttribute("type", "email");
  expect(input).toHaveAttribute("placeholder", "you@example.com");
  expect(input).toBeRequired();
});

test("renders a hint and puts className on the wrapper", () => {
  render(<Field label="Email" hint="Work address" className="mt-4" data-testid="field" />);
  expect(screen.getByText("Work address")).toBeInTheDocument();
  expect(screen.getByLabelText("Email").parentElement).toHaveClass("mt-4");
});
