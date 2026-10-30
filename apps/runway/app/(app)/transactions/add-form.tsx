"use client";

import { Button, Field } from "@pickler/ui";
import { useActionState, useId, useState } from "react";
import type { SelectHTMLAttributes } from "react";
import { addTransaction } from "./actions";
import type { AddState } from "./actions";
import type { AccountOption, CategoryOption } from "./query";

type Props = {
  accounts: AccountOption[];
  categories: CategoryOption[];
  /** YYYY-MM-DD default for the date field. */
  today: string;
  /** Overridable for tests. */
  action?: (prev: AddState, formData: FormData) => Promise<AddState>;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  options: { id: string; name: string }[];
  blank?: string;
};

/** Field's styling on a native select. Local until the design system grows one. */
function SelectField({ label, hint, options, blank, id, ...props }: SelectProps) {
  const generated = useId();
  const selectId = id ?? generated;
  const hintId = hint ? `${selectId}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="font-mono text-label uppercase tracking-label text-grey">
        {label}
      </label>
      <select
        id={selectId}
        aria-describedby={hintId}
        className="h-9 border border-line bg-bg px-2 font-sans text-body text-fg focus:outline-2 focus:-outline-offset-1 focus:outline-acc"
        {...props}
      >
        {blank !== undefined ? <option value="">{blank}</option> : null}
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      {hint ? (
        <span id={hintId} className="font-mono text-label text-grey">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

const hintProp = (text: string | undefined) => (text ? { hint: text } : {});

export function AddForm({ accounts, categories, today, action = addTransaction }: Props) {
  const [state, submit, pending] = useActionState(action, {} as AddState);
  const [transfer, setTransfer] = useState(false);
  const errors = state.errors ?? {};

  return (
    <form key={state.added ?? 0} action={submit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Date"
          name="occurred_at"
          type="date"
          defaultValue={today}
          required
          {...hintProp(errors.occurred_at)}
        />
        <Field
          label="Payee"
          name="payee"
          type="text"
          autoComplete="off"
          {...hintProp(errors.payee)}
        />
        <Field
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          inputMode="decimal"
          placeholder="-42.10"
          hint={
            errors.amount ??
            (transfer ? "Moved between the two accounts." : "Negative is money out.")
          }
        />
        <SelectField
          label="Account"
          name="account_id"
          options={accounts}
          {...hintProp(errors.account_id)}
        />
        {transfer ? (
          <SelectField
            label="To account"
            name="to_account_id"
            options={accounts}
            blank="Choose"
            {...hintProp(errors.to_account_id)}
          />
        ) : (
          <SelectField
            label="Category"
            name="category_id"
            options={categories}
            blank="None"
            {...hintProp(errors.category_id)}
          />
        )}
      </div>
      <label className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-label text-grey">
        <input
          type="checkbox"
          name="transfer"
          checked={transfer}
          onChange={(e) => setTransfer(e.target.checked)}
          className="size-4 accent-acc"
        />
        Transfer
      </label>
      {state.error ? (
        <p role="alert" className="font-mono text-small text-bad">
          {state.error}
        </p>
      ) : null}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Adding" : "Add"}
        </Button>
      </div>
    </form>
  );
}
