import { useState } from 'react';
import { Filter } from 'lucide-react';
import { formatCents } from '../../core/utils/currency';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-8921',
      user: 'demouser (Alex Rivers)',
      service: 'Telegram Real HQ Subscribers',
      target: '@growth_channel_demo',
      quantity: 1000,
      chargeCents: 140,
      status: 'completed',
      date: '2026-11-12 14:32',
    },
    {
      id: 'ORD-8922',
      user: 'demouser (Alex Rivers)',
      service: 'Telegram Post Views [Instant]',
      target: 'https://t.me/growth_channel_demo/42',
      quantity: 5000,
      chargeCents: 75,
      status: 'processing',
      date: '2026-11-14 10:15',
    },
  ]);

  const advanceStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status:
                o.status === 'processing'
                  ? 'completed'
                  : o.status === 'pending'
                    ? 'processing'
                    : 'refunded',
            }
          : o,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Order Lifecycle Management
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            All Customer Orders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review simulated incoming orders and manually step through status state machines.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Pipeline</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Charge</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Step Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-primary">
                    {ord.id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{ord.user}</td>
                  <td className="py-3.5 px-4 text-white">{ord.service}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 max-w-xs truncate">
                    {ord.target}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {ord.quantity.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    {formatCents(ord.chargeCents)}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        ord.status === 'completed'
                          ? 'success'
                          : ord.status === 'processing'
                            ? 'default'
                            : 'secondary'
                      }
                      className="capitalize"
                    >
                      {ord.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => advanceStatus(ord.id)}
                      className="text-[11px] h-7 px-2.5 text-brand-primary hover:text-white"
                    >
                      Step State
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
