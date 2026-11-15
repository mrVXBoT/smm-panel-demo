import { describe, it, expect, beforeEach } from 'vitest';
import { orderRepository } from './orderRepository';
import { walletRepository } from './walletRepository';
import { resetDemoSystem } from './reset';
import { INITIAL_DEMO_CUSTOMER } from '../fixtures/demoUser';
import { useAppStore } from '../../app/store';

describe('Architecture & Persistence Integration Gates', () => {
  const userId = INITIAL_DEMO_CUSTOMER.id;

  beforeEach(async () => {
    await resetDemoSystem();
  });

  it('preserves initial seed balance of exactly $87.00 (8,700 cents) derived from ledger', async () => {
    const wallet = await walletRepository.getWallet(userId);
    expect(wallet.balanceCents).toBe(8700);

    const ledger = await walletRepository.getLedgerEntries(userId);
    const sum = ledger.reduce((acc, entry) => acc + entry.amountCents, 0);
    expect(sum).toBe(8700);
  });

  it('guarantees atomic order creation and wallet debit in a single IndexedDB transaction', async () => {
    const initialOrders = await orderRepository.getByUserId(userId);
    const initialBalance = await walletRepository.getBalanceCents(userId);

    const newOrder = await orderRepository.placeOrder({
      userId,
      serviceId: 'srv_tg_subscribers_hq',
      serviceName: 'Telegram Subscribers HQ',
      target: '@growth_channel_test',
      quantity: 1000,
      chargeCents: 140,
    });

    expect(newOrder.id).toBeDefined();
    expect(newOrder.chargeCents).toBe(140);
    expect(newOrder.status).toBe('pending');
    expect(newOrder.id).toMatch(/^ORD-[0-9a-f-]{36}$/);

    // Verify order table has new row
    const ordersAfter = await orderRepository.getByUserId(userId);
    expect(ordersAfter.length).toBe(initialOrders.length + 1);
    expect(ordersAfter[0]?.id).toBe(newOrder.id);

    // Verify ledger has matching debit entry with collision-resistant UUID
    const ledger = await walletRepository.getLedgerEntries(userId);
    const debitEntry = ledger.find((e) => e.orderId === newOrder.id);
    expect(debitEntry).toBeDefined();
    expect(debitEntry?.amountCents).toBe(-140);
    expect(debitEntry?.kind).toBe('order_charge');
    expect(debitEntry?.id).toMatch(/^TXN-[0-9a-f-]{36}$/);

    // Verify derived balance reduced by exactly 140 cents
    const newBalance = await walletRepository.getBalanceCents(userId);
    expect(newBalance).toBe(initialBalance - 140);
  });

  it('atomically rejects orders with insufficient balance without creating phantom records', async () => {
    const currentBalance = await walletRepository.getBalanceCents(userId);
    const initialOrders = await orderRepository.getByUserId(userId);
    const initialLedger = await walletRepository.getLedgerEntries(userId);

    await expect(
      orderRepository.placeOrder({
        userId,
        serviceId: 'srv_tg_subscribers_hq',
        serviceName: 'Mass Campaign',
        target: '@channel_excess',
        quantity: 50000,
        chargeCents: 15000, // $150.00 > $87.00
      }),
    ).rejects.toThrow(/Insufficient balance/i);

    // Ensure zero records were added and balance is untouched
    const balanceAfter = await walletRepository.getBalanceCents(userId);
    expect(balanceAfter).toBe(currentBalance);

    const ordersAfter = await orderRepository.getByUserId(userId);
    expect(ordersAfter.length).toBe(initialOrders.length);

    const ledgerAfter = await walletRepository.getLedgerEntries(userId);
    expect(ledgerAfter.length).toBe(initialLedger.length);
  });

  describe('Repository-Level Input Validation Enforcement', () => {
    it('rejects order placement with non-existent user account', async () => {
      await expect(
        orderRepository.placeOrder({
          userId: 'usr_ghost_unknown',
          serviceId: 'srv_tg_subscribers_hq',
          target: '@channel_test',
          quantity: 1000,
          chargeCents: 140,
        }),
      ).rejects.toThrow(/User not found/i);
    });

    it('rejects order placement with non-existent service ID', async () => {
      await expect(
        orderRepository.placeOrder({
          userId,
          serviceId: 'srv_nonexistent_service_xyz',
          target: '@channel_test',
          quantity: 1000,
          chargeCents: 140,
        }),
      ).rejects.toThrow(/Service not found/i);
    });

    it('rejects order placement with invalid non-integer or zero quantities', async () => {
      await expect(
        orderRepository.placeOrder({
          userId,
          serviceId: 'srv_tg_subscribers_hq',
          target: '@channel_test',
          quantity: 0,
          chargeCents: 140,
        }),
      ).rejects.toThrow(/Invalid quantity/i);

      await expect(
        orderRepository.placeOrder({
          userId,
          serviceId: 'srv_tg_subscribers_hq',
          target: '@channel_test',
          quantity: 15.5,
          chargeCents: 140,
        }),
      ).rejects.toThrow(/Invalid quantity/i);
    });

    it('rejects order placement with invalid non-integer or non-positive charge amount', async () => {
      await expect(
        orderRepository.placeOrder({
          userId,
          serviceId: 'srv_tg_subscribers_hq',
          target: '@channel_test',
          quantity: 1000,
          chargeCents: -50,
        }),
      ).rejects.toThrow(/Invalid charge amount/i);

      await expect(
        orderRepository.placeOrder({
          userId,
          serviceId: 'srv_tg_subscribers_hq',
          target: '@channel_test',
          quantity: 1000,
          chargeCents: 140.25,
        }),
      ).rejects.toThrow(/Invalid charge amount/i);
    });

    it('rejects order placement with empty or whitespace-only target link', async () => {
      await expect(
        orderRepository.placeOrder({
          userId,
          serviceId: 'srv_tg_subscribers_hq',
          target: '   ',
          quantity: 1000,
          chargeCents: 140,
        }),
      ).rejects.toThrow(/Invalid target/i);
    });
  });

  /**
   * Scope Documentation:
   * This unit/integration test verifies in-process repository query persistence:
   * 1. Confirms that financial records written to Dexie persist across subsequent independent repository reads.
   * 2. Confirms that localStorage remains strictly confined to UI session state without financial leakage.
   * Note: Full multi-tab browser context restarts are covered in end-to-end browser workflows.
   */
  it('verifies in-process repository query persistence across operations without leaking financial state to localStorage', async () => {
    // 1. Place an order
    await orderRepository.placeOrder({
      userId,
      serviceId: 'srv_tg_views_instant',
      serviceName: 'Telegram Post Views',
      target: 'https://t.me/test/100',
      quantity: 5000,
      chargeCents: 75,
    });

    // 2. Inspect localStorage to ensure orders/ledger are NOT stored there
    const storageItem = localStorage.getItem('smm_panel_demo_session_v2');
    if (storageItem) {
      const parsed = JSON.parse(storageItem);
      expect(parsed.state.orders).toBeUndefined();
      expect(parsed.state.ledgerEntries).toBeUndefined();
    }

    // 3. Verify independent subsequent query from Dexie reflects correct balance and orders
    const reloadedWallet = await walletRepository.getWallet(userId);
    expect(reloadedWallet.balanceCents).toBe(8700 - 75);

    const reloadedOrders = await orderRepository.getByUserId(userId);
    expect(reloadedOrders.some((o) => o.chargeCents === 75)).toBe(true);
  });

  it('resets demo data cleanly: reseeds database back to $87.00 and resets session state', async () => {
    // Mutate state with an order and admin role switch
    await orderRepository.placeOrder({
      userId,
      serviceId: 'srv_tg_subscribers_hq',
      serviceName: 'Telegram HQ',
      target: '@channel_demo',
      quantity: 2000,
      chargeCents: 280,
    });
    useAppStore.getState().switchRole('admin');
    expect(useAppStore.getState().currentUser.role).toBe('admin');

    // Execute full reset
    await resetDemoSystem();

    // Verify Dexie is reseeded with $87.00 customer balance
    const wallet = await walletRepository.getWallet(userId);
    expect(wallet.balanceCents).toBe(8700);

    // Verify initial orders count is 2
    const orders = await orderRepository.getByUserId(userId);
    expect(orders.length).toBe(2);

    // Verify Zustand session returned to customer
    expect(useAppStore.getState().currentUser.role).toBe('customer');
  });

  it('ensures cross-page data consistency: customer wallet, ledger, and orders agree on all figures', async () => {
    const wallet = await walletRepository.getWallet(userId);
    const ledger = await walletRepository.getLedgerEntries(userId);
    const orders = await orderRepository.getByUserId(userId);

    // Ledger sum strictly matches wallet balance
    const ledgerSum = ledger.reduce((sum, e) => sum + e.amountCents, 0);
    expect(ledgerSum).toBe(wallet.balanceCents);

    // Every order_charge entry corresponds to an existing order
    const chargeEntries = ledger.filter((e) => e.kind === 'order_charge');
    for (const entry of chargeEntries) {
      if (entry.orderId) {
        const matchingOrder = orders.find((o) => o.id === entry.orderId);
        expect(matchingOrder).toBeDefined();
        expect(Math.abs(entry.amountCents)).toBe(matchingOrder?.chargeCents);
      }
    }
  });
});
