export type Canned = ReadonlyArray<{
  readonly keywords: readonly string[];
  readonly reply: string;
}>;

/** The first canned entry whose keyword appears in the question, else the fallback. Case-insensitive. */
export function replyFor(question: string, canned: Canned, fallback: string): string {
  const text = question.trim().toLowerCase();
  if (!text) return fallback;
  const hit = canned.find((entry) =>
    entry.keywords.some((keyword) => text.includes(keyword.toLowerCase())),
  );
  return hit?.reply ?? fallback;
}
