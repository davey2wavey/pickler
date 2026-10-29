import type { Metadata } from "next";
import { Button, Field, Label, Panel, Table } from "@pickler/ui";
import type { Column } from "@pickler/ui";

export const metadata: Metadata = {
  title: "ui",
  description: "Every primitive in the design system, light and dark.",
};

type Row = { item: string; due: string; amount: string };

const columns: Column<Row>[] = [
  { key: "item", header: "Item" },
  { key: "due", header: "Due" },
  { key: "amount", header: "Amount", numeric: true },
];

const rows: Row[] = [
  { item: "Rent", due: "1st", amount: "1,200.00" },
  { item: "Power", due: "14th", amount: "82.40" },
  { item: "Domains", due: "22nd", amount: "12.00" },
];

function Showcase({ theme }: { theme: "light" | "dark" }) {
  return (
    <div
      data-theme={theme}
      data-testid={`showcase-${theme}`}
      className="flex flex-col gap-8 bg-bg p-6 text-fg"
    >
      <div className="flex flex-col gap-2">
        <Label text={theme} dot="acc" />
        <h2 className="text-h2 font-medium">Primitives</h2>
        <p className="text-grey">Five of them. Nothing else exists yet.</p>
      </div>

      <section className="flex flex-col gap-3">
        <Label text="button" />
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Label text="label" />
        <div className="flex flex-wrap gap-4">
          <Label text="status" />
          <Label text="ok" dot="ok" />
          <Label text="warn" dot="warn" />
          <Label text="bad" dot="bad" />
          <Label text="acc" dot="acc" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Label text="panel" />
        <Panel title="Runway" meta="30 days">
          <p className="font-mono text-h2 tabular-nums">$4,812</p>
          <p className="text-small text-grey">left at the current burn</p>
        </Panel>
      </section>

      <section className="flex flex-col gap-3">
        <Label text="field" />
        <Field label="Email" type="email" placeholder="you@example.com" hint="Work address" />
      </section>

      <section className="flex flex-col gap-3">
        <Label text="table" />
        <Table caption={`Costs, ${theme}`} columns={columns} rows={rows} />
      </section>
    </div>
  );
}

export default function UiPage() {
  return (
    <main className="mx-auto flex max-w-grid flex-col gap-6 px-6 py-16">
      <div className="flex flex-col gap-2">
        <Label text="design system" />
        <h1 className="text-h1 font-medium">ui</h1>
        <p className="text-lead text-grey">
          Tokens and the five primitives, rendered once per theme.
        </p>
      </div>
      <div className="grid gap-px border border-line bg-line md:grid-cols-2">
        <Showcase theme="light" />
        <Showcase theme="dark" />
      </div>
    </main>
  );
}
