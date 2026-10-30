import { Label } from "@pickler/ui";

export const email = "picklerdavid@gmail.com";

/** Email as text on every page. Plate 6, step 5. */
export function Footer() {
  return (
    <footer className="mx-auto flex max-w-grid flex-wrap items-center gap-4 border-t border-line px-6 py-8">
      <Label text="contact" />
      <a href={`mailto:${email}`} className="font-mono text-small hover:text-grey">
        {email}
      </a>
    </footer>
  );
}
