import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Panel } from "./panel";

test("renders children inside a bordered box", () => {
  render(<Panel>Body</Panel>);
  expect(screen.getByText("Body")).toBeInTheDocument();
});

test("renders no title bar without a title", () => {
  render(<Panel>Body</Panel>);
  expect(screen.queryByRole("banner")).not.toBeInTheDocument();
});

test("renders title and meta in the title bar", () => {
  render(
    <Panel title="Runway" meta="30 days">
      Body
    </Panel>,
  );
  expect(screen.getByText("Runway")).toBeInTheDocument();
  expect(screen.getByText("30 days")).toBeInTheDocument();
});

test("forwards className", () => {
  render(
    <Panel className="mt-4" data-testid="panel">
      Body
    </Panel>,
  );
  expect(screen.getByTestId("panel")).toHaveClass("mt-4");
  expect(screen.getByTestId("panel")).toHaveClass("border-line");
});
