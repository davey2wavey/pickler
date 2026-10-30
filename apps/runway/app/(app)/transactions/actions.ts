"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "../../../lib/supabase/server";
import { parseAddForm } from "./add-schema";
import type { FieldErrors } from "./add-schema";

export type AddState = {
  errors?: FieldErrors;
  /** Database or auth failure. */
  error?: string;
  /** Changes on every success so the form can reset. */
  added?: number;
};

export async function addTransaction(_prev: AddState, formData: FormData): Promise<AddState> {
  const parsed = parseAddForm(formData, randomUUID());
  if (!parsed.ok) return { errors: parsed.errors };

  const db = await createClient();
  const { error } = await db.from("transactions").insert(parsed.rows);
  if (error) return { error: error.message };

  revalidatePath("/transactions");
  return { added: Date.now() };
}
