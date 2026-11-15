import type { UserRole } from '../types/models';

/** Resume only internal workspace routes that this account may open. */
export function loginDestination(from: unknown, role: UserRole): string {
  const fallback = role === 'admin' ? '/admin' : '/app';
  if (
    !from ||
    typeof from !== 'object' ||
    !('pathname' in from) ||
    typeof from.pathname !== 'string'
  )
    return fallback;
  const { pathname } = from;
  if (pathname.includes('\\') || pathname.startsWith('//')) return fallback;
  if (pathname === '/app/numbers' || pathname.startsWith('/app/numbers/')) return '/app/order/new';
  const customerPath = pathname === '/app' || pathname.startsWith('/app/');
  const adminPath = pathname === '/admin' || pathname.startsWith('/admin/');
  if (!customerPath && !(role === 'admin' && adminPath)) return fallback;
  const search =
    'search' in from && typeof from.search === 'string' && from.search.startsWith('?')
      ? from.search
      : '';
  const hash =
    'hash' in from && typeof from.hash === 'string' && from.hash.startsWith('#') ? from.hash : '';
  return `${pathname}${search}${hash}`;
}
