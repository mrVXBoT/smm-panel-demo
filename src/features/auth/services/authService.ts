import type { DemoUser, UserRole } from '../../../core/types/models';
import type { IAuthService } from '../../../core/types/services';
import { INITIAL_DEMO_CUSTOMER, INITIAL_DEMO_ADMIN } from '../../../core/fixtures/demoUser';

export class MockAuthService implements IAuthService {
  private currentUser: DemoUser | null = INITIAL_DEMO_CUSTOMER;

  async getCurrentUser(): Promise<DemoUser | null> {
    return this.currentUser;
  }

  async loginAsDemo(role: UserRole): Promise<DemoUser> {
    this.currentUser = role === 'admin' ? INITIAL_DEMO_ADMIN : INITIAL_DEMO_CUSTOMER;
    return this.currentUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }

  async switchRole(role: UserRole): Promise<DemoUser> {
    this.currentUser = role === 'admin' ? INITIAL_DEMO_ADMIN : INITIAL_DEMO_CUSTOMER;
    return this.currentUser;
  }
}

export const authService = new MockAuthService();
