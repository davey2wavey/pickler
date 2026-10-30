/** "2026-10-29" → "2026-10". Month groups on the timeline. */
export function monthLabel(isoDate: string): string {
  return isoDate.slice(0, 7);
}
