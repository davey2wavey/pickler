import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { projects } from "@/data/projects";
import Page from "./page";

test("home shows the name, a tile per project, and the contact email", () => {
  render(<Page />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("David Pickler");
  const list = screen.getByRole("list", { name: "Projects" });
  expect(within(list).getAllByRole("listitem")).toHaveLength(projects.length);
  expect(screen.getByRole("link", { name: "picklerdavid@gmail.com" })).toBeInTheDocument();
});
