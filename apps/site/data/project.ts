import { z } from "zod";

// The one shape every view renders. Edit projects.json, not this, to add a project.
export const projectStatus = z.enum(["live", "beta", "in-progress", "case-study", "archived"]);
export type ProjectStatus = z.infer<typeof projectStatus>;

export const projectKind = z.enum(["web", "ios", "mac", "worker", "static"]);
export type ProjectKind = z.infer<typeof projectKind>;

const isoDate = z.iso.date();
const paragraph = z.string().trim().min(1);

/** How a screenshot is framed on the page. Phone is 9:19.5, desktop 16:10, none is the image as is. */
export const screenshotFrame = z.enum(["phone", "desktop", "none"]);
export type ScreenshotFrame = z.infer<typeof screenshotFrame>;

/** Fields a featured project must carry: the home page bands read them. */
const featuredFields = ["headline", "whatItDoes", "underTheHood"] as const;

const projectBase = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug is lowercase words joined by -"),
  name: z.string().min(1),
  /** Leads with what it does. No tagline. */
  oneLiner: paragraph,
  /** Band headline. The mono tail goes in headlineMono. Required when featured. */
  headline: paragraph.optional(),
  headlineMono: paragraph.optional(),
  status: projectStatus,
  kind: projectKind,
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
  /** Band facts. Required when featured. */
  whatItDoes: paragraph.optional(),
  underTheHood: paragraph.optional(),
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
  /** The core three. Sort first on the grid. */
  featured: z.boolean().default(false),
});

export const projectSchema = projectBase.superRefine((project, ctx) => {
  if (!project.featured) return;
  for (const field of featuredFields) {
    if (!project[field]) {
      ctx.addIssue({
        code: "custom",
        message: `${field} is required when featured`,
        path: [field],
      });
    }
  }
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
