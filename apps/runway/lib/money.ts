// All transaction arithmetic for the UI. Integer cents inside, numbers out.

export type MoneyRow = {
  /** Negative is money out. */
  amount: number;
  /** Rows sharing a group are one transfer and count as neither in nor out. */
  transfer_group: string | null;
};

const toCents = (amount: number) => Math.round(amount * 100);
const fromCents = (cents: number) => cents / 100;

function sumCents(rows: MoneyRow[], keep: (amount: number) => boolean): number {
  return rows
    .filter((row) => row.transfer_group === null && keep(row.amount))
    .reduce((total, row) => total + toCents(row.amount), 0);
}

/** Sum of positive non-transfer amounts. */
export function moneyIn(rows: MoneyRow[]): number {
  return fromCents(sumCents(rows, (amount) => amount > 0));
}

/** Sum of negative non-transfer amounts. Stays negative. */
export function moneyOut(rows: MoneyRow[]): number {
  return fromCents(sumCents(rows, (amount) => amount < 0));
}

/** In plus out. */
export function net(rows: MoneyRow[]): number {
  return fromCents(sumCents(rows, () => true));
}

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1234.5 → "1,234.50". Negative keeps the sign. No currency symbol. */
export function formatAmount(amount: number): string {
  return formatter.format(amount);
}
