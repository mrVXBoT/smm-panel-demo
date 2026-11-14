import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './server';

describe('MSW Mock API handlers', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('serves list of services from GET /api/services', async () => {
    const res = await fetch('http://localhost:5173/api/services');
    expect(res.ok).toBe(true);
    const json = (await res.json()) as Array<{ id: string; name: string }>;
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBeGreaterThan(0);
    expect(json[0]?.id).toBeDefined();
  });

  it('serves wallet balance from GET /api/wallet', async () => {
    const res = await fetch('http://localhost:5173/api/wallet');
    expect(res.ok).toBe(true);
    const json = (await res.json()) as { balanceCents: number; currency: string };
    expect(json.balanceCents).toBe(8700);
    expect(json.currency).toBe('USD');
  });

  it('rejects invalid credentials on POST /api/auth/login', async () => {
    const res = await fetch('http://localhost:5173/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demo', password: 'wrongpassword' }),
    });
    expect(res.status).toBe(401);
    const json = (await res.json()) as { error: string };
    expect(json.error).toBe('Invalid demo credentials');
  });
});
