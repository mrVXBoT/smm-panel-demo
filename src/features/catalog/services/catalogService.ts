import type { Service, ServiceCategory } from '../../../core/types/models';
import type { ICatalogService } from '../../../core/types/services';
import { INITIAL_CATEGORIES } from '../../../core/fixtures/categories';
import { INITIAL_SERVICES } from '../../../core/fixtures/services';

export class MockCatalogService implements ICatalogService {
  private categories: ServiceCategory[] = [...INITIAL_CATEGORIES];
  private services: Service[] = [...INITIAL_SERVICES];

  async getCategories(): Promise<ServiceCategory[]> {
    return [...this.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getServices(categoryId?: string): Promise<Service[]> {
    if (!categoryId) return [...this.services];
    return this.services.filter((s) => s.categoryId === categoryId);
  }

  async getServiceById(id: string): Promise<Service | null> {
    return this.services.find((s) => s.id === id) ?? null;
  }
}

export const catalogService = new MockCatalogService();
