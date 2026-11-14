import { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle, Sparkles, ArrowRight, Info } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { formatCents, dollarsToCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function WalletPage() {
  const { currentUser, setCurrentUser, resetDemoData } = useAppStore();

  const [topUpAmountDollars, setTopUpAmountDollars] = useState<number>(25);
  const [selectedMethod, setSelectedMethod] = useState<'visa_demo' | 'mastercard_demo'>(
    'visa_demo',
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const presets = [10, 25, 50, 100];

  const handleSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setSuccessMessage(null);

    const addedCents = dollarsToCents(topUpAmountDollars);

    setTimeout(() => {
      setCurrentUser({
        ...currentUser,
        balanceCents: currentUser.balanceCents + addedCents,
      });
      setIsProcessing(false);
      setSuccessMessage(
        `Successfully credited ${formatCents(addedCents)} to your demo balance via simulated ${
          selectedMethod === 'visa_demo' ? 'Visa' : 'Mastercard'
        }.`,
      );
    }, 600);
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
            Top up your simulation balance or review simulated ledger accounting.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetDemoData}
          className="gap-2 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
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
            <span>{formatCents(currentUser.balanceCents)}</span>
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
            <div className="font-bold text-white">Initial Seed Active</div>
            <div className="text-slate-400">Default $87.00 Ready</div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs text-emerald-400 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top-up Form Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-primary" />
                <span>Simulated Top-Up</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select a preset amount and simulate Visa or Mastercard credit.
              </p>
            </div>
            <Badge variant="warning" className="text-[10px]">
              No Real Payment Gateway
            </Badge>
          </div>

          <form onSubmit={handleSimulatedPayment} className="space-y-6">
            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Choose Amount (USD)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presets.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmountDollars(amt)}
                    className={`py-3 rounded-xl border text-sm font-mono font-bold transition-all cursor-pointer ${
                      topUpAmountDollars === amt
                        ? 'border-brand-primary bg-brand-primary/15 text-white shadow-md shadow-brand-primary/20'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    ${amt}.00
                  </button>
                ))}
              </div>
            </div>

            {/* Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Payment Method (Simulation Selector)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('visa_demo')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedMethod === 'visa_demo'
                      ? 'border-brand-primary bg-brand-primary/10 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-black text-xs">
                      VISA
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Visa Demo</div>
                      <div className="text-[10px] text-slate-400">Instant test approval</div>
                    </div>
                  </div>
                  {selectedMethod === 'visa_demo' && (
                    <CheckCircle className="w-4 h-4 text-brand-primary" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('mastercard_demo')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedMethod === 'mastercard_demo'
                      ? 'border-brand-accent bg-brand-accent/10 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs">
                      MC
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Mastercard Demo</div>
                      <div className="text-[10px] text-slate-400">Instant test approval</div>
                    </div>
                  </div>
                  {selectedMethod === 'mastercard_demo' && (
                    <CheckCircle className="w-4 h-4 text-brand-accent" />
                  )}
                </button>
              </div>
            </div>

            {/* Client Requirement Button: "Pay by Visa or Mastercard" */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isProcessing}
                size="lg"
                className="w-full py-6 rounded-2xl text-base font-extrabold gap-2 shadow-xl shadow-brand-primary/20"
              >
                <CreditCard className="w-5 h-5 text-slate-950" />
                <span>
                  {isProcessing ? 'Processing Simulation...' : 'Pay by Visa or Mastercard'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Button>
            </div>

            {/* Safety Reassurance */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Card Data Collected:</strong> Clicking "Pay by Visa or Mastercard"
                immediately simulates a successful top-up. No card numbers, CVVs, expiration dates,
                or bank redirects are requested.
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
