import type { LedgerEntry, PaymentAttempt, Wallet } from '../../../core/types/models';
import type { IWalletService, SimulatePaymentParams } from '../../../core/types/services';
import { useAppStore } from '../../../app/store';

export class MockWalletService implements IWalletService {
  async getWallet(userId: string): Promise<Wallet> {
    const store = useAppStore.getState();
    return {
      id: `wal_${userId}`,
      userId,
      currency: 'USD',
      balanceCents: store.currentUser.balanceCents,
    };
  }

  async getLedger(_userId: string): Promise<LedgerEntry[]> {
    const store = useAppStore.getState();
    return [...store.ledgerEntries];
  }

  async simulateTopUp(params: SimulatePaymentParams): Promise<{
    payment: PaymentAttempt;
    wallet: Wallet;
    ledgerEntry?: LedgerEntry;
  }> {
    const shouldSucceed = params.shouldSucceed ?? true;
    const store = useAppStore.getState();

    if (!shouldSucceed) {
      const payment: PaymentAttempt = {
        id: `PAY-${Date.now()}`,
        userId: params.userId,
        amountCents: params.amountCents,
        method: params.method,
        state: 'failed',
        idempotencyKey: `idem_${Date.now()}_failed`,
        createdAt: new Date().toISOString(),
      };
      const wallet = await this.getWallet(params.userId);
      return { payment, wallet };
    }

    const { payment, ledgerEntry } = store.addTopUp(params.amountCents, params.method);
    const wallet = await this.getWallet(params.userId);

    return {
      payment,
      wallet,
      ledgerEntry,
    };
  }

  async resetWallet(userId: string): Promise<Wallet> {
    const store = useAppStore.getState();
    store.resetDemoData();
    return this.getWallet(userId);
  }
}

export const walletService = new MockWalletService();
