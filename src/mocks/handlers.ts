import { http, HttpResponse, delay } from 'msw';
import { INITIAL_SERVICES } from '../core/fixtures/services';
import { INITIAL_CATEGORIES } from '../core/fixtures/categories';
import {
  INITIAL_DEMO_CUSTOMER,
  INITIAL_DEMO_ADMIN,
  DEMO_CREDENTIALS,
} from '../core/fixtures/demoUser';
import { useAppStore } from '../app/store';

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

  // Orders
  http.get('*/api/orders', async () => {
    await delay(150);
    const orders = useAppStore.getState().orders;
    return HttpResponse.json(orders);
  }),

  http.post('*/api/orders', async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as {
      serviceId: string;
      target: string;
      quantity: number;
    };

    const service = INITIAL_SERVICES.find((s) => s.id === body.serviceId);
    if (!service) {
      return HttpResponse.json({ error: 'Invalid service' }, { status: 400 });
    }

    let chargeCents = 0;
    if (service.fixedPriceCents) {
      chargeCents = service.fixedPriceCents * body.quantity;
    } else if (service.pricePerThousandCents) {
      chargeCents = Math.round((service.pricePerThousandCents * body.quantity) / 1000);
    }

    const store = useAppStore.getState();
    const result = store.addOrder({
      serviceId: body.serviceId,
      serviceName: service.name,
      target: body.target,
      quantity: body.quantity,
      chargeCents,
    });

    if (!result.success) {
      return HttpResponse.json({ error: result.error }, { status: 422 });
    }

    return HttpResponse.json(result.order, { status: 201 });
  }),

  // Wallet
  http.get('*/api/wallet', async () => {
    await delay(100);
    const store = useAppStore.getState();
    return HttpResponse.json({
      userId: store.currentUser.id,
      currency: 'USD',
      balanceCents: store.currentUser.balanceCents,
      ledgerEntries: store.ledgerEntries,
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
