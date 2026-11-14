import { AlertTriangle, Sparkles } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { resetDemoSystem } from '../../core/db/reset';

export function DemoWatermark() {
  const { currentUser, switchRole } = useAppStore();

  return (
    <div className="bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-purple-500/20 border-b border-amber-500/30 px-4 py-1.5 text-xs text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex items-center justify-center bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
            SIMULATION ONLY
          </span>
          <span className="flex items-center gap-1.5 text-slate-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Fictional SMM Storefront. No real payments, cards, OTPs, or fulfillment.</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Active Persona: <strong className="text-white capitalize">{currentUser.role}</strong> (
            {currentUser.displayName})
          </span>
          <button
            onClick={() => switchRole(currentUser.role === 'customer' ? 'admin' : 'customer')}
            className="text-brand-primary hover:text-sky-300 underline font-semibold text-xs transition-colors cursor-pointer"
          >
            Switch to {currentUser.role === 'customer' ? 'Admin' : 'Customer'}
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => void resetDemoSystem()}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors text-xs cursor-pointer"
            title="Reset demo balance and state to $87.00 seed"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
}
