import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WalletPage } from './WalletPage';
import { useAppStore } from '../../app/store';

describe('WalletPage Client Payment Flow', () => {
  beforeEach(() => {
    useAppStore.getState().resetDemoData();
  });

  it('renders initial demo customer balance of $87.00', () => {
    render(
      <MemoryRouter>
        <WalletPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('$87.00')).toBeInTheDocument();
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

  it('displays "Pay by Visa or Mastercard" notice on click without external gateway', () => {
    render(
      <MemoryRouter>
        <WalletPage />
      </MemoryRouter>,
    );

    const payButton = screen.getByRole('button', { name: /Pay by Visa or Mastercard/i });
    fireEvent.click(payButton);

    const statusNotice = screen.getByRole('status');
    expect(statusNotice).toBeInTheDocument();
    expect(statusNotice).toHaveTextContent(/Pay by Visa or Mastercard/i);
    expect(statusNotice).toHaveTextContent(/Per client specification/i);
  });
});
