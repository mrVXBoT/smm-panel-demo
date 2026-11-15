import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { NewOrderPage } from './NewOrderPage';
import { productRoute } from '../../core/utils/productRoutes';
describe('New Order product launcher', () => {
  it('links each product to its own studio without duplicating checkout', () => {
    render(
      <MemoryRouter>
        <NewOrderPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: /Telegram Stars/ })).toHaveAttribute(
      'href',
      '/app/stars',
    );
    expect(screen.getByRole('link', { name: /Telegram Premium/ })).toHaveAttribute(
      'href',
      '/app/premium',
    );
    expect(screen.getByRole('link', { name: /Channel Growth/ })).toHaveAttribute(
      'href',
      '/app/growth',
    );
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });
  it('redirects old service deep links to the owning product', () => {
    render(
      <MemoryRouter initialEntries={['/app/order/new?service=srv_tg_premium_12m']}>
        <Routes>
          <Route path="/app/order/new" element={<NewOrderPage />} />
          <Route path="/app/premium" element={<h1>Premium studio</h1>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Premium studio' })).toBeInTheDocument();
  });
  it('resolves catalog checkout links consistently', () => {
    expect(productRoute('srv_tg_views_instant')).toBe('/app/growth?service=srv_tg_views_instant');
    expect(productRoute('srv_tg_stars_500')).toBe('/app/stars?service=srv_tg_stars_500');
    expect(productRoute('missing')).toBe('/app/order/new');
  });
});
