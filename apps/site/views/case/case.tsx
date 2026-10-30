import Link from "next/link";
import { Label } from "@pickler/ui";
import type { Project } from "@/data/project";
import { LinkButton } from "./link-button";
import { Shots } from "./shots";

const linkLabels = {
  live: "Open",
  repo: "Code",
  testflight: "TestFlight",
  caseStudy: "Case study",
} as const;

function Section({ label, text }: { label: string; text: string }) {
  return (
    <section className="flex flex-col gap-3">
      <Label text={label} />
      <p className="max-w-[60ch]">{text}</p>
    </section>
  );
}

/** One project's case study: problem, what was built, what changed, numbers, shots, links. */
export function Case({ project }: { project: Project }) {
  const links = (Object.keys(linkLabels) as Array<keyof typeof linkLabels>)
    .map((key) => ({ key, href: project.links[key] }))
    .filter((link): link is { key: keyof typeof linkLabels; href: string } => Boolean(link.href));

  return (
    <main className="mx-auto flex max-w-grid flex-col gap-12 px-6 py-16">
      <Link
        href="/"
        className="self-start font-mono text-label uppercase tracking-label text-grey hover:text-fg"
      >
        All projects
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-4">
          <Label text={project.status} dot="acc" />
          <Label text={project.kind} />
        </div>
        <h1 className="text-h1 font-medium">{project.name}</h1>
        <p className="max-w-[60ch] text-lead text-grey">{project.oneLiner}</p>
        <p className="font-mono text-label uppercase tracking-label text-grey">
          {project.stack.join(" / ")}
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <Section label="problem" text={project.problem} />
        <Section label="built" text={project.built} />
        <Section label="changed" text={project.changed} />
      </div>

      {project.metrics.length > 0 ? (
        <section aria-label="Numbers" className="flex flex-col gap-3">
          <Label text="numbers" />
          <dl className="grid border-t border-l border-line md:grid-cols-3">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex flex-col gap-1 border-b border-r border-line p-4"
              >
                <dt className="font-mono text-label uppercase tracking-label text-grey">
                  {metric.label}
                </dt>
                <dd className="font-mono text-h2 tabular-nums">{metric.value}</dd>
                {metric.note ? <dd className="text-small text-grey">{metric.note}</dd> : null}
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section aria-label="Screenshots" className="flex flex-col gap-3">
        <Label text="screenshots" />
        <Shots project={project} />
      </section>

      {links.length > 0 ? (
        <section aria-label="Links" className="flex flex-col gap-3">
          <Label text="links" />
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <LinkButton key={link.key} href={link.href} rel="noreferrer">
                {linkLabels[link.key]}
              </LinkButton>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
