import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { orderRepository } from '../../core/db/orderRepository';
import type { Order, Service } from '../../core/types/models';
export type ProductKind = 'stars' | 'premium' | 'growth';
const categories = { stars: 'cat_tg_stars', premium: 'cat_tg_premium', growth: 'cat_tg_growth' };
export function productOptions(kind: ProductKind): Service[] {
  return INITIAL_SERVICES.filter(
    (service) => service.categoryId === categories[kind] && service.status === 'active',
  );
}
export function productPrice(service: Service, quantity: number): number {
  return service.fixedPriceCents !== undefined
    ? service.fixedPriceCents * quantity
    : Math.round(((service.pricePerThousandCents ?? 0) * quantity) / 1000);
}
export interface ProductCheckout {
  purchase(input: {
    userId: string;
    serviceId: string;
    target: string;
    quantity: number;
  }): Promise<Order>;
}
/** Local simulation adapter: authoritative catalog pricing before repository ledger transaction. */
export const productCheckout: ProductCheckout = {
  async purchase({ userId, serviceId, target, quantity }) {
    const service = INITIAL_SERVICES.find(
      (item) => item.id === serviceId && item.status === 'active',
    );
    if (!service) throw new Error('This product is unavailable. Choose another option.');
    if (!/^@[a-zA-Z0-9_]{3,}$/.test(target.trim()))
      throw new Error('Use a fictional @handle with at least 3 letters, numbers or underscores.');
    if (
      !Number.isInteger(quantity) ||
      quantity < (service.minQty ?? 1) ||
      quantity > (service.maxQty ?? 100000)
    )
      throw new Error('Choose a quantity within the service limits.');
    return orderRepository.placeOrder({
      userId,
      serviceId,
      target: target.trim(),
      quantity,
      chargeCents: productPrice(service, quantity),
      serviceName: service.name,
    });
  },
};
