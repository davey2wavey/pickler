import { expect, test } from "@playwright/test";
import projects from "../data/projects.json";

const featured = projects.filter((p) => p.featured);
const first = featured[0];
if (!first) throw new Error("no featured project in projects.json");

test("home lists the featured projects and opens a case study @smoke", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("David Pickler");
  for (const project of featured) {
    await expect(page.getByRole("link", { name: new RegExp(project.name) })).toBeVisible();
  }
  await expect(page.getByRole("link", { name: "picklerdavid@gmail.com" })).toBeVisible();

  const tiles = page.getByRole("list", { name: "Projects" }).getByRole("link");
  await expect(tiles).toHaveCount(projects.length);
  await tiles.first().click();

  await expect(page).toHaveURL(`/p/${first.slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(first.name);
  await expect(page.getByText(first.problem)).toBeVisible();
  await expect(page.getByRole("link", { name: "picklerdavid@gmail.com" })).toBeVisible();
});

test("an unknown project is a 404 @smoke", async ({ page }) => {
  const response = await page.goto("/p/nope");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No such project");
});
