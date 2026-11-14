/**
 * Currency utilities for SMM Panel Demo.
 * All monetary amounts are stored internally as integer minor units (USD cents)
 * to avoid floating-point inaccuracies.
 */

export function centsToDollars(cents: number): number {
  return cents / 100;
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function formatCents(cents: number, options: { showCurrency?: boolean } = {}): string {
  const { showCurrency = true } = options;
  const dollars = centsToDollars(cents);
  const formatted = dollars.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return showCurrency ? `$${formatted}` : formatted;
}
