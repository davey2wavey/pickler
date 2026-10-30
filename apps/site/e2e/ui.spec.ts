import { expect, test } from "@playwright/test";

const backgrounds = { light: "rgb(241, 241, 236)", dark: "rgb(11, 11, 12)" } as const;
const accent = "rgb(127, 209, 242)";

// Each column forces its own theme, so the result must not depend on the OS setting.
for (const osScheme of ["light", "dark"] as const) {
  test(`ui page renders every primitive in both themes with the OS in ${osScheme} @smoke`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ colorScheme: osScheme });
    await page.goto("/ui");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("ui");

    for (const theme of ["light", "dark"] as const) {
      const column = page.getByTestId(`showcase-${theme}`);
      await expect(column).toHaveCSS("background-color", backgrounds[theme]);
      await expect(column.getByTestId("swatch-acc")).toHaveCSS("background-color", accent);
      await expect(column.getByRole("button", { name: "Primary" })).toBeVisible();
      await expect(column.getByText("//status//")).toBeVisible();
      await expect(column.getByText("Runway")).toBeVisible();
      await expect(column.getByLabel("Email")).toBeVisible();
      await expect(column.getByRole("table", { name: `Costs, ${theme}` })).toBeVisible();
      await column.screenshot({ path: testInfo.outputPath(`ui-${theme}-os-${osScheme}.png`) });
    }
  });
}
