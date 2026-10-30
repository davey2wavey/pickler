import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { CopyEmail } from "./copy-email";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("copies the address and says so for a moment", async () => {
  const writeText = vi.fn(() => Promise.resolve());
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  render(<CopyEmail email="a@b.c" resetAfterMs={20} />);
  fireEvent.click(screen.getByRole("button", { name: "copy" }));
  expect(await screen.findByRole("button", { name: "copied" })).toBeInTheDocument();
  expect(writeText).toHaveBeenCalledWith("a@b.c");
  expect(await screen.findByRole("button", { name: "copy" })).toBeInTheDocument();
});

test("a blocked clipboard leaves the label alone", async () => {
  vi.stubGlobal("navigator", { clipboard: { writeText: () => Promise.reject(new Error("no")) } });
  render(<CopyEmail email="a@b.c" />);
  fireEvent.click(screen.getByRole("button", { name: "copy" }));
  await Promise.resolve();
  expect(screen.getByRole("button", { name: "copy" })).toBeInTheDocument();
});
