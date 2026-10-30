import Link from "next/link";
import { Label } from "@pickler/ui";
import type { Tone } from "@pickler/ui";
import type { Project, ProjectStatus } from "@/data/project";

const tones: Record<ProjectStatus, Tone | undefined> = {
  live: "ok",
  beta: "acc",
  "in-progress": "warn",
  "case-study": "acc",
  archived: undefined,
};

const cell = "border-b border-r border-line";
const box =
  "group flex h-full flex-col gap-3 bg-bg p-4 text-fg hover:bg-acc hover:text-acc-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-acc";

/** One project. Opens its case study page. */
export function Tile({ project }: { project: Project }) {
  const tone = tones[project.status];
  return (
    <li className={cell}>
      <Link href={`/p/${project.slug}`} className={box}>
        <Label
          text={project.status}
          {...(tone ? { dot: tone } : {})}
          className="group-hover:text-acc-ink"
        />
        <h2 className="text-h3 font-medium">{project.name}</h2>
        <p className="text-grey group-hover:text-acc-ink">{project.oneLiner}</p>
        <p className="mt-auto font-mono text-label uppercase tracking-label text-grey group-hover:text-acc-ink">
          {project.stack.join(" / ")}
        </p>
      </Link>
    </li>
  );
}
