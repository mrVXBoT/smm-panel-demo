import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../core/db/database';
import { walletRepository } from '../../core/db/walletRepository';
import type { LedgerEntry, Ticket } from '../../core/types/models';
export function useAccountLedger(userId: string) {
  const result = useLiveQuery(async () => {
    try {
      return { data: await walletRepository.getLedgerEntries(userId), error: null };
    } catch {
      return {
        data: [] as LedgerEntry[],
        error: 'Could not load your ledger. Reload to try again.',
      };
    }
  }, [userId]);
  return { entries: result?.data ?? [], isLoading: !result, error: result?.error };
}
export function useSupportThreads(userId: string) {
  const result = useLiveQuery(async () => {
    try {
      return {
        data: await db.tickets.where('userId').equals(userId).reverse().sortBy('updatedAt'),
        error: null,
      };
    } catch {
      return { data: [] as Ticket[], error: 'Could not load your threads. Reload to try again.' };
    }
  }, [userId]);
  return { tickets: result?.data ?? [], isLoading: !result, error: result?.error };
}
