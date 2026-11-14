import { ListOrdered } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { formatCents } from '../../core/utils/currency';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export function AdminOrdersPage() {
  const { orders, advanceOrderStatus } = useAppStore();

  const getServiceName = (serviceId: string) => {
    const s = INITIAL_SERVICES.find((item) => item.id === serviceId);
    return s ? s.name : serviceId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Order Lifecycle Management
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ListOrdered className="w-7 h-7 text-brand-primary" />
            <span>All Customer Orders</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review simulated incoming orders and advance their status in the shared state.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                <th className="py-3 px-4">Order ID</th>
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
                  <td className="py-3.5 px-4 text-white font-medium max-w-xs truncate">
                    {getServiceName(ord.serviceId)}
                  </td>
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
                            : ord.status === 'pending'
                              ? 'warning'
                              : 'danger'
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
                      onClick={() => advanceOrderStatus(ord.id)}
                      className="text-[11px] h-7 px-2.5 text-brand-primary hover:text-white cursor-pointer"
                    >
                      Step State
                    </Button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    No orders recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
