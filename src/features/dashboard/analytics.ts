import type { Order } from '../../core/types/models';
import { INITIAL_SERVICES } from '../../core/fixtures/services';

export function dashboardAnalytics(orders: Order[], now = new Date()) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - 6 + index);
    return {
      start: date.getTime(),
      date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      orders: 0,
      spendDollars: 0,
    };
  });
  const categories = [
    { name: 'Channel Growth', platform: 'telegram', value: 0, color: '#38bdf8' },
    { name: 'Telegram Stars', platform: 'telegram_stars', value: 0, color: '#f59e0b' },
    { name: 'Telegram Premium', platform: 'telegram_premium', value: 0, color: '#a78bfa' },
    { name: 'Other', platform: 'other', value: 0, color: '#94a3b8' },
  ];
  for (const order of orders) {
    const timestamp = new Date(order.createdAt).getTime();
    const day = days.find(
      (item) =>
        timestamp >= item.start &&
        timestamp <
          new Date(new Date(item.start).setDate(new Date(item.start).getDate() + 1)).getTime(),
    );
    if (day) {
      day.orders++;
      if (order.status !== 'refunded') day.spendDollars += order.chargeCents / 100;
    }
    const platform = INITIAL_SERVICES.find((service) => service.id === order.serviceId)?.platform;
    const category = categories.find((item) => item.platform === platform) ?? categories.find((item) => item.platform === 'other');
    if (category) category.value++;
  }
  return {
    volume: days,
    breakdown: categories.filter((item) => item.value > 0),
    active: orders.filter((order) => ['pending', 'processing'].includes(order.status)).length,
    spentCents: orders.reduce(
      (sum, order) => sum + (order.status === 'refunded' ? 0 : order.chargeCents),
      0,
    ),
    recent: [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4),
  };
}
