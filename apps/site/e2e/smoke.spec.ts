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

test("the view switch marks the active view and the footer has contact @smoke", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/?view=grid");
  const nav = page.getByRole("navigation", { name: "View" });
  await expect(nav.getByRole("link", { name: "Grid" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("list", { name: "Projects" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("site.view"))).toBe("grid");

  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/davey2wavey",
  );
  await footer.getByRole("button", { name: "copy" }).click();
  await expect(footer.getByRole("button", { name: "copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("picklerdavid@gmail.com");
});

test("the timeline view lists projects newest first and links to their pages @smoke", async ({
  page,
}) => {
  await page.goto("/?view=timeline");
  const nav = page.getByRole("navigation", { name: "View" });
  await expect(nav.getByRole("link", { name: "Timeline" })).toHaveAttribute("aria-current", "page");
  const entries = page.getByRole("list", { name: "Projects, newest first" }).getByRole("listitem");
  await expect(entries).toHaveCount(projects.length);

  const first = entries.first().getByRole("link");
  const href = await first.getAttribute("href");
  expect(href).toMatch(/^\/p\/[a-z0-9-]+$/);
  await first.click();
  await expect(page).toHaveURL(href!);

  await page.goto("/?view=grid");
  await expect(nav.getByRole("link", { name: "Grid" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("list", { name: "Projects" })).toBeVisible();
});
