import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { parseProjects } from "@/data/project";
import { DemoSlot, demoKindFor } from "./demo-slot";

function make(overrides: Record<string, unknown>) {
  const [project] = parseProjects([
    {
      slug: "x",
      name: "X",
      oneLiner: "x",
      status: "beta",
      kind: "web",
      stack: ["a"],
      problem: "p",
      built: "b",
      changed: "c",
      updatedAt: "2026-10-29",
      ...overrides,
    },
  ]);
  if (!project) throw new Error("fixture");
  return project;
}

const live = "https://pickler-runway.vercel.app";

describe("demoKindFor", () => {
  test("a usable web app with a live url embeds", () => {
    expect(demoKindFor(make({ links: { live } }))).toBe("iframe");
    expect(demoKindFor(make({ status: "live", links: { live } }))).toBe("iframe");
  });

  test("a web app still in progress, or without a url, gets the placeholder", () => {
    expect(demoKindFor(make({ status: "in-progress", links: { live } }))).toBe("placeholder");
    expect(demoKindFor(make({ links: {} }))).toBe("placeholder");
  });

  test("native apps prefer video, then the first screenshot, then the placeholder", () => {
    const shot = [{ src: "/shots/x/a.png", alt: "A" }];
    expect(
      demoKindFor(
        make({ kind: "mac", links: { video: "https://v.example/x.mp4" }, screenshots: shot }),
      ),
    ).toBe("video");
    expect(demoKindFor(make({ kind: "ios", screenshots: shot }))).toBe("screenshot");
    expect(demoKindFor(make({ kind: "mac", status: "case-study" }))).toBe("placeholder");
  });

  test("workers and static sites never embed", () => {
    expect(demoKindFor(make({ kind: "worker", status: "live", links: { live } }))).toBe(
      "placeholder",
    );
  });
});

describe("DemoSlot", () => {
  test("iframe points at the live url and offers full screen", () => {
    render(<DemoSlot project={make({ links: { live } })} />);
    expect(screen.getByTitle("X demo")).toHaveAttribute("src", live);
    expect(screen.getByRole("link", { name: /Open full screen/ })).toHaveAttribute("href", live);
  });

  test("video uses the first screenshot as its poster", () => {
    render(
      <DemoSlot
        project={make({
          kind: "mac",
          links: { video: "https://v.example/x.mp4" },
          screenshots: [{ src: "/shots/x/a.png", alt: "A" }],
        })}
      />,
    );
    const video = screen.getByLabelText("X walkthrough");
    expect(video).toHaveAttribute("poster", "/shots/x/a.png");
  });

  test("screenshot renders the image with its alt", () => {
    render(
      <DemoSlot
        project={make({
          kind: "ios",
          screenshots: [{ src: "/shots/x/a.png", alt: "Home tab", frame: "phone" }],
        })}
      />,
    );
    expect(screen.getByRole("img", { name: "Home tab" })).toBeInTheDocument();
  });

  test("placeholder is labeled", () => {
    render(<DemoSlot project={make({ status: "in-progress", links: { live } })} />);
    expect(screen.getByRole("img", { name: "X: demo coming" })).toBeInTheDocument();
    expect(screen.getByText("//demo coming//")).toBeInTheDocument();
  });
});
