import { expect, test } from "@playwright/test";
import projects from "../data/projects.json";

const iphone = projects.filter((p) => p.tags[0] === "iphone");
const runway = projects.find((p) => p.slug === "runway");
if (!runway) throw new Error("no runway in projects.json");

test("a hash on load lands in its room, and the dock moves the hash @smoke", async ({ page }) => {
  await page.goto("/#iphone");
  const room = page.locator("section#iphone");
  await expect(room.getByTestId("project-block")).toHaveCount(iphone.length);
  await expect(room).toBeInViewport();
  const dock = page.getByRole("navigation", { name: "Rooms", exact: true });
  await expect(dock.getByRole("link", { name: /iPhone/ })).toHaveAttribute(
    "aria-current",
    "location",
  );

  await dock.getByRole("link", { name: /^Mac/ }).click();
  await expect(page).toHaveURL(/#mac$/);
  await expect(page.locator("section#mac")).toBeInViewport();
  await expect(dock.getByRole("link", { name: /^Mac/ })).toHaveAttribute(
    "aria-current",
    "location",
  );
});

test("home shows every project once, embeds Runway, and opens a project page @smoke", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hi, I make apps.");
  await expect(page.getByTestId("project-block")).toHaveCount(projects.length);
  await expect(page.getByTitle(`${runway.name} demo`)).toHaveAttribute(
    "src",
    runway.links.live ?? "",
  );

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

test("get in touch copies the address and the footer links to GitHub @smoke", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#touch");
  const touch = page.locator("section#touch");
  await touch.getByRole("button", { name: "copy" }).click();
  await expect(touch.getByRole("button", { name: "copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("picklerdavid@gmail.com");

  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/davey2wavey",
  );
});
