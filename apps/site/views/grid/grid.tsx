import type { Project } from "@/data/project";
import { byFeatured } from "@/data/select";
import { Header } from "../header";
import { Tile } from "./tile";

/** View 6, minimal grid. A tile per project, featured first. Each tile draws its own bottom
 * and right hairline, the list the top and left, so a short last row stays open. */
export function Grid({ projects }: { projects: Project[] }) {
  return (
    <main className="mx-auto flex max-w-grid flex-col gap-12 px-6 py-16">
      <Header />
      <ul
        aria-label="Projects"
        className="grid border-t border-l border-line md:grid-cols-2 lg:grid-cols-3"
      >
        {byFeatured(projects).map((project) => (
          <Tile key={project.slug} project={project} />
        ))}
      </ul>
    </main>
  );
}
