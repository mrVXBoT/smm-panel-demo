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
      color: 'text-brand-success',
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
      color: 'text-brand-accent',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Operations Console
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-dark tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-brand-accent" />
            <span>Admin Overview & Analytics</span>
          </h1>
          <p className="text-xs text-brand-muted-dark mt-1">
            Review platform services, orders, wallet ledgers, and support queues.
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
                  <div className="text-xs text-brand-muted-dark font-medium">{stat.label}</div>
                  <div className="text-2xl font-extrabold text-brand-text-dark font-mono mt-1">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-brand-muted-dark mt-1">{stat.change}</div>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl bg-brand-elevated-dark/80 border border-brand-border flex items-center justify-center ${stat.color}`}
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
            <h3 className="font-bold text-base text-brand-text-dark">Management Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link
                to="/admin/services"
                className="p-3.5 rounded-xl bg-brand-surface-dark/60 border border-brand-border hover:border-brand-primary/50 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-brand-text-dark">Catalog Manager</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
              </Link>
              <Link
                to="/admin/orders"
                className="p-3.5 rounded-xl bg-brand-surface-dark/60 border border-brand-border hover:border-brand-primary/50 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-brand-text-dark">Order Dispatcher</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
              </Link>
              <Link
                to="/admin/payments"
                className="p-3.5 rounded-xl bg-brand-surface-dark/60 border border-brand-border hover:border-brand-primary/50 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-brand-text-dark">Payment Attempts</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
              </Link>
              <Link
                to="/admin/tickets"
                className="p-3.5 rounded-xl bg-brand-surface-dark/60 border border-brand-border hover:border-brand-primary/50 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-brand-text-dark">Support Inbox</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-brand-text-dark">
                Sandbox Environment Status
              </h3>
              <Badge variant="success" className="text-[10px]">
                Healthy
              </Badge>
            </div>
            <p className="text-xs text-brand-muted-dark leading-relaxed">
              All side effects are safely mocked in-memory and via Dexie state boundaries. Zero
              actual providers or bank endpoints are accessed.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-warning" />
              <span className="text-xs text-brand-warning font-medium">
                Workspace ready to explore.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
