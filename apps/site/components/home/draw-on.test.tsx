import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { DrawOn } from "./draw-on";

function mockMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("reduce"),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DrawOn", () => {
  test("under reduced motion every stroke is fully drawn and nothing moves", async () => {
    mockMotion(true);
    await act(async () => {
      render(
        <DrawOn parallax>
          <svg data-testid="svg" />
        </DrawOn>,
      );
    });
    const wrapper = screen.getByTestId("svg").parentElement;
    expect(wrapper?.style.getPropertyValue("--p")).toBe("1.000");
    expect(wrapper?.style.getPropertyValue("--sy")).toBe("0");
    expect(wrapper).toHaveAttribute("data-reduced-motion");
  });

  test("with motion allowed it measures the element and exposes --p and --sy", async () => {
    mockMotion(false);
    await act(async () => {
      render(
        <DrawOn parallax>
          <svg data-testid="svg" />
        </DrawOn>,
      );
    });
    const wrapper = screen.getByTestId("svg").parentElement;
    // jsdom puts every element at 0,0 with a 768px viewport: at the top means fully drawn.
    expect(wrapper?.style.getPropertyValue("--p")).toBe("1.000");
    expect(wrapper?.style.getPropertyValue("--sy")).toBe("120");
    expect(wrapper).not.toHaveAttribute("data-reduced-motion");
  });
});
