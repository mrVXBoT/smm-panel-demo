import { INITIAL_SERVICES } from '../fixtures/services';
/** A product owns its checkout. New Order only chooses the product. */
export function productRoute(serviceId: string): string {
  const service = INITIAL_SERVICES.find((item) => item.id === serviceId);
  if (!service) return '/app/order/new';
  const path =
    service.platform === 'telegram_stars'
      ? '/app/stars'
      : service.platform === 'telegram_premium'
        ? '/app/premium'
        : '/app/growth';
  return `${path}?service=${encodeURIComponent(service.id)}`;
}
