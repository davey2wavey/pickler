import type { Tone } from "@pickler/ui";
import type { ProjectStatus } from "@/data/project";

/** Dot color per status. Archived gets no dot. Shared by every view. */
export const statusTone: Record<ProjectStatus, Tone | undefined> = {
  live: "ok",
  beta: "acc",
  "in-progress": "warn",
  "case-study": "acc",
  archived: undefined,
};
