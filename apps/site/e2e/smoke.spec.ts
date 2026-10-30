import { expect, test } from "@playwright/test";
import projects from "../data/projects.json";

const featured = projects.filter((p) => p.featured);
const first = featured[0];
if (!first) throw new Error("no featured project in projects.json");
const embedded = featured.find((p) => p.kind === "web" && p.links.live && p.status === "beta");
if (!embedded) throw new Error("no embeddable project in projects.json");

test("home shows every featured headline and the live demo, and opens a project page @smoke", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Working software");
  for (const project of featured) {
    await expect(
      page.getByRole("heading", { level: 2, name: new RegExp(project.headline ?? project.name) }),
    ).toBeVisible();
  }

  const frame = page.getByTitle(`${embedded.name} demo`);
  await expect(frame).toHaveAttribute("src", embedded.links.live ?? "");

  await page
    .getByRole("heading", { level: 2, name: new RegExp(first.headline ?? first.name) })
    .getByRole("link")
    .click();
  await expect(page).toHaveURL(`/p/${first.slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(first.name);
  await expect(page.getByText(first.problem)).toBeVisible();
});

test("an unknown project is a 404 @smoke", async ({ page }) => {
  const response = await page.goto("/p/nope");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No such project");
});

test("the contact block copies the address and the footer links to GitHub @smoke", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const contact = page.getByRole("region", { name: "Contact" });
  await contact.getByRole("button", { name: "copy" }).click();
  await expect(contact.getByRole("button", { name: "copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("picklerdavid@gmail.com");

  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/davey2wavey",
  );
});

test("/views keeps the grid and timeline working @smoke", async ({ page }) => {
  await page.goto("/views?view=timeline");
  const nav = page.getByRole("navigation", { name: "View" });
  await expect(nav.getByRole("link", { name: "Timeline" })).toHaveAttribute("aria-current", "page");
  const entries = page.getByRole("list", { name: "Projects, newest first" }).getByRole("listitem");
  await expect(entries).toHaveCount(projects.length);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("site.view"))).toBe("timeline");

  await nav.getByRole("link", { name: "Grid" }).click();
  await expect(page).toHaveURL("/views?view=grid");
  await expect(page.getByRole("list", { name: "Projects" }).getByRole("link")).toHaveCount(
    projects.length,
  );
});
