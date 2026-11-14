import { db } from './database';
import type { Order, OrderStatus } from '../types/models';

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
