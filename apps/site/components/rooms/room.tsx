import type { CSSProperties } from "react";
import type { Project, RoomTag } from "@/data/project";
import { rooms, site } from "@/content/site";
import { AppGlyph } from "./app-art";
import { AppBand } from "./app-band";
import { ProjectBlock } from "./project-block";
import styles from "./room.module.css";

/**
 * One room: a divider band (the room's word in its accent, then its icons), then its
 * projects. Apps with a brand get a band in their own tones; the rest get blocks.
 */
export function Room({ id, projects }: { id: RoomTag; projects: readonly Project[] }) {
  const titleId = `${id}-title`;
  const room = rooms[id];
  const vars = { "--ground": room.ground, "--accent": room.accent } as CSSProperties;
  return (
    <section id={id} aria-labelledby={titleId}>
      <div className={styles.divider} style={vars} data-testid="room-divider">
        <h2 id={titleId} className={styles.word}>
          {room.title}
        </h2>
        <div className={styles.mini} aria-hidden>
          {projects
            .filter((p) => p.brand)
            .map((p) => (
              <a key={p.slug} href={`#${p.slug}`} tabIndex={-1}>
                <AppGlyph slug={p.slug} />
              </a>
            ))}
        </div>
      </div>
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
