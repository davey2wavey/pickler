import Link from "next/link";
import { buttonClasses, cx } from "@pickler/ui";
import type { Project, RoomTag } from "@/data/project";
import { block } from "@/content/site";
import { Column } from "@/components/home/column";
import { DemoSlot } from "@/components/home/demo-slot";
import { FeatureCards } from "./feature-cards";

type Props = {
  project: Project;
  room: RoomTag;
  /** Every other block in a room flips its ground. */
  invert?: boolean;
  /** True for this site's own entry: no iframe of itself. */
  self?: boolean;
};

/** One project: demo on the left, the facts on the right, feature cards underneath. */
export function ProjectBlock({ project, room, invert = false, self = false }: Props) {
  const headingId = `${project.slug}-headline`;
  return (
    <article
      id={project.slug}
      data-testid="project-block"
      data-room={room}
      aria-labelledby={headingId}
      {...(invert ? { "data-invert": "" } : {})}
      className={cx("border-t border-line text-fg", invert ? "bg-bg" : "bg-transparent")}
    >
      <Column>
        <div className="grid md:grid-cols-[1.3fr_1fr]">
          <div className="border-b border-line bg-ground p-6 md:border-b-0 md:border-r">
            <DemoSlot project={project} self={self} />
          </div>
          <div className="flex flex-col gap-3.5 px-6 py-7">
            <p className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-label text-grey">
              <span aria-hidden className="size-[7px] bg-acc" />
              {project.name}
            </p>
            <h3
              id={headingId}
              className="text-balance text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.025em]"
            >
              {project.headline}
              {project.headlineMono ? (
                <>
                  {" "}
                  <span className="font-mono font-medium">{project.headlineMono}</span>
                </>
              ) : null}
            </h3>
            <p className="text-grey">{project.oneLiner}</p>
            <ul aria-label="Tags" className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-line-soft px-1.5 py-0.5 font-mono text-[0.64rem] uppercase tracking-label text-grey"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-small">
              {[
                [block.role, project.role],
                [block.year, project.year],
                [block.stack, project.stack.join(" · ")],
              ].map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="pt-0.5 font-mono text-[0.66rem] uppercase tracking-label text-grey">
                    {label}
                  </dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={`/p/${project.slug}`}
              className={cx(buttonClasses("secondary"), "mt-auto self-start")}
            >
              {block.learnMore} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
        <FeatureCards features={project.features} name={project.name} />
      </Column>
    </article>
  );
}
