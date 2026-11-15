import Dexie, { type EntityTable } from 'dexie';
import type { DemoUser, Order, LedgerEntry, Wallet, Service, Ticket } from '../types/models';

export interface SmmDatabase extends Dexie {
  tickets: EntityTable<Ticket, 'id'>;
  users: EntityTable<DemoUser, 'id'>;
  orders: EntityTable<Order, 'id'>;
  ledgerEntries: EntityTable<LedgerEntry, 'id'>;
  wallets: EntityTable<Wallet, 'id'>;
  services: EntityTable<Service, 'id'>;
}

export const db = new Dexie('SmmPanelDatabase') as SmmDatabase;

db.version(1).stores({
  users: 'id, username, role',
  orders: 'id, userId, serviceId, status, createdAt',
  ledgerEntries: 'id, walletId, orderId, paymentId, kind, createdAt',
  wallets: 'id, userId',
  services: 'id, categoryId, platform, status',
});

// Add local-only support threads without changing existing wallet/order tables.
db.version(2).stores({ tickets: 'id, userId, status, updatedAt' });
