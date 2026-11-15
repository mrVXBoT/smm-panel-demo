import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useReducedMotion } from 'motion/react';
import { NovaMascot } from './NovaMascot';

vi.mock('motion/react', () => ({ useReducedMotion: vi.fn(() => false) }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('Nova mascot experience', () => {
  it('supports touch/click category selection and keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<NovaMascot interactive />);
    await user.click(screen.getByRole('button', { name: 'Premium' }));
    expect(screen.getByText('Something special')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Premium' })).toHaveAttribute('aria-pressed', 'true');
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Onwards & upwards')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Growth' })).toHaveAttribute('aria-pressed', 'true');
  });
  it('reacts to external order outcomes without moving focus', () => {
    const { rerender } = render(<NovaMascot compact mood="loading" />);
    expect(screen.getByText('One moment')).toBeInTheDocument();
    rerender(<NovaMascot compact mood="success" />);
    expect(screen.getByRole('status')).toHaveTextContent('Nicely done!');
    rerender(<NovaMascot compact mood="error" />);
    expect(screen.getByRole('status')).toHaveTextContent('Let’s try again');
  });
  it('keeps the static character and category interactions when reduced motion is enabled', async () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<NovaMascot interactive />);
    expect(container.querySelector('[data-motion="reduced"]')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/images/nova-mascot.png');
    await userEvent.click(screen.getByRole('button', { name: 'Stars' }));
    expect(screen.getByText('Star power')).toBeInTheDocument();
    expect(container.querySelector('.nova-burst')).not.toBeInTheDocument();
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });
  it('replays the chosen product burst on repeated selection without a floating badge', async () => {
    const user = userEvent.setup();
    const { container } = render(<NovaMascot interactive />);
    expect(container.querySelector('.nova-burst')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Premium' }));
    const firstBurst = container.querySelector('[data-effect="premium"]');
    expect(firstBurst).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.nova-token')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Premium' }));
    expect(container.querySelector('[data-effect="premium"]')).not.toBe(firstBurst);
    expect(screen.getByRole('button', { name: 'Premium' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Growth' }));
    expect(container.querySelector('[data-effect="growth"]')).toBeInTheDocument();
  });
  it('provides a fallback when the image cannot load', () => {
    render(<NovaMascot />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByRole('img', { name: 'Nova mascot' })).toBeInTheDocument();
    expect(screen.getByText('Meet Nova')).toBeInTheDocument();
  });
});
