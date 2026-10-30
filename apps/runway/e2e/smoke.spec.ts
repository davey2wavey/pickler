import { expect, test } from "@playwright/test";

test("home page renders the app name @smoke", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("runway");
});

test("/health lists the seeded accounts @smoke", async ({ page }) => {
  await page.goto("/health");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("health");
  await expect(page.getByRole("cell", { name: "Checking", exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Savings", exact: true })).toBeVisible();
});
