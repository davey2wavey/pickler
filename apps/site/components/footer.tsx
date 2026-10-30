import { Label } from "@pickler/ui";
import { CopyEmail } from "./copy-email";

export const email = "picklerdavid@gmail.com";
export const github = "https://github.com/davey2wavey";

/** Contact on every page. Mono, hairline above. LinkedIn joins when there is a URL. */
export function Footer() {
  return (
    <footer className="mx-auto flex max-w-grid flex-wrap items-center gap-x-6 gap-y-3 border-t border-line px-6 py-8 font-mono text-small">
      <Label text="contact" />
      <span className="flex items-center gap-2">
        <a href={`mailto:${email}`} className="select-all hover:text-grey">
          {email}
        </a>
        <CopyEmail email={email} />
      </span>
      <a href={github} rel="noreferrer" className="hover:text-grey">
        GitHub
      </a>
    </footer>
  );
}
