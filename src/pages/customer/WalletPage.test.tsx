import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WalletPage } from './WalletPage';
import { resetDemoSystem } from '../../core/db/reset';

describe('WalletPage Client Payment Flow', () => {
  beforeEach(async () => {
    await resetDemoSystem();
  });

  it('renders initial demo customer balance of $87.00', async () => {
    render(
      <MemoryRouter>
        <WalletPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('$87.00')).toBeInTheDocument();
    });
  });

  it('renders primary button reading strictly "Pay by Visa or Mastercard"', () => {
    render(
      <MemoryRouter>
        <WalletPage />
      </MemoryRouter>,
    );

    const payButton = screen.getByRole('button', { name: /Pay by Visa or Mastercard/i });
    expect(payButton).toBeInTheDocument();
  });

  it('opens the branded demo gateway without collecting card data', async () => {
    render(
      <MemoryRouter>
        <WalletPage />
      </MemoryRouter>,
    );
    const payButton = screen.getByRole('button', { name: /Pay by Visa or Mastercard/i });
    await waitFor(() => expect(payButton).toBeEnabled());
    fireEvent.click(payButton);
    expect(screen.getByRole('dialog')).toHaveTextContent(
      'Preview payment: no real money is transferred.',
    );
    expect(screen.getByRole('button', { name: /Confirm payment/ })).toBeInTheDocument();
    expect(screen.getByLabelText('Card number')).toHaveValue('');
    expect(screen.getByLabelText('Expiry date')).toBeInTheDocument();
    expect(screen.getByLabelText('CVV2')).toBeInTheDocument();
  });
});
