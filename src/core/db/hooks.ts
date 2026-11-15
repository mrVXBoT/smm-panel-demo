import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './database';
import { walletRepository } from './walletRepository';
import type { Order, LedgerEntry, Wallet } from '../types/models';

export interface CustomerWalletState {
  id: string;
  userId: string;
  currency: 'USD';
  balanceCents: number;
  isLoading: boolean;
  wallet: Wallet | null;
  error: Error | null;
}

export function useCustomerWallet(userId: string): CustomerWalletState {
  const queryResult = useLiveQuery(async () => {
    return walletRepository.getWallet(userId);
  }, [userId]);

  const isLoading = queryResult === undefined;
  const wallet = queryResult ?? null;

  return {
    id: `wal_${userId}`,
    userId,
    currency: 'USD',
    // Never present a fabricated balance: returns genuine ledger-derived balance when resolved, or 0 while loading
    balanceCents: wallet ? wallet.balanceCents : 0,
    isLoading,
    wallet,
    error: null,
  };
}

/** Read-only dashboard query with explicit loading and error states. */
export function useDashboardOrders(userId: string) {
  const result = useLiveQuery(async () => {
    try {
      const orders = await db.orders.where('userId').equals(userId).reverse().sortBy('createdAt');
      return { orders, error: null };
    } catch {
      return {
        orders: [] as Order[],
        error: 'Could not load your orders. Reload the page to try again.',
      };
    }
  }, [userId]);
  return {
    orders: result?.orders ?? [],
    error: result?.error ?? null,
    isLoading: result === undefined,
  };
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
