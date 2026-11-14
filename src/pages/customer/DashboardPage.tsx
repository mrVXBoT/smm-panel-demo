import { Link } from 'react-router-dom';
import {
  Wallet,
  ShoppingCart,
  ListOrdered,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  HelpCircle,
  PieChart,
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { NovaBotRive } from '../../components/mascot/NovaBotRive';
import { OrderVolumeChart } from '../../components/charts/OrderVolumeChart';
import { SpendingBreakdownChart } from '../../components/charts/SpendingBreakdownChart';
import { startDemoTour } from '../../components/ui/tour';

export function DashboardPage() {
  const { currentUser, orders } = useAppStore();

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Mascot */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-surface-dark via-slate-900 to-brand-elevated-dark border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <Badge variant="accent" className="text-xs">
            Demo Customer Workspace
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Your simulation account is loaded with{' '}
            <strong className="text-brand-primary font-mono">
              {formatCents(currentUser.balanceCents)}
            </strong>
            . Place test orders, explore Telegram Stars, or simulate mock Visa/Mastercard payments.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <Link to="/app/order/new">
              <Button size="sm" className="gap-2 cursor-pointer">
                <ShoppingCart className="w-4 h-4" />
                <span>Place New Order</span>
              </Button>
            </Link>
            <Link to="/app/wallet">
              <Button variant="secondary" size="sm" className="gap-2 cursor-pointer">
                <Wallet className="w-4 h-4 text-brand-primary" />
                <span>Manage Wallet</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={startDemoTour}
              className="gap-2 text-xs border-slate-700 text-slate-300 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-brand-primary" />
              <span>Interactive Tour</span>
            </Button>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <NovaBotRive size="md" mood="happy" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-brand-primary/40 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Available Balance</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {formatCents(currentUser.balanceCents)}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dexie Persisted</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
              <Wallet className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-brand-primary/40 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Orders Placed</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {orders.length}
              </div>
              <div className="text-[11px] text-sky-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Active History</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ListOrdered className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-brand-primary/40 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Spent on Services</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {formatCents(orders.reduce((sum, o) => sum + o.chargeCents, 0))}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Demo Ledger</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-brand-primary/40 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Fictional Numbers</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">Ready</div>
              <div className="text-[11px] text-purple-400 mt-1">
                <span>5 Countries Supported</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-primary" />
                  <span>7-Day Simulated Order Velocity</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daily simulated order count and volume trends rendered with Recharts.
                </p>
              </div>
              <Badge variant="default" className="text-[10px]">
                Recharts Area
              </Badge>
            </div>
            <OrderVolumeChart />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-amber-400" />
                  <span>Category Breakdown</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Simulated distribution by product.</p>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                Recharts Pie
              </Badge>
            </div>
            <SpendingBreakdownChart />
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-base text-white mb-2 flex items-center justify-between">
              <span>Quick Services Access</span>
              <Badge variant="secondary" className="text-[10px]">
                Catalog
              </Badge>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Direct simulated shortcuts to popular client-requested categories:
            </p>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <Link
                to="/app/stars"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-800 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-slate-200">Telegram Stars</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
              <Link
                to="/app/premium"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-400/50 hover:bg-slate-800 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-slate-200">Telegram Premium</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </Link>
              <Link
                to="/app/numbers"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-400/50 hover:bg-slate-800 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-slate-200">Virtual Numbers</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </Link>
              <Link
                to="/app/order/new"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-400/50 hover:bg-slate-800 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-slate-200">Telegram Growth</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-base text-white mb-2 flex items-center justify-between">
              <span>Simulation Guardrails</span>
              <Badge variant="warning" className="text-[10px]">
                Strict Safety
              </Badge>
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              This environment guarantees complete privacy and safety during demonstrations:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero real payment processors or credit card forms.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No live telecommunication numbers or SMS OTP interception.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-click reset restores the $87.00 seed balance anytime.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
