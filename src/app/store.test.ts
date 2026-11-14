import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './store';
import { INITIAL_DEMO_CUSTOMER } from '../core/fixtures/demoUser';

describe('Global App State (Zustand & Persistence)', () => {
  beforeEach(() => {
    useAppStore.getState().resetDemoData();
  });

  it('starts with initial demo customer having $87.00 (8,700 cents)', () => {
    const state = useAppStore.getState();
    expect(state.currentUser.balanceCents).toBe(8700);
    expect(state.currentUser.role).toBe('customer');
    expect(state.currentUser.displayName).toBe(INITIAL_DEMO_CUSTOMER.displayName);
  });

  it('toggles theme between dark and light', () => {
    const store = useAppStore.getState();
    expect(store.theme).toBe('dark');

    store.toggleTheme();
    expect(useAppStore.getState().theme).toBe('light');

    store.toggleTheme();
    expect(useAppStore.getState().theme).toBe('dark');
  });

  it('switches between customer and admin roles', () => {
    const store = useAppStore.getState();
    store.switchRole('admin');
    expect(useAppStore.getState().currentUser.role).toBe('admin');
    expect(useAppStore.getState().currentUser.username).toBe('admin');

    store.switchRole('customer');
    expect(useAppStore.getState().currentUser.role).toBe('customer');
    expect(useAppStore.getState().currentUser.balanceCents).toBe(8700);
  });

  it('prevents adding order if balance is insufficient', () => {
    const store = useAppStore.getState();
    // Attempt to order exceeding $87.00
    const result = store.addOrder({
      serviceId: 'srv_large_order',
      target: '@channel_large',
      quantity: 100000,
      chargeCents: 15000, // $150.00 > $87.00
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Insufficient balance');
    expect(useAppStore.getState().currentUser.balanceCents).toBe(8700);
  });

  it('successfully creates order, deducts balance, and updates ledger when funds are sufficient', () => {
    const store = useAppStore.getState();
    const result = store.addOrder({
      serviceId: 'srv_tg_subscribers_hq',
      serviceName: 'Telegram Subscribers',
      target: '@channel_valid',
      quantity: 1000,
      chargeCents: 140, // $1.40
    });

    expect(result.success).toBe(true);
    expect(result.order).toBeDefined();
    expect(useAppStore.getState().currentUser.balanceCents).toBe(8700 - 140);
    expect(useAppStore.getState().orders[0]?.id).toBe(result.order?.id);

    const latestLedger = useAppStore.getState().ledgerEntries[0];
    expect(latestLedger?.amountCents).toBe(-140);
    expect(latestLedger?.kind).toBe('order_charge');
  });

  it('adds simulated top-up and credits customer balance', () => {
    const store = useAppStore.getState();
    const { payment, ledgerEntry } = store.addTopUp(2500, 'visa_demo');

    expect(payment.amountCents).toBe(2500);
    expect(ledgerEntry.amountCents).toBe(2500);
    expect(useAppStore.getState().currentUser.balanceCents).toBe(8700 + 2500);
  });

  it('resetDemoData restores $87.00 customer seed', () => {
    const store = useAppStore.getState();
    store.addTopUp(5000, 'mastercard_demo');
    expect(useAppStore.getState().currentUser.balanceCents).toBe(8700 + 5000);

    store.resetDemoData();
    expect(useAppStore.getState().currentUser.balanceCents).toBe(8700);
  });
});
