import { Button, Label } from "@pickler/ui";

export default function Page() {
  return (
    <main className="mx-auto flex max-w-grid flex-col gap-4 px-6 py-16">
      <Label text="site" dot="acc" />
      <h1 className="text-h1 font-medium">site</h1>
      <p className="text-lead text-grey">Portfolio. One dataset, many views. Nothing here yet.</p>
      <div>
        <Button>Placeholder</Button>
      </div>
    </main>
  );
}
