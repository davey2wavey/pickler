/// <reference types="@testing-library/jest-dom/vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const setupFile = new URL("./setup.ts", import.meta.url).pathname;

/** Vitest config for packages that render React: jsdom plus Testing Library matchers. */
export function reactConfig() {
  return defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: [setupFile],
      include: ["**/*.test.{ts,tsx}"],
      exclude: ["**/node_modules/**", "**/.next/**", "**/e2e/**"],
      passWithNoTests: true,
    },
  });
}

/** Vitest config for plain TypeScript packages. */
export function nodeConfig() {
  return defineConfig({
    test: {
      environment: "node",
      include: ["**/*.test.ts"],
      exclude: ["**/node_modules/**", "**/dist/**"],
      passWithNoTests: true,
    },
  });
}
