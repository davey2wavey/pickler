import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { deleteSmokeRows, SMOKE_PAYEE_PREFIX } from "./cleanup";

async function signInAsDemo(page: Page) {
  await page.goto("/sign-in");
  await page.getByRole("button", { name: "Try the demo" }).click();
  await expect(page).toHaveURL(/\/transactions$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Transactions");
}

test("signed out, the app sends you to sign in @smoke", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sign in");
});

test("the demo lands on this month's transactions with seeded rows @smoke", async ({ page }) => {
  await signInAsDemo(page);
  const rows = page.getByRole("table").locator("tbody tr");
  await expect(rows.first()).toBeVisible();
  expect(await rows.count()).toBeGreaterThan(0);
  await expect(page.getByRole("row", { name: /^In/ })).toBeVisible();
});

test("add a transaction, see it, sign out @smoke", async ({ page }) => {
  const payee = `${SMOKE_PAYEE_PREFIX} ${Date.now()}`;
  try {
    await signInAsDemo(page);
    await page.getByLabel("Payee").fill(payee);
    await page.getByLabel("Amount").fill("-1.23");
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByRole("cell", { name: payee })).toBeVisible();

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/sign-in$/);
  } finally {
    await deleteSmokeRows();
  }
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
