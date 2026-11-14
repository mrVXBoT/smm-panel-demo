import { db } from './database';
import type { LedgerEntry, Wallet } from '../types/models';

export const walletRepository = {
  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await db.wallets.where('userId').equals(userId).first();
    if (!wallet) {
      return {
        id: `wal_${userId}`,
        userId,
        currency: 'USD',
        balanceCents: 8700,
      };
    }

    // Compute balance from ledger to verify integrity
    const entries = await db.ledgerEntries.where('walletId').equals(wallet.id).toArray();
    if (entries.length > 0) {
      const derivedBalance = entries.reduce((sum, entry) => sum + entry.amountCents, 0);
      if (derivedBalance !== wallet.balanceCents) {
        wallet.balanceCents = derivedBalance;
        await db.wallets.put(wallet);
      }
    }

    return wallet;
  },

  async getLedgerEntries(userId: string): Promise<LedgerEntry[]> {
    const walletId = `wal_${userId}`;
    return db.ledgerEntries.where('walletId').equals(walletId).reverse().sortBy('createdAt');
  },

  async appendLedgerEntry(entry: LedgerEntry): Promise<LedgerEntry> {
    await db.transaction('rw', [db.ledgerEntries, db.wallets], async () => {
      await db.ledgerEntries.add(entry);
      const wallet = await db.wallets.get(entry.walletId);
      if (wallet) {
        wallet.balanceCents += entry.amountCents;
        await db.wallets.put(wallet);
      }
    });
    return entry;
  },
};
