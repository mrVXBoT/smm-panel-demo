import { db } from './database';
import type { Order, OrderStatus, LedgerEntry } from '../types/models';

export interface PlaceOrderParams {
  userId: string;
  serviceId: string;
  target: string;
  quantity: number;
  chargeCents: number;
  serviceName?: string;
}

export const orderRepository = {
  async getAll(): Promise<Order[]> {
    return db.orders.reverse().sortBy('createdAt');
  },

  async getByUserId(userId: string): Promise<Order[]> {
    return db.orders.where('userId').equals(userId).reverse().sortBy('createdAt');
  },

  async getById(id: string): Promise<Order | undefined> {
    return db.orders.get(id);
  },

  async create(order: Order): Promise<Order> {
    await db.orders.add(order);
    return order;
  },

  /**
   * Atomic Order Creation & Wallet Debit:
   * 1. Reads ledger entries for wallet to derive active balance.
   * 2. Checks that balance is sufficient.
   * 3. Inserts order with 'pending' status.
   * 4. Inserts ledger debit entry (negative amount).
   * 5. Updates wallet balance.
   * All executed in a single atomic Dexie transaction.
   */
  async placeOrder(params: PlaceOrderParams): Promise<Order> {
    return await db.transaction('rw', [db.orders, db.ledgerEntries, db.wallets], async () => {
      const walletId = `wal_${params.userId}`;

      // Calculate current balance directly from ledger entries to guarantee integrity
      const ledgerEntries = await db.ledgerEntries.where('walletId').equals(walletId).toArray();
      const currentBalance = ledgerEntries.reduce((sum, entry) => sum + entry.amountCents, 0);

      if (currentBalance < params.chargeCents) {
        throw new Error(
          `Insufficient balance. Available: $${(currentBalance / 100).toFixed(2)}, Required: $${(
            params.chargeCents / 100
          ).toFixed(2)}.`,
        );
      }

      const timestamp = new Date().toISOString();
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder: Order = {
        id: orderId,
        userId: params.userId,
        serviceId: params.serviceId,
        target: params.target,
        quantity: params.quantity,
        chargeCents: params.chargeCents,
        status: 'pending',
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await db.orders.add(newOrder);

      const newLedgerEntry: LedgerEntry = {
        id: `TXN-${Math.floor(500 + Math.random() * 500)}`,
        walletId,
        orderId,
        amountCents: -params.chargeCents,
        kind: 'order_charge',
        createdAt: timestamp,
        description: `Order #${orderId} (${params.serviceName || params.serviceId})`,
      };

      await db.ledgerEntries.add(newLedgerEntry);

      // Update cached wallet balance
      const newBalance = currentBalance - params.chargeCents;
      const existingWallet = await db.wallets.get(walletId);
      if (existingWallet) {
        existingWallet.balanceCents = newBalance;
        await db.wallets.put(existingWallet);
      } else {
        await db.wallets.add({
          id: walletId,
          userId: params.userId,
          currency: 'USD',
          balanceCents: newBalance,
        });
      }

      return newOrder;
    });
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await db.orders.get(id);
    if (!order) {
      throw new Error(`Order #${id} not found`);
    }
    const updated: Order = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
    };
    await db.orders.put(updated);
    return updated;
  },
};
