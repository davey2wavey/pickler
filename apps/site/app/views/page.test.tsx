import { act, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { projects } from "@/data/projects";
import Page from "./page";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams("") }));

test("/views shows the name and a tile per project", async () => {
  await act(async () => {
    render(<Page />);
  });
  expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("David Pickler");
  const list = screen.getByRole("list", { name: "Projects" });
  expect(within(list).getAllByRole("listitem")).toHaveLength(projects.length);
});
