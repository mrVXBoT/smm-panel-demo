import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkoutGateway } from './checkoutGateway';
afterEach(() => vi.useRealTimers());
describe('local authorization placeholder', () => {
  it('processes valid test references before allowing the wallet step', async () => {
    vi.useFakeTimers();
    let completed = false;
    const work = checkoutGateway
      .authorize(
        { amountCents: 2500, method: 'visa_demo', testReference: 'NOVA-TEST-001' },
        new AbortController().signal,
      )
      .then(() => {
        completed = true;
      });
    await vi.advanceTimersByTimeAsync(1000);
    expect(completed).toBe(false);
    await vi.advanceTimersByTimeAsync(500);
    await work;
    expect(completed).toBe(true);
  });
  it('cancels pending work on unmount and rejects invalid test IDs', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const work = checkoutGateway.authorize(
      { amountCents: 2500, method: 'mastercard_demo', testReference: 'NOVA-TEST-001' },
      controller.signal,
    );
    const check = expect(work).rejects.toThrow('Cancelled');
    controller.abort();
    await check;
    expect(vi.getTimerCount()).toBe(0);
    await expect(
      checkoutGateway.authorize(
        { amountCents: 2500, method: 'visa_demo', testReference: '123456' },
        controller.signal,
      ),
    ).rejects.toThrow('NOVA');
  });
});
