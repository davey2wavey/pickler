import Link from "next/link";
import { Label } from "@pickler/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-grid flex-col gap-4 px-6 py-16">
      <Label text="404" dot="bad" />
      <h1 className="text-h1 font-medium">No such project</h1>
      <p className="text-lead text-grey">Nothing lives at this address.</p>
      <Link
        href="/"
        className="self-start font-mono text-label uppercase tracking-label hover:text-grey"
      >
        All projects
      </Link>
    </main>
  );
}
