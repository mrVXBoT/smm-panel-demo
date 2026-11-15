import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';
import { resetDemoSystem } from '../../core/db/reset';
import { useAppStore } from '../../app/store';

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}
afterEach(cleanup);
describe('Header Component', () => {
  beforeEach(async () => {
    await resetDemoSystem();
  });
  it('renders the original brand without the removed demo badge', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: 'NovaSMM home' })).toBeInTheDocument();
    expect(screen.queryByText('DEMO')).not.toBeInTheDocument();
  });
  it('renders the authenticated customer balance from the wallet service', async () => {
    renderHeader();
    await waitFor(() => {
      expect(screen.getByText('$87.00')).toBeInTheDocument();
    });
  });
  it('does not offer role switching in the account menu', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: 'User menu' }));
    expect(
      screen.queryByRole('button', { name: /Admin View|Customer View/ }),
    ).not.toBeInTheDocument();
    expect(useAppStore.getState().currentUser.role).toBe('customer');
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
  });
  it('supports keyboard service navigation and restores focus on Escape', async () => {
    const user = userEvent.setup();
    renderHeader();
    const trigger = screen.getByRole('button', { name: 'Services' });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /^Telegram Stars/ })).toHaveAttribute(
      'href',
      '/app/stars',
    );
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
  it('shows visitor entry instead of seeded account balance when signed out', () => {
    useAppStore.getState().logout();
    renderHeader();
    expect(screen.getByRole('link', { name: 'Enter panel' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: 'User menu' })).not.toBeInTheDocument();
    expect(screen.queryByText('$87.00')).not.toBeInTheDocument();
  });
  it('switches the document theme and persists the preference in both directions', async () => {
    useAppStore.getState().setTheme('dark');
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));
    expect(document.documentElement).toHaveClass('light');
    expect(document.documentElement).not.toHaveClass('dark');
    expect(JSON.parse(localStorage.getItem('smm_panel_demo_session_v2')!).state.theme).toBe(
      'light',
    );
    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));
    expect(document.documentElement).toHaveClass('dark');
    expect(useAppStore.getState().theme).toBe('dark');
  });
  it('closes mobile navigation on outside interaction and exposes section anchors', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'How It Works' })[0]).toHaveAttribute(
      'href',
      '/#how-it-works',
    );
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });
});
