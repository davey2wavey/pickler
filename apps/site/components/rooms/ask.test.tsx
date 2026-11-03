import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ask } from "@/content/site";
import { Ask, REPLY_DELAY_MS } from "./ask";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("Ask", () => {
  test("a suggestion posts the question and its canned reply after a beat", () => {
    render(<Ask />);
    const log = screen.getByRole("log", { name: "Conversation" });
    fireEvent.click(screen.getByRole("button", { name: "What stack do you use?" }));
    expect(within(log).getByText("What stack do you use?")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(REPLY_DELAY_MS));
    expect(within(log).getByText(/Next\.js and TypeScript/)).toBeInTheDocument();
  });

  test("a typed question with no match gets the honest fallback; blanks are ignored", () => {
    render(<Ask />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(input.closest("form")!);
    expect(screen.getAllByText(ask.intro)).toHaveLength(1);

    fireEvent.change(input, { target: { value: "do you like pears" } });
    fireEvent.submit(input.closest("form")!);
    expect(input).toHaveValue("");
    act(() => vi.advanceTimersByTime(REPLY_DELAY_MS));
    expect(screen.getByText(ask.fallback)).toBeInTheDocument();
  });
});
