import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  Menu,
  X,
  Search,
  LogIn,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet } from '../../core/db/hooks';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../ui/button';
import { CommandMenu } from '../ui/command-menu';

export function Header() {
  const {
    theme,
    toggleTheme,
    currentUser,
    isAuthenticated,
    logout,
    switchRole,
    sidebarOpen,
    toggleSidebar,
  } = useAppStore();
  const wallet = useCustomerWallet(currentUser.id);

  const [commandOpen, setCommandOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const isAppOrAdmin =
    location.pathname.startsWith('/app') || location.pathname.startsWith('/admin');

  const navLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Pricing', href: '/pricing' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-800/80 bg-brand-surface-dark/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Hamburger (mobile app) + Logo */}
          <div className="flex items-center gap-3">
            {isAppOrAdmin && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              {/* Gradient "N" logo box */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-brand-primary to-indigo-500 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-shadow">
                <span className="font-black text-white text-base leading-none select-none">N</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">NovaSMM</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
                  DEMO
                </span>
              </div>
            </Link>

            {/* Center nav — desktop only, public pages */}
            {!isAppOrAdmin && (
              <nav className="hidden md:flex items-center gap-1 ml-6">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-brand-primary font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search (Ctrl+K) */}
            <button
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900/60 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
              title="Search services (Ctrl+K)"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline text-slate-400">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">
                ⌘K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-sky-400" />
              )}
            </button>

            {/* Wallet balance chip */}
            <Link
              to="/app/wallet"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-primary/30 bg-brand-primary/10 hover:bg-brand-primary/20 transition-all text-xs text-brand-primary font-semibold shadow-sm"
              title="Available Balance"
            >
              <Wallet className="w-3.5 h-3.5 text-brand-primary" />
              <span className="font-mono text-sm tracking-tight text-white">
                {wallet.isLoading ? '...' : formatCents(wallet.balanceCents)}
              </span>
            </Link>

            {/* Quick Role Switcher Button */}
            <div className="hidden sm:flex items-center">
              {currentUser.role === 'customer' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchRole('admin')}
                  className="gap-1.5 text-xs text-slate-300 border-slate-700 hover:border-brand-accent hover:text-brand-accent cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Admin View</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchRole('customer')}
                  className="gap-1.5 text-xs text-slate-300 border-slate-700 hover:border-brand-primary hover:text-brand-primary cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Customer View</span>
                </Button>
              )}
            </div>

            {/* Auth: Sign In or User menu */}
            {!isAuthenticated ? (
              <Link to="/login">
                <Button size="sm" className="gap-1.5 text-xs cursor-pointer">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Button>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full border border-brand-primary/40 overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-xs text-brand-primary shrink-0">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      currentUser.displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="hidden sm:block text-xs font-medium text-slate-200 max-w-[90px] truncate">
                    {currentUser.displayName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 z-20 w-48 rounded-xl border border-slate-800 bg-brand-surface-dark shadow-2xl py-1.5">
                      <div className="px-4 py-2 border-b border-slate-800/80">
                        <div className="text-xs font-bold text-white truncate">
                          {currentUser.displayName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {currentUser.email}
                        </div>
                      </div>
                      <Link
                        to={currentUser.role === 'admin' ? '/admin' : '/app'}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/app/order/new"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        New Order
                      </Link>
                      <Link
                        to="/app/wallet"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        Wallet & Billing
                      </Link>
                      <Link
                        to="/app/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        Profile Settings
                      </Link>
                      <div className="my-1 border-t border-slate-800" />
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
