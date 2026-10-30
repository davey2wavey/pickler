import { nodeConfig } from "@pickler/config/vitest/base";
import { mergeConfig } from "vitest/config";

const globalSetup = new URL("./src/test/global-setup.ts", import.meta.url).pathname;

// Tests under src/db hit the local Supabase stack (Docker). Keys come from global setup.
export default mergeConfig(nodeConfig(), {
  test: {
    globalSetup: [globalSetup],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
