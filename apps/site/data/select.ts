import type { Project } from "./project";

/** Featured first, otherwise the file's order. Stable. */
export function byFeatured(projects: readonly Project[]): Project[] {
  return [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));
}

export function findProject(projects: readonly Project[], slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
