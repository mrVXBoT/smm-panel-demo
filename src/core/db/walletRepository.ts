import { db } from './database';
import type { LedgerEntry, Wallet, PaymentAttempt, PaymentMethod } from '../types/models';

export const walletRepository = {
  async getWallet(userId: string): Promise<Wallet> {
    const walletId = `wal_${userId}`;
    const entries = await db.ledgerEntries.where('walletId').equals(walletId).toArray();
    const balanceCents = entries.reduce((sum, entry) => sum + entry.amountCents, 0);

    return {
      id: walletId,
      userId,
      currency: 'USD',
      balanceCents,
    };
  },

  async getBalanceCents(userId: string): Promise<number> {
    const wallet = await this.getWallet(userId);
    return wallet.balanceCents;
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

  async simulateTopUp(
    userId: string,
    amountCents: number,
    method: PaymentMethod,
  ): Promise<{ payment: PaymentAttempt; ledgerEntry: LedgerEntry; wallet: Wallet }> {
    return await db.transaction('rw', [db.ledgerEntries, db.wallets], async () => {
      const walletId = `wal_${userId}`;
      const timestamp = new Date().toISOString();
      const paymentId = `PAY-${crypto.randomUUID()}`;
      const txnId = `TXN-${crypto.randomUUID()}`;

      const payment: PaymentAttempt = {
        id: paymentId,
        userId,
        amountCents,
        method,
        state: 'completed',
        idempotencyKey: `idem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: timestamp,
      };

      const ledgerEntry: LedgerEntry = {
        id: txnId,
        walletId,
        paymentId,
        amountCents,
        kind: 'top_up',
        createdAt: timestamp,
        description: `Simulated ${method === 'visa_demo' ? 'Visa' : 'Mastercard'} Top-up`,
      };

      await db.ledgerEntries.add(ledgerEntry);

      const entries = await db.ledgerEntries.where('walletId').equals(walletId).toArray();
      const balanceCents = entries.reduce((sum, e) => sum + e.amountCents, 0);

      const existingWallet = await db.wallets.get(walletId);
      if (existingWallet) {
        existingWallet.balanceCents = balanceCents;
        await db.wallets.put(existingWallet);
      } else {
        await db.wallets.add({
          id: walletId,
          userId,
          currency: 'USD',
          balanceCents,
        });
      }

      const wallet: Wallet = {
        id: walletId,
        userId,
        currency: 'USD',
        balanceCents,
      };

      return { payment, ledgerEntry, wallet };
    });
  },
};
