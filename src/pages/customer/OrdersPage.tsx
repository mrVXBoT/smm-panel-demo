import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Clock } from 'lucide-react';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface MockOrderRow {
  id: string;
  serviceName: string;
  target: string;
  quantity: number;
  chargeCents: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  date: string;
}

export function OrdersPage() {
  const [filter, setFilter] = useState<string>('all');

  const orders: MockOrderRow[] = [
    {
      id: 'ORD-8921',
      serviceName: 'Telegram Real HQ Subscribers [Non-Drop]',
      target: '@growth_channel_demo',
      quantity: 1000,
      chargeCents: 140,
      status: 'completed',
      date: '2026-11-12 14:32',
    },
    {
      id: 'ORD-8922',
      serviceName: 'Telegram Post Views [Instant Auto]',
      target: 'https://t.me/growth_channel_demo/42',
      quantity: 5000,
      chargeCents: 75,
      status: 'processing',
      date: '2026-11-14 10:15',
    },
  ];

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const getStatusBadge = (status: MockOrderRow['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'processing':
        return <Badge variant="default">Processing</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
      case 'refunded':
        return <Badge variant="danger">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Order Management
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time simulated lifecycle status and execution logs.
          </p>
        </div>

        <Link to="/app/order/new">
          <Button size="sm" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span>New Order</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'processing', 'completed', 'pending'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              filter === st
                ? 'bg-brand-primary text-slate-950 shadow-md shadow-brand-primary/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Charge</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-primary">
                    {ord.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                    {ord.serviceName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300 max-w-xs truncate">
                    {ord.target}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {ord.quantity.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    {formatCents(ord.chargeCents)}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(ord.status)}</td>
                  <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{ord.date}</span>
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
