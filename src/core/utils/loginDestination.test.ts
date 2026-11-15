import { describe, expect, it } from 'vitest';
import { loginDestination } from './loginDestination';
describe('post-login destination', () => {
  it('preserves the selected bundle, query and fragment', () => {
    expect(
      loginDestination(
        { pathname: '/app/stars', search: '?service=srv_tg_stars_500', hash: '#details' },
        'customer',
      ),
    ).toBe('/app/stars?service=srv_tg_stars_500#details');
  });
  it('keeps customer accounts out of admin destinations', () => {
    expect(loginDestination({ pathname: '/admin/orders' }, 'customer')).toBe('/app');
    expect(loginDestination({ pathname: '/admin/orders' }, 'admin')).toBe('/admin/orders');
  });
  it.each([
    null,
    {},
    '/app/stars',
    { pathname: '//example.com' },
    { pathname: '/app\\evil' },
    { pathname: '/login' },
    { pathname: '/admin-other' },
  ])('rejects malformed or non-workspace destinations: %j', (from) => {
    expect(loginDestination(from, 'customer')).toBe('/app');
  });
  it('sends removed number links to the product chooser', () => {
    expect(loginDestination({ pathname: '/app/numbers' }, 'customer')).toBe('/app/order/new');
  });
});
