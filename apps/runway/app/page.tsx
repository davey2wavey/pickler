import { Button, Label } from "@pickler/ui";

export default function Page() {
  return (
    <main className="mx-auto flex max-w-grid flex-col gap-4 px-6 py-16">
      <Label text="runway" dot="acc" />
      <h1 className="text-h1 font-medium">runway</h1>
      <p className="text-lead text-grey">Shows where money goes. Nothing here yet.</p>
      <div>
        <Button>Placeholder</Button>
      </div>
    </main>
  );
}
