import { describe, expect, it } from 'vitest';
import { dashboardAnalytics } from './analytics';
import type { Order } from '../../core/types/models';
const order = (id: string, createdAt: string, status: Order['status'] = 'completed'): Order => ({
  id,
  createdAt,
  updatedAt: createdAt,
  userId: 'demo',
  serviceId: 'srv_tg_views_instant',
  target: '@demo',
  quantity: 1000,
  chargeCents: 15,
  status,
});
describe('dashboard analytics', () => {
  it('uses seven local calendar days and excludes future and older orders from the chart', () => {
    const now = new Date(2026, 10, 15, 12);
    const result = dashboardAnalytics(
      [
        order('today', new Date(2026, 10, 15, 10).toISOString(), 'processing'),
        order('old', new Date(2026, 10, 8).toISOString()),
        order('first', new Date(2026, 10, 9).toISOString()),
        order('future', new Date(2026, 10, 16).toISOString()),
      ],
      now,
    );
    expect(result.volume).toHaveLength(7);
    expect(result.volume.map((day) => day.orders)).toEqual([1, 0, 0, 0, 0, 0, 1]);
    expect(result.active).toBe(1);
    expect(result.breakdown[0]?.value).toBe(4);
  });
  it('excludes refunded charges and sorts recent orders without mutating input', () => {
    const orders = [
      order('old', '2026-11-13T12:00:00Z'),
      order('new', '2026-11-15T12:00:00Z', 'refunded'),
    ];
    const result = dashboardAnalytics(orders);
    expect(result.spentCents).toBe(15);
    expect(result.recent[0]?.id).toBe('new');
    expect(orders[0]?.id).toBe('old');
  });
  it('keeps empty accounts empty', () => {
    const result = dashboardAnalytics([]);
    expect(result.breakdown).toEqual([]);
    expect(result.spentCents).toBe(0);
    expect(result.volume.every((day) => day.orders === 0)).toBe(true);
  });
});
