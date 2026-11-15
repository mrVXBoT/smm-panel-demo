import type { PaymentMethod } from '../../core/types/models';
export interface CheckoutGateway {
  authorize(
    input: { amountCents: number; method: PaymentMethod; testReference: string },
    signal: AbortSignal,
  ): Promise<void>;
}
/** Replace this local adapter with a hosted provider session when real checkout is connected. */
export const checkoutGateway: CheckoutGateway = {
  authorize(input, signal) {
    if (
      !Number.isInteger(input.amountCents) ||
      input.amountCents <= 0 ||
      !/^NOVA-[A-Z0-9-]{3,30}$/.test(input.testReference)
    )
      return Promise.reject(new Error('Use a valid NOVA test reference.'));
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException('Cancelled', 'AbortError'));
        return;
      }
      const abort = () => {
        clearTimeout(timer);
        reject(new DOMException('Cancelled', 'AbortError'));
      };
      const timer = setTimeout(() => {
        signal.removeEventListener('abort', abort);
        resolve();
      }, 1500);
      signal.addEventListener('abort', abort, { once: true });
    });
  },
};
