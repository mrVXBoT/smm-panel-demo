import { useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight, Clock } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { useAppStore } from '../../app/store';
import { useCustomerLedger } from '../../core/db/hooks';
import { formatCents } from '../../core/utils/currency';
import { Badge } from '../../components/ui/badge';
import { DataTable } from '../../components/ui/data-table';
import type { LedgerEntry } from '../../core/types/models';

export function TransactionsPage() {
  const { currentUser } = useAppStore();
  const ledgerEntries = useCustomerLedger(currentUser.id);

  const columns = useMemo<ColumnDef<LedgerEntry>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Transaction ID',
        cell: ({ row }) => (
          <span className="font-mono font-semibold text-brand-primary">{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'kind',
        header: 'Type',
        cell: ({ row }) => {
          const isCredit = row.original.amountCents > 0;
          return isCredit ? (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              Credit
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Debit
            </span>
          );
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <span className="font-medium text-white max-w-sm block truncate">
            {row.original.description}
          </span>
        ),
      },
      {
        accessorKey: 'amountCents',
        header: 'Amount',
        cell: ({ row }) => {
          const isCredit = row.original.amountCents > 0;
          return (
            <span
              className={`font-mono font-bold ${isCredit ? 'text-emerald-400' : 'text-slate-300'}`}
            >
              {isCredit ? '+' : '-'}
              {formatCents(Math.abs(row.original.amountCents))}
            </span>
          );
        },
      },
      {
        accessorKey: 'orderId',
        header: 'Reference',
        cell: ({ row }) => (
          <span className="font-mono text-slate-400 text-xs">
            {row.original.orderId || row.original.paymentId || 'INIT-SEED'}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Timestamp',
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
      <div>
        <Badge
          variant="outline"
          className="mb-2 border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs"
        >
          Billing History
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Transaction History
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete record of your wallet top-ups, order charges, and billing activity.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={ledgerEntries}
        searchPlaceholder="Filter transactions by description or reference..."
        searchColumnKey="description"
      />
    </div>
  );
}
