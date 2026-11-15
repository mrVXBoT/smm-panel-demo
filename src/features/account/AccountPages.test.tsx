import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WalletPage } from '../../pages/customer/WalletPage';
import { TransactionsPage } from '../../pages/customer/TransactionsPage';
import { SupportPage } from '../../pages/customer/SupportPage';
import { ProfilePage } from '../../pages/customer/ProfilePage';
import { resetDemoSystem } from '../../core/db/reset';
import { walletRepository } from '../../core/db/walletRepository';
import { useAppStore } from '../../app/store';
import { db } from '../../core/db/database';
beforeEach(async () => {
  await resetDemoSystem();
});
describe('account studio flows', () => {
  it('adds the selected amount using the selected simulated method', async () => {
    render(
      <MemoryRouter>
        <WalletPage />
      </MemoryRouter>,
    );
    const original = walletRepository.simulateTopUp.bind(walletRepository);
    const spy = vi.spyOn(walletRepository, 'simulateTopUp').mockImplementation(original);
    fireEvent.click(screen.getByRole('button', { name: '+$50.00' }));
    fireEvent.click(screen.getByRole('radio', { name: /Mastercard/ }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Pay by Visa or Mastercard' })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Pay by Visa or Mastercard' }));
    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: '5555555555554444' },
    });
    fireEvent.change(screen.getByLabelText('Expiry date'), { target: { value: '1235' } });
    fireEvent.change(screen.getByLabelText('CVV2'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.change(screen.getByLabelText('Image code'), { target: { value: '73842' } });
    fireEvent.click(screen.getByRole('button', { name: /Confirm payment/ }));
    await screen.findByText('Your wallet is ready.', {}, { timeout: 4000 });
    fireEvent.click(screen.getByRole('button', { name: 'Back to wallet' }));
    await screen.findByText('$50.00 added to your wallet.');
    expect(spy).toHaveBeenCalledWith(
      useAppStore.getState().currentUser.id,
      5000,
      'mastercard_demo',
    );
    spy.mockRestore();
  });
  it('filters the ledger by description and reference and opens a receipt', async () => {
    render(
      <MemoryRouter>
        <TransactionsPage />
      </MemoryRouter>,
    );
    await screen.findByText('Initial Demo Balance Seed');
    fireEvent.change(screen.getByRole('textbox', { name: 'Search transactions' }), {
      target: { value: 'ORD-8922' },
    });
    expect(screen.queryByText('Initial Demo Balance Seed')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Telegram Post Views/ }));
    expect(screen.getByRole('region', { name: 'Transaction details' })).toHaveTextContent(
      'ORD-8922',
    );
  });
  it('creates a support conversation and appends a local reply', async () => {
    render(
      <MemoryRouter>
        <SupportPage />
      </MemoryRouter>,
    );
    fireEvent.click(await screen.findByRole('button', { name: 'Open New Ticket' }));
    fireEvent.change(screen.getByLabelText('Subject'), {
      target: { value: 'Fictional order question' },
    });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'This is a fictional support question.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save ticket' }));
    await screen.findByLabelText('Add a reply');
    fireEvent.change(screen.getByLabelText('Add a reply'), {
      target: { value: 'Another fictional detail.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save reply' }));
    await screen.findByText('Another fictional detail.');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save reply' })).toBeEnabled());
    expect(await db.tickets.count()).toBe(1);
  });
  it('saves a profile and exposes reset as an explicit two-step action', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText('Display name'), {
      target: { value: 'Nova Test Persona' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));
    await screen.findByText('Profile updated.');
    expect(useAppStore.getState().currentUser.displayName).toBe('Nova Test Persona');
    fireEvent.click(screen.getByRole('button', { name: 'Restore sample data' }));
    expect(screen.getByRole('button', { name: 'Restore sample data now' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Keep my data' }));
    expect(
      screen.queryByRole('button', { name: 'Restore sample data now' }),
    ).not.toBeInTheDocument();
  });
});
