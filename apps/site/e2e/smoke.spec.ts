import { expect, test } from "@playwright/test";
import projects from "../data/projects.json";

const runway = projects.find((p) => p.slug === "runway");
if (!runway) throw new Error("no runway in projects.json");

test("a hash on load lands in its room, and a grid tile moves the hash @smoke", async ({
  page,
}) => {
  await page.goto("/#iphone");
  await expect(page.locator("section#iphone")).toBeInViewport();
  await page
    .getByRole("navigation", { name: "Apps" })
    .getByRole("link", { name: /Mail Room/ })
    .click();
  await expect(page).toHaveURL(/#mail-room$/);
});

test("home shows every project once and opens a project page @smoke", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hi, I'm David.");
  await expect(page.getByTestId("project-block")).toHaveCount(projects.length);

  await page
    .locator("article#runway")
    .getByRole("link", { name: /Learn more/ })
    .click();
  await expect(page).toHaveURL("/p/runway");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(runway.headline);
  await expect(page.getByText(runway.problem)).toBeVisible();
});

test("/views and an unknown project are 404s @smoke", async ({ page }) => {
  const views = await page.goto("/views");
  expect(views?.status()).toBe(404);
  const nope = await page.goto("/p/nope");
  expect(nope?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No such project");
});

test("connect copies the address and links to GitHub @smoke", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#touch");
  const touch = page.locator("section#touch");
  await touch.getByRole("button", { name: "copy" }).click();
  await expect(touch.getByRole("button", { name: "copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("picklerdavid@gmail.com");

  await expect(touch.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/davey2wavey",
  );
});
