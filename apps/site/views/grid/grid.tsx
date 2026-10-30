import { Label } from "@pickler/ui";
import type { Project } from "@/data/project";
import { Tile } from "./tile";

export const pitch =
  "I build internal tools, dashboards, and automations for small teams. Solo, end to end.";

/** View 6, minimal grid. Name, one line, a tile per project. Each tile draws its own
 * bottom and right hairline, the list the top and left, so a short last row stays open. */
export function Grid({ projects }: { projects: Project[] }) {
  return (
    <main className="mx-auto flex max-w-grid flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-3">
        <Label text="portfolio" dot="acc" />
        <h1 className="text-h1 font-medium">David Pickler</h1>
        <p className="max-w-[60ch] text-lead text-grey">{pitch}</p>
      </header>
      <ul
        aria-label="Projects"
        className="grid border-t border-l border-line md:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <Tile key={project.slug} project={project} />
        ))}
      </ul>
    </main>
  );
}
