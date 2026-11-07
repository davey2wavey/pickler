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

test("the iPhone room holds every iPhone project, branded apps as bands", () => {
  render(<Home />);
  const iphone = document.getElementById("iphone");
  if (!iphone) throw new Error("iphone");
  const blocks = within(iphone).getAllByTestId("project-block");
  expect(blocks).toHaveLength(groups.iphone.length);
  const branded = groups.iphone.filter((p) => p.brand).map((p) => p.slug);
  expect(branded.length).toBeGreaterThanOrEqual(5);
  for (const block of blocks) {
    if (branded.includes(block.id)) expect(block).toHaveAttribute("data-band");
    else expect(block).not.toHaveAttribute("data-band");
  }
});

test("every project in the dataset renders as a band", () => {
  render(<Home />);
  for (const block of screen.getAllByTestId("project-block"))
    expect(block).toHaveAttribute("data-band");
});

test("the glyph hero shows one tile per branded project, each linking to its band", () => {
  render(<Home />);
  const tiles = screen.getAllByTestId("hero-tile");
  const branded = projects.filter((p) => p.brand);
  expect(tiles).toHaveLength(branded.length);
  expect(tiles.map((t) => t.getAttribute("href"))).toEqual(branded.map((p) => `#${p.slug}`));
});

test("the intro, the room dividers, and connect are there, and this site does not embed itself", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hi, I'm David.");
  expect(screen.getAllByTestId("room-divider").map((d) => d.textContent)).toEqual(
    expect.arrayContaining(["Web", "iPhone", "Mac", "Automation"]),
  );
  const touch = screen.getByRole("region", { name: "Connect." });
  expect(within(touch).getByRole("link", { name: "Email me" })).toHaveAttribute(
    "href",
    "mailto:picklerdavid@gmail.com",
  );
  expect(screen.queryByTitle("This site demo")).not.toBeInTheDocument();
});
