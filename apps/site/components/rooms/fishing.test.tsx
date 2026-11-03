import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { storageKey } from "@/lib/fishing";
import { Fishing, TIMING } from "./fishing";

const pool = [
  { slug: "a", name: "Alpha" },
  { slug: "b", name: "Beta" },
];

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Fishing", () => {
  test("a tap casts, the line lands, something bites, a tap reels, and the catch is logged", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<Fishing pool={pool} />);
    const scene = screen.getByRole("button", { name: "Cast the line" });
    const status = screen.getByTestId("fishing-status");
    expect(status).toHaveTextContent("tap water to cast");

    fireEvent.click(scene);
    expect(status).toHaveTextContent("casting");
    act(() => vi.advanceTimersByTime(TIMING.landed));
    expect(status).toHaveTextContent("waiting");
    act(() => vi.advanceTimersByTime(TIMING.biteMin + TIMING.biteSpread));
    expect(status).toHaveTextContent(/BITE/);

    fireEvent.click(scene);
    expect(status).toHaveTextContent("reeling");
    act(() => vi.advanceTimersByTime(TIMING.reeled));
    expect(screen.getByTestId("catch-card")).toHaveAttribute("href", "#a");
    expect(screen.getByTestId("catch-card")).toHaveTextContent("Alpha");
    expect(screen.getByTestId("fishing-hint")).toHaveTextContent("1 / 2 caught");
    expect(JSON.parse(localStorage.getItem(storageKey) ?? "")).toEqual(["a"]);
    const log = within(screen.getByRole("list", { name: "Catch log" })).getAllByRole("listitem");
    expect(log[0]).toHaveAttribute("data-caught");
    expect(log[1]).not.toHaveAttribute("data-caught");
  });

  test("a bite left alone gets away", () => {
    render(<Fishing pool={pool} />);
    const scene = screen.getByRole("button", { name: "Cast the line" });
    fireEvent.keyDown(scene, { key: "Enter" });
    // Each step schedules the next from an effect, so advance one step at a time.
    act(() => vi.advanceTimersByTime(TIMING.landed));
    act(() => vi.advanceTimersByTime(TIMING.biteMin + TIMING.biteSpread));
    act(() => vi.advanceTimersByTime(TIMING.escaped));
    expect(screen.getByTestId("fishing-status")).toHaveTextContent("got away");
    expect(screen.queryByTestId("catch-card")).not.toBeInTheDocument();
  });

  test("the log comes back from storage and reset clears it", () => {
    localStorage.setItem(storageKey, JSON.stringify(["b"]));
    render(<Fishing pool={pool} />);
    expect(screen.getByTestId("fishing-hint")).toHaveTextContent("1 / 2 caught");
    fireEvent.click(screen.getByRole("button", { name: "reset log" }));
    expect(screen.getByTestId("fishing-hint")).toHaveTextContent("0 / 2 caught");
    expect(localStorage.getItem(storageKey)).toBe("[]");
    expect(screen.queryByRole("button", { name: "reset log" })).not.toBeInTheDocument();
  });

  test("with everything caught the hint says so and casting still works", () => {
    localStorage.setItem(storageKey, JSON.stringify(["a", "b"]));
    render(<Fishing pool={pool} />);
    expect(screen.getByTestId("fishing-hint")).toHaveTextContent("you found them all");
    fireEvent.click(screen.getByRole("button", { name: "Cast the line" }));
    expect(screen.getByTestId("fishing-status")).toHaveTextContent("casting");
  });
});
