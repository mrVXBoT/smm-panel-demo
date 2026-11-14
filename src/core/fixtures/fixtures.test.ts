import { describe, it, expect } from 'vitest';
import { INITIAL_DEMO_CUSTOMER, INITIAL_DEMO_ADMIN, DEMO_CREDENTIALS } from './demoUser';
import { INITIAL_CATEGORIES } from './categories';
import { INITIAL_SERVICES } from './services';

describe('Demo Fixtures Specification Compliance', () => {
  it('demo customer has initial balance of exactly 8,700 cents ($87.00)', () => {
    expect(INITIAL_DEMO_CUSTOMER.balanceCents).toBe(8700);
    expect(INITIAL_DEMO_CUSTOMER.role).toBe('customer');
    expect(INITIAL_DEMO_CUSTOMER.username).toBe('demouser');
    expect(INITIAL_DEMO_ADMIN.role).toBe('admin');
  });

  it('provides matching demo credentials for customer and admin', () => {
    expect(DEMO_CREDENTIALS.customer.username).toBe('demouser');
    expect(DEMO_CREDENTIALS.customer.password).toBe('password123');
    expect(DEMO_CREDENTIALS.admin.username).toBe('admin');
  });

  it('includes required service categories: Telegram growth, numbers, Stars, Premium, Instagram, YouTube, TikTok', () => {
    const slugs = INITIAL_CATEGORIES.map((c) => c.slug);
    expect(slugs).toContain('telegram');
    expect(slugs).toContain('telegram_stars');
    expect(slugs).toContain('telegram_premium');
    expect(slugs).toContain('virtual_numbers');
    expect(slugs).toContain('instagram');
    expect(slugs).toContain('youtube');
    expect(slugs).toContain('tiktok');
  });

  it('initial services use integer minor unit pricing', () => {
    expect(INITIAL_SERVICES.length).toBeGreaterThan(5);
    for (const service of INITIAL_SERVICES) {
      if (service.fixedPriceCents !== undefined) {
        expect(Number.isInteger(service.fixedPriceCents)).toBe(true);
      }
      if (service.pricePerThousandCents !== undefined) {
        expect(Number.isInteger(service.pricePerThousandCents)).toBe(true);
      }
    }
  });
});
