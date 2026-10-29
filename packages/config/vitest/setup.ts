import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only auto-cleans with globals on. We keep globals off.
afterEach(() => {
  cleanup();
});
