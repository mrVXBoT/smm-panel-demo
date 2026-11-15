import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  ListOrdered,
  Wallet,
  ShieldAlert,
  Layers,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronUp,
  ArrowUpRight,
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet } from '../../core/db/hooks';
import { formatCents } from '../../core/utils/currency';
import { NovaLogo } from './NovaLogo';
import { ProductMark } from './ProductMark';
import './Sidebar.css';
import { AccountGlyph, type AccountKind } from '../../features/account/AccountGlyph';
interface SidebarProps {
  mode: 'customer' | 'admin';
}
interface NavItem {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  accountKind?: AccountKind;
  product?: 'stars' | 'premium' | 'growth';
}
interface NavSection {
  title: string;
  items: NavItem[];
}
const customerSections: NavSection[] = [
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
      { label: 'Orders', href: '/app/orders', icon: ListOrdered },
    ],
  },
  {
    title: 'YOUR PRODUCTS',
    items: [
      { label: 'Telegram Stars', href: '/app/stars', product: 'stars' },
      { label: 'Telegram Premium', href: '/app/premium', product: 'premium' },
      { label: 'Channel Growth', href: '/app/growth', product: 'growth' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { label: 'Wallet', href: '/app/wallet', accountKind: 'wallet' },
      { label: 'Transactions', href: '/app/transactions', accountKind: 'transactions' },
      { label: 'Support', href: '/app/support', accountKind: 'support' },
    ],
  },
];
export function Sidebar({ mode }: SidebarProps) {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapsed, currentUser } =
    useAppStore();
  const wallet = useCustomerWallet(currentUser.id);
  const [accountOpen, setAccountOpen] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const account = useRef<HTMLDivElement>(null);
  const accountButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!sidebarOpen || !window.matchMedia('(max-width: 1023px)').matches) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(
      () => closeButton.current?.focus(),
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280,
    );
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSidebarOpen(false);
      }
      if (event.key !== 'Tab') return;
      const nodes = Array.from(
        panel.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])') ?? [],
      ).filter((node) => node.getClientRects().length > 0);
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', keydown);
      previousFocus?.focus();
    };
  }, [sidebarOpen, setSidebarOpen]);
  useEffect(() => {
    if (!accountOpen) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !account.current?.contains(event.target))
        setAccountOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountOpen(false);
        accountButton.current?.focus();
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [accountOpen]);
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
  const close = () => {
    setSidebarOpen(false);
    setAccountOpen(false);
  };
  return (
    <div
      className={`dock-rail ${sidebarCollapsed ? 'is-collapsed' : ''} ${sidebarOpen ? 'is-open' : ''}`}
    >
      {sidebarOpen && (
        <button
          className="dock-backdrop"
          onClick={close}
          aria-label="Close navigation backdrop"
          tabIndex={-1}
        />
      )}
      <aside
        ref={panel}
        className="nova-dock"
        aria-label={mode === 'admin' ? 'Administration sidebar' : 'Workspace sidebar'}
      >
        <div className="dock-brand-row">
          <Link
            to={mode === 'admin' ? '/admin' : '/app'}
            className="dock-brand"
            aria-label="NovaSMM workspace"
            onClick={close}
          >
            <NovaLogo />
            <span>
              Nova<span>SMM</span>
            </span>
          </Link>
          <button
            ref={closeButton}
            className="dock-mobile-close"
            onClick={close}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>
        <button
          className="dock-collapse"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!sidebarCollapsed}
          onClick={() => {
            toggleSidebarCollapsed();
            setAccountOpen(false);
          }}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          <span>Compact view</span>
        </button>
        {mode === 'customer' && (
          <Link
            to="/app/order/new"
            className="dock-new-order"
            aria-label="New Order"
            title={sidebarCollapsed ? 'New Order' : undefined}
            aria-current={location.pathname === '/app/order/new' ? 'page' : undefined}
            onClick={close}
          >
            <Plus size={19} />
            <span>New Order</span>
            <ArrowUpRight size={15} />
          </Link>
        )}
        <nav
          className="dock-navigation"
          aria-label={mode === 'admin' ? 'Admin navigation' : 'Workspace navigation'}
        >
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item) => {
                  const active = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        className={`dock-link ${item.product ? `dock-${item.product}` : ''} ${active ? 'is-active' : ''}`}
                        to={item.href}
                        onClick={close}
                        aria-label={item.label}
                        title={sidebarCollapsed ? item.label : undefined}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span className="dock-link-icon">
                          {item.accountKind ? (
                            <AccountGlyph kind={item.accountKind} className="dock-account-glyph" />
                          ) : item.product ? (
                            <ProductMark product={item.product} />
                          ) : Icon ? (
                            <Icon className="dock-utility-icon" />
                          ) : null}
                        </span>
                        <span className="dock-label">{item.label}</span>
                        {item.product && <i className="dock-product-dot" aria-hidden="true" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </nav>
        <div className="dock-account" ref={account}>
          {accountOpen && (
            <div className="dock-account-popover" id="dock-account-details">
              <span>{mode === 'admin' ? 'ADMIN WORKSPACE' : 'YOUR ACCOUNT'}</span>
              <strong>{currentUser.displayName}</strong>
              <Link to={mode === 'admin' ? '/admin/settings' : '/app/profile'} onClick={close}>
                <AccountGlyph kind="profile" className="dock-account-glyph" />
                {mode === 'admin' ? 'Settings' : 'Your profile'}
              </Link>
              {mode === 'customer' && (
                <Link to="/app/wallet" onClick={close}>
                  <Wallet size={15} />
                  Wallet & funds <ArrowUpRight size={13} />
                </Link>
              )}
            </div>
          )}
          <button
            ref={accountButton}
            className="dock-account-trigger"
            aria-label="Account details"
            title={sidebarCollapsed ? 'Account details' : undefined}
            aria-expanded={accountOpen}
            aria-controls={accountOpen ? 'dock-account-details' : undefined}
            onClick={() => setAccountOpen((value) => !value)}
          >
            <span className="dock-avatar">
              {currentUser.displayName.charAt(0)}
              <i />
            </span>
            <span className="dock-account-copy">
              <strong>{currentUser.displayName}</strong>
              <small>
                {mode === 'customer'
                  ? wallet.isLoading
                    ? 'Loading wallet…'
                    : `${formatCents(wallet.balanceCents)} · Wallet`
                  : 'Administrator'}
              </small>
            </span>
            <ChevronUp size={14} className={accountOpen ? 'account-chevron-open' : ''} />
          </button>
        </div>
      </aside>
    </div>
  );
}
