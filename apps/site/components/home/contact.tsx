import { CopyEmail } from "@/components/copy-email";
import { email, github } from "@/components/footer";
import { Column } from "./column";

const stack = [
  ["Web", "Next.js · TypeScript"],
  ["Style", "Tailwind · own tokens"],
  ["Data", "Postgres · Supabase"],
  ["Deploy", "Vercel · GitHub Actions"],
  ["Tests", "Vitest · Playwright"],
  ["Native", "Swift · SwiftUI"],
] as const;

/** Email as selectable mono text with a copy button, then the stack grid. */
export function Contact() {
  return (
    <section id="contact" aria-label="Contact" className="bg-ground">
      <Column className="grid md:grid-cols-[1.3fr_1fr]">
        <div className="border-b border-line px-6 py-10 md:border-b-0 md:border-r">
          <p className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-label text-grey">
            <span aria-hidden className="size-[7px] bg-acc" />
            Contact
          </p>
          <h2 className="mb-3 mt-2 text-balance text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Need a tool built? <span className="font-mono font-medium">Start here.</span>
          </h2>
          <p className="mb-4 max-w-[44ch] text-grey">
            Remote, project-based or full-time. Reply within a day. Tell me the process that&apos;s
            hurting and I&apos;ll tell you what I&apos;d build.
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
        <div className="px-6 py-10">
          <p className="mb-2.5 inline-flex items-center gap-2 font-mono text-label uppercase tracking-label text-grey">
            <span aria-hidden className="size-[7px] bg-grey" />
            Stack
          </p>
          <dl className="grid grid-cols-2 border border-line bg-panel">
            {stack.map(([label, value]) => (
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
      </Column>
    </section>
  );
}
