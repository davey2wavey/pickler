import { reactConfig } from "@pickler/config/vitest/base";
import { defineConfig, mergeConfig } from "vitest/config";

// tsconfig maps "@/*" to this folder. Vite does not read tsconfig paths, so repeat it here.
export default mergeConfig(
  reactConfig(),
  defineConfig({ resolve: { alias: { "@": new URL(".", import.meta.url).pathname } } }),
);
