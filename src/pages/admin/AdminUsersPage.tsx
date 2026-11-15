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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-dark tracking-tight">
            User Directory
          </h1>
          <p className="text-xs text-brand-muted-dark mt-1">
            Overview of registered customer and administrative user profiles.
          </p>
        </div>

        <Button size="sm" className="gap-2 text-xs">
          <UserPlus className="w-4 h-4" />
          <span>Add User Profile</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-brand-bg-dark/40 text-brand-muted-dark font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Account Balance</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-brand-elevated-dark/30 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-brand-elevated-dark border border-brand-border">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-brand-primary">
                          {u.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-brand-text-dark">{u.displayName}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-brand-secondary">{u.username}</td>
                  <td className="py-3.5 px-4 text-brand-muted-dark">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={u.role === 'admin' ? 'accent' : 'default'}
                      className="uppercase"
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-text-dark">
                    {formatCents(u.balanceCents)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-brand-success font-medium">Active</span>
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
