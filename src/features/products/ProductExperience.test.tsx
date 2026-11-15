import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ProductExperience } from './ProductExperience';
const state = vi.hoisted(() => ({
  wallet: { balanceCents: 8700, isLoading: false },
  purchase: vi.fn(),
}));
vi.mock('../../core/db/hooks', () => ({ useCustomerWallet: () => state.wallet }));
vi.mock('./productService', async (importOriginal) => {
  const original = await importOriginal<typeof import('./productService')>();
  return { ...original, productCheckout: { purchase: state.purchase } };
});
beforeEach(() => {
  vi.clearAllMocks();
  state.wallet.balanceCents = 8700;
  state.wallet.isLoading = false;
});
function setup(kind: 'stars' | 'premium' | 'growth') {
  render(
    <MemoryRouter>
      <ProductExperience kind={kind} />
    </MemoryRouter>,
  );
}
describe('product worlds', () => {
  it('selects fresh Stars bundle with keyboard and supports self preview', async () => {
    setup('stars');
    const pack = screen.getByRole('radio', { name: /500 Stars/ });
    pack.focus();
    await userEvent.keyboard(' ');
    expect(pack).toBeChecked();
    expect(screen.getByText('$9.80')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'For myself' }));
    expect(screen.getByLabelText('Recipient')).toHaveValue('');
    expect(screen.getByLabelText('Recipient')).toBeEnabled();
    expect(screen.getByAltText(/golden glass star/)).toHaveAttribute(
      'src',
      '/images/nova-stars-world.png',
    );
  });
  it('changes Premium duration and interactive profile preview', () => {
    setup('premium');
    fireEvent.click(screen.getByRole('radio', { name: /12 months/ }));
    expect(screen.getByText('$28.99')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Emoji' }));
    expect(screen.getByText('A world of expressive emoji')).toBeInTheDocument();
  });
  it('changes Growth category, minimum quantity and rounded price', () => {
    setup('growth');
    fireEvent.click(screen.getByRole('radio', { name: /Post views/ }));
    expect(screen.getByLabelText('Quantity')).toHaveValue(500);
    expect(screen.getByText('$0.08')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '1,000' }));
    expect(screen.getByText('$0.15')).toBeInTheDocument();
    expect(screen.getByText('Views +1000')).toBeInTheDocument();
  });
  it('handles failure, retry and a clearly simulated receipt', async () => {
    state.purchase
      .mockRejectedValueOnce(new Error('Could not save demo'))
      .mockResolvedValueOnce({ id: 'TEST-1', chargeCents: 110, target: '@nova_demo' });
    setup('stars');
    fireEvent.change(screen.getByLabelText('Recipient'), { target: { value: '@sample_user' } });
    fireEvent.click(screen.getByRole('button', { name: /Order Stars/ }));
    await screen.findByRole('alert');
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save demo');
    fireEvent.click(screen.getByRole('button', { name: /Order Stars/ }));
    await screen.findByText('A little idea, now an order.');
    expect(screen.getByText('TEST-1')).toBeInTheDocument();
    expect(screen.getByText(/actually delivered/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Create another/ }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Order Stars/ })).toBeInTheDocument(),
    );
  });
  it('blocks checkout for loading and insufficient funds', () => {
    state.wallet.balanceCents = 0;
    setup('premium');
    expect(screen.getByRole('alert')).toHaveTextContent('Add funds');
    expect(screen.getByRole('button', { name: /Order Premium/ })).toBeDisabled();
  });
  it('blocks checkout while loading without flashing insufficient funds', () => {
    state.wallet.isLoading = true;
    setup('growth');
    expect(screen.getByRole('button', { name: /Loading wallet/ })).toBeDisabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
