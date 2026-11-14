import { Settings, RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { resetDemoSystem } from '../../core/db/reset';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export function AdminSettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Badge variant="accent" className="mb-2">
          Environment Configuration
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-brand-primary" />
          <span>Platform Settings & Seed Management</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Reset test state, verify simulation guards, and review deployment configuration.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-brand-primary" />
              <span>Demo State Reset</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restores the customer balance back to the official client seed of{' '}
              <strong className="text-white">$87.00 (8,700 cents)</strong> and reinitializes all
              mock orders and simulated ledger entries.
            </p>
            <div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => void resetDemoSystem()}
                className="gap-2 text-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-seed Simulation ($87.00)</span>
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Compliance & Safety Checklist</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>No live payment gateway credentials required or stored.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Client payment button displayed as "Pay by Visa or Mastercard".</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  Telegram virtual numbers, Stars, and Premium are mock simulated products.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>DEMO watermark visible in all views.</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              All configuration changes in this demo are confined to the browser session and local
              storage boundaries.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
