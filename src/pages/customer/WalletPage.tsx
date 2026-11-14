import { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle, Sparkles, ArrowRight, Info, X } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { formatCents, dollarsToCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function WalletPage() {
  const { currentUser, resetDemoData, addTopUp } = useAppStore();

  const [topUpAmountDollars, setTopUpAmountDollars] = useState<number>(25);
  const [selectedMethod, setSelectedMethod] = useState<'visa_demo' | 'mastercard_demo'>(
    'visa_demo',
  );
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const presets = [10, 25, 50, 100];

  const handleOpenPayModal = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setShowSimulatedModal(true);
  };

  const handleConfirmSimulatedPayment = () => {
    setIsProcessing(true);
    const addedCents = dollarsToCents(topUpAmountDollars);

    setTimeout(() => {
      addTopUp(addedCents, selectedMethod);
      setIsProcessing(false);
      setShowSimulatedModal(false);
      setSuccessMessage(
        `Simulated payment confirmed! Credited ${formatCents(addedCents)} to demo balance.`,
      );
    }, 500);
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
          onClick={resetDemoData}
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
                Select test amount and trigger the client-specified payment presentation.
              </p>
            </div>
            <Badge variant="warning" className="text-[10px]">
              No Gateway Required
            </Badge>
          </div>

          <form onSubmit={handleOpenPayModal} className="space-y-6">
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
                Simulated Card Network
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
                      <div className="text-xs font-bold text-white">Visa Simulation</div>
                      <div className="text-[10px] text-slate-400">Method selector only</div>
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
                      <div className="text-xs font-bold text-white">Mastercard Simulation</div>
                      <div className="text-[10px] text-slate-400">Method selector only</div>
                    </div>
                  </div>
                  {selectedMethod === 'mastercard_demo' && (
                    <CheckCircle className="w-4 h-4 text-brand-accent" />
                  )}
                </button>
              </div>
            </div>

            {/* Client Requirement Button: strictly "Pay by Visa or Mastercard" */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full py-6 rounded-2xl text-base font-extrabold gap-2 shadow-xl shadow-brand-primary/20 cursor-pointer"
              >
                <CreditCard className="w-5 h-5 text-slate-950" />
                <span>Pay by Visa or Mastercard</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Button>
            </div>

            {/* Safety Reassurance */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong>Client Specification Note:</strong> Per project requirements, the payment
                button strictly reads "Pay by Visa or Mastercard" without opening gateways or
                collecting PAN, CVV, or expiry dates.
              </span>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Simulated "Pay by Visa or Mastercard" Modal */}
      {showSimulatedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-brand-surface-dark border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-primary" />
                <h3 className="font-extrabold text-base text-white">Pay by Visa or Mastercard</h3>
              </div>
              <button
                onClick={() => setShowSimulatedModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Selected Amount:</span>
                <span className="font-mono text-base font-extrabold text-white">
                  ${topUpAmountDollars}.00 USD
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Simulated Network:</span>
                <span className="capitalize font-semibold text-brand-primary">
                  {selectedMethod === 'visa_demo' ? 'Visa Demo' : 'Mastercard Demo'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Client Scope Compliance:</strong> No real payment gateway, card input, or
                  banking authorization is invoked. This modal confirms the "Pay by Visa or
                  Mastercard" demo presentation.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={handleConfirmSimulatedPayment}
                disabled={isProcessing}
                className="w-full py-5 rounded-xl text-xs font-bold gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Logging Simulation...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Simulated Demo Credit (${topUpAmountDollars}.00)</span>
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSimulatedModal(false)}
                className="text-xs text-slate-400 cursor-pointer"
              >
                Dismiss Modal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
