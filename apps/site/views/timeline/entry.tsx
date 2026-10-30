import Link from "next/link";
import { Label } from "@pickler/ui";
import type { Project } from "@/data/project";
import { statusTone } from "../status-tone";

/** One project on the line. Dates in mono, status, name as the link, one line. */
export function Entry({ project, month }: { project: Project; month?: string }) {
  const tone = statusTone[project.status];
  return (
    <li className="relative flex flex-col gap-2 py-6 pl-6 before:absolute before:top-8 before:left-0 before:size-2 before:-translate-x-1/2 before:bg-fg">
      {month ? (
        <p className="mb-2 font-mono text-label tracking-label text-fg uppercase">{month}</p>
      ) : null}
      <p className="font-mono text-label tracking-label text-grey uppercase">
        {project.shippedAt ? <span>shipped {project.shippedAt}</span> : null}
        {project.shippedAt ? " / " : null}
        <span>updated {project.updatedAt}</span>
      </p>
      <Label text={project.status} {...(tone ? { dot: tone } : {})} />
      <h2 className="text-h3 font-medium">
        <Link href={`/p/${project.slug}`} className="hover:text-grey">
          {project.name}
        </Link>
      </h2>
      <p className="max-w-[60ch] text-grey">{project.oneLiner}</p>
    </li>
  );
}
