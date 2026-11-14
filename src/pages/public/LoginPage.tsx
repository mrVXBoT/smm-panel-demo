import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { DEMO_CREDENTIALS } from '../../core/fixtures/demoUser';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAsDemo } = useAppStore();

  const [username, setUsername] = useState(DEMO_CREDENTIALS.customer.username);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.customer.password);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (
        username === DEMO_CREDENTIALS.customer.username &&
        password === DEMO_CREDENTIALS.customer.password
      ) {
        loginAsDemo('customer');
        navigate('/app');
      } else if (
        username === DEMO_CREDENTIALS.admin.username &&
        password === DEMO_CREDENTIALS.admin.password
      ) {
        loginAsDemo('admin');
        navigate('/admin');
      } else {
        // For convenience in demo, allow any non-empty input as demo customer
        if (username.trim()) {
          loginAsDemo('customer');
          navigate('/app');
        } else {
          setError('Please enter a username and password.');
          setIsLoading(false);
        }
      }
    }, 400);
  };

  const selectPersona = (role: 'customer' | 'admin') => {
    setUsername(DEMO_CREDENTIALS[role].username);
    setPassword(DEMO_CREDENTIALS[role].password);
    setError('');
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent p-0.5 mx-auto mb-4 shadow-lg shadow-brand-primary/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-brand-primary" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Demo Platform Sign In
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Enter credentials or choose a pre-configured demo profile below.
        </p>
      </div>

      <Card className="border-slate-800 bg-brand-surface-dark shadow-2xl">
        <CardContent className="p-6 sm:p-8">
          {/* Quick Profile Selectors */}
          <div className="mb-6 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Demo Role
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectPersona('customer')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  username === DEMO_CREDENTIALS.customer.username
                    ? 'border-brand-primary/60 bg-brand-primary/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Customer</span>
                  <Badge variant="default" className="text-[9px] px-1 py-0">
                    $87.00
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">demouser</div>
              </button>

              <button
                type="button"
                onClick={() => selectPersona('admin')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  username === DEMO_CREDENTIALS.admin.username
                    ? 'border-brand-accent/60 bg-brand-accent/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Admin</span>
                  <Badge variant="accent" className="text-[9px] px-1 py-0">
                    Ops
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">admin</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 text-xs font-mono"
                  placeholder="demouser"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 text-xs font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gap-2 text-xs font-bold py-5 rounded-xl mt-2"
            >
              {isLoading ? (
                <span>Loading Session...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enter Demo Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              Simulated authentication. No actual user accounts or passwords are leaked.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
