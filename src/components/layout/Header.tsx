import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Wallet,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  Zap,
  Search,
  HelpCircle,
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet } from '../../core/db/hooks';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../ui/button';
import { CommandMenu } from '../ui/command-menu';
import { startDemoTour } from '../ui/tour';

export function Header() {
  const { theme, toggleTheme, currentUser, switchRole, sidebarOpen, toggleSidebar } = useAppStore();
  const wallet = useCustomerWallet(currentUser.id);

  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();
  const isAppOrAdmin =
    location.pathname.startsWith('/app') || location.pathname.startsWith('/admin');

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-800/80 bg-brand-surface-dark/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand & Left Navigation */}
          <div className="flex items-center gap-4">
            {isAppOrAdmin && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Toggle Navigation Sidebar"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" id="tour-brand" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent p-0.5 shadow-md shadow-brand-primary/20 group-hover:shadow-brand-primary/40 transition-shadow">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  NovaSMM
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-primary/20 text-brand-primary border border-brand-primary/40">
                    DEMO
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Simulation Suite</span>
              </div>
            </Link>

            {/* Desktop Nav Links (Public) */}
            <nav className="hidden md:flex items-center gap-1 ml-6 text-sm font-medium text-slate-300">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/'
                    ? 'text-brand-primary font-semibold'
                    : 'hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Overview
              </Link>
              <Link
                to="/services"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/services'
                    ? 'text-brand-primary font-semibold'
                    : 'hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Services
              </Link>
              <Link
                to="/pricing"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  location.pathname === '/pricing'
                    ? 'text-brand-primary font-semibold'
                    : 'hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Command Menu Search Trigger (cmdk) */}
            <button
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900/60 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
              title="Search services (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">
                ⌘K
              </kbd>
            </button>

            {/* Onboarding Tour Button (Driver.js) */}
            <button
              onClick={startDemoTour}
              className="p-2 rounded-xl border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Start Interactive Walkthrough Tour"
              aria-label="Start Tour"
            >
              <HelpCircle className="w-4 h-4 text-brand-primary" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-sky-400" />
              )}
            </button>

            {/* Customer Balance Widget */}
            <Link
              to="/app/wallet"
              id="tour-balance"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-primary/30 bg-brand-primary/10 hover:bg-brand-primary/20 transition-all text-xs text-brand-primary font-semibold shadow-sm"
              title="Demo Wallet Balance ($87.00 test funds available)"
            >
              <Wallet className="w-3.5 h-3.5 text-brand-primary" />
              <span className="font-mono text-sm tracking-tight text-white">
                {formatCents(wallet.balanceCents)}
              </span>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 bg-brand-primary/20 rounded font-normal text-sky-200">
                Demo
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

            {/* App / Dashboard Link */}
            {!isAppOrAdmin ? (
              <Link to="/app">
                <Button size="sm" className="gap-1.5 cursor-pointer">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Open Demo</span>
                </Button>
              </Link>
            ) : (
              <Link to={currentUser.role === 'admin' ? '/admin' : '/app'}>
                <div className="flex items-center gap-2 pl-1">
                  <div className="w-8 h-8 rounded-full border border-brand-primary/40 overflow-hidden bg-slate-800">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-brand-primary">
                        {currentUser.displayName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
