import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  ListOrdered,
  Wallet,
  Receipt,
  PhoneCall,
  Sparkles,
  Crown,
  LifeBuoy,
  User,
  ShieldAlert,
  Layers,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '../../app/store';

interface SidebarProps {
  mode: 'customer' | 'admin';
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export function Sidebar({ mode }: SidebarProps) {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const customerNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { label: 'New Order', href: '/app/order/new', icon: ShoppingCart, badge: 'Fast' },
    { label: 'Order History', href: '/app/orders', icon: ListOrdered },
    { label: 'Wallet & Top-up', href: '/app/wallet', icon: Wallet, highlight: true },
    { label: 'Transactions', href: '/app/transactions', icon: Receipt },
    { label: 'Virtual Numbers', href: '/app/numbers', icon: PhoneCall, badge: 'Demo' },
    { label: 'Telegram Stars', href: '/app/stars', icon: Sparkles },
    { label: 'Telegram Premium', href: '/app/premium', icon: Crown },
    { label: 'Support Tickets', href: '/app/support', icon: LifeBuoy },
    { label: 'Account Profile', href: '/app/profile', icon: User },
  ];

  const adminNavItems: NavItem[] = [
    { label: 'Admin Overview', href: '/admin', icon: ShieldAlert },
    { label: 'Manage Services', href: '/admin/services', icon: Layers },
    { label: 'Manage Orders', href: '/admin/orders', icon: ListOrdered },
    { label: 'User Directory', href: '/admin/users', icon: Users },
    { label: 'Simulated Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Support Queue', href: '/admin/tickets', icon: MessageSquare },
    { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
  ];

  const navItems = mode === 'admin' ? adminNavItems : customerNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container: 256px (w-64) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-brand-surface-dark border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 lg:hidden">
          <span className="font-bold text-sm text-white">
            {mode === 'admin' ? 'Admin Navigation' : 'Customer Workspace'}
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Header Badge */}
        <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {mode === 'admin' ? 'Operator Console' : 'Customer Portal'}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
              mode === 'admin'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
            }`}
          >
            {mode}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-brand-primary' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Switch view */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Switch Portal:</span>
            {mode === 'customer' ? (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-brand-accent hover:text-purple-300 font-medium"
              >
                Go to Admin
                <ExternalLink className="w-3 h-3" />
              </Link>
            ) : (
              <Link
                to="/app"
                className="flex items-center gap-1 text-brand-primary hover:text-sky-300 font-medium"
              >
                Go to Customer
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
