import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { projects } from "@/data/projects";
import { featured } from "@/data/select";
import Home from "./page";

test("home renders one band per featured project, each headed by its headline", () => {
  render(<Home />);
  const bands = screen.getAllByTestId("project-band");
  expect(bands).toHaveLength(featured(projects).length);
  featured(projects).forEach((project, index) => {
    const band = bands[index];
    if (!band) throw new Error("band");
    const heading = within(band).getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(project.headline ?? "");
    expect(within(heading).getByRole("link")).toHaveAttribute("href", `/p/${project.slug}`);
    expect(within(band).getByText(project.problem)).toBeInTheDocument();
  });
});

test("the second band is inverted and the first is not", () => {
  render(<Home />);
  const [first, second] = screen.getAllByTestId("project-band");
  expect(first).not.toHaveAttribute("data-invert");
  expect(second).toHaveAttribute("data-invert");
});

test("the hero, proof strip, how I work, and contact are all there", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/this month/);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Working software/);
  expect(screen.getByLabelText("Proof").children).toHaveLength(4);
  expect(screen.getByRole("region", { name: "How I work" })).toBeInTheDocument();
  expect(
    within(screen.getByRole("region", { name: "Contact" })).getByRole("link", {
      name: "picklerdavid@gmail.com",
    }),
  ).toHaveAttribute("href", "mailto:picklerdavid@gmail.com");
});
