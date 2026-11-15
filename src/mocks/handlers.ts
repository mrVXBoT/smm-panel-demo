import { http, HttpResponse, delay } from 'msw';
import { INITIAL_SERVICES } from '../core/fixtures/services';
import { INITIAL_CATEGORIES } from '../core/fixtures/categories';
import {
  INITIAL_DEMO_CUSTOMER,
  INITIAL_DEMO_ADMIN,
  DEMO_CREDENTIALS,
} from '../core/fixtures/demoUser';
import { useAppStore } from '../app/store';
import { orderRepository } from '../core/db/orderRepository';
import { walletRepository } from '../core/db/walletRepository';
import { orderService } from '../features/orders/services/orderService';

export const handlers = [
  // Categories
  http.get('*/api/categories', async () => {
    await delay(120);
    return HttpResponse.json(INITIAL_CATEGORIES);
  }),

  // Services Catalog
  http.get('*/api/services', async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');

    if (categoryId) {
      return HttpResponse.json(INITIAL_SERVICES.filter((s) => s.categoryId === categoryId));
    }
    return HttpResponse.json(INITIAL_SERVICES);
  }),

  http.get('*/api/services/:id', async ({ params }) => {
    await delay(100);
    const service = INITIAL_SERVICES.find((s) => s.id === params.id);
    if (!service) {
      return new HttpResponse(null, { status: 404, statusText: 'Service Not Found' });
    }
    return HttpResponse.json(service);
  }),

  // Orders - backed by Dexie database
  http.get('*/api/orders', async () => {
    await delay(150);
    const orders = await orderRepository.getAll();
    return HttpResponse.json(orders);
  }),

  http.post('*/api/orders', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as {
      serviceId: string;
      target: string;
      quantity: number;
    };

    const store = useAppStore.getState();

    try {
      const order = await orderService.createOrder({
        userId: store.currentUser.id,
        serviceId: body.serviceId,
        target: body.target,
        quantity: body.quantity,
      });

      return HttpResponse.json(order, { status: 201 });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Order creation failed';
      return HttpResponse.json({ error: message }, { status: 422 });
    }
  }),

  // Wallet - backed by Dexie ledger
  http.get('*/api/wallet', async () => {
    await delay(100);
    const store = useAppStore.getState();
    const wallet = await walletRepository.getWallet(store.currentUser.id);
    const ledgerEntries = await walletRepository.getLedgerEntries(store.currentUser.id);

    return HttpResponse.json({
      userId: store.currentUser.id,
      currency: 'USD',
      balanceCents: wallet.balanceCents,
      ledgerEntries,
    });
  }),

  // Auth Login Simulation
  http.post('*/api/auth/login', async ({ request }) => {
    await delay(200);
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (
      username === DEMO_CREDENTIALS.customer.username &&
      password === DEMO_CREDENTIALS.customer.password
    ) {
      return HttpResponse.json({
        user: INITIAL_DEMO_CUSTOMER,
        token: 'smm_demo_token_customer',
      });
    }

    if (
      username === DEMO_CREDENTIALS.admin.username &&
      password === DEMO_CREDENTIALS.admin.password
    ) {
      return HttpResponse.json({
        user: INITIAL_DEMO_ADMIN,
        token: 'smm_demo_token_admin',
      });
    }

    return HttpResponse.json({ error: 'Invalid demo credentials' }, { status: 401 });
  }),
];
