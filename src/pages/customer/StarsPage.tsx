import { useState } from 'react';
import { Sparkles, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

export function StarsPage() {
  const { currentUser, setCurrentUser } = useAppStore();

  const [recipient, setRecipient] = useState('@demo_bot');
  const [selectedPack, setSelectedPack] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const packs = [
    { stars: 50, priceCents: 110, popular: false },
    { stars: 100, priceCents: 215, popular: false },
    { stars: 250, priceCents: 520, popular: true },
    { stars: 500, priceCents: 980, popular: false },
    { stars: 1000, priceCents: 1890, popular: false },
  ];

  const activePack = packs.find((p) => p.stars === selectedPack) || packs[0]!;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (currentUser.balanceCents >= activePack.priceCents) {
        setCurrentUser({
          ...currentUser,
          balanceCents: currentUser.balanceCents - activePack.priceCents,
        });
      }
      setIsSubmitting(false);
      setSuccess(true);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Badge variant="accent" className="mb-2">
          Digital Goods Simulation
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Telegram Stars Transfer Simulator</span>
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Simulate Telegram Stars gifts and mini-app payments with instant balance deduction.
        </p>
      </div>

      {success ? (
        <Card className="border-amber-500/40 bg-amber-950/20 text-center py-10">
          <CardContent className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {selectedPack} Stars Transferred to {recipient}!
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Simulated gift receipt recorded. Charged {formatCents(activePack.priceCents)} to your
              demo balance.
            </p>
            <Button variant="default" size="sm" onClick={() => setSuccess(false)} className="mt-2">
              Send More Stars
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <form onSubmit={handlePurchase} className="space-y-6">
              {/* Recipient Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Recipient Username or Bot Link
                </label>
                <Input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="@botusername or @channel"
                  required
                  className="text-xs font-mono"
                />
              </div>

              {/* Pack Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Stars Bundle
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {packs.map((pack) => (
                    <button
                      key={pack.stars}
                      type="button"
                      onClick={() => setSelectedPack(pack.stars)}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer relative ${
                        selectedPack === pack.stars
                          ? 'border-amber-400 bg-amber-400/10 text-white shadow-lg shadow-amber-400/10'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {pack.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-bold text-[9px] uppercase">
                          Popular
                        </span>
                      )}
                      <div className="flex items-center justify-center gap-1 text-amber-400 font-extrabold text-lg">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{pack.stars}</span>
                      </div>
                      <div className="text-xs font-mono font-semibold text-slate-400 mt-1">
                        {formatCents(pack.priceCents)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-400">Total Simulated Charge:</span>
                  <div className="text-xl font-bold font-mono text-brand-primary">
                    {formatCents(activePack.priceCents)}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 text-xs font-bold py-5 px-6 rounded-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Simulating Transfer...' : 'Send Stars (Demo)'}</span>
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
