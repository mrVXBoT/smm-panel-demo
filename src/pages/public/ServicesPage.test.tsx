import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ServicesPage } from './ServicesPage';
function setup(path = '/services') {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/app/growth" element={<h1>Growth studio</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}
describe('service collection', () => {
  it('keeps each product linked to its owning studio and exact bundle', () => {
    setup();
    expect(screen.getAllByRole('article')).toHaveLength(7);
    expect(screen.getByRole('link', { name: 'Order 500 Telegram Stars' })).toHaveAttribute(
      'href',
      '/app/stars?service=srv_tg_stars_500',
    );
    expect(screen.getByRole('link', { name: 'Order Premium · 12 months' })).toHaveAttribute(
      'href',
      '/app/premium?service=srv_tg_premium_12m',
    );
    expect(screen.getByRole('link', { name: 'Order Post views' })).toHaveAttribute(
      'href',
      '/app/growth?service=srv_tg_views_instant',
    );
  });
  it('combines category filtering with search and recovers from an empty result', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /Premium 2/ }));
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2));
    fireEvent.change(screen.getByRole('textbox', { name: 'Search services' }), {
      target: { value: '12 months' },
    });
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1));
    fireEvent.change(screen.getByRole('textbox', { name: 'Search services' }), {
      target: { value: 'nothing-matches' },
    });
    expect(screen.getByRole('heading', { name: 'No matches just yet.' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Show all services/ }));
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(7));
    expect(screen.getByRole('textbox', { name: 'Search services' })).toHaveValue('');
  });
  it('restores a premium category link and preserves the legacy growth redirect', () => {
    setup('/services?category=cat_tg_premium');
    expect(screen.getByRole('button', { name: /Premium 2/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
  it('redirects legacy growth links to the growth studio', async () => {
    setup('/services?category=cat_tg_growth');
    expect(await screen.findByRole('heading', { name: 'Growth studio' })).toBeInTheDocument();
  });
});
