import { beforeEach, describe, expect, it, vi } from 'vitest';
import { productCheckout, productOptions, productPrice } from './productService';
import { orderRepository } from '../../core/db/orderRepository';
vi.mock('../../core/db/orderRepository', () => ({
  orderRepository: { placeOrder: vi.fn().mockResolvedValue({ id: 'DEMO' }) },
}));
beforeEach(() => vi.clearAllMocks());
describe('product checkout adapter', () => {
  it('records Stars packs with pack quantity and matching service IDs', async () => {
    await productCheckout.purchase({
      userId: 'demo',
      serviceId: 'srv_tg_stars_500',
      target: '@fictional_demo',
      quantity: 1,
    });
    expect(orderRepository.placeOrder).toHaveBeenCalledWith(
      expect.objectContaining({ serviceId: 'srv_tg_stars_500', quantity: 1, chargeCents: 980 }),
    );
  });
  it('records annual Premium with the annual service and price', async () => {
    await productCheckout.purchase({
      userId: 'demo',
      serviceId: 'srv_tg_premium_12m',
      target: '@fictional_demo',
      quantity: 1,
    });
    expect(orderRepository.placeOrder).toHaveBeenCalledWith(
      expect.objectContaining({ serviceId: 'srv_tg_premium_12m', chargeCents: 2899 }),
    );
  });
  it('rounds per-thousand charges in integer cents', () => {
    const views = productOptions('growth').find((item) => item.id.includes('views'));
    expect(views).toBeDefined();
    if (views) expect(productPrice(views, 500)).toBe(8);
  });
  it('rejects unavailable products, invalid handles and out-of-range quantities before writes', async () => {
    const input = {
      userId: 'demo',
      serviceId: 'srv_tg_stars_50',
      target: '@fictional_demo',
      quantity: 1,
    };
    await expect(productCheckout.purchase({ ...input, serviceId: 'missing' })).rejects.toThrow(
      'unavailable',
    );
    await expect(productCheckout.purchase({ ...input, quantity: 50 })).rejects.toThrow('limits');
    await expect(productCheckout.purchase({ ...input, target: 'x' })).rejects.toThrow('fictional');
    expect(orderRepository.placeOrder).not.toHaveBeenCalled();
  });
});
