import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
  Search,
  ShoppingCart,
  Wallet,
  Sparkles,
  Crown,
  PhoneCall,
  LayoutDashboard,
  ShieldAlert,
  Send,
  X,
} from 'lucide-react';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { formatCents } from '../../core/utils/currency';

interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandMenu({ open: externalOpen, onOpenChange }: CommandMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const navigate = useNavigate();

  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;
  const setOpen = useCallback(
    (val: boolean) => {
      if (isControlled && onOpenChange) {
        onOpenChange(val);
      } else {
        setInternalOpen(val);
      }
    },
    [isControlled, onOpenChange],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-brand-surface-dark shadow-2xl overflow-hidden">
        <Command label="Search SMM services and navigation" className="flex flex-col w-full">
          <div className="flex items-center px-4 border-b border-slate-800">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <Command.Input
              placeholder="Search services, categories, or pages... (ESC to exit)"
              className="w-full h-12 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
            <Command.Empty className="py-6 text-center text-slate-500">
              No matching services or commands found.
            </Command.Empty>

            {/* Quick Navigation Group */}
            <Command.Group
              heading="Navigation"
              className="text-slate-500 font-semibold px-2 py-1.5 uppercase text-[10px] tracking-wider"
            >
              <Command.Item
                onSelect={() => {
                  navigate('/app');
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-primary" />
                <span>Customer Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  navigate('/app/order/new');
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-sky-400" />
                <span>Create New Order</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  navigate('/app/wallet');
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>Wallet & Payment Simulation</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  navigate('/admin');
                  setOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-brand-accent" />
                <span>Admin Operations Console</span>
              </Command.Item>
            </Command.Group>

            {/* Special Categories */}
            <Command.Group
              heading="Simulated Digital Goods"
              className="text-slate-500 font-semibold px-2 py-1.5 uppercase text-[10px] tracking-wider pt-2"
            >
              <Command.Item
                onSelect={() => {
                  navigate('/app/stars');
                  setOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Telegram Stars Gift Pack</span>
                </div>
                <span className="text-[10px] text-amber-400 font-mono">From $1.10</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  navigate('/app/premium');
                  setOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span>Telegram Premium Annual & 3M Pass</span>
                </div>
                <span className="text-[10px] text-purple-400 font-mono">From $11.99</span>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  navigate('/app/numbers');
                  setOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Virtual Numbers SMS Verification</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">From $0.85</span>
              </Command.Item>
            </Command.Group>

            {/* Services Catalog */}
            <Command.Group
              heading="Services Catalog"
              className="text-slate-500 font-semibold px-2 py-1.5 uppercase text-[10px] tracking-wider pt-2"
            >
              {INITIAL_SERVICES.map((s) => (
                <Command.Item
                  key={s.id}
                  onSelect={() => {
                    navigate(`/app/order/new?service=${s.id}`);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Send className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{s.name}</span>
                  </div>
                  <span className="font-mono text-brand-primary shrink-0 ml-2">
                    {s.pricePerThousandCents
                      ? `${formatCents(s.pricePerThousandCents)}/1k`
                      : `${formatCents(s.fixedPriceCents || 0)}`}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="p-2 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Use ↑ ↓ to navigate, ↵ to select</span>
            <span>ESC to close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
