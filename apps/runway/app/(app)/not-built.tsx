import { Label, Panel } from "@pickler/ui";

/** Honest placeholder for a tab that has no content yet. */
export function NotBuilt({ name }: { name: string }) {
  return (
    <div className="flex flex-col gap-4">
      <Label text={name} />
      <h1 className="text-h1 font-medium">{name}</h1>
      <Panel title={name}>
        <p className="text-body text-grey">Not built yet.</p>
      </Panel>
    </div>
  );
}
