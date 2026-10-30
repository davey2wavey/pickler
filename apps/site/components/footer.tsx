import { CopyEmail } from "./copy-email";

export const email = "picklerdavid@gmail.com";
export const github = "https://github.com/davey2wavey";
/** Set when there is a profile worth linking. Empty hides the link. */
export const linkedin = "";

/** Contact on every page. One mono strip: who and where, how to reach me, what it runs on. */
export function Footer() {
  return (
    <footer className="mx-auto flex max-w-grid flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line px-6 py-4 font-mono text-label uppercase tracking-label text-grey">
      <span>David Pickler · Orange County, CA</span>
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
      <span>Built with the tools above</span>
    </footer>
  );
}
