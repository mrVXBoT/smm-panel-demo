import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
  LayoutDashboard,
  Plus,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { formatCents } from '../../core/utils/currency';
import { productRoute } from '../../core/utils/productRoutes';
import { useAppStore } from '../../app/store';
import { AccountGlyph } from '../../features/account/AccountGlyph';
import { NovaLogo } from '../layout/NovaLogo';
import './command-menu.css';
interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
const products = [
  {
    id: 'stars',
    title: 'Telegram Stars',
    description: 'A little star power',
    category: 'cat_tg_stars',
    href: '/app/stars',
  },
  {
    id: 'premium',
    title: 'Telegram Premium',
    description: 'Something extraordinary',
    category: 'cat_tg_premium',
    href: '/app/premium',
  },
  {
    id: 'growth',
    title: 'Channel Growth',
    description: 'Your next chapter',
    category: 'cat_tg_growth',
    href: '/app/growth',
  },
] as const;
export function CommandMenu({ open: externalOpen, onOpenChange }: CommandMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const role = useAppStore((state) => state.currentUser.role);
  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;
  const setOpen = useCallback(
    (value: boolean) => {
      if (!value) setQuery('');
      if (isControlled) onOpenChange?.(value);
      else setInternalOpen(value);
    },
    [isControlled, onOpenChange],
  );
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!isOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, setOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    input.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [isOpen]);
  const close = () => {
    setOpen(false);
    setQuery('');
  };
  const go = (path: string) => {
    close();
    navigate(path);
  };
  const pages = [
    {
      label: 'Dashboard',
      detail: 'Your workspace at a glance',
      path: '/app',
      keywords: ['home', 'account'],
      glyph: <LayoutDashboard size={20} />,
    },
    {
      label: 'New order',
      detail: 'Choose your next product',
      path: '/app/order/new',
      keywords: ['create', 'buy'],
      glyph: <Plus size={20} />,
    },
    {
      label: 'Wallet & payments',
      detail: 'Balance, top-ups and funds',
      path: '/app/wallet',
      keywords: ['billing', 'money'],
      glyph: <AccountGlyph kind="wallet" />,
    },
    {
      label: 'Transactions',
      detail: 'Every wallet movement',
      path: '/app/transactions',
      keywords: ['history', 'receipt'],
      glyph: <AccountGlyph kind="transactions" />,
    },
    {
      label: 'Support',
      detail: 'A little help from Nova',
      path: '/app/support',
      keywords: ['ticket', 'help'],
      glyph: <AccountGlyph kind="support" />,
    },
    {
      label: 'Profile',
      detail: 'Make yourself at home',
      path: '/app/profile',
      keywords: ['settings', 'name'],
      glyph: <AccountGlyph kind="profile" />,
    },
    ...(role === 'admin'
      ? [
          {
            label: 'Operations console',
            detail: 'Administration workspace',
            path: '/admin',
            keywords: ['admin'],
            glyph: <ShieldCheck size={20} />,
          },
        ]
      : []),
  ];
  if (!isOpen) return null;
  return (
    <dialog
      ref={dialog}
      className="nova-search-dialog"
      aria-labelledby="nova-search-heading"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target !== dialog.current) return;
        const rect = dialog.current.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          close();
      }}
    >
      <Command label="Search NovaSMM" loop className="nova-search-command">
        <header className="nova-search-header">
          <div>
            <NovaLogo />
            <span id="nova-search-heading">
              A shortcut to your next idea.<small aria-hidden="true">THE NOVA FINDER</small>
            </span>
          </div>
          <button type="button" aria-label="Close search" onClick={close}>
            <X size={18} />
          </button>
        </header>
        <div className="nova-search-input">
          <Search size={22} aria-hidden="true" />
          <Command.Input
            ref={input}
            autoFocus
            aria-label="Search services and pages"
            value={query}
            onValueChange={setQuery}
            placeholder="What are you looking for?"
          />
          {query ? (
            <button type="button" aria-label="Clear search" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          ) : (
            <kbd>⌘ K</kbd>
          )}
        </div>
        <Command.List className="nova-search-results">
          <Command.Empty className="nova-search-empty">
            <span aria-hidden="true">⌕</span>
            <h3>No matches just yet.</h3>
            <p>Try Stars, Premium, wallet or a service name.</p>
            <button type="button" onClick={() => setQuery('')}>
              Explore everything <ArrowRight size={15} />
            </button>
          </Command.Empty>
          {!query.trim() && (
            <Command.Group heading="Discover your next upgrade" className="nova-search-products">
              <div className="nova-search-product-grid">
                {products.map((product) => {
                  const price = Math.min(
                    ...INITIAL_SERVICES.filter(
                      (service) =>
                        service.categoryId === product.category && service.status === 'active',
                    ).map(
                      (service) => service.fixedPriceCents ?? service.pricePerThousandCents ?? 0,
                    ),
                  );
                  return (
                    <Command.Item
                      key={product.id}
                      value={product.title}
                      className={`nova-search-product search-tone-${product.id}`}
                      onSelect={() => go(product.href)}
                    >
                      <div className="nova-search-product-art">
                        <img src={`/images/solution-${product.id}.png`} alt="" />
                        <ArrowRight size={15} />
                      </div>
                      <strong>{product.title}</strong>
                      <span>{product.description}</span>
                      <small>
                        From {formatCents(price)}
                        {product.id === 'growth' ? ' / 1,000' : ''}
                      </small>
                    </Command.Item>
                  );
                })}
              </div>
            </Command.Group>
          )}
          {query.trim() && (
            <Command.Group heading="Services · choose your bundle" className="nova-search-group">
              {INITIAL_SERVICES.filter((service) => service.status === 'active').map((service) => {
                const product =
                  products.find((item) => item.category === service.categoryId) ?? products[2];
                return (
                  <Command.Item
                    key={service.id}
                    value={`${service.id} ${service.name}`}
                    keywords={[service.description, product.title]}
                    className={`nova-search-service search-tone-${product.id}`}
                    onSelect={() => go(productRoute(service.id))}
                  >
                    <span className="nova-search-service-art">
                      <img src={`/images/solution-${product.id}.png`} alt="" />
                    </span>
                    <span className="nova-search-row-copy">
                      <strong>{service.name}</strong>
                      <small>{product.title}</small>
                    </span>
                    <span className="nova-search-price">
                      {formatCents(service.fixedPriceCents ?? service.pricePerThousandCents ?? 0)}
                      <small>
                        {service.pricePerThousandCents !== undefined ? '/ 1,000' : '/ bundle'}
                      </small>
                    </span>
                    <CornerDownLeft size={14} className="nova-search-enter" />
                  </Command.Item>
                );
              })}
            </Command.Group>
          )}
          <Command.Group
            heading={query.trim() ? 'Pages & shortcuts' : 'Your workspace, one step away'}
            className="nova-search-group nova-search-pages"
          >
            {pages.map((page) => (
              <Command.Item
                key={page.path}
                value={page.label}
                keywords={page.keywords}
                className="nova-search-page"
                onSelect={() => go(page.path)}
              >
                <span className="nova-search-page-glyph">{page.glyph}</span>
                <span className="nova-search-row-copy">
                  <strong>{page.label}</strong>
                  <small>{page.detail}</small>
                </span>
                <ArrowRight size={15} className="nova-search-page-arrow" />
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
        <footer className="nova-search-footer">
          <span>
            <kbd>
              <ArrowUp size={11} />
            </kbd>
            <kbd>
              <ArrowDown size={11} />
            </kbd>{' '}
            Navigate{' '}
            <kbd>
              <CornerDownLeft size={11} />
            </kbd>{' '}
            Open
          </span>
          <span>
            <kbd>esc</kbd> Close
          </span>
        </footer>
      </Command>
    </dialog>
  );
}
