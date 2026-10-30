import { Button, Label } from "@pickler/ui";
import { formatMonth, nextMonth, prevMonth } from "../../../lib/month";
import type { Month } from "../../../lib/month";

/** One GET form per direction: a real button, works without JS, no button inside a link. */
function Jump({ to, label, children }: { to: Month; label: string; children: string }) {
  return (
    <form method="get" action="/transactions">
      <input type="hidden" name="month" value={to} />
      <Button type="submit" variant="secondary" size="sm" aria-label={label}>
        {children}
      </Button>
    </form>
  );
}

/** //MONTH// label, prev and next, the month in mono. */
export function MonthSwitcher({ month }: { month: Month }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Label text="month" />
      <Jump to={prevMonth(month)} label="Previous month">Prev</Jump>
      <span className="font-mono text-small uppercase tracking-label">{formatMonth(month)}</span>
      <Jump to={nextMonth(month)} label="Next month">Next</Jump>
    </div>
  );
}
