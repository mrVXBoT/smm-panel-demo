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
   * 1. Validates user existence, service catalog existence, positive integer quantity, and positive integer chargeCents.
   * 2. Reads ledger entries for wallet to derive active balance.
   * 3. Checks that balance is sufficient.
   * 4. Generates collision-resistant identifiers via crypto.randomUUID().
   * 5. Inserts order with 'pending' status.
   * 6. Inserts ledger debit entry (negative amount).
   * 7. Updates wallet balance.
   * All executed in a single atomic Dexie transaction.
   */
  async placeOrder(params: PlaceOrderParams): Promise<Order> {
    return await db.transaction(
      'rw',
      [db.orders, db.ledgerEntries, db.wallets, db.users, db.services],
      async () => {
        // 1. Repository-level input validations
        if (
          !params.userId ||
          typeof params.userId !== 'string' ||
          params.userId.trim().length === 0
        ) {
          throw new Error('Invalid user ID: user ID is required.');
        }
        const user = await db.users.get(params.userId);
        if (!user) {
          throw new Error(`User not found: account "${params.userId}" does not exist.`);
        }

        if (
          !params.serviceId ||
          typeof params.serviceId !== 'string' ||
          params.serviceId.trim().length === 0
        ) {
          throw new Error('Invalid service ID: service ID is required.');
        }
        const service = await db.services.get(params.serviceId);
        if (!service) {
          throw new Error(`Service not found: catalog item "${params.serviceId}" does not exist.`);
        }

        if (!Number.isInteger(params.quantity) || params.quantity <= 0) {
          throw new Error('Invalid quantity: quantity must be a positive integer.');
        }
        if (service.minQty && params.quantity < service.minQty) {
          throw new Error(
            `Quantity below minimum requirement: must be at least ${service.minQty}.`,
          );
        }
        if (service.maxQty && params.quantity > service.maxQty) {
          throw new Error(`Quantity exceeds maximum allowance: cannot exceed ${service.maxQty}.`);
        }

        if (!Number.isInteger(params.chargeCents) || params.chargeCents <= 0) {
          throw new Error('Invalid charge amount: charge must be a positive integer in cents.');
        }

        if (
          !params.target ||
          typeof params.target !== 'string' ||
          params.target.trim().length === 0
        ) {
          throw new Error('Invalid target: order destination link or handle cannot be empty.');
        }

        const walletId = `wal_${params.userId}`;

        // 2. Calculate current balance directly from ledger entries to guarantee integrity
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
        // Collision-resistant UUID-based identifier
        const orderId = `ORD-${crypto.randomUUID()}`;

        const newOrder: Order = {
          id: orderId,
          userId: params.userId,
          serviceId: params.serviceId,
          target: params.target.trim(),
          quantity: params.quantity,
          chargeCents: params.chargeCents,
          status: 'pending',
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        await db.orders.add(newOrder);

        // Collision-resistant UUID-based transaction identifier
        const newLedgerEntry: LedgerEntry = {
          id: `TXN-${crypto.randomUUID()}`,
          walletId,
          orderId,
          amountCents: -params.chargeCents,
          kind: 'order_charge',
          createdAt: timestamp,
          description: `Order #${orderId.substring(0, 12)} (${params.serviceName || service.name})`,
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
      },
    );
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
