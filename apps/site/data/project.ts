import { z } from "zod";

// The one shape every view renders. Edit projects.json, not this, to add a project.
export const projectStatus = z.enum(["live", "beta", "in-progress", "case-study", "archived"]);
export type ProjectStatus = z.infer<typeof projectStatus>;

export const projectKind = z.enum(["web", "ios", "mac", "worker", "static"]);
export type ProjectKind = z.infer<typeof projectKind>;

/** The rooms a project can live in. Its first tag is the room that shows it. */
export const roomTag = z.enum(["web", "iphone", "mac", "automation"]);
export type RoomTag = z.infer<typeof roomTag>;

const isoDate = z.iso.date();
const paragraph = z.string().trim().min(1);

/** How a screenshot is framed on the page. Phone is 9:19.5, desktop 16:10, none is the image as is. */
export const screenshotFrame = z.enum(["phone", "desktop", "none"]);
export type ScreenshotFrame = z.infer<typeof screenshotFrame>;

/** One feature card under a project block. The metric is a short mono fact, when there is one. */
export const featureSchema = z.object({
  glyph: z.string().trim().min(1).max(3),
  title: paragraph,
  text: paragraph,
  metric: paragraph.optional(),
});
export type Feature = z.infer<typeof featureSchema>;

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "hex color like #0A1118");

/**
 * Consumer-app brand, only for apps with their own look. Two tones: one dark ground tinted
 * toward one accent. The band renders in SF Pro, not the site font. See DECISIONS.md.
 */
export const brandSchema = z.object({
  ground: hex,
  accent: hex,
  /** Corner radius in px for the button and glyph. 0 is square. */
  radius: z.number().int().min(0).max(40).default(0),
  /** Short store-style line: "Golf wagers". */
  eyebrow: paragraph,
  /** Two or three plain sentences on what it does. */
  lede: paragraph,
  /** Website for the app, once it exists. */
  site: z.url().optional(),
});
export type Brand = z.infer<typeof brandSchema>;

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug is lowercase words joined by -"),
  name: z.string().min(1),
  /** Leads with what it does. No tagline. */
  oneLiner: paragraph,
  /** Block headline. The mono tail goes in headlineMono. */
  headline: paragraph,
  headlineMono: paragraph.optional(),
  status: projectStatus,
  kind: projectKind,
  /** First tag is the room. Others are shown as chips. */
  tags: z.array(roomTag).min(1),
  role: paragraph,
  year: paragraph,
  stack: z.array(z.string().min(1)).min(1),
  links: z
    .object({
      live: z.url().optional(),
      repo: z.url().optional(),
      video: z.url().optional(),
      testflight: z.url().optional(),
      appstore: z.url().optional(),
      caseStudy: z.url().optional(),
    })
    .default({}),
  /** Case study shape: problem, what was built, what changed. One short paragraph each. */
  problem: paragraph,
  built: paragraph,
  changed: paragraph,
  whatItDoes: paragraph.optional(),
  underTheHood: paragraph.optional(),
  /** Up to four cards under the block. Empty hides the row. */
  features: z.array(featureSchema).max(4).default([]),
  /** Real numbers only. An estimate says "est." in note. */
  metrics: z
    .array(z.object({ label: paragraph, value: paragraph, note: paragraph.optional() }))
    .default([]),
  /** Files live under public/shots/<slug>/. Empty renders a labeled placeholder. */
  screenshots: z
    .array(
      z.object({
        src: z.string().startsWith("/shots/"),
        alt: paragraph,
        frame: screenshotFrame.default("none"),
      }),
    )
    .default([]),
  shippedAt: isoDate.optional(),
  updatedAt: isoDate,
  /** Sorts first inside its room. */
  featured: z.boolean().default(false),
  /** Present only for consumer apps with a locked look. Renders the app band instead of the block. */
  brand: brandSchema.optional(),
});
export type Project = z.infer<typeof projectSchema>;

export const projectsSchema = z
  .array(projectSchema)
  .min(1)
  .superRefine((projects, ctx) => {
    const seen = new Set<string>();
    projects.forEach((project, index) => {
      if (seen.has(project.slug)) {
        ctx.addIssue({
          code: "custom",
          message: `duplicate slug ${project.slug}`,
          path: [index, "slug"],
        });
      }
      seen.add(project.slug);
    });
  });

/** Parses the dataset. Throws with every problem listed, so a bad entry fails the build. */
export function parseProjects(input: unknown): Project[] {
  const result = projectsSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Invalid projects.json:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
