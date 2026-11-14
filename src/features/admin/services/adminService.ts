import type { DemoUser, Order, Service } from '../../../core/types/models';
import type { IAdminService } from '../../../core/types/services';
import { INITIAL_DEMO_CUSTOMER, INITIAL_DEMO_ADMIN } from '../../../core/fixtures/demoUser';
import { catalogService } from '../../catalog/services/catalogService';
import { orderService } from '../../orders/services/orderService';

export class MockAdminService implements IAdminService {
  async getStats(): Promise<{
    totalOrders: number;
    totalRevenueCents: number;
    activeUsersCount: number;
    activeServicesCount: number;
  }> {
    const orders = await orderService.getOrders();
    const services = await catalogService.getServices();
    const totalRevenueCents = orders.reduce((sum, o) => sum + o.chargeCents, 0);

    return {
      totalOrders: orders.length,
      totalRevenueCents,
      activeUsersCount: 2,
      activeServicesCount: services.filter((s) => s.status === 'active').length,
    };
  }

  async getAllOrders(): Promise<Order[]> {
    return orderService.getOrders();
  }

  async getAllUsers(): Promise<DemoUser[]> {
    return [INITIAL_DEMO_CUSTOMER, INITIAL_DEMO_ADMIN];
  }

  async toggleServiceStatus(serviceId: string, status: Service['status']): Promise<Service> {
    const service = await catalogService.getServiceById(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }
    service.status = status;
    return service;
  }
}

export const adminService = new MockAdminService();
