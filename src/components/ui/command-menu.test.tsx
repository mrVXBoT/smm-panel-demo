import { useState } from 'react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { CommandMenu } from './command-menu';
import { useAppStore } from '../../app/store';
beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => useAppStore.getState().resetDemoSession());
function Harness() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <>
      <button onClick={() => setOpen(true)}>Find something</button>
      <CommandMenu open={open} onOpenChange={setOpen} />
      <output aria-label="Current route">
        {location.pathname}
        {location.search}
      </output>
    </>
  );
}
function setup() {
  render(
    <MemoryRouter>
      <Harness />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Find something' }));
}
describe('Nova finder', () => {
  it('offers only Telegram products and hides admin navigation for a customer', () => {
    setup();
    expect(screen.getByRole('dialog')).toHaveAccessibleName('A shortcut to your next idea.');
    expect(screen.getByRole('option', { name: /Channel Growth/ })).toBeInTheDocument();
    expect(screen.queryByText(/Virtual Numbers/)).not.toBeInTheDocument();
    expect(screen.queryByText('Operations console')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveFocus();
  });
  it('searches exact bundles and opens the matching product with Enter', async () => {
    setup();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '500 Telegram Stars' } });
    await waitFor(() =>
      expect(screen.getByRole('option', { name: /500 Telegram Stars/ })).toBeInTheDocument(),
    );
    await userEvent.keyboard('{Enter}');
    expect(screen.getByLabelText('Current route')).toHaveTextContent(
      '/app/stars?service=srv_tg_stars_500',
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('clears empty results and closes with Escape, restoring focus', async () => {
    setup();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'no-such-product-xyz' } });
    expect(await screen.findByText('No matches just yet.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Explore everything/ }));
    expect(screen.getByRole('combobox')).toHaveValue('');
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
  it('toggles with Ctrl+K and exposes the console only to the admin account', () => {
    useAppStore.getState().loginAsDemo('admin');
    render(
      <MemoryRouter>
        <CommandMenu />
      </MemoryRouter>,
    );
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(screen.getByText('Operations console')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
