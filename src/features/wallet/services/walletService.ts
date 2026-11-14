import type { LedgerEntry, PaymentAttempt, Wallet } from '../../../core/types/models';
import type { IWalletService, SimulatePaymentParams } from '../../../core/types/services';
import { walletRepository } from '../../../core/db/walletRepository';

export class MockWalletService implements IWalletService {
  async getWallet(userId: string): Promise<Wallet> {
    return walletRepository.getWallet(userId);
  }

  async getLedger(userId: string): Promise<LedgerEntry[]> {
    return walletRepository.getLedgerEntries(userId);
  }

  async simulateTopUp(params: SimulatePaymentParams): Promise<{
    payment: PaymentAttempt;
    wallet: Wallet;
    ledgerEntry?: LedgerEntry;
  }> {
    const shouldSucceed = params.shouldSucceed ?? true;

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

    const { payment, ledgerEntry, wallet } = await walletRepository.simulateTopUp(
      params.userId,
      params.amountCents,
      params.method,
    );

    return {
      payment,
      wallet,
      ledgerEntry,
    };
  }

  async resetWallet(userId: string): Promise<Wallet> {
    return walletRepository.getWallet(userId);
  }
}

export const walletService = new MockWalletService();
