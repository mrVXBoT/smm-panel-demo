import type { Order, LedgerEntry } from '../types/models';
import { INITIAL_DEMO_CUSTOMER, INITIAL_DEMO_ADMIN } from './demoUser';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    userId: INITIAL_DEMO_CUSTOMER.id,
    serviceId: 'srv_tg_subscribers_hq',
    target: '@growth_channel_demo',
    quantity: 1000,
    chargeCents: 140,
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
  },
  {
    id: 'ORD-8922',
    userId: INITIAL_DEMO_CUSTOMER.id,
    serviceId: 'srv_tg_views_instant',
    target: 'https://t.me/growth_channel_demo/42',
    quantity: 5000,
    chargeCents: 75,
    status: 'processing',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

/**
 * Initial Ledger accounting entries:
 * 8,915 cents top-up - 140 cents order - 75 cents order = exactly 8,700 cents ($87.00 USD).
 */
export const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'TXN-401',
    walletId: `wal_${INITIAL_DEMO_CUSTOMER.id}`,
    amountCents: 8915, // Net derived balance: 8915 - 140 - 75 = 8700 ($87.00)
    kind: 'top_up',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    description: 'Initial Demo Balance Seed',
  },
  {
    id: 'TXN-402',
    walletId: `wal_${INITIAL_DEMO_CUSTOMER.id}`,
    orderId: 'ORD-8921',
    amountCents: -140,
    kind: 'order_charge',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: 'Order #ORD-8921 (Telegram Subscribers)',
  },
  {
    id: 'TXN-403',
    walletId: `wal_${INITIAL_DEMO_CUSTOMER.id}`,
    orderId: 'ORD-8922',
    amountCents: -75,
    kind: 'order_charge',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    description: 'Order #ORD-8922 (Telegram Post Views)',
  },
  {
    id: 'TXN-901',
    walletId: `wal_${INITIAL_DEMO_ADMIN.id}`,
    amountCents: 250000, // $2,500.00
    kind: 'top_up',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    description: 'Initial Admin Operations Float',
  },
];
