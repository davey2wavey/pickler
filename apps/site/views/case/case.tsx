import Link from "next/link";
import { Label, cx } from "@pickler/ui";
import type { Project } from "@/data/project";
import { Column, columnClasses } from "@/components/home/column";
import { DemoSlot } from "@/components/home/demo-slot";
import { WaveRule } from "@/components/home/wave-rule";
import { LinkButton } from "./link-button";
import { Shots } from "./shots";

const linkLabels = {
  live: "Open",
  video: "Watch",
  testflight: "TestFlight",
  appstore: "App Store",
  repo: "Code",
  caseStudy: "Case study",
} as const;

type LinkKey = keyof typeof linkLabels;

export function caseLinks(project: Project): Array<{ key: LinkKey; href: string }> {
  return (Object.keys(linkLabels) as LinkKey[])
    .map((key) => ({ key, href: project.links[key] }))
    .filter((link): link is { key: LinkKey; href: string } => Boolean(link.href));
}

function Story({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-b border-line px-6 py-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <span className="mb-2 block font-mono text-label uppercase tracking-label text-grey">
        {label}
      </span>
      <p className="max-w-[46ch]">{text}</p>
    </div>
  );
}

/** One project's page in the band language: head, demo, story, numbers, screens, links. */
export function Case({ project }: { project: Project }) {
  const links = caseLinks(project);
  return (
    <main>
      <div className="border-b border-line">
        <Column className="flex h-[52px] items-stretch">
          <Link
            href="/"
            className="flex items-center border-r border-line px-4 font-mono text-label uppercase tracking-label hover:bg-fg hover:text-bg"
          >
            ← All projects
          </Link>
          <span className="flex items-center gap-2 px-4 font-mono text-label uppercase tracking-label text-grey">
            <span aria-hidden className="size-[7px] bg-acc" />
            {project.name}
          </span>
        </Column>
      </div>

      <Column>
        <header className="grid items-start gap-x-8 gap-y-4 px-6 pb-7 pt-9 md:grid-cols-[1.15fr_1fr]">
          <h1 className="text-balance text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            {project.headline ?? project.name}
            {project.headlineMono ? (
              <>
                {" "}
                <span className="font-mono font-medium">{project.headlineMono}</span>
              </>
            ) : null}
          </h1>
          <div className="flex flex-col gap-2.5 pt-1">
            <p className="max-w-[46ch] text-lead text-grey">{project.oneLiner}</p>
            <p className="flex flex-wrap gap-x-4 font-mono text-label tracking-[0.06em]">
              <span>
                <span className="mr-1.5 text-grey">stack</span>
                {project.stack.join(" · ").toLowerCase()}
              </span>
              <span>
                <span className="mr-1.5 text-grey">status</span>
                {project.status}
              </span>
              <span>
                <span className="mr-1.5 text-grey">kind</span>
                {project.kind}
              </span>
            </p>
          </div>
        </header>
        <WaveRule className="mx-6" />
      </Column>

      <section aria-label="Demo" className="bg-ground">
        <Column className="p-6">
          <DemoSlot project={project} />
        </Column>
      </section>

      <section aria-label="Story" className="border-t border-line">
        <Column className="grid md:grid-cols-3">
          <Story label="problem" text={project.problem} />
          <Story label="built" text={project.built} />
          <Story label="changed" text={project.changed} />
        </Column>
      </section>

      {project.metrics.length > 0 ? (
        <section aria-label="Numbers" className="border-t border-line">
          <dl className={cx(columnClasses, "grid md:grid-cols-3")}>
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex flex-col gap-1 border-b border-line px-6 py-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <dt className="font-mono text-label uppercase tracking-label text-grey">
                  {metric.label}
                </dt>
                <dd className="font-mono text-[2.2rem] leading-none tabular-nums tracking-tight">
                  {metric.value}
                </dd>
                {metric.note ? <dd className="text-small text-grey">{metric.note}</dd> : null}
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section aria-label="Screenshots" className="border-t border-line">
        <Column className="flex flex-col gap-4 px-6 py-6">
          <Label text="screens" />
          <Shots project={project} />
        </Column>
      </section>

      {links.length > 0 ? (
        <section aria-label="Links" className="border-t border-line">
          <Column className="flex flex-wrap gap-3 px-6 py-6">
            {links.map((link) => (
              <LinkButton key={link.key} href={link.href} rel="noreferrer">
                {linkLabels[link.key]}
              </LinkButton>
            ))}
          </Column>
        </section>
      ) : null}
    </main>
  );
}
