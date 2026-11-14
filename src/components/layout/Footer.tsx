import { Link } from 'react-router-dom';
import { Send, Twitter, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/70 bg-brand-bg-dark text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-md shadow-sky-500/20">
                <span className="font-black text-white text-sm leading-none select-none">N</span>
              </div>
              <span className="font-bold text-base tracking-tight text-white">
                Nova<span className="text-brand-primary">SMM</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Your all-in-one Telegram growth platform. Boost subscribers, send Stars, and unlock
              Premium — all in minutes.
            </p>
          </div>

          {/* Products column */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Products
            </h4>
            <ul className="space-y-2.5 text-sm">
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
                <Link to="/app/order/new" className="hover:text-brand-primary transition-colors">
                  Channel Growth
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-primary transition-colors">
                  All Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-brand-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/app" className="hover:text-brand-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Social column */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://t.me/novasmm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-brand-primary transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/novasmm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-brand-primary transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/novasmm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-brand-primary transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              </li>
              <li>
                <Link to="/app/support" className="hover:text-brand-primary transition-colors">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} NovaSMM. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-700 text-center">
            NovaSMM is a sales demonstration platform. Services are simulated for showcase purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
