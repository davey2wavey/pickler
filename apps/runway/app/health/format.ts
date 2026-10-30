const formatters = new Map<string, Intl.NumberFormat>();

/** "$1,234.50". Negative keeps the sign: "-$20.00". */
export function formatMoney(amount: number, currency = "USD"): string {
  let formatter = formatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    formatters.set(currency, formatter);
  }
  return formatter.format(amount);
}
