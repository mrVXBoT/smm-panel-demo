import { User, Key, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function ProfilePage() {
  const { currentUser, resetDemoData, switchRole } = useAppStore();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Badge variant="accent" className="mb-2">
          Demo Identity
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Demo Profile & Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review demo persona properties, simulated API tokens, and persistence controls.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-brand-primary/40 bg-slate-800">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-xl text-brand-primary">
                  {currentUser.displayName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{currentUser.displayName}</h2>
                <Badge variant="default" className="text-[10px] uppercase font-bold">
                  {currentUser.role}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
              <div className="text-xs font-mono font-semibold text-brand-primary mt-1">
                Balance: {formatCents(currentUser.balanceCents)}
              </div>
            </div>
          </div>

          {/* Persona details */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Username</span>
              <span className="font-mono text-white font-medium">{currentUser.username}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Account ID</span>
              <span className="font-mono text-white font-medium">{currentUser.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Simulated API Key</span>
              <span className="font-mono text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-brand-primary" />
                smm_demo_live_9a8f237...
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchRole(currentUser.role === 'customer' ? 'admin' : 'customer')}
              className="gap-2 text-xs"
            >
              <User className="w-4 h-4" />
              <span>Switch to {currentUser.role === 'customer' ? 'Admin' : 'Customer'} Role</span>
            </Button>

            <Button variant="danger" size="sm" onClick={resetDemoData} className="gap-2 text-xs">
              <RefreshCw className="w-4 h-4" />
              <span>Reset State to Seed ($87.00)</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
