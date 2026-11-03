import type { ReactNode } from "react";
import { email, github, rooms, stack } from "@/content/site";
import { Column } from "@/components/home/column";
import { CopyEmail } from "@/components/copy-email";

/** The last room: a slot for the ask box, then the stack grid and the address with a copy button. */
export function Touch({ children }: { children?: ReactNode }) {
  return (
    <section id="touch" aria-labelledby="touch-title" className="bg-ground">
      <Column className="flex flex-wrap items-baseline gap-x-4 gap-y-2 px-6 pb-6 pt-[72px]">
        <h2
          id="touch-title"
          className="text-[clamp(1.8rem,3.6vw,2.6rem)] font-semibold tracking-[-0.03em]"
        >
          {rooms.touch.title}
        </h2>
        <p className="max-w-[48ch] text-grey">{rooms.touch.blurb}</p>
      </Column>
      {children}
      <Column className="grid border-t border-line md:grid-cols-[1.3fr_1fr]">
        <div className="border-b border-line px-6 py-10 md:border-b-0 md:border-r">
          <p className="mb-2.5 inline-flex items-center gap-2 font-mono text-label uppercase tracking-label text-grey">
            <span aria-hidden className="size-[7px] bg-grey" />
            {stack.title}
          </p>
          <dl className="grid grid-cols-2 border border-line bg-panel">
            {stack.items.map(([label, value]) => (
              <div
                key={label}
                className="border-b border-r border-line-soft px-3 py-2.5 font-mono text-label tracking-[0.04em] nth-[2n]:border-r-0 nth-last-[-n+2]:border-b-0"
              >
                <dt className="mb-0.5 text-[0.6rem] uppercase tracking-label text-grey">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="px-6 py-10">
          <p className="mb-2.5 inline-flex items-center gap-2 font-mono text-label uppercase tracking-label text-grey">
            <span aria-hidden className="size-[7px] bg-acc" />
            Email
          </p>
          <div className="flex max-w-[460px] border border-line bg-panel">
            <a
              href={`mailto:${email}`}
              className="flex min-w-0 flex-1 items-center overflow-hidden text-ellipsis px-3.5 py-2.5 font-mono text-small select-all"
            >
              {email}
            </a>
            <CopyEmail email={email} variant="primary" className="h-auto border-0 border-l" />
          </div>
          <a
            href={github}
            rel="noreferrer"
            className="mt-4 inline-block font-mono text-label uppercase tracking-label hover:text-grey"
          >
            GitHub ↗
          </a>
        </div>
      </Column>
    </section>
  );
}
