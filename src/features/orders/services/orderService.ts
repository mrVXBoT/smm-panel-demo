import type { Order, OrderStatus } from '../../../core/types/models';
import type { IOrderService, CreateOrderParams } from '../../../core/types/services';
import { catalogService } from '../../catalog/services/catalogService';
import { orderRepository } from '../../../core/db/orderRepository';

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

    // Atomic order creation & balance check in Dexie
    return await orderRepository.placeOrder({
      userId: params.userId,
      serviceId: params.serviceId,
      serviceName: service.name,
      target: params.target,
      quantity: params.quantity,
      chargeCents,
    });
  }

  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return orderRepository.getByUserId(userId);
    }
    return orderRepository.getAll();
  }

  async getOrderById(id: string): Promise<Order | null> {
    const order = await orderRepository.getById(id);
    return order ?? null;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    return orderRepository.updateStatus(orderId, status);
  }
}

export const orderService = new MockOrderService();
