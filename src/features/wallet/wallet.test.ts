import { describe, it, expect, beforeEach } from 'vitest';
import { MockWalletService } from './services/walletService';

describe('MockWalletService & Ledger Accounting', () => {
  let service: MockWalletService;

  beforeEach(() => {
    service = new MockWalletService();
  });

  it('calculates initial customer wallet balance from ledger as 8,700 cents ($87.00)', async () => {
    const wallet = await service.getWallet('usr_demo_customer_01');
    expect(wallet.balanceCents).toBe(8700);
    expect(wallet.currency).toBe('USD');
  });

  it('adds simulated top-up credit and appends to ledger', async () => {
    const result = await service.simulateTopUp({
      userId: 'usr_demo_customer_01',
      amountCents: 2500, // $25.00
      method: 'visa_demo',
      shouldSucceed: true,
    });

    expect(result.payment.state).toBe('completed');
    expect(result.wallet.balanceCents).toBe(8700 + 2500);
    expect(result.ledgerEntry).toBeDefined();
    expect(result.ledgerEntry?.amountCents).toBe(2500);

    const ledger = await service.getLedger('usr_demo_customer_01');
    expect(ledger.length).toBeGreaterThanOrEqual(2);
  });

  it('does not credit balance on simulated failed payment', async () => {
    const result = await service.simulateTopUp({
      userId: 'usr_demo_customer_01',
      amountCents: 5000,
      method: 'mastercard_demo',
      shouldSucceed: false,
    });

    expect(result.payment.state).toBe('failed');
    expect(result.ledgerEntry).toBeUndefined();
    expect(result.wallet.balanceCents).toBe(8700);
  });

  it('resets wallet balance back to initial seed of 8,700 cents', async () => {
    // Add extra funds first
    await service.simulateTopUp({
      userId: 'usr_demo_customer_01',
      amountCents: 5000,
      method: 'visa_demo',
    });

    const resetWallet = await service.resetWallet('usr_demo_customer_01');
    expect(resetWallet.balanceCents).toBe(8700);
  });
});
