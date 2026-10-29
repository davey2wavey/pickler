import { expect, test } from "@playwright/test";

test("ui page renders every primitive in both themes @smoke", async ({ page }, testInfo) => {
  await page.goto("/ui");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ui");

  for (const theme of ["light", "dark"] as const) {
    const column = page.getByTestId(`showcase-${theme}`);
    await expect(column.getByRole("button", { name: "Primary" })).toBeVisible();
    await expect(column.getByText("//status//")).toBeVisible();
    await expect(column.getByText("Runway")).toBeVisible();
    await expect(column.getByLabel("Email")).toBeVisible();
    await expect(column.getByRole("table", { name: `Costs, ${theme}` })).toBeVisible();
    await column.screenshot({ path: testInfo.outputPath(`ui-${theme}.png`) });
  }
});
