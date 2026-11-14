import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { formatCents } from '../../core/utils/currency';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function TransactionsPage() {
  const { ledgerEntries } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="accent" className="mb-2">
          Append-Only Accounting
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Wallet Transactions & Ledger
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Immutable event log tracking all credits, charges, and test transactions. Persisted across
          page refreshes.
        </p>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ledgerEntries.map((tx) => {
                const isCredit = tx.amountCents > 0;
                return (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-brand-primary">
                      {tx.id}
                    </td>
                    <td className="py-3.5 px-4">
                      {isCredit ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          Credit
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-400 font-semibold">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Debit
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium">{tx.description}</td>
                    <td
                      className={`py-3.5 px-4 font-mono font-bold ${
                        isCredit ? 'text-emerald-400' : 'text-slate-300'
                      }`}
                    >
                      {isCredit ? '+' : '-'}
                      {formatCents(Math.abs(tx.amountCents))}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {tx.orderId || tx.paymentId || 'INIT-SEED'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString()}{' '}
                      {new Date(tx.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
