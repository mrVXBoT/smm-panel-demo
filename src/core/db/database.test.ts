import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './database';
import { seedDatabase, resetDatabase } from './seed';
import { walletRepository } from './walletRepository';
import { orderRepository } from './orderRepository';
import { INITIAL_DEMO_CUSTOMER } from '../fixtures/demoUser';
import type { Order } from '../types/models';

describe('Dexie Database & Repositories', () => {
  beforeEach(async () => {
    await resetDatabase();
    await seedDatabase();
  });

  it('seeds default demo customer with 8700 cents ($87.00)', async () => {
    const customer = await db.users.get(INITIAL_DEMO_CUSTOMER.id);
    expect(customer).toBeDefined();
    expect(customer?.role).toBe('customer');

    const wallet = await walletRepository.getWallet(INITIAL_DEMO_CUSTOMER.id);
    expect(wallet.balanceCents).toBe(8700);
  });

  it('records a new order and derives balance properly', async () => {
    const newOrder: Order = {
      id: 'ord_test_001',
      userId: INITIAL_DEMO_CUSTOMER.id,
      serviceId: 'srv-tg-members-high',
      target: 'https://t.me/novachannel',
      quantity: 500,
      chargeCents: 450,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await orderRepository.create(newOrder);

    // Record charge in wallet via ledger
    await walletRepository.appendLedgerEntry({
      id: 'led_test_001',
      walletId: `wal_${INITIAL_DEMO_CUSTOMER.id}`,
      kind: 'order_charge',
      amountCents: -450,
      orderId: newOrder.id,
      description: 'Order charge: Telegram Premium Members',
      createdAt: new Date().toISOString(),
    });

    const wallet = await walletRepository.getWallet(INITIAL_DEMO_CUSTOMER.id);
    expect(wallet.balanceCents).toBe(8700 - 450);

    const orders = await orderRepository.getByUserId(INITIAL_DEMO_CUSTOMER.id);
    expect(orders.some((o) => o.id === newOrder.id)).toBe(true);
  });

  it('can reset database back to initial state', async () => {
    const dummyOrder: Order = {
      id: 'ord_dummy_002',
      userId: INITIAL_DEMO_CUSTOMER.id,
      serviceId: 'srv-tg-members-high',
      target: 'https://t.me/novachannel',
      quantity: 100,
      chargeCents: 100,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await orderRepository.create(dummyOrder);

    await resetDatabase();

    const wallet = await walletRepository.getWallet(INITIAL_DEMO_CUSTOMER.id);
    expect(wallet.balanceCents).toBe(8700);
  });
});
