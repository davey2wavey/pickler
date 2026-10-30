import { z } from "zod";

// The one shape every view renders. Edit projects.json, not this, to add a project.
export const projectStatus = z.enum(["live", "building", "native"]);
export type ProjectStatus = z.infer<typeof projectStatus>;

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug is lowercase words joined by -"),
  name: z.string().min(1),
  /** Leads with what it does. No tagline. */
  oneLiner: z.string().min(1),
  status: projectStatus,
  stack: z.array(z.string().min(1)).min(1),
  /** Where it runs. Absent while nothing is live. */
  url: z.url().optional(),
  repo: z.url().optional(),
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
