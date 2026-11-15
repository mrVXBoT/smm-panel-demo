import { describe, expect, it, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DemoCheckout } from './DemoCheckout';
import { walletRepository } from '../../core/db/walletRepository';
vi.mock('../../core/db/walletRepository', () => ({ walletRepository: { simulateTopUp: vi.fn() } }));
vi.mock('./checkoutGateway', () => ({
  checkoutGateway: { authorize: vi.fn().mockResolvedValue(undefined) },
}));
const simulate = vi.mocked(walletRepository.simulateTopUp);
beforeEach(() => vi.clearAllMocks());
function setup() {
  const onClose = vi.fn(),
    onSuccess = vi.fn();
  render(
    <DemoCheckout
      userId="demo"
      amountCents={5000}
      initialMethod="visa_demo"
      onClose={onClose}
      onSuccess={onSuccess}
    />,
  );
  return { onClose, onSuccess };
}
function completeCardForm() {
  fireEvent.change(screen.getByLabelText('Card number'), { target: { value: '4242424242424242' } });
  fireEvent.change(screen.getByLabelText('Expiry date'), { target: { value: '1235' } });
  fireEvent.change(screen.getByLabelText('CVV2'), { target: { value: '123' } });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.change(screen.getByLabelText('Image code'), { target: { value: '73842' } });
}
describe('custom demo checkout', () => {
  it('cancels without touching the ledger and never exposes payment credential fields', () => {
    const { onClose } = setup();
    expect(screen.getByLabelText('Card number')).toHaveValue('');
    fireEvent.click(screen.getByRole('button', { name: /Cancel and return/ }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(simulate).not.toHaveBeenCalled();
  });
  it('uses the selected method and blocks duplicate submissions and closing while pending', async () => {
    let release: (() => void) | undefined;
    simulate.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          release = () =>
            resolve({ payment: { id: 'PAY-DEMO' }, ledgerEntry: {}, wallet: {} } as Awaited<
              ReturnType<typeof walletRepository.simulateTopUp>
            >);
        }),
    );
    const { onClose, onSuccess } = setup();
    fireEvent.click(screen.getByRole('radio', { name: 'Mastercard' }));
    completeCardForm();
    const confirm = screen.getByRole('button', { name: /Confirm payment/ });
    fireEvent.click(confirm);
    fireEvent.click(confirm);
    await waitFor(() => expect(simulate).toHaveBeenCalledTimes(1));
    expect(simulate).toHaveBeenCalledWith('demo', 5000, 'mastercard_demo');
    expect(screen.getByRole('button', { name: 'Close checkout' })).toBeDisabled();
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(onClose).not.toHaveBeenCalled();
    await act(async () => release?.());
    expect(screen.getByText('PAY-DEMO')).toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalledWith(5000);
  });
  it('rejects an incorrect image code without touching the ledger', () => {
    setup();
    completeCardForm();
    fireEvent.change(screen.getByLabelText('Image code'), { target: { value: '00000' } });
    fireEvent.click(screen.getByRole('button', { name: /Confirm payment/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('enter the image code');
    expect(simulate).not.toHaveBeenCalled();
  });
  it('shows a failure and allows an explicit retry', async () => {
    simulate.mockRejectedValueOnce(new Error('offline'));
    setup();
    completeCardForm();
    fireEvent.click(screen.getByRole('button', { name: /Confirm payment/ }));
    await screen.findByRole('alert');
    expect(screen.getByRole('button', { name: /Confirm payment/ })).toBeEnabled();
    expect(screen.queryByText('Your wallet is ready.')).not.toBeInTheDocument();
  });
});
