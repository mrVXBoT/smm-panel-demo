import { Link } from 'react-router-dom';
import { Sparkles, Shield, AlertCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-brand-bg-dark text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-primary" />
            </div>
            <span className="font-extrabold text-lg text-white">NovaSMM Demo</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Frontend-only interactive simulation platform for SMM marketing operations, customer
            management, and growth services testing.
          </p>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2 max-w-md">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Demo Disclaimer:</strong> All orders, Stars, Premium codes, phone numbers, and
              balances are simulations. The Visa/Mastercard payment flow is a UI test method and
              collects zero real payment or personal information.
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Services Showcase
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/services" className="hover:text-brand-primary transition-colors">
                Telegram Growth
              </Link>
            </li>
            <li>
              <Link to="/app/stars" className="hover:text-brand-primary transition-colors">
                Telegram Stars
              </Link>
            </li>
            <li>
              <Link to="/app/premium" className="hover:text-brand-primary transition-colors">
                Telegram Premium
              </Link>
            </li>
            <li>
              <Link to="/app/numbers" className="hover:text-brand-primary transition-colors">
                Fictional Virtual Numbers
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-brand-primary transition-colors">
                Instagram, TikTok & YouTube
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Demo Navigation
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/login" className="hover:text-brand-primary transition-colors">
                Demo Sign In
              </Link>
            </li>
            <li>
              <Link to="/app" className="hover:text-brand-primary transition-colors">
                Customer Workspace ($87.00)
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-brand-primary transition-colors">
                Admin Operations Console
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-brand-primary transition-colors">
                Tiered Pricing
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Frontend Sandbox Prototype • No Real Financial Processing</span>
        </div>
        <div>
          © {new Date().getFullYear()} NovaSMM Simulation Project. Built with React 19 & Tailwind
          CSS.
        </div>
      </div>
    </footer>
  );
}
