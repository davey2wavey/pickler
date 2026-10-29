import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Page from "./page";

test("shows the app name as the page heading", () => {
  render(<Page />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("company-log");
});
