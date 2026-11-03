import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Dock, PREVIEW_DELAY_MS } from "./dock";
import type { DockItem } from "./dock";
import { HASH_DELAY_MS } from "./use-rooms";

const items: DockItem[] = [
  { id: "home", label: "Home", glyph: "⌂", preview: ["Hero"] },
  { id: "web", label: "Web", glyph: "▦", preview: ["Runway", "This site"] },
  { id: "iphone", label: "iPhone", glyph: "▯", preview: ["Dekk"] },
  { id: "mac", label: "Mac", glyph: "▭", preview: ["Mail Room"] },
  { id: "automation", label: "Automation", glyph: "⟳", preview: [] },
];
const cta: DockItem = { id: "touch", label: "Get in touch", glyph: "@", preview: [] };

/** Sections for every room, each reporting the given top. */
function mountRooms(tops: Record<string, number>) {
  for (const [id, top] of Object.entries(tops)) {
    const section = document.createElement("section");
    section.id = id;
    section.getBoundingClientRect = () => ({ top }) as DOMRect;
    document.body.appendChild(section);
  }
}

async function flushFrame() {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}

async function settle() {
  await flushFrame();
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, HASH_DELAY_MS + 20));
  });
}

beforeEach(() => {
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("Dock", () => {
  test("renders six links, the last one the accent call to action", () => {
    render(<Dock items={items} cta={cta} />);
    const links = within(screen.getByRole("navigation", { name: "Rooms" })).getAllByRole("link");
    expect(links).toHaveLength(6);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "#home",
      "#web",
      "#iphone",
      "#mac",
      "#automation",
      "#touch",
    ]);
    expect(links[5]).toHaveTextContent("Get in touch");
  });

  test("the active room follows scroll and the hash follows after the first scroll", async () => {
    mountRooms({ home: 0, web: 900, iphone: 1800, mac: 2700, automation: 3600, touch: 4500 });
    render(<Dock items={items} cta={cta} />);
    await flushFrame();
    expect(screen.getByRole("link", { name: /Home/ })).toHaveAttribute("aria-current", "location");
    expect(window.location.hash).toBe("");

    for (const [id, top] of Object.entries({ home: -1800, web: -900, iphone: 100 })) {
      document.getElementById(id)!.getBoundingClientRect = () => ({ top }) as DOMRect;
    }
    fireEvent.scroll(window);
    await flushFrame();
    expect(screen.getByRole("link", { name: /iPhone/ })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: /Home/ })).not.toHaveAttribute("aria-current");
    expect(window.location.hash).toBe("");
    await settle();
    expect(window.location.hash).toBe("#iphone");
  });

  test("a hash naming a block keeps while its room is active", async () => {
    mountRooms({ home: -900, web: 0, iphone: 900, mac: 1800, automation: 2700, touch: 3600 });
    const block = document.createElement("article");
    block.id = "runway";
    block.setAttribute("data-room", "web");
    document.getElementById("web")!.appendChild(block);
    window.history.replaceState(null, "", "#runway");

    render(<Dock items={items} cta={cta} />);
    await flushFrame();
    fireEvent.scroll(window);
    await settle();
    expect(screen.getByRole("link", { name: /Web/ })).toHaveAttribute("aria-current", "location");
    expect(window.location.hash).toBe("#runway");
  });

  test("a pointer down after a scroll cancels the pending hash write", async () => {
    mountRooms({ home: -1800, web: -900, iphone: 100, mac: 1000, automation: 1900, touch: 2800 });
    render(<Dock items={items} cta={cta} />);
    await flushFrame();
    document.getElementById("iphone")!.getBoundingClientRect = () => ({ top: -100 }) as DOMRect;
    document.getElementById("mac")!.getBoundingClientRect = () => ({ top: 200 }) as DOMRect;
    fireEvent.scroll(window);
    await flushFrame();
    fireEvent.pointerDown(document.body);
    await settle();
    expect(window.location.hash).toBe("");
  });

  test("resting on a room for the delay shows its projects in the strip; leaving hides it", () => {
    vi.useFakeTimers();
    render(<Dock items={items} cta={cta} />);
    const strip = screen.getByTestId("dock-strip");
    fireEvent.mouseEnter(screen.getByRole("link", { name: /Web/ }));
    act(() => vi.advanceTimersByTime(PREVIEW_DELAY_MS - 1));
    expect(strip).not.toHaveAttribute("data-show");
    act(() => vi.advanceTimersByTime(1));
    expect(strip).toHaveAttribute("data-show");
    expect(strip).toHaveTextContent("Runway");
    expect(strip).toHaveTextContent("This site");
    fireEvent.mouseLeave(screen.getByRole("link", { name: /Web/ }));
    expect(strip).not.toHaveAttribute("data-show");
  });

  test("a room with nothing to preview never shows the strip", () => {
    vi.useFakeTimers();
    render(<Dock items={items} cta={cta} />);
    fireEvent.mouseEnter(screen.getByRole("link", { name: /Automation/ }));
    act(() => vi.advanceTimersByTime(PREVIEW_DELAY_MS * 2));
    expect(screen.getByTestId("dock-strip")).not.toHaveAttribute("data-show");
  });
});
