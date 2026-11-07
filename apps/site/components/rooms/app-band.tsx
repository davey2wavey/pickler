import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project, RoomTag } from "@/data/project";
import { bandStatus, block } from "@/content/site";
import { Column } from "@/components/home/column";
import { AppGlyph, AppObject } from "./app-art";
import styles from "./app-band.module.css";

type Props = { project: Project & { brand: NonNullable<Project["brand"]> }; room: RoomTag };

/**
 * One consumer app as a store-style hero: eyebrow, name with its icon, what it does, status,
 * and the animated object on the right. Two tones from the project's brand. Links to /p/[slug].
 */
export function AppBand({ project, room }: Props) {
  const { brand } = project;
  const headingId = `${project.slug}-headline`;
  const status =
    project.status in bandStatus
      ? bandStatus[project.status as keyof typeof bandStatus]
      : project.status;
  const vars = {
    "--ground": brand.ground,
    "--accent": brand.accent,
    "--radius": `${brand.radius}px`,
  } as CSSProperties;
  return (
    <article
      id={project.slug}
      data-testid="project-block"
      data-room={room}
      data-band=""
      aria-labelledby={headingId}
      className={styles.band}
      style={vars}
    >
      <Column className={styles.grid ?? ""}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{brand.eyebrow}</p>
          <div className={styles.titleRow}>
            <h3 id={headingId} className={styles.name}>
              {project.name}
            </h3>
            <AppGlyph slug={project.slug} className={styles.glyph} />
          </div>
          <p className={styles.lede}>{brand.lede}</p>
          <div className={styles.row}>
            <Link href={`/p/${project.slug}`} className={styles.more}>
              {block.learnMore} <span aria-hidden>→</span>
            </Link>
            <span className={styles.status}>{status}</span>
            {brand.site ? (
              <span className={styles.meta}>{brand.site.replace(/^https?:\/\//, "")}</span>
            ) : null}
          </div>
        </div>
        <div className={styles.object}>
          <AppObject slug={project.slug} />
        </div>
      </Column>
    </article>
  );
}
