import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);

/**
 * Playwright config for one app. Runs against PLAYWRIGHT_BASE_URL when set
 * (CI against a Vercel preview), otherwise starts the app on its own port.
 * Tag critical-flow tests with @smoke; `pnpm test:smoke` runs only those.
 */
export function appConfig(port: number) {
  const externalUrl = process.env.PLAYWRIGHT_BASE_URL;
  const baseURL = externalUrl ?? `http://localhost:${port}`;
  // Vercel previews sit behind Deployment Protection. The bypass secret, when
  // present, lets CI through: https://vercel.com/docs/deployment-protection
  const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const extraHTTPHeaders = bypassSecret
    ? { "x-vercel-protection-bypass": bypassSecret, "x-vercel-set-bypass-cookie": "true" }
    : undefined;

  return defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    ...(isCI ? { workers: 1 } : {}),
    reporter: isCI ? "github" : "list",
    use: {
      baseURL,
      trace: "on-first-retry",
      ...(extraHTTPHeaders ? { extraHTTPHeaders } : {}),
    },
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
    ...(externalUrl
      ? {}
      : {
          webServer: {
            command: isCI ? "pnpm build && pnpm start" : "pnpm dev",
            url: baseURL,
            reuseExistingServer: !isCI,
            timeout: 120_000,
          },
        }),
  });
}
