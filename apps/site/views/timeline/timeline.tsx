import type { Project } from "@/data/project";
import { byNewest, newestDate } from "@/data/select";
import { Header } from "../header";
import { monthLabel } from "./dates";
import { Entry } from "./entry";

/** View 8, build timeline. Every project on a vertical line, newest first, month by month. */
export function Timeline({ projects }: { projects: Project[] }) {
  const ordered = byNewest(projects);
  return (
    <main className="mx-auto flex max-w-grid flex-col gap-12 px-6 py-16">
      <Header />
      <ol aria-label="Projects, newest first" className="border-l border-line">
        {ordered.map((project, index) => {
          const month = monthLabel(newestDate(project));
          const previous = ordered[index - 1];
          const startsMonth = !previous || monthLabel(newestDate(previous)) !== month;
          return <Entry key={project.slug} project={project} {...(startsMonth ? { month } : {})} />;
        })}
      </ol>
    </main>
  );
}
