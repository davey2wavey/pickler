import type { Project, RoomTag } from "@/data/project";
import { rooms, site } from "@/content/site";
import { Column } from "@/components/home/column";
import { AppBand } from "./app-band";
import { ProjectBlock } from "./project-block";

/** One room: title and blurb, then its projects. Apps with a brand get a band in their own tones; the rest get blocks with alternating ground. */
export function Room({ id, projects }: { id: RoomTag; projects: readonly Project[] }) {
  const titleId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className="border-b border-line">
      <Column className="flex flex-wrap items-baseline gap-x-4 gap-y-2 px-6 pb-6 pt-[72px]">
        <h2
          id={titleId}
          className="text-[clamp(1.8rem,3.6vw,2.6rem)] font-semibold tracking-[-0.03em]"
        >
          {rooms[id].title}
        </h2>
        <p className="max-w-[48ch] text-grey">{rooms[id].blurb}</p>
      </Column>
      {projects.map((project, index) =>
        project.brand ? (
          <AppBand key={project.slug} project={{ ...project, brand: project.brand }} room={id} />
        ) : (
          <ProjectBlock
            key={project.slug}
            project={project}
            room={id}
            invert={index % 2 === 1}
            self={project.links.live === site.url}
          />
        ),
      )}
    </section>
  );
}
