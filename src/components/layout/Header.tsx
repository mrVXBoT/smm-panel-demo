import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  Menu,
  X,
  Search,
  ChevronDown,
  Wallet,
  ArrowUpRight,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet } from '../../core/db/hooks';
import { formatCents } from '../../core/utils/currency';
import { CommandMenu } from '../ui/command-menu';
import { NovaLogo } from './NovaLogo';
import './Header.css';

const offerings = [
  {
    name: 'Telegram Stars',
    detail: 'A little star power for your next idea.',
    image: '/images/solution-stars.png',
    to: '/app/stars',
  },
  {
    name: 'Telegram Premium',
    detail: 'Gift a little extra. Explore the plans.',
    image: '/images/solution-premium.png',
    to: '/app/premium',
  },
  {
    name: 'Channel Growth',
    detail: 'Members, views and reactions, together.',
    image: '/images/solution-growth.png',
    to: '/app/growth',
  },
];
type OpenPanel = 'services' | 'account' | 'mobile' | null;

export function Header() {
  const { theme, toggleTheme, currentUser, isAuthenticated, logout, sidebarOpen, toggleSidebar } =
    useAppStore();
  const wallet = useCustomerWallet(currentUser.id);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<OpenPanel>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const isPanel = location.pathname.startsWith('/app') || location.pathname.startsWith('/admin');

  useEffect(() => {
    let frame = 0;
    const update = () => {
      setScrolled(window.scrollY > 28);
      let current = '';
      if (location.pathname === '/')
        for (const id of ['how-it-works', 'why-novasmm']) {
          const element = document.getElementById(id);
          if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.4)
            current = id;
        }
      setActiveSection(current);
    };
    const scroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!location.hash) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' }),
    );
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setOpen(null);
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(null);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', keydown);
    };
  }, [open]);

  const close = () => setOpen(null);
  const toggle = (panel: Exclude<OpenPanel, null>, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setOpen((value) => (value === panel ? null : panel));
  };
  const sectionLink = (id: string, label: string) => (
    <Link
      to={`/#${id}`}
      onClick={close}
      aria-current={location.pathname === '/' && activeSection === id ? 'location' : undefined}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header
        ref={headerRef}
        className={`glass-header ${scrolled ? 'is-scrolled' : ''}`}
        onBlur={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            !event.currentTarget.contains(event.relatedTarget)
          )
            close();
        }}
      >
        <div className="glass-nav">
          <div className="glass-brand-group">
            {isPanel && (
              <button
                className="glass-icon panel-sidebar-toggle"
                type="button"
                aria-label="Toggle sidebar"
                aria-expanded={sidebarOpen}
                onClick={toggleSidebar}
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
            <Link to="/" className="glass-brand" aria-label="NovaSMM home" onClick={close}>
              <NovaLogo />
              <span>
                Nova<span className="brand-smm">SMM</span>
              </span>
            </Link>
          </div>
          {!isPanel && (
            <nav className="glass-desktop-links" aria-label="Main navigation">
              <button
                type="button"
                className={
                  open === 'services' || location.pathname === '/services' ? 'is-active' : ''
                }
                aria-expanded={open === 'services'}
                aria-controls="services-navigation"
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    triggerRef.current = event.currentTarget;
                    setOpen('services');
                    requestAnimationFrame(() =>
                      document.querySelector<HTMLAnchorElement>('#services-navigation a')?.focus(),
                    );
                  }
                }}
                onClick={(event) => toggle('services', event.currentTarget)}
              >
                Services <ChevronDown size={12} />
              </button>
              {sectionLink('how-it-works', 'How It Works')}
              {sectionLink('why-novasmm', 'Why NovaSMM')}
              <Link
                to="/pricing"
                onClick={close}
                aria-current={location.pathname === '/pricing' ? 'page' : undefined}
              >
                Pricing
              </Link>
            </nav>
          )}
          <div className="glass-actions">
            <button
              className="glass-icon desktop-action"
              type="button"
              aria-label="Search"
              title="Search services (Ctrl+K)"
              onClick={() => {
                close();
                setCommandOpen(true);
              }}
            >
              <Search size={17} />
              <kbd>⌘K</kbd>
            </button>
            <button
              className="glass-icon desktop-action"
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            {isAuthenticated ? (
              <>
                <Link
                  className="glass-wallet"
                  to="/app/wallet"
                  onClick={close}
                  aria-label={
                    wallet.isLoading
                      ? 'Wallet loading'
                      : `Wallet balance ${formatCents(wallet.balanceCents)}`
                  }
                >
                  <Wallet size={14} />
                  <span>{wallet.isLoading ? '…' : formatCents(wallet.balanceCents)}</span>
                </Link>
                <button
                  className="glass-avatar"
                  type="button"
                  aria-label="User menu"
                  aria-expanded={open === 'account'}
                  aria-controls="account-navigation"
                  onClick={(event) => toggle('account', event.currentTarget)}
                >
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </button>
              </>
            ) : (
              <Link className="glass-panel-cta" to="/login" onClick={close}>
                <img src="/images/nova-mascot.png" alt="" width="26" height="26" />
                <span>Enter panel</span>
                <ArrowUpRight size={14} />
              </Link>
            )}
            {!isPanel && (
              <button
                className="glass-icon mobile-menu-toggle"
                type="button"
                aria-label={open === 'mobile' ? 'Close navigation' : 'Open navigation'}
                aria-expanded={open === 'mobile'}
                aria-controls="mobile-navigation"
                onClick={(event) => toggle('mobile', event.currentTarget)}
              >
                {open === 'mobile' ? <X size={19} /> : <Menu size={19} />}
              </button>
            )}
          </div>
        </div>
        {open === 'services' && !isPanel && (
          <div className="glass-flyout services-flyout" id="services-navigation">
            <div className="glass-flyout-heading">
              <span>FIND YOUR NEXT SPARK</span>
              <Link to="/services" onClick={close}>
                All services <ArrowUpRight size={13} />
              </Link>
            </div>
            <nav aria-label="Telegram services" className="glass-offerings">
              {offerings.map((item) => (
                <Link to={item.to} key={item.name} onClick={close}>
                  <div className="glass-offering-art">
                    <img src={item.image} alt="" width="100" height="100" />
                  </div>
                  <strong>
                    {item.name}
                    <ArrowUpRight size={13} />
                  </strong>
                  <p>{item.detail}</p>
                </Link>
              ))}
            </nav>
          </div>
        )}
        {open === 'account' && isAuthenticated && (
          <div className="glass-flyout account-flyout" id="account-navigation">
            <div className="glass-account-heading">
              <strong>{currentUser.displayName}</strong>
              <span>{currentUser.email}</span>
            </div>
            <nav aria-label="Account navigation">
              <Link to={currentUser.role === 'admin' ? '/admin' : '/app'} onClick={close}>
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <Link to="/app/order/new" onClick={close}>
                New Order
              </Link>
              <Link to="/app/wallet" onClick={close}>
                Wallet & Billing{' '}
                <span>{wallet.isLoading ? '…' : formatCents(wallet.balanceCents)}</span>
              </Link>
              <Link to="/app/profile" onClick={close}>
                Profile Settings
              </Link>
              <button
                type="button"
                className="glass-signout"
                onClick={() => {
                  logout();
                  close();
                }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </nav>
          </div>
        )}
        {open === 'mobile' && !isPanel && (
          <nav
            className="glass-flyout mobile-flyout"
            id="mobile-navigation"
            aria-label="Mobile navigation"
          >
            <span className="glass-mobile-label">EXPLORE TELEGRAM</span>
            {offerings.map((item) => (
              <Link className="mobile-product-link" key={item.name} to={item.to} onClick={close}>
                <img src={item.image} alt="" width="40" height="40" />
                <span>{item.name}</span>
                <ArrowUpRight size={15} />
              </Link>
            ))}
            <div className="glass-mobile-sections">
              {sectionLink('how-it-works', 'How It Works')}
              {sectionLink('why-novasmm', 'Why NovaSMM')}
              <Link to="/pricing" onClick={close}>
                Pricing
              </Link>
            </div>
            <div className="glass-mobile-tools">
              <button
                type="button"
                onClick={() => {
                  close();
                  setCommandOpen(true);
                }}
              >
                <Search size={15} />
                Search services
              </button>
              <button type="button" aria-label="Toggle theme" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
            <Link
              className="mobile-panel-link"
              to={isAuthenticated ? '/app' : '/login'}
              onClick={close}
            >
              Go to customer panel <ArrowUpRight size={15} />
            </Link>
          </nav>
        )}
      </header>
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
