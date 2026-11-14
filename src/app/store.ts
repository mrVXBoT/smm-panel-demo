import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  DemoUser,
  UserRole,
  Order,
  LedgerEntry,
  PaymentAttempt,
  PaymentMethod,
} from '../core/types/models';
import { INITIAL_DEMO_CUSTOMER, INITIAL_DEMO_ADMIN } from '../core/fixtures/demoUser';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
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
    id: 'ORD-8922',
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

export const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: 'TXN-401',
    walletId: 'wal_usr_demo_customer_01',
    amountCents: 8915, // 8915 - 140 - 75 = 8700 net balance ($87.00)
    kind: 'top_up',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    description: 'Initial Demo Balance Seed',
  },
  {
    id: 'TXN-402',
    walletId: 'wal_usr_demo_customer_01',
    orderId: 'ORD-8921',
    amountCents: -140,
    kind: 'order_charge',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: 'Order #ORD-8921 (Telegram Subscribers)',
  },
  {
    id: 'TXN-403',
    walletId: 'wal_usr_demo_customer_01',
    orderId: 'ORD-8922',
    amountCents: -75,
    kind: 'order_charge',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    description: 'Order #ORD-8922 (Telegram Post Views)',
  },
];

export interface AddOrderParams {
  serviceId: string;
  target: string;
  quantity: number;
  chargeCents: number;
  serviceName?: string;
}

export interface AppState {
  // Theme state
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Session & Demo User
  currentUser: DemoUser;
  isAuthenticated: boolean;
  setCurrentUser: (user: DemoUser) => void;
  switchRole: (role: UserRole) => void;
  loginAsDemo: (role?: UserRole) => void;
  logout: () => void;

  // Persisted Orders & Ledger
  orders: Order[];
  ledgerEntries: LedgerEntry[];
  addOrder: (params: AddOrderParams) => { success: boolean; error?: string; order?: Order };
  advanceOrderStatus: (orderId: string) => void;
  addTopUp: (
    amountCents: number,
    method: PaymentMethod,
  ) => {
    payment: PaymentAttempt;
    ledgerEntry: LedgerEntry;
  };

  // UI state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Reset to default seed
  resetDemoData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (typeof document !== 'undefined') {
            const root = document.documentElement;
            root.classList.remove('dark', 'light');
            root.classList.add(nextTheme);
          }
          return { theme: nextTheme };
        }),
      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          root.classList.remove('dark', 'light');
          root.classList.add(theme);
        }
        set({ theme });
      },

      currentUser: { ...INITIAL_DEMO_CUSTOMER },
      isAuthenticated: true,

      setCurrentUser: (user) => set({ currentUser: user }),

      switchRole: (role) =>
        set(() => {
          const targetUser = role === 'admin' ? INITIAL_DEMO_ADMIN : INITIAL_DEMO_CUSTOMER;
          return { currentUser: { ...targetUser }, isAuthenticated: true };
        }),

      loginAsDemo: (role = 'customer') =>
        set(() => ({
          currentUser: role === 'admin' ? { ...INITIAL_DEMO_ADMIN } : { ...INITIAL_DEMO_CUSTOMER },
          isAuthenticated: true,
        })),

      logout: () =>
        set(() => ({
          isAuthenticated: false,
        })),

      orders: [...INITIAL_ORDERS],
      ledgerEntries: [...INITIAL_LEDGER],

      addOrder: (params) => {
        const state = get();
        if (state.currentUser.balanceCents < params.chargeCents) {
          return {
            success: false,
            error: `Insufficient balance. Available: $${(
              state.currentUser.balanceCents / 100
            ).toFixed(2)}, Required: $${(params.chargeCents / 100).toFixed(2)}.`,
          };
        }

        const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const timestamp = new Date().toISOString();

        const newOrder: Order = {
          id: newOrderId,
          userId: state.currentUser.id,
          serviceId: params.serviceId,
          target: params.target,
          quantity: params.quantity,
          chargeCents: params.chargeCents,
          status: 'pending',
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        const newLedgerEntry: LedgerEntry = {
          id: `TXN-${Math.floor(500 + Math.random() * 500)}`,
          walletId: `wal_${state.currentUser.id}`,
          orderId: newOrderId,
          amountCents: -params.chargeCents,
          kind: 'order_charge',
          createdAt: timestamp,
          description: `Order #${newOrderId} (${params.serviceName || params.serviceId})`,
        };

        set({
          currentUser: {
            ...state.currentUser,
            balanceCents: state.currentUser.balanceCents - params.chargeCents,
          },
          orders: [newOrder, ...state.orders],
          ledgerEntries: [newLedgerEntry, ...state.ledgerEntries],
        });

        return { success: true, order: newOrder };
      },

      advanceOrderStatus: (orderId) =>
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== orderId) return o;
            const nextStatus =
              o.status === 'pending'
                ? 'processing'
                : o.status === 'processing'
                  ? 'completed'
                  : o.status === 'completed'
                    ? 'refunded'
                    : 'pending';
            return { ...o, status: nextStatus, updatedAt: new Date().toISOString() };
          }),
        })),

      addTopUp: (amountCents, method) => {
        const state = get();
        const paymentId = `PAY-${Math.floor(8000 + Math.random() * 1000)}`;
        const txnId = `TXN-${Math.floor(600 + Math.random() * 400)}`;
        const timestamp = new Date().toISOString();

        const payment: PaymentAttempt = {
          id: paymentId,
          userId: state.currentUser.id,
          amountCents,
          method,
          state: 'completed',
          idempotencyKey: `idem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          createdAt: timestamp,
        };

        const ledgerEntry: LedgerEntry = {
          id: txnId,
          walletId: `wal_${state.currentUser.id}`,
          paymentId,
          amountCents,
          kind: 'top_up',
          createdAt: timestamp,
          description: `Simulated ${method === 'visa_demo' ? 'Visa' : 'Mastercard'} Top-up`,
        };

        set({
          currentUser: {
            ...state.currentUser,
            balanceCents: state.currentUser.balanceCents + amountCents,
          },
          ledgerEntries: [ledgerEntry, ...state.ledgerEntries],
        });

        return { payment, ledgerEntry };
      },

      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      resetDemoData: () =>
        set(() => ({
          currentUser: { ...INITIAL_DEMO_CUSTOMER },
          orders: [...INITIAL_ORDERS],
          ledgerEntries: [...INITIAL_LEDGER],
          isAuthenticated: true,
        })),
    }),
    {
      name: 'smm_panel_demo_store_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        orders: state.orders,
        ledgerEntries: state.ledgerEntries,
      }),
    },
  ),
);
