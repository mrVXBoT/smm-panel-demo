import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Clock } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { useAppStore } from '../../app/store';
import { useCustomerOrders } from '../../core/db/hooks';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { DataTable } from '../../components/ui/data-table';
import type { Order, OrderStatus } from '../../core/types/models';

export function OrdersPage() {
  const { currentUser } = useAppStore();
  const orders = useCustomerOrders(currentUser.id);

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

  const getServiceName = (serviceId: string) => {
    const s = INITIAL_SERVICES.find((item) => item.id === serviceId);
    return s ? s.name : serviceId;
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
          <span className="font-mono text-slate-300 max-w-xs block truncate">
            {row.original.target}
          </span>
        ),
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
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
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
          <span className="text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {new Date(row.original.createdAt).toLocaleDateString()}{' '}
              {new Date(row.original.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </span>
        ),
      },
    ],
    [],
  );

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
            Track the status, delivery details, and receipts for all your Telegram orders.
          </p>
        </div>

        <Link to="/app/order/new">
          <Button size="sm" className="gap-2 cursor-pointer">
            <ShoppingCart className="w-4 h-4" />
            <span>New Order</span>
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        searchPlaceholder="Filter orders by ID, target, or service..."
        searchColumnKey="target"
      />
    </div>
  );
}
