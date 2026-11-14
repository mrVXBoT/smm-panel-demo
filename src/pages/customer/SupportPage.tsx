import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function SupportPage() {
  const tickets = [
    {
      id: 'TCK-201',
      subject: 'Inquiry regarding Telegram Stars simulation rate',
      status: 'resolved',
      updatedAt: '2 hours ago',
      messagesCount: 3,
    },
    {
      id: 'TCK-202',
      subject: 'Virtual numbers availability for test German carrier',
      status: 'open',
      updatedAt: '15 min ago',
      messagesCount: 1,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Simulated Helpdesk
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Support Tickets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate customer assistance requests and mock operator replies.
          </p>
        </div>

        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>Open New Ticket</span>
        </Button>
      </div>

      <div className="space-y-3">
        {tickets.map((t) => (
          <Card key={t.id} className="hover:border-slate-700 transition-colors">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-brand-primary">{t.id}</span>
                  <Badge
                    variant={t.status === 'open' ? 'warning' : 'success'}
                    className="capitalize text-[10px]"
                  >
                    {t.status}
                  </Badge>
                </div>
                <h3 className="font-bold text-sm text-white">{t.subject}</h3>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>Last activity: {t.updatedAt}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {t.messagesCount} messages
                  </span>
                </div>
              </div>

              <Button variant="secondary" size="sm" className="text-xs">
                View Thread
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
