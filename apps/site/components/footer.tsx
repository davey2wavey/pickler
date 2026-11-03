import { email, github, linkedin, site } from "@/content/site";
import { CopyEmail } from "./copy-email";
import { Column } from "./home/column";

/** Contact on every page. One mono strip: who and where, how to reach me, what it runs on. */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <Column className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4 font-mono text-label uppercase tracking-label text-grey">
        <span>
          {site.name} · {site.location}
        </span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-2 normal-case">
          <span className="flex items-center gap-2">
            <a href={`mailto:${email}`} className="select-all text-fg hover:text-grey">
              {email}
            </a>
            <CopyEmail email={email} />
          </span>
          <a href={github} rel="noreferrer" className="uppercase hover:text-fg">
            GitHub
          </a>
          {linkedin ? (
            <a href={linkedin} rel="noreferrer" className="uppercase hover:text-fg">
              LinkedIn
            </a>
          ) : null}
        </span>
        <span>{site.footer}</span>
      </Column>
    </footer>
  );
}
