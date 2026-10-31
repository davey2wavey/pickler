import type { Project } from "./project";

/** Only the featured projects, in the file's order. The home page bands. */
export function featured(projects: readonly Project[]): Project[] {
  return projects.filter((project) => project.featured);
}

/** Featured first, otherwise the file's order. Stable. */
export function byFeatured(projects: readonly Project[]): Project[] {
  return [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));
}

export function findProject(projects: readonly Project[], slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** The date a project is "new" by: when it shipped, else when it last changed. */
export function newestDate(project: Project): string {
  return project.shippedAt ?? project.updatedAt;
}

/** Newest first by newestDate(), otherwise the file's order. Stable. */
export function byNewest(projects: readonly Project[]): Project[] {
  return [...projects].sort((a, b) => newestDate(b).localeCompare(newestDate(a)));
}
