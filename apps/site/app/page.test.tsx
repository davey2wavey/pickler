import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { projects } from "@/data/projects";
import { groupByRoom, projectRooms } from "@/lib/rooms";
import Home from "./page";

const groups = groupByRoom(projects);

test("home renders one block per project, each inside its room", () => {
  render(<Home />);
  expect(screen.getAllByTestId("project-block")).toHaveLength(projects.length);
  for (const room of projectRooms) {
    const section = document.getElementById(room);
    if (!section) throw new Error(room);
    const blocks = within(section).getAllByTestId("project-block");
    expect(blocks.map((block) => block.id)).toEqual(groups[room].map((p) => p.slug));
  }
});

test("the iPhone room holds five blocks with phone-framed screenshots", () => {
  render(<Home />);
  const iphone = document.getElementById("iphone");
  if (!iphone) throw new Error("iphone");
  const blocks = within(iphone).getAllByTestId("project-block");
  expect(blocks).toHaveLength(5);
  expect(within(iphone).getAllByRole("img").length).toBeGreaterThanOrEqual(5);
});

test("blocks alternate ground inside a room", () => {
  render(<Home />);
  const iphone = document.getElementById("iphone");
  if (!iphone) throw new Error("iphone");
  const [first, second, third] = within(iphone).getAllByTestId("project-block");
  expect(first).not.toHaveAttribute("data-invert");
  expect(second).toHaveAttribute("data-invert");
  expect(third).not.toHaveAttribute("data-invert");
});

test("the dock lists six rooms and the map counts match the data", () => {
  render(<Home />);
  const dock = screen.getByRole("navigation", { name: "Rooms" });
  expect(within(dock).getAllByRole("link")).toHaveLength(6);
  expect(within(dock).getByRole("link", { name: /iPhone/ })).toHaveAttribute("href", "#iphone");
  for (const room of projectRooms) {
    expect(screen.getByTestId(`map-count-${room}`)).toHaveTextContent(String(groups[room].length));
  }
  expect(screen.getByTestId("map-total")).toHaveTextContent(String(projects.length));
});

test("the hero and the touch room are there, and this site does not embed itself", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Working software/);
  expect(
    within(screen.getByRole("region", { name: "Get in touch." })).getByRole("link", {
      name: "picklerdavid@gmail.com",
    }),
  ).toHaveAttribute("href", "mailto:picklerdavid@gmail.com");
  expect(screen.queryByTitle("This site demo")).not.toBeInTheDocument();
  expect(screen.getByText("//YOU ARE HERE//")).toBeInTheDocument();
});
