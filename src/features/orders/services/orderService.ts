import type { Order, OrderStatus } from '../../../core/types/models';
import type { IOrderService, CreateOrderParams } from '../../../core/types/services';
import { catalogService } from '../../catalog/services/catalogService';

export class MockOrderService implements IOrderService {
  private orders: Order[] = [
    {
      id: 'ord_demo_1001',
      userId: 'usr_demo_customer_01',
      serviceId: 'srv_tg_subscribers_hq',
      target: '@growth_channel_demo',
      quantity: 1000,
      chargeCents: 140,
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
    },
    {
      id: 'ord_demo_1002',
      userId: 'usr_demo_customer_01',
      serviceId: 'srv_tg_views_instant',
      target: 'https://t.me/growth_channel_demo/42',
      quantity: 5000,
      chargeCents: 75,
      status: 'processing',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  async createOrder(params: CreateOrderParams): Promise<Order> {
    const service = await catalogService.getServiceById(params.serviceId);
    if (!service) {
      throw new Error(`Service with ID ${params.serviceId} not found`);
    }

    let chargeCents = 0;
    if (service.fixedPriceCents) {
      chargeCents = service.fixedPriceCents * params.quantity;
    } else if (service.pricePerThousandCents) {
      chargeCents = Math.round((service.pricePerThousandCents * params.quantity) / 1000);
    }

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      userId: params.userId,
      serviceId: params.serviceId,
      target: params.target,
      quantity: params.quantity,
      chargeCents,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  async getOrders(userId?: string): Promise<Order[]> {
    if (!userId) return [...this.orders];
    return this.orders.filter((o) => o.userId === userId);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders.find((o) => o.id === id) ?? null;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return { ...order };
  }
}

export const orderService = new MockOrderService();
