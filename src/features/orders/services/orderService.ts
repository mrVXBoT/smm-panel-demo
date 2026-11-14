import type { Order, OrderStatus } from '../../../core/types/models';
import type { IOrderService, CreateOrderParams } from '../../../core/types/services';
import { catalogService } from '../../catalog/services/catalogService';
import { useAppStore } from '../../../app/store';

export class MockOrderService implements IOrderService {
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

    const store = useAppStore.getState();
    const result = store.addOrder({
      serviceId: params.serviceId,
      serviceName: service.name,
      target: params.target,
      quantity: params.quantity,
      chargeCents,
    });

    if (!result.success || !result.order) {
      throw new Error(result.error || 'Failed to create order');
    }

    return result.order;
  }

  async getOrders(userId?: string): Promise<Order[]> {
    const orders = useAppStore.getState().orders;
    if (!userId) return [...orders];
    return orders.filter((o) => o.userId === userId);
  }

  async getOrderById(id: string): Promise<Order | null> {
    const orders = useAppStore.getState().orders;
    return orders.find((o) => o.id === id) ?? null;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const store = useAppStore.getState();
    store.advanceOrderStatus(orderId);
    const order = store.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    return { ...order, status };
  }
}

export const orderService = new MockOrderService();
