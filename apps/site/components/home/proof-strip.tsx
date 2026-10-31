import { cx } from "@pickler/ui";
import type { Project } from "@/data/project";
import { daysSince, proof } from "@/data/proof";
import { columnClasses } from "./column";

type Cell = { n: string; d: string };

/** Four cells, real numbers only. A cell without a real number is not rendered. */
export function proofCells(projects: readonly Project[], today: Date): Cell[] {
  const deployed = projects.filter((project) => project.links.live).length;
  const days = daysSince(proof.firstCommit, today);
  const cells: Cell[] = [];
  if (deployed > 0) cells.push({ n: String(deployed), d: "tools you can open today" });
  cells.push({
    n: String(proof.prsMerged),
    d: `pull requests merged, every one green (${proof.prsAsOf})`,
  });
  cells.push({ n: "1", d: "person. Spec, build, test, deploy." });
  cells.push({ n: `${days}d`, d: "since the first commit" });
  return cells;
}

export function ProofStrip({ projects, today }: { projects: readonly Project[]; today: Date }) {
  const cells = proofCells(projects, today);
  return (
    <div className="border-b border-t border-line bg-panel">
      <dl aria-label="Proof" className={cx(columnClasses, "grid grid-cols-2 md:grid-cols-4")}>
        {cells.map((cell) => (
          <div
            key={cell.d}
            className="border-r border-line px-5 py-4 last:border-r-0 max-md:nth-[2]:border-r-0 max-md:nth-[-n+2]:border-b"
          >
            <dd className="font-mono text-[1.7rem] leading-none tabular-nums tracking-tight">
              {cell.n}
            </dd>
            <dt className="mt-1.5 text-small text-grey">{cell.d}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
