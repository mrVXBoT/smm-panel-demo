import { CreditCard, ShieldCheck } from 'lucide-react';
import { formatCents } from '../../core/utils/currency';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function AdminPaymentsPage() {
  const attempts = [
    {
      id: 'PAY-8190',
      user: 'user77007 (user77007)',
      amountCents: 2500,
      method: 'visa_demo',
      state: 'completed',
      idempotency: 'idem_9210_visa',
      date: '2026-11-14 11:00',
    },
    {
      id: 'PAY-8189',
      user: 'user77007 (user77007)',
      amountCents: 1000,
      method: 'mastercard_demo',
      state: 'completed',
      idempotency: 'idem_9100_mc',
      date: '2026-11-13 16:45',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Payment Audit Trail
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-dark tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-brand-primary" />
            <span>Payment Records & Settlement</span>
          </h1>
          <p className="text-xs text-brand-muted-dark mt-1">
            Audit payment attempts, transaction references, and settlement records.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-brand-success">
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Logging Active</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-bg-dark/40 text-brand-muted-dark font-semibold">
                <th className="py-3 px-4">Attempt ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Idempotency Key</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {attempts.map((att) => (
                <tr key={att.id} className="hover:bg-brand-elevated-dark/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-primary">
                    {att.id}
                  </td>
                  <td className="py-3.5 px-4 text-brand-secondary font-medium">{att.user}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-brand-elevated-dark text-brand-secondary border border-brand-border">
                      {att.method === 'visa_demo' ? 'Visa' : 'Mastercard'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-success">
                    +{formatCents(att.amountCents)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-brand-muted-dark text-[11px]">
                    {att.idempotency}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success">Completed</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-brand-muted-dark text-right whitespace-nowrap">
                    {att.date}
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
