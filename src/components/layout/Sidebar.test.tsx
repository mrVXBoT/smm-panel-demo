import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../../app/store';
vi.mock('../../core/db/hooks', () => ({
  useCustomerWallet: () => ({ balanceCents: 8700, isLoading: false }),
}));
function setup(path = '/app/growth', mode: 'customer' | 'admin' = 'customer') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar mode={mode} />
    </MemoryRouter>,
  );
}
beforeEach(() => {
  useAppStore.getState().resetDemoSession();
  useAppStore.setState({ sidebarCollapsed: false });
});
describe('floating navigation dock', () => {
  it('keeps product destinations distinct and marks exactly the current page', () => {
    setup();
    expect(screen.getByRole('link', { name: 'Channel Growth' })).toHaveAttribute(
      'href',
      '/app/growth',
    );
    expect(screen.getByRole('link', { name: 'Channel Growth' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'New Order' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Telegram Stars' })).toHaveAttribute(
      'href',
      '/app/stars',
    );
  });
  it('persists compact view and preserves accessible names', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(useAppStore.getState().sidebarCollapsed).toBe(true);
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('link', { name: 'Telegram Premium' })).toHaveAttribute(
      'title',
      'Telegram Premium',
    );
    const stored = JSON.parse(localStorage.getItem('smm_panel_demo_session_v2') ?? '{}') as {
      state: { sidebarCollapsed: boolean };
    };
    expect(stored.state.sidebarCollapsed).toBe(true);
  });
  it('opens account links and closes with Escape or outside pointer', () => {
    setup();
    const trigger = screen.getByRole('button', { name: 'Account details' });
    fireEvent.click(trigger);
    expect(screen.getByText('$87.00 · Wallet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Your profile' })).toHaveAttribute(
      'href',
      '/app/profile',
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('link', { name: 'Your profile' })).not.toBeInTheDocument();
  });
  it('closes the mobile drawer using Escape and restores focus', async () => {
    const media = vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    useAppStore.setState({ sidebarOpen: true });
    setup();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Close sidebar' })).toHaveFocus(),
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(useAppStore.getState().sidebarOpen).toBe(false);
    expect(opener).toHaveFocus();
    opener.remove();
    media.mockRestore();
  });
  it('retains administration navigation without customer checkout links', () => {
    setup('/admin/services', 'admin');
    expect(screen.getByRole('link', { name: 'Manage Services' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.queryByRole('link', { name: 'New Order' })).not.toBeInTheDocument();
  });
});
