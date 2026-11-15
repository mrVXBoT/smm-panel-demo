import { MessageSquare, Check } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export function AdminTicketsPage() {
  const tickets = [
    {
      id: 'TCK-202',
      customer: 'user77007 (user77007)',
      subject: 'Bulk Telegram Stars bundle inquiry',
      status: 'open',
      priority: 'high',
      created: '15 min ago',
    },
    {
      id: 'TCK-201',
      customer: 'user77007 (user77007)',
      subject: 'Inquiry regarding Telegram Stars processing time',
      status: 'resolved',
      priority: 'normal',
      created: '2 hours ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Support Operations
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-dark tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-brand-primary" />
            <span>Support Ticket Queue</span>
          </h1>
          <p className="text-xs text-brand-muted-dark mt-1">
            Review and resolve customer inquiries and support requests.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-bg-dark/40 text-brand-muted-dark font-semibold">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-brand-elevated-dark/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-primary">{t.id}</td>
                  <td className="py-3.5 px-4 text-brand-secondary font-medium">{t.customer}</td>
                  <td className="py-3.5 px-4 text-brand-text-dark font-medium">{t.subject}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={t.priority === 'high' ? 'danger' : 'secondary'}>
                      {t.priority}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={t.status === 'open' ? 'warning' : 'success'}>{t.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                      <Check className="w-3.5 h-3.5 text-brand-success" />
                      <span>Reply</span>
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
