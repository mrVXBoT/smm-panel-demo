import { describe, it, expect, beforeEach } from 'vitest';
import { orderService } from './services/orderService';
import { useAppStore } from '../../app/store';

describe('Unified MockOrderService & Order Lifecycle', () => {
  beforeEach(() => {
    useAppStore.getState().resetDemoData();
  });

  it('retrieves initial seeded orders', async () => {
    const orders = await orderService.getOrders('usr_demo_customer_01');
    expect(orders.length).toBeGreaterThanOrEqual(2);
  });

  it('successfully creates an order and deducts balance via service', async () => {
    const initialBalance = useAppStore.getState().currentUser.balanceCents;
    const order = await orderService.createOrder({
      userId: 'usr_demo_customer_01',
      serviceId: 'srv_tg_subscribers_hq',
      target: '@channel_test',
      quantity: 1000,
    });

    expect(order.id).toBeDefined();
    expect(order.chargeCents).toBe(140);
    expect(order.status).toBe('pending');

    const updatedBalance = useAppStore.getState().currentUser.balanceCents;
    expect(updatedBalance).toBe(initialBalance - 140);
  });

  it('throws error when order exceeds available balance', async () => {
    await expect(
      orderService.createOrder({
        userId: 'usr_demo_customer_01',
        serviceId: 'srv_tg_subscribers_hq',
        target: '@channel_excess',
        quantity: 1000000, // Very large
      }),
    ).rejects.toThrow(/Insufficient balance/i);
  });

  it('advances order status through state machine', async () => {
    const orders = await orderService.getOrders();
    const firstOrder = orders[0]!;

    const updated = await orderService.updateOrderStatus(firstOrder.id, 'completed');
    expect(updated.status).toBe('completed');
  });
});
