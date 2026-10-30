import { expect, test } from "@playwright/test";

test("home page renders the app name @smoke", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("runway");
});

test("/health lists the seeded accounts @smoke", async ({ page }) => {
  // The page reads live rows from Supabase. A locally built app in CI has no database
  // (DECISIONS: no test touches the hosted project), so this runs only against a preview.
  test.skip(!process.env.PLAYWRIGHT_BASE_URL, "needs a deployed preview with a database");
  await page.goto("/health");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("health");
  await expect(page.getByRole("cell", { name: "Checking", exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Savings", exact: true })).toBeVisible();
});
