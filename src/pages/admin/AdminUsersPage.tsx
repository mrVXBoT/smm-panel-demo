import { UserPlus } from 'lucide-react';
import { INITIAL_DEMO_CUSTOMER, INITIAL_DEMO_ADMIN } from '../../core/fixtures/demoUser';
import { formatCents } from '../../core/utils/currency';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export function AdminUsersPage() {
  const users = [INITIAL_DEMO_CUSTOMER, INITIAL_DEMO_ADMIN];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Identity Directory
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Demo Users & Personas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Overview of seeded customer and operator identities in the simulation.
          </p>
        </div>

        <Button size="sm" className="gap-2 text-xs">
          <UserPlus className="w-4 h-4" />
          <span>Add Demo Persona</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Simulated Balance</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-brand-primary">
                          {u.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-white">{u.displayName}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{u.username}</td>
                  <td className="py-3.5 px-4 text-slate-400">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={u.role === 'admin' ? 'accent' : 'default'}
                      className="uppercase"
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    {formatCents(u.balanceCents)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-emerald-400 font-medium">Active Demo</span>
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
