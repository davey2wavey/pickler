import { render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { views } from "./index";
import { ViewSwitch } from "./view-switch";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams("") }));

describe("ViewSwitch", () => {
  test("lists one segment per registered view and marks the active one", () => {
    render(<ViewSwitch />);
    const nav = screen.getByRole("navigation", { name: "View" });
    expect(within(nav).getByText("//view//")).toBeInTheDocument();
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(views.length);
    expect(links[0]).toHaveAttribute("href", "/views?view=grid");
    expect(links[0]).toHaveAttribute("aria-current", "page");
    expect(links[0]?.className).toContain("bg-acc");
    expect(links[1]).toHaveAttribute("href", "/views?view=timeline");
    expect(links[1]).not.toHaveAttribute("aria-current");
  });
});
