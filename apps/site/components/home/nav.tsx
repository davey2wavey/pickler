import type { Project } from "@/data/project";

/** Bordered strip: name and what I do, anchors to each band, a black contact cell. */
export function Nav({ projects }: { projects: readonly Project[] }) {
  return (
    <header className="flex h-[52px] items-stretch border-b border-line">
      <a href="#top" className="flex items-center gap-2.5 border-r border-line px-4 font-bold">
        David Pickler
        <span className="font-mono text-label font-normal tracking-label text-grey">
          {"// BUILDS TOOLS"}
        </span>
      </a>
      <nav aria-label="Sections" className="hidden flex-1 md:flex">
        <ul className="flex">
          {projects.map((project) => (
            <li key={project.slug} className="flex">
              <a
                href={`#${project.slug}`}
                className="flex items-center border-r border-line-soft px-4 font-mono text-label uppercase tracking-label hover:bg-fg hover:text-bg"
              >
                {project.name}
              </a>
            </li>
          ))}
          <li className="flex">
            <a
              href="#how"
              className="flex items-center border-r border-line-soft px-4 font-mono text-label uppercase tracking-label hover:bg-fg hover:text-bg"
            >
              How I work
            </a>
          </li>
        </ul>
      </nav>
      <a
        href="#contact"
        className="ml-auto flex items-center bg-fg px-4 font-mono text-label uppercase tracking-label text-bg hover:bg-acc hover:text-acc-ink"
      >
        Get in touch
      </a>
    </header>
  );
}
