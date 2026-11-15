import { AlertTriangle, Sparkles } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { resetDemoSystem } from '../../core/db/reset';

export function DemoWatermark() {
  const { currentUser } = useAppStore();

  return (
    <div className="bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-purple-500/20 border-b border-amber-500/30 px-4 py-1.5 text-xs text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex items-center justify-center bg-amber-500/30 border border-amber-400/40 text-brand-warning font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
            SIMULATION ONLY
          </span>
          <span className="flex items-center gap-1.5 text-brand-text-dark">
            <AlertTriangle className="w-3.5 h-3.5 text-brand-warning shrink-0" />
            <span>Fictional SMM Storefront. No real payments, cards, OTPs, or fulfillment.</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-brand-muted-dark">
            Active Persona:{' '}
            <strong className="text-brand-text-dark capitalize">{currentUser.role}</strong> (
            {currentUser.displayName})
          </span>
          <button
            onClick={() => void resetDemoSystem()}
            className="flex items-center gap-1 text-brand-muted-dark hover:text-brand-warning transition-colors text-xs cursor-pointer"
            title="Reset demo balance and state to $87.00 seed"
          >
            <Sparkles className="w-3 h-3 text-brand-warning" />
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
}
