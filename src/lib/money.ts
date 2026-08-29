const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  PHP: "₱",
};

/**
 * Formats a budget stored in minor units (cents) + a currency code
 * into a display string. e.g. formatMoney(2000, "EUR") -> "€20".
 * Drops the decimals when the amount is whole; shows them otherwise.
 */
export function formatMoney(cents: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "$";
  const amount = cents / 100;
  const text = Number.isInteger(amount)
    ? amount.toString()
    : amount.toFixed(2);
  return `${symbol}${text}`;
}