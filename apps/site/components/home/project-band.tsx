import Link from "next/link";
import { cx } from "@pickler/ui";
import type { Project } from "@/data/project";
import { DemoSlot, demoKindFor } from "./demo-slot";
import { SectionMarkSvg, sectionMarkFor } from "./doodles";
import { DrawOn } from "./draw-on";
import { WaveRule } from "./wave-rule";

type BandLink = { label: string; href: string; external?: boolean; key?: string };

/** Project page first, then the live app, video, and code when they exist. */
export function bandLinks(project: Project): BandLink[] {
  const links: BandLink[] = [{ label: "Case study", href: `/p/${project.slug}` }];
  const kind = demoKindFor(project);
  if (project.links.live && kind === "iframe") {
    links.push({ label: "Open demo", href: project.links.live, external: true, key: "→" });
  }
  if (project.links.video) {
    links.push({ label: "Watch", href: project.links.video, external: true, key: "▶" });
  }
  if (project.links.repo) links.push({ label: "Code", href: project.links.repo, external: true });
  return links;
}

const fact = "border-b border-line px-5 py-4";
const factLabel = "mb-1.5 block font-mono text-label uppercase tracking-label text-grey";

/** One featured project: head, mark, wave rule, then demo on the left and facts on the right. */
export function ProjectBand({ project, index }: { project: Project; index: number }) {
  const number = String(index + 1).padStart(2, "0");
  const invert = index % 2 === 1;
  const metric = project.metrics[0];
  const headingId = `${project.slug}-headline`;

  return (
    <section
      id={project.slug}
      aria-labelledby={headingId}
      data-testid="project-band"
      {...(invert ? { "data-invert": "" } : {})}
      className={cx("border-b border-line text-fg", invert ? "bg-bg" : "bg-transparent")}
    >
      <DrawOn
        reach={0.6}
        className="grid items-start gap-x-8 gap-y-4 px-6 pb-7 pt-9 md:grid-cols-[1.15fr_1fr_96px]"
      >
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-label text-grey">
            <span aria-hidden className="size-[7px] bg-acc" />
            {number} · {project.name}
          </p>
          <h2
            id={headingId}
            className="mt-2 text-balance text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
          >
            <Link href={`/p/${project.slug}`} className="hover:text-grey">
              {project.headline}
              {project.headlineMono ? (
                <>
                  {" "}
                  <span className="font-mono font-medium">{project.headlineMono}</span>
                </>
              ) : null}
            </Link>
          </h2>
        </div>
        <div className="flex flex-col gap-2.5 pt-1">
          <p className="max-w-[46ch] text-grey">{project.problem}</p>
          <p className="flex flex-wrap gap-x-4 font-mono text-label tracking-[0.06em]">
            <span>
              <span className="mr-1.5 text-grey">stack</span>
              {project.stack.join(" · ").toLowerCase()}
            </span>
            <span>
              <span className="mr-1.5 text-grey">status</span>
              {project.status}
            </span>
          </p>
        </div>
        <SectionMarkSvg mark={sectionMarkFor(index)} className="max-md:hidden" />
      </DrawOn>
      <WaveRule className="mx-6" />

      <div className="grid border-t border-line md:grid-cols-[1.4fr_1fr]">
        <div className="border-b border-line bg-ground p-6 md:border-b-0 md:border-r">
          <DemoSlot project={project} />
        </div>
        <div className="flex flex-col">
          {metric ? (
            <div className={fact}>
              <span className={factLabel}>{metric.label}</span>
              <span
                className={cx(
                  "block font-mono text-[2.2rem] leading-none tabular-nums tracking-tight",
                  invert ? "text-acc" : "text-fg",
                )}
              >
                {metric.value}
              </span>
              {metric.note ? (
                <span className="mt-1.5 block text-small text-grey">{metric.note}</span>
              ) : null}
            </div>
          ) : null}
          <div className={fact}>
            <span className={factLabel}>What it does</span>
            <p className="text-small">{project.whatItDoes}</p>
          </div>
          <div className={cx(fact, "flex-1")}>
            <span className={factLabel}>Under the hood</span>
            <p className="text-small">{project.underTheHood}</p>
          </div>
          <nav aria-label={`${project.name} links`} className="flex">
            {bandLinks(project).map((link) => {
              const classes =
                "flex flex-1 items-center justify-between gap-2 border-r border-line px-5 py-3.5 font-mono text-label uppercase tracking-label last:border-r-0 hover:bg-fg hover:text-bg";
              const key = link.key ? (
                <span aria-hidden className="bg-acc px-1.5 text-acc-ink">
                  {link.key}
                </span>
              ) : null;
              return link.external ? (
                <a key={link.label} href={link.href} rel="noreferrer" className={classes}>
                  {link.label}
                  {key}
                </a>
              ) : (
                <Link key={link.label} href={link.href} className={classes}>
                  {link.label}
                  {key}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
