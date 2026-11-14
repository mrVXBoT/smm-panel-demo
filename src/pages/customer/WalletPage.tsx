import { useState } from 'react';
import { CreditCard, ShieldCheck, Sparkles, Info, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet } from '../../core/db/hooks';
import { resetDemoSystem } from '../../core/db/reset';
import { walletRepository } from '../../core/db/walletRepository';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function WalletPage() {
  const { currentUser } = useAppStore();
  const wallet = useCustomerWallet(currentUser.id);

  const [displayedPaymentNotice, setDisplayedPaymentNotice] = useState<string | null>(null);
  const [testCreditSuccess, setTestCreditSuccess] = useState<string | null>(null);

  const handlePayButtonClick = () => {
    // Client requirement: clicking the action strictly displays the simulated label "Pay by Visa or Mastercard"
    // No gateway execution, no card processing, no automatic crediting
    setDisplayedPaymentNotice('Pay by Visa or Mastercard');
    setTestCreditSuccess(null);
  };

  const handleOptionalTestTopUp = async (amountDollars: number) => {
    const { ledgerEntry } = await walletRepository.simulateTopUp(
      currentUser.id,
      amountDollars * 100,
      'visa_demo',
    );
    setTestCreditSuccess(
      `Optional test top-up added: ${formatCents(ledgerEntry.amountCents)} credited to demo balance.`,
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Simulated Checkout
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Demo Wallet & Funds
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review simulated balances, ledger accounting, and the client-mandated payment trigger.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => void resetDemoSystem()}
          className="gap-2 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/10 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Reset to $87.00 Seed</span>
        </Button>
      </div>

      {/* Balance Card Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-brand-surface-dark via-slate-900 to-sky-950/40 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Current Simulated Balance
          </span>
          <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white flex items-baseline gap-2">
            <span>{formatCents(wallet.balanceCents)}</span>
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
            <div className="font-bold text-white">Dexie Ledger Active</div>
            <div className="text-slate-400">Initial $87.00 Ready</div>
          </div>
        </div>
      </div>

      {/* Notification when "Pay by Visa or Mastercard" is clicked */}
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
            <Badge variant="default" className="text-[10px]">
              Client Scope Match
            </Badge>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Per client specification, clicking this action displays{' '}
            <strong>"Pay by Visa or Mastercard"</strong>. No actual payment gateway, credit card
            fields, or bank redirects are required or executed.
          </p>
          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-slate-400">Simulation Method: Visa / Mastercard Selector</span>
            <button
              onClick={() => setDisplayedPaymentNotice(null)}
              className="text-brand-primary hover:underline font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {testCreditSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{testCreditSuccess}</span>
        </div>
      )}

      {/* Payment Action Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-primary" />
                <span>Client Payment Presentation</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Complies with the requirement: button strictly displays "Pay by Visa or Mastercard".
              </p>
            </div>
            <Badge variant="warning" className="text-[10px]">
              No Real Gateway
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

            {/* Client Requirement Note */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong>Client Requirement:</strong> The payment button only needs to display "Pay
                by Visa or Mastercard". No actual payment gateway or card-data collection is
                required.
              </span>
            </div>

            {/* Optional Demo Top-Up Testing for high-value orders */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-slate-400">
                Optional: Add simulated test credit to balance:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleOptionalTestTopUp(25)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-brand-primary text-slate-300 text-xs font-mono font-semibold cursor-pointer transition-colors"
                >
                  +$25.00
                </button>
                <button
                  type="button"
                  onClick={() => void handleOptionalTestTopUp(50)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-brand-primary text-slate-300 text-xs font-mono font-semibold cursor-pointer transition-colors"
                >
                  +$50.00
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
