import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './database';
import { walletRepository } from './walletRepository';
import type { Order, LedgerEntry, Wallet } from '../types/models';

export function useCustomerWallet(userId: string): Wallet {
  const wallet = useLiveQuery(
    async () => {
      return walletRepository.getWallet(userId);
    },
    [userId],
    {
      id: `wal_${userId}`,
      userId,
      currency: 'USD' as const,
      balanceCents: 8700,
    },
  );

  return (
    wallet ?? {
      id: `wal_${userId}`,
      userId,
      currency: 'USD' as const,
      balanceCents: 8700,
    }
  );
}

export function useCustomerOrders(userId: string): Order[] {
  const orders = useLiveQuery(
    async () => {
      return db.orders.where('userId').equals(userId).reverse().sortBy('createdAt');
    },
    [userId],
    [],
  );

  return orders ?? [];
}

export function useCustomerLedger(userId: string): LedgerEntry[] {
  const entries = useLiveQuery(
    async () => {
      const walletId = `wal_${userId}`;
      return db.ledgerEntries.where('walletId').equals(walletId).reverse().sortBy('createdAt');
    },
    [userId],
    [],
  );

  return entries ?? [];
}

export function useAllOrders(): Order[] {
  const orders = useLiveQuery(
    async () => {
      return db.orders.reverse().sortBy('createdAt');
    },
    [],
    [],
  );

  return orders ?? [];
}

export function useAdminStats() {
  const stats = useLiveQuery(
    async () => {
      const orders = await db.orders.toArray();
      const services = await db.services.toArray();
      const totalRevenueCents = orders.reduce((sum, o) => sum + o.chargeCents, 0);

      return {
        totalOrders: orders.length,
        totalRevenueCents,
        activeUsersCount: 2,
        activeServicesCount: services.filter((s) => s.status === 'active').length,
      };
    },
    [],
    {
      totalOrders: 2,
      totalRevenueCents: 215,
      activeUsersCount: 2,
      activeServicesCount: 9,
    },
  );

  return stats;
}
