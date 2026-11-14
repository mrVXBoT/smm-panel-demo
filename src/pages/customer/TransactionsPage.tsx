import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatCents } from '../../core/utils/currency';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface LedgerRow {
  id: string;
  type: 'credit' | 'debit';
  amountCents: number;
  description: string;
  date: string;
  ref: string;
}

export function TransactionsPage() {
  const transactions: LedgerRow[] = [
    {
      id: 'TXN-401',
      type: 'credit',
      amountCents: 8700,
      description: 'Initial Demo Balance Seed',
      date: '2026-11-10 09:00',
      ref: 'INIT-SEED',
    },
    {
      id: 'TXN-402',
      type: 'debit',
      amountCents: 140,
      description: 'Order #ORD-8921 (Telegram Subscribers)',
      date: '2026-11-12 14:32',
      ref: 'ORD-8921',
    },
    {
      id: 'TXN-403',
      type: 'debit',
      amountCents: 75,
      description: 'Order #ORD-8922 (Telegram Post Views)',
      date: '2026-11-14 10:15',
      ref: 'ORD-8922',
    },
  ];

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
          Immutable event log tracking all credits, charges, and test transactions.
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
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-primary">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-4">
                    {tx.type === 'credit' ? (
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
                      tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-300'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}
                    {formatCents(tx.amountCents)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{tx.ref}</td>
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
