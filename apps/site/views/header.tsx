import { Label } from "@pickler/ui";

export const pitch =
  "I build internal tools, dashboards, and automations for small teams. Solo, end to end.";

/** Name and one line. Every view starts with it. */
export function Header() {
  return (
    <header className="flex flex-col gap-3">
      <Label text="portfolio" dot="acc" />
      <h1 className="text-h1 font-medium">David Pickler</h1>
      <p className="max-w-[60ch] text-lead text-grey">{pitch}</p>
    </header>
  );
}
