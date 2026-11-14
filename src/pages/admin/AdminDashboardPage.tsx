import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Layers,
  Users,
  CreditCard,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { useAdminStats } from '../../core/db/hooks';
import { formatCents } from '../../core/utils/currency';

export function AdminDashboardPage() {
  const liveStats = useAdminStats();

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCents(liveStats?.totalRevenueCents ?? 215),
      change: '+18.2% this week',
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
    {
      label: 'Active Services',
      value: (liveStats?.activeServicesCount ?? INITIAL_SERVICES.length).toString(),
      change: '100% operational',
      icon: Layers,
      color: 'text-brand-primary',
    },
    {
      label: 'Active Users',
      value: (liveStats?.activeUsersCount ?? 2).toString(),
      change: 'Verified clients',
      icon: Users,
      color: 'text-brand-accent',
    },
    {
      label: 'Total Orders',
      value: (liveStats?.totalOrders ?? 2).toString(),
      change: 'Processed queue',
      icon: CreditCard,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Operations Console
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-brand-accent" />
            <span>Admin Overview & Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate administrative control over platform services, orders, simulated ledgers, and
            support queues.
          </p>
        </div>

        <Link to="/app">
          <Button variant="secondary" size="sm" className="gap-2 text-xs">
            <span>Customer Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                  <div className="text-2xl font-extrabold text-white font-mono mt-1">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{stat.change}</div>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center ${stat.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Ops Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Management Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link
                to="/admin/services"
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-primary/50 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-slate-200">Catalog Manager</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
              </Link>
              <Link
                to="/admin/orders"
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-primary/50 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-slate-200">Order Dispatcher</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
              </Link>
              <Link
                to="/admin/payments"
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-primary/50 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-slate-200">Payment Attempts</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
              </Link>
              <Link
                to="/admin/tickets"
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-brand-primary/50 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-slate-200">Support Inbox</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Sandbox Environment Status</h3>
              <Badge variant="success" className="text-[10px]">
                Healthy
              </Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              All side effects are safely mocked in-memory and via Dexie state boundaries. Zero
              actual providers or bank endpoints are accessed.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300 font-medium">
                Simulation engine ready for client sales walkthrough.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
