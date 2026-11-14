import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  ListOrdered,
  Wallet,
  Receipt,
  Crown,
  LifeBuoy,
  User,
  Star,
  Send,
  ShieldAlert,
  Layers,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  X,
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet } from '../../core/db/hooks';
import { formatCents } from '../../core/utils/currency';

interface SidebarProps {
  mode: 'customer' | 'admin';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar({ mode }: SidebarProps) {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, currentUser } = useAppStore();
  const wallet = useCustomerWallet(currentUser.id);

  const customerSections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
        { label: 'New Order', href: '/app/order/new', icon: Plus },
        { label: 'Orders', href: '/app/orders', icon: ListOrdered },
      ],
    },
    {
      title: 'PRODUCTS',
      items: [
        { label: 'Telegram Stars', href: '/app/stars', icon: Star },
        { label: 'Telegram Premium', href: '/app/premium', icon: Crown },
        { label: 'Channel Growth', href: '/app/order/new', icon: Send },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'Wallet', href: '/app/wallet', icon: Wallet },
        { label: 'Transactions', href: '/app/transactions', icon: Receipt },
        { label: 'Support', href: '/app/support', icon: LifeBuoy },
        { label: 'Profile', href: '/app/profile', icon: User },
      ],
    },
  ];

  const adminSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Admin Dashboard', href: '/admin', icon: ShieldAlert },
        { label: 'Manage Services', href: '/admin/services', icon: Layers },
        { label: 'Manage Orders', href: '/admin/orders', icon: ListOrdered },
      ],
    },
    {
      title: 'USERS & FINANCE',
      items: [
        { label: 'User Directory', href: '/admin/users', icon: Users },
        { label: 'Payments', href: '/admin/payments', icon: CreditCard },
      ],
    },
    {
      title: 'SUPPORT & CONFIG',
      items: [
        { label: 'Support Queue', href: '/admin/tickets', icon: MessageSquare },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const sections = mode === 'admin' ? adminSections : customerSections;

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-brand-surface-dark border-r border-slate-800/70 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Logo Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/70">
          <Link
            to={mode === 'admin' ? '/admin' : '/app'}
            className="flex items-center gap-2.5 group"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-md shadow-sky-500/20">
              <span className="font-black text-white text-xs leading-none select-none">N</span>
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              Nova<span className="text-brand-primary">SMM</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                          isActive
                            ? 'bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary pl-[10px]'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border-l-2 border-transparent pl-[10px]'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-brand-primary'
                              : 'text-slate-500 group-hover:text-slate-300'
                          }`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom: balance + username */}
        {mode === 'customer' && (
          <div className="p-4 border-t border-slate-800/70 bg-slate-950/30">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-brand-primary/30 flex items-center justify-center font-bold text-xs text-brand-primary shrink-0">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-slate-300 font-medium truncate">
                  {currentUser.displayName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary/10 border border-brand-primary/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                <span className="font-mono text-xs font-semibold text-white">
                  {formatCents(wallet.balanceCents)}
                </span>
              </div>
            </div>
          </div>
        )}

        {mode === 'admin' && (
          <div className="p-4 border-t border-slate-800/70 bg-slate-950/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-300 shrink-0">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">
                  {currentUser.displayName}
                </p>
                <p className="text-[10px] text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
