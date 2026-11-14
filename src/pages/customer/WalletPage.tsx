import { useState } from 'react';
import { CreditCard, ShieldCheck, Sparkles, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet } from '../../core/db/hooks';
import { resetDemoSystem } from '../../core/db/reset';
import { walletRepository } from '../../core/db/walletRepository';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

export function WalletPage() {
  const { currentUser } = useAppStore();
  const wallet = useCustomerWallet(currentUser.id);

  const [displayedPaymentNotice, setDisplayedPaymentNotice] = useState<string | null>(null);
  const [topUpSuccess, setTopUpSuccess] = useState<string | null>(null);

  const handlePayButtonClick = () => {
    // Client requirement: clicking the action strictly displays the label "Pay by Visa or Mastercard"
    setDisplayedPaymentNotice('Pay by Visa or Mastercard');
    setTopUpSuccess(null);
  };

  const handleTopUp = async (amountDollars: number) => {
    const { ledgerEntry } = await walletRepository.simulateTopUp(
      currentUser.id,
      amountDollars * 100,
      'visa_demo',
    );
    setTopUpSuccess(
      `Successfully added ${formatCents(ledgerEntry.amountCents)} to your available balance.`,
    );
    toast.success(`Wallet credited: +${formatCents(ledgerEntry.amountCents)}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge
            variant="outline"
            className="mb-2 border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs"
          >
            Billing & Funds
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Wallet & Billing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your account balance and payment methods for automated orders.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await resetDemoSystem();
            toast.info('Balance reset to initial $87.00');
          }}
          className="gap-2 text-xs border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Reset Balance ($87.00)</span>
        </Button>
      </div>

      {/* Balance Card Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-brand-surface-dark via-slate-900 to-sky-950/40 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available Balance
          </span>
          <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white flex items-baseline gap-2">
            <span>{wallet.isLoading ? '...' : formatCents(wallet.balanceCents)}</span>
            <span className="text-xs font-sans text-brand-primary font-bold">USD</span>
          </div>
          <p className="text-xs text-slate-400">
            Account: <strong className="text-white">{currentUser.displayName}</strong> (
            {currentUser.email})
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-brand-primary" />
          <div className="text-xs">
            <div className="font-bold text-white">Active Account</div>
            <div className="text-slate-400">Instant Order Access</div>
          </div>
        </div>
      </div>

      {/* Payment Action Notice */}
      {displayedPaymentNotice && (
        <div
          role="status"
          className="p-5 rounded-2xl bg-brand-surface-dark border-2 border-brand-primary/50 text-white shadow-xl space-y-2 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-primary" />
              <span className="text-base font-extrabold tracking-wide text-brand-primary">
                {displayedPaymentNotice}
              </span>
            </div>
            <Badge variant="outline" className="text-[10px] text-sky-400 border-sky-500/30">
              Payment Method
            </Badge>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Per client specification, your payment method is recorded as{' '}
            <strong>"Pay by Visa or Mastercard"</strong>.
          </p>
          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-slate-400">Ready for automated order settlement.</span>
            <button
              onClick={() => setDisplayedPaymentNotice(null)}
              className="text-brand-primary hover:underline font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {topUpSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{topUpSuccess}</span>
        </div>
      )}

      {/* Payment Method Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-primary" />
                <span>Card Payment Selection</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose your preferred payment method to fund your account.
              </p>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              Instant Settlement
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Primary Payment Button */}
            <div>
              <Button
                type="button"
                onClick={handlePayButtonClick}
                size="lg"
                className="w-full py-6 rounded-2xl text-base font-extrabold gap-2 shadow-xl shadow-brand-primary/20 cursor-pointer"
              >
                <CreditCard className="w-5 h-5 text-slate-950" />
                <span>Pay by Visa or Mastercard</span>
              </Button>
            </div>

            {/* Quick Balance Add Options */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-slate-400">Quick Balance Add:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleTopUp(25)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-brand-primary text-slate-200 text-xs font-mono font-semibold cursor-pointer transition-colors"
                >
                  +$25.00
                </button>
                <button
                  type="button"
                  onClick={() => void handleTopUp(50)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-brand-primary text-slate-200 text-xs font-mono font-semibold cursor-pointer transition-colors"
                >
                  +$50.00
                </button>
                <button
                  type="button"
                  onClick={() => void handleTopUp(100)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-brand-primary text-slate-200 text-xs font-mono font-semibold cursor-pointer transition-colors"
                >
                  +$100.00
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
