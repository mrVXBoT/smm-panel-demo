import type {
  DemoUser,
  Order,
  OrderStatus,
  PaymentAttempt,
  PaymentMethod,
  Service,
  ServiceCategory,
  LedgerEntry,
  Wallet,
} from './models';

export interface IAuthService {
  getCurrentUser(): Promise<DemoUser | null>;
  loginAsDemo(role: 'customer' | 'admin'): Promise<DemoUser>;
  logout(): Promise<void>;
  switchRole(role: 'customer' | 'admin'): Promise<DemoUser>;
}

export interface ICatalogService {
  getCategories(): Promise<ServiceCategory[]>;
  getServices(categoryId?: string): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | null>;
}

export interface CreateOrderParams {
  userId: string;
  serviceId: string;
  target: string;
  quantity: number;
}

export interface IOrderService {
  createOrder(params: CreateOrderParams): Promise<Order>;
  getOrders(userId?: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
}

export interface SimulatePaymentParams {
  userId: string;
  amountCents: number;
  method: PaymentMethod;
  shouldSucceed?: boolean;
}

export interface IWalletService {
  getWallet(userId: string): Promise<Wallet>;
  getLedger(userId: string): Promise<LedgerEntry[]>;
  simulateTopUp(params: SimulatePaymentParams): Promise<{
    payment: PaymentAttempt;
    wallet: Wallet;
    ledgerEntry?: LedgerEntry;
  }>;
  resetWallet(userId: string): Promise<Wallet>;
}

export interface IAdminService {
  getStats(): Promise<{
    totalOrders: number;
    totalRevenueCents: number;
    activeUsersCount: number;
    activeServicesCount: number;
  }>;
  getAllOrders(): Promise<Order[]>;
  getAllUsers(): Promise<DemoUser[]>;
  toggleServiceStatus(serviceId: string, status: Service['status']): Promise<Service>;
}
