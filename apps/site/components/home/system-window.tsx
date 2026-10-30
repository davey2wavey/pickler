import type { Project } from "@/data/project";
import { proof } from "@/data/proof";
import { statusTone } from "@/views/status-tone";
import { AppWindow } from "./app-window";

const icons = ["$", "@", "#", "%", "&"];
const toneText = { ok: "text-ok", warn: "text-warn", bad: "text-bad", acc: "text-acc" } as const;

/** Three columns: project nodes with their status, one builder, the live list. Nothing invented. */
export function SystemWindow({ projects }: { projects: readonly Project[] }) {
  const deployed = projects.filter((project) => project.links.live).length;
  return (
    <AppWindow title="PICKLER · SYSTEMS" size="lg" className="mx-auto max-w-[960px] text-left">
      <div className="grid min-h-[300px] bg-[linear-gradient(var(--line-soft)_1px,transparent_1px),linear-gradient(90deg,var(--line-soft)_1px,transparent_1px)] bg-[size:24px_24px] md:grid-cols-[1fr_1.2fr_1fr]">
        <ul aria-label="Projects" className="flex flex-col justify-center gap-2.5 p-4">
          {projects.map((project, index) => (
            <li
              key={project.slug}
              className="grid h-10 grid-cols-[28px_1fr_auto] items-center border border-line bg-panel"
            >
              <span
                aria-hidden
                className="grid h-full place-items-center border-r border-line bg-acc font-mono text-label text-acc-ink"
              >
                {icons[index % icons.length]}
              </span>
              <span className="px-2.5 font-mono text-label uppercase tracking-label">
                {project.name}
              </span>
              <span className="grid h-full place-items-center border-l border-line px-3 font-mono text-label uppercase tracking-label">
                {project.status}
              </span>
            </li>
          ))}
          <li className="mt-1 list-none font-mono text-label uppercase tracking-label text-grey">
            status · from projects.json
          </li>
        </ul>

        <div className="grid place-items-center p-4">
          <div className="grid w-full max-w-[240px] grid-rows-[auto_1fr_auto] border border-line bg-fg text-bg md:aspect-[1.3]">
            <div className="border-b border-grey px-2.5 py-2 font-mono text-label tracking-[0.1em] text-acc">
              {"//ONE BUILDER//"}
            </div>
            <div className="grid place-items-center py-6 text-center font-mono">
              <span className="text-[2.4rem] leading-none tabular-nums tracking-tight">
                {proof.prsMerged}
              </span>
              <span className="mt-1 block text-label uppercase tracking-[0.1em] text-grey">
                PRs merged · {proof.prsAsOf}
              </span>
            </div>
            <div className="mx-2.5 mb-2.5 h-2 bg-grey">
              <div className="h-full w-full bg-acc" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="border border-line bg-panel">
            <div className="flex items-center justify-between border-b border-line px-2.5 py-2 font-mono text-label uppercase tracking-label">
              <span>Live now</span>
              <b className="bg-acc px-1.5 font-medium text-acc-ink">{deployed} deployed</b>
            </div>
            <ul aria-label="Live now">
              {projects.map((project) => {
                const tone = statusTone[project.status];
                return (
                  <li
                    key={project.slug}
                    className="grid grid-cols-[1fr_auto] gap-2 border-b border-line-soft px-2.5 py-1.5 text-small last:border-b-0"
                  >
                    <span>
                      {project.name}
                      <small className="block font-mono text-label text-grey">
                        {project.kind} · {project.stack.slice(0, 2).join(" + ").toLowerCase()}
                      </small>
                    </span>
                    <span
                      className={`font-mono text-label uppercase tracking-label ${tone ? toneText[tone] : "text-grey"}`}
                    >
                      {project.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
