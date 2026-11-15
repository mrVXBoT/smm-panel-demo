import { useState } from 'react';
import { Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function AdminServicesPage() {
  const [services, setServices] = useState(INITIAL_SERVICES);

  const toggleStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Service Governance
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-dark tracking-tight">
            Manage Service Catalog
          </h1>
          <p className="text-xs text-brand-muted-dark mt-1">
            Configure service availability, rates, and category visibility.
          </p>
        </div>

        <Button size="sm" className="gap-2 text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Custom Service</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-bg-dark/40 text-brand-muted-dark font-semibold">
                <th className="py-3 px-4">Service ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Delivery Speed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-brand-elevated-dark/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-primary">
                    {srv.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-brand-text-dark max-w-xs truncate">
                    {srv.name}
                  </td>
                  <td className="py-3.5 px-4 capitalize text-brand-secondary">
                    {srv.platform.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-text-dark">
                    {srv.pricePerThousandCents
                      ? `${formatCents(srv.pricePerThousandCents)} / 1k`
                      : `${formatCents(srv.fixedPriceCents || 0)} fixed`}
                  </td>
                  <td className="py-3.5 px-4 text-brand-muted-dark">
                    {srv.estimatedDeliveryLabel}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={srv.status === 'active' ? 'success' : 'secondary'}>
                      {srv.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(srv.id)}
                      className="text-brand-muted-dark hover:text-brand-text-dark transition-colors cursor-pointer"
                      title="Toggle Active/Paused"
                    >
                      {srv.status === 'active' ? (
                        <ToggleRight className="w-5 h-5 text-brand-success inline" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-brand-muted-dark inline" />
                      )}
                    </button>
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
