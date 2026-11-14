import { useState } from 'react';
import { Crown, CheckCircle, Copy, Check, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

export function PremiumPage() {
  const { currentUser, addOrder } = useAppStore();

  const [recipient, setRecipient] = useState('@my_personal_account');
  const [selectedDuration, setSelectedDuration] = useState<number>(3);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const plans = [
    { months: 3, priceCents: 1199, label: '3 Months Gift' },
    { months: 6, priceCents: 1799, label: '6 Months Gift' },
    { months: 12, priceCents: 2899, label: '12 Months Annual Pass', best: true },
  ];

  const activePlan = plans.find((p) => p.months === selectedDuration) || plans[0]!;
  const hasInsufficientBalance = currentUser.balanceCents < activePlan.priceCents;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!recipient.trim()) {
      setErrorMessage('Please specify target recipient username.');
      return;
    }

    if (hasInsufficientBalance) {
      setErrorMessage('Insufficient balance for this Premium plan.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const codeUrl = `https://t.me/giftcode/sim_${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`;

      const result = addOrder({
        serviceId: 'srv_tg_premium_3m',
        serviceName: `Telegram Premium ${activePlan.months}M Gift Code (${recipient})`,
        target: recipient.trim(),
        quantity: 1,
        chargeCents: activePlan.priceCents,
      });

      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to dispatch premium pass.');
      } else {
        setGeneratedCode(codeUrl);
      }
    }, 450);
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard?.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Subscription Simulator
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Telegram Premium Simulator</span>
            <Crown className="w-6 h-6 text-purple-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate simulated Telegram Premium gift links and test checkout deduction.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Available:</span>
          <div className="text-xl font-mono font-extrabold text-brand-primary">
            {formatCents(currentUser.balanceCents)}
          </div>
        </div>
      </div>

      {generatedCode ? (
        <Card className="border-purple-500/40 bg-purple-950/20 text-center py-10">
          <CardContent className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {activePlan.label} Simulated Link Generated!
            </h2>
            <div className="p-3 bg-slate-900/90 border border-purple-500/40 rounded-xl font-mono text-xs text-purple-300 max-w-md mx-auto flex items-center justify-between gap-2">
              <span className="truncate">{generatedCode}</span>
              <button
                onClick={copyCode}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy Gift Link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Assigned to: <strong className="text-white">{recipient}</strong> • Fictional
              demonstration gift URL recorded in order history.
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => setGeneratedCode(null)}
              className="mt-2 cursor-pointer"
            >
              Generate Another
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Target Recipient Username
                </label>
                <Input
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="@username"
                  required
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Subscription Duration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {plans.map((p) => (
                    <button
                      key={p.months}
                      type="button"
                      onClick={() => {
                        setSelectedDuration(p.months);
                        setErrorMessage(null);
                      }}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer relative ${
                        selectedDuration === p.months
                          ? 'border-purple-400 bg-purple-400/10 text-white shadow-lg shadow-purple-400/10'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {p.best && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-purple-500 text-white font-bold text-[9px] uppercase">
                          Best Value
                        </span>
                      )}
                      <div className="font-bold text-sm text-purple-300">{p.label}</div>
                      <div className="text-lg font-mono font-extrabold text-white mt-1">
                        {formatCents(p.priceCents)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {hasInsufficientBalance && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    Insufficient balance for this plan ({formatCents(activePlan.priceCents)}{' '}
                    required, you have {formatCents(currentUser.balanceCents)}).
                  </span>
                </div>
              )}

              {errorMessage && !hasInsufficientBalance && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-400">Total Simulated Charge:</span>
                  <div className="text-xl font-bold font-mono text-brand-primary">
                    {formatCents(activePlan.priceCents)}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || hasInsufficientBalance}
                  className="gap-2 text-xs font-bold py-5 px-6 rounded-xl cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Generating...'
                      : hasInsufficientBalance
                        ? 'Insufficient Balance'
                        : 'Simulate Gift Code'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
