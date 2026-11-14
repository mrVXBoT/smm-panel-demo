import { describe, it, expect } from 'vitest';
import { centsToDollars, dollarsToCents, formatCents } from './currency';

describe('Currency Utilities (USD Minor Units)', () => {
  it('converts cents to dollars accurately', () => {
    expect(centsToDollars(8700)).toBe(87.0);
    expect(centsToDollars(140)).toBe(1.4);
    expect(centsToDollars(15)).toBe(0.15);
    expect(centsToDollars(0)).toBe(0);
  });

  it('converts dollars to integer minor units (cents)', () => {
    expect(dollarsToCents(87.0)).toBe(8700);
    expect(dollarsToCents(1.4)).toBe(140);
    expect(dollarsToCents(0.15)).toBe(15);
  });

  it('formats cents with dollar symbol and 2 decimal places', () => {
    expect(formatCents(8700)).toBe('$87.00');
    expect(formatCents(140)).toBe('$1.40');
    expect(formatCents(15)).toBe('$0.15');
    expect(formatCents(2899)).toBe('$28.99');
  });

  it('supports formatting without dollar symbol', () => {
    expect(formatCents(8700, { showCurrency: false })).toBe('87.00');
  });
});
