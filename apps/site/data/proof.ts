// Facts for the home page proof strip. Hardcoded and dated; update by hand, never guess.
// The PR count comes from `gh pr list --state merged`. The first commit date from `git log --reverse`.
export const proof = {
  prsMerged: 13,
  prsAsOf: "2026-10-30",
  firstCommit: "2026-10-29",
} as const;

const dayMs = 86_400_000;

/** Whole days from an ISO date to `today`, floored, never negative. Build-time value on a static page. */
export function daysSince(iso: string, today: Date = new Date()): number {
  const start = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(start)) throw new Error(`Expected an ISO date, got "${iso}"`);
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.max(0, Math.floor((todayUtc - start) / dayMs));
}
