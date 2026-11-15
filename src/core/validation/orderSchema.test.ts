import { describe, it, expect } from 'vitest';
import { createOrderSchema } from './orderSchema';

describe('orderSchema dynamic validation', () => {
  const schema = createOrderSchema({ minQty: 50, maxQty: 5000 });

  it('validates a correct order', () => {
    const result = schema.safeParse({
      categoryId: 'cat-telegram',
      serviceId: 'srv-1',
      target: 'https://t.me/example',
      quantity: 500,
    });
    expect(result.success).toBe(true);
  });

  it('rejects quantities below minQuantity', () => {
    const result = schema.safeParse({
      categoryId: 'cat-telegram',
      serviceId: 'srv-1',
      target: 'https://t.me/example',
      quantity: 20,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]?.message).toContain('Minimum quantity');
    }
  });

  it('rejects quantities above maxQuantity', () => {
    const result = schema.safeParse({
      categoryId: 'cat-telegram',
      serviceId: 'srv-1',
      target: 'https://t.me/example',
      quantity: 10000,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]?.message).toContain('Maximum quantity');
    }
  });

  it('rejects invalid targets', () => {
    const result = schema.safeParse({
      categoryId: 'cat-telegram',
      serviceId: 'srv-1',
      target: 'x',
      quantity: 100,
    });
    expect(result.success).toBe(false);
  });
});
