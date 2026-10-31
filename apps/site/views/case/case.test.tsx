import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { parseProjects } from "@/data/project";
import { Case } from "./case";

const [runway] = parseProjects([
  {
    slug: "runway",
    name: "Runway",
    oneLiner: "Shows where money goes.",
    status: "in-progress",
    kind: "web",
    stack: ["Next.js", "Supabase"],
    links: { live: "https://pickler-runway.vercel.app", repo: "https://github.com/x/y" },
    problem: "Money leaves in small pieces.",
    built: "A ledger with a burn line.",
    changed: "Still building.",
    updatedAt: "2026-10-29",
  },
]);
if (!runway) throw new Error("fixture");

describe("Case", () => {
  test("renders the head and the three story paragraphs", () => {
    render(<Case project={runway} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Runway");
    expect(screen.getByText("in-progress")).toBeInTheDocument();
    expect(screen.getByText("web")).toBeInTheDocument();
    const story = screen.getByRole("region", { name: "Story" });
    expect(within(story).getByText("Money leaves in small pieces.")).toBeInTheDocument();
    expect(within(story).getByText("A ledger with a burn line.")).toBeInTheDocument();
    expect(within(story).getByText("Still building.")).toBeInTheDocument();
  });

  test("the headline leads when there is one, with its mono tail", () => {
    render(
      <Case
        project={{
          ...runway,
          headline: "Where the money goes, and",
          headlineMono: "how long it lasts",
        }}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Where the money goes, and how long it lasts",
    );
  });

  test("the demo slot sits full width: a placeholder for an in-progress web app", () => {
    render(<Case project={runway} />);
    const demo = screen.getByRole("region", { name: "Demo" });
    expect(within(demo).getByRole("img", { name: "Runway: demo coming" })).toBeInTheDocument();
  });

  test("hides numbers when there are no metrics, shows them when there are", () => {
    const { unmount } = render(<Case project={runway} />);
    expect(screen.queryByRole("region", { name: "Numbers" })).not.toBeInTheDocument();
    unmount();
    render(
      <Case
        project={{ ...runway, metrics: [{ label: "Days left", value: "41", note: "est." }] }}
      />,
    );
    const numbers = screen.getByRole("region", { name: "Numbers" });
    expect(within(numbers).getByText("41")).toBeInTheDocument();
    expect(within(numbers).getByText("est.")).toBeInTheDocument();
  });

  test("shows a labeled placeholder when there are no screenshots", () => {
    render(<Case project={runway} />);
    expect(screen.getByRole("img", { name: "Runway: screenshots to come" })).toBeInTheDocument();
  });

  test("renders screenshots in their frames with the alt as caption", () => {
    render(
      <Case
        project={{
          ...runway,
          screenshots: [
            { src: "/shots/runway/home.png", alt: "Runway home", frame: "desktop" },
            { src: "/shots/runway/phone.png", alt: "On a phone", frame: "phone" },
          ],
        }}
      />,
    );
    const screens = screen.getByRole("region", { name: "Screenshots" });
    const items = within(screens).getAllByRole("listitem");
    expect(items.map((item) => item.getAttribute("data-frame"))).toEqual(["desktop", "phone"]);
    expect(within(screens).getByRole("img", { name: "On a phone" })).toBeInTheDocument();
    expect(within(screens).getByText("Runway home")).toBeInTheDocument();
  });

  test("links are anchors in a fixed order, and the back link goes home", () => {
    render(
      <Case
        project={{
          ...runway,
          links: {
            ...runway.links,
            appstore: "https://apps.apple.com/x",
            video: "https://v.example/x",
          },
        }}
      />,
    );
    const links = within(screen.getByRole("region", { name: "Links" })).getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual(["Open", "Watch", "App Store", "Code"]);
    expect(links[0]).toHaveAttribute("href", "https://pickler-runway.vercel.app");
    expect(screen.getByRole("link", { name: /All projects/ })).toHaveAttribute("href", "/");
  });

  test("hides the links section when there are none", () => {
    render(<Case project={{ ...runway, links: {} }} />);
    expect(screen.queryByRole("region", { name: "Links" })).not.toBeInTheDocument();
  });
});
