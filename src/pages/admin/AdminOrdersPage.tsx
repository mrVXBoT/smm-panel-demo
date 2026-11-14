import { useMemo } from 'react';
import { ListOrdered } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { useAppStore } from '../../app/store';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { formatCents } from '../../core/utils/currency';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { DataTable } from '../../components/ui/data-table';
import type { Order, OrderStatus } from '../../core/types/models';

export function AdminOrdersPage() {
  const { orders, advanceOrderStatus } = useAppStore();

  const getServiceName = (serviceId: string) => {
    const s = INITIAL_SERVICES.find((item) => item.id === serviceId);
    return s ? s.name : serviceId;
  };

  const getStatusBadge = (status: OrderStatus) => {
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

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Order ID',
        cell: ({ row }) => (
          <span className="font-mono font-semibold text-brand-primary">{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'serviceId',
        header: 'Service',
        cell: ({ row }) => (
          <span className="font-medium text-white max-w-xs block truncate">
            {getServiceName(row.original.serviceId)}
          </span>
        ),
      },
      {
        accessorKey: 'target',
        header: 'Target',
        cell: ({ row }) => (
          <span className="font-mono text-slate-400 max-w-xs block truncate">
            {row.original.target}
          </span>
        ),
      },
      {
        accessorKey: 'quantity',
        header: 'Qty',
        cell: ({ row }) => (
          <span className="font-mono text-slate-300">{row.original.quantity.toLocaleString()}</span>
        ),
      },
      {
        accessorKey: 'chargeCents',
        header: 'Charge',
        cell: ({ row }) => (
          <span className="font-mono font-semibold text-white">
            {formatCents(row.original.chargeCents)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => advanceOrderStatus(row.original.id)}
            className="text-[11px] h-7 px-2.5 text-brand-primary hover:text-white cursor-pointer"
          >
            Advance State
          </Button>
        ),
      },
    ],
    [advanceOrderStatus],
  );

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
            TanStack Table operator dashboard with sorting, search filtering, and state
            manipulation.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        searchPlaceholder="Filter all orders by target or service..."
        searchColumnKey="target"
      />
    </div>
  );
}
