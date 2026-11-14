export type UserRole = 'customer' | 'admin';

export interface DemoUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
  balanceCents: number; // 8700 = $87.00
  avatarUrl?: string;
}

export type ServicePlatform =
  | 'telegram'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'virtual_numbers'
  | 'telegram_stars'
  | 'telegram_premium';

export interface ServiceCategory {
  id: string;
  name: string;
  slug: ServicePlatform;
  description: string;
  icon: string;
  displayOrder: number;
  badge?: string;
}

export type ServiceStatus = 'active' | 'maintenance' | 'paused';

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  platform: ServicePlatform;
  pricePerThousandCents?: number;
  fixedPriceCents?: number;
  minQty?: number;
  maxQty?: number;
  status: ServiceStatus;
  estimatedDeliveryLabel: string;
  features?: string[];
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  serviceId: string;
  target: string;
  quantity: number;
  chargeCents: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'visa_demo' | 'mastercard_demo';
export type PaymentState = 'initiated' | 'completed' | 'failed' | 'cancelled';

export interface PaymentAttempt {
  id: string;
  userId: string;
  amountCents: number;
  method: PaymentMethod;
  state: PaymentState;
  idempotencyKey: string;
  createdAt: string;
}

export type LedgerKind = 'top_up' | 'order_charge' | 'refund' | 'adjustment';

export interface LedgerEntry {
  id: string;
  walletId: string;
  orderId?: string;
  paymentId?: string;
  amountCents: number; // signed: +credit, -debit
  kind: LedgerKind;
  createdAt: string;
  description: string;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: 'USD';
  balanceCents: number;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface TicketMessage {
  id: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  status: TicketStatus;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  details: Record<string, unknown>;
  timestamp: string;
}
