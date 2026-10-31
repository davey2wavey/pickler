import { proof } from "@/data/proof";
import { Column } from "./column";

const steps = [
  {
    title: "Spec first",
    body: "One page. Problem, what gets built, what changes. Approved before any code.",
  },
  {
    title: "Thin slices",
    body: `One feature per branch, reviewable in minutes. ${proof.prsMerged} so far, zero broken.`,
  },
  {
    title: "Tests gate merge",
    body: "Typecheck, lint, unit, browser smoke on every PR. Red cannot ship.",
  },
  {
    title: "You click before merge",
    body: "Every change gets a preview link. You see it running before it goes live.",
  },
];

/** Solid accent band, four cells. Ink stays black on the blue in both themes. */
export function HowIWork() {
  return (
    <section
      id="how"
      aria-label="How I work"
      className="border-b border-acc-ink bg-acc text-acc-ink [--grey:var(--acc-ink)] [--line:var(--acc-ink)]"
    >
      <Column className="grid grid-cols-2 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="border-r border-line px-5 py-5 last:border-r-0 max-md:nth-[2]:border-r-0 max-md:nth-[-n+2]:border-b"
          >
            <p className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-label">
              <span aria-hidden className="size-[7px] bg-acc-ink" />
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mb-1.5 mt-2 text-body font-semibold">{step.title}</h3>
            <p className="text-small opacity-80">{step.body}</p>
          </div>
        ))}
      </Column>
    </section>
  );
}
