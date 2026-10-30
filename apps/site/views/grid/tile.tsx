import { Label } from "@pickler/ui";
import type { Tone } from "@pickler/ui";
import type { Project, ProjectStatus } from "@/data/project";

const tones: Record<ProjectStatus, Tone> = { live: "ok", building: "warn", native: "acc" };

const box = "flex h-full flex-col gap-3 bg-bg p-4 text-fg";
const link =
  "group hover:bg-acc hover:text-acc-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-acc";

/** One project. Links out only when it is live; building and native tiles are plain boxes. */
export function Tile({ project }: { project: Project }) {
  const body = (
    <>
      <Label
        text={project.status}
        dot={tones[project.status]}
        className="group-hover:text-acc-ink"
      />
      <h2 className="text-h3 font-medium">{project.name}</h2>
      <p className="text-grey group-hover:text-acc-ink">{project.oneLiner}</p>
      <p className="mt-auto font-mono text-label uppercase tracking-label text-grey group-hover:text-acc-ink">
        {project.stack.join(" / ")}
      </p>
    </>
  );

  if (project.status === "live" && project.url) {
    return (
      <li className="bg-bg">
        <a href={project.url} className={`${box} ${link}`}>
          {body}
        </a>
      </li>
    );
  }
  return <li className={box}>{body}</li>;
}
