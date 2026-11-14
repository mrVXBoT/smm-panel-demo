import { describe, it, expect, beforeEach } from 'vitest';
import { orderService } from './services/orderService';
import { walletService } from '../wallet/services/walletService';
import { resetDatabaseToSeed } from '../../core/db/seed';

describe('Unified MockOrderService & Order Lifecycle', () => {
  beforeEach(async () => {
    await resetDatabaseToSeed();
  });

  it('retrieves initial seeded orders from Dexie', async () => {
    const orders = await orderService.getOrders('usr_demo_customer_01');
    expect(orders.length).toBeGreaterThanOrEqual(2);
  });

  it('successfully creates an order and deducts balance via atomic Dexie transaction', async () => {
    const initialWallet = await walletService.getWallet('usr_demo_customer_01');
    expect(initialWallet.balanceCents).toBe(8700);

    const order = await orderService.createOrder({
      userId: 'usr_demo_customer_01',
      serviceId: 'srv_tg_subscribers_hq',
      target: '@channel_test',
      quantity: 1000,
    });

    expect(order.id).toBeDefined();
    expect(order.chargeCents).toBe(140);
    expect(order.status).toBe('pending');

    const updatedWallet = await walletService.getWallet('usr_demo_customer_01');
    expect(updatedWallet.balanceCents).toBe(8700 - 140);
  });

  it('throws error and leaves balance untouched when order exceeds available balance', async () => {
    await expect(
      orderService.createOrder({
        userId: 'usr_demo_customer_01',
        serviceId: 'srv_yt_views_retention',
        target: 'https://youtube.com/watch?v=demo1234567',
        quantity: 50000, // Valid qty (max 100k), total $190.00 exceeds $87.00 balance
      }),
    ).rejects.toThrow(/Insufficient balance/i);

    const wallet = await walletService.getWallet('usr_demo_customer_01');
    expect(wallet.balanceCents).toBe(8700);
  });

  it('advances order status through state machine', async () => {
    const orders = await orderService.getOrders();
    const firstOrder = orders[0]!;

    const updated = await orderService.updateOrderStatus(firstOrder.id, 'completed');
    expect(updated.status).toBe('completed');
  });
});
