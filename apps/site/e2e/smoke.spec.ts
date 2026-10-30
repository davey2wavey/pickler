import { expect, test } from "@playwright/test";

test("home shows the grid, live tiles link out, email in the footer @smoke", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("David Pickler");

  const tiles = page.getByRole("list", { name: "Projects" }).getByRole("listitem");
  await expect(tiles).toHaveCount(4);

  await expect(page.getByRole("link", { name: /This site/ })).toHaveAttribute(
    "href",
    "https://pickler-site.vercel.app",
  );
  await expect(page.getByText("Runway")).toBeVisible();
  await expect(page.getByRole("link", { name: /Runway/ })).toHaveCount(0);

  await expect(page.getByRole("link", { name: "picklerdavid@gmail.com" })).toBeVisible();
});
