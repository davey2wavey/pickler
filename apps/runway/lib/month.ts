// Months are "YYYY-MM" strings end to end. No Date math leaks into the UI.

export type Month = string;

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

const NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const pad = (n: number) => String(n).padStart(2, "0");

function split(month: Month): { year: number; index: number } {
  const [year, mm] = month.split("-");
  return { year: Number(year), index: Number(mm) - 1 };
}

function join(year: number, index: number): Month {
  return `${year}-${pad(index + 1)}`;
}

/** YYYY-MM-DD in UTC, matching the database's current_date. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** "YYYY-MM" when the input is one, otherwise the fallback. */
export function parseMonth(input: string | undefined, fallback: Month): Month {
  return input && MONTH.test(input) ? input : fallback;
}

export function prevMonth(month: Month): Month {
  const { year, index } = split(month);
  return index === 0 ? join(year - 1, 11) : join(year, index - 1);
}

export function nextMonth(month: Month): Month {
  const { year, index } = split(month);
  return index === 11 ? join(year + 1, 0) : join(year, index + 1);
}

/** Half-open date range: first of the month up to the first of the next. */
export function monthRange(month: Month): { from: string; to: string } {
  return { from: `${month}-01`, to: `${nextMonth(month)}-01` };
}

/** "2026-10" → "October 2026". */
export function formatMonth(month: Month): string {
  const { year, index } = split(month);
  return `${NAMES[index]} ${year}`;
}
