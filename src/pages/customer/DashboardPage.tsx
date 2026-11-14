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
  PieChart,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet, useCustomerOrders } from '../../core/db/hooks';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { OrderVolumeChart } from '../../components/charts/OrderVolumeChart';
import { SpendingBreakdownChart } from '../../components/charts/SpendingBreakdownChart';

export function DashboardPage() {
  const { currentUser } = useAppStore();
  const wallet = useCustomerWallet(currentUser.id);
  const orders = useCustomerOrders(currentUser.id);

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing',
  ).length;
  const totalSpentCents = orders.reduce((sum, o) => sum + o.chargeCents, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-surface-dark via-slate-900 to-brand-elevated-dark border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <Badge variant="outline" className="text-xs border-sky-500/30 bg-sky-500/10 text-sky-400">
            Client Workspace
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Account active. You have{' '}
            <strong className="text-brand-primary font-mono">
              {wallet.isLoading ? '...' : formatCents(wallet.balanceCents)}
            </strong>{' '}
            available for Telegram Stars, Premium gift subscriptions, and channel growth.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <Link to="/app/order/new">
              <Button size="sm" className="gap-2 cursor-pointer font-semibold">
                <ShoppingCart className="w-4 h-4" />
                <span>New Order</span>
              </Button>
            </Link>
            <Link to="/app/wallet">
              <Button variant="secondary" size="sm" className="gap-2 cursor-pointer font-semibold">
                <Wallet className="w-4 h-4 text-brand-primary" />
                <span>Wallet & Billing</span>
              </Button>
            </Link>
            <Link to="/app/orders">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>View Orders</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="shrink-0 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Delivery Status</div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Automated Queue Active</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Avg start time &lt; 5 mins</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-brand-primary/40 transition-colors">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Available Balance</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {wallet.isLoading ? '...' : formatCents(wallet.balanceCents)}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ready for Orders</span>
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
                <span>Account Lifetime</span>
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
              <div className="text-xs text-slate-400 font-medium">Total Spent</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {formatCents(totalSpentCents)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Fulfilled Services</span>
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
              <div className="text-xs text-slate-400 font-medium">In-Progress Orders</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {activeOrdersCount}
              </div>
              <div className="text-[11px] text-indigo-400 mt-1">
                <span>Active in Queue</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-primary" />
                  <span>Order Volume Activity</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  7-day order dispatch frequency and volume analytics.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Real-Time
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
                <p className="text-xs text-slate-400 mt-0.5">Service distribution by volume.</p>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Services
              </Badge>
            </div>
            <SpendingBreakdownChart />
          </CardContent>
        </Card>
      </div>

      {/* Quick Access & Account Assurance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-base text-white mb-2 flex items-center justify-between">
              <span>Quick Services Access</span>
              <Badge variant="secondary" className="text-[10px]">
                Direct Links
              </Badge>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Direct access to our most popular Telegram products:
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
                to="/app/order/new"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-400/50 hover:bg-slate-800 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-slate-200">Channel Growth</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
              </Link>
              <Link
                to="/app/wallet"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-400/50 hover:bg-slate-800 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-slate-200">Wallet & Top-up</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-base text-white mb-2 flex items-center justify-between">
              <span>Security & Reliability</span>
              <Badge variant="default" className="text-[10px]">
                Guaranteed
              </Badge>
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Every order follows enterprise privacy standards and automated dispatch:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Account Risk: No passwords or private tokens required.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated Queue: Orders are picked up within minutes.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Refill Guarantee: Gradual delivery and retention monitoring.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
