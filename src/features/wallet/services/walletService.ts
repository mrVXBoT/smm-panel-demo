import type { LedgerEntry, PaymentAttempt, Wallet } from '../../../core/types/models';
import type { IWalletService, SimulatePaymentParams } from '../../../core/types/services';

export class MockWalletService implements IWalletService {
  private ledgers: Record<string, LedgerEntry[]> = {
    usr_demo_customer_01: [
      {
        id: 'led_init_01',
        walletId: 'wal_demo_01',
        amountCents: 8700,
        kind: 'top_up',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        description: 'Initial demo balance credit (Simulated)',
      },
    ],
  };

  async getWallet(userId: string): Promise<Wallet> {
    const ledger = this.ledgers[userId] || [];
    const balanceCents = ledger.reduce((sum, entry) => sum + entry.amountCents, 0);

    return {
      id: `wal_${userId}`,
      userId,
      currency: 'USD',
      balanceCents,
    };
  }

  async getLedger(userId: string): Promise<LedgerEntry[]> {
    return [...(this.ledgers[userId] || [])].reverse();
  }

  async simulateTopUp(params: SimulatePaymentParams): Promise<{
    payment: PaymentAttempt;
    wallet: Wallet;
    ledgerEntry?: LedgerEntry;
  }> {
    const shouldSucceed = params.shouldSucceed ?? true;
    const paymentId = `pay_${Date.now()}`;
    const idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const payment: PaymentAttempt = {
      id: paymentId,
      userId: params.userId,
      amountCents: params.amountCents,
      method: params.method,
      state: shouldSucceed ? 'completed' : 'failed',
      idempotencyKey,
      createdAt: new Date().toISOString(),
    };

    let ledgerEntry: LedgerEntry | undefined;

    if (shouldSucceed) {
      ledgerEntry = {
        id: `led_${Date.now()}`,
        walletId: `wal_${params.userId}`,
        paymentId,
        amountCents: params.amountCents,
        kind: 'top_up',
        createdAt: new Date().toISOString(),
        description: `Simulated ${params.method === 'visa_demo' ? 'Visa' : 'Mastercard'} Top-up`,
      };

      if (!this.ledgers[params.userId]) {
        this.ledgers[params.userId] = [];
      }
      this.ledgers[params.userId]!.push(ledgerEntry);
    }

    const wallet = await this.getWallet(params.userId);

    return {
      payment,
      wallet,
      ledgerEntry,
    };
  }

  async resetWallet(userId: string): Promise<Wallet> {
    this.ledgers[userId] = [
      {
        id: `led_reset_${Date.now()}`,
        walletId: `wal_${userId}`,
        amountCents: 8700,
        kind: 'top_up',
        createdAt: new Date().toISOString(),
        description: 'Reset demo balance (Simulated)',
      },
    ];
    return this.getWallet(userId);
  }
}

export const walletService = new MockWalletService();
