import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useReducedMotion } from 'motion/react';
import { HowItWorks, WhyNova } from './LandingStory';

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return { ...actual, useReducedMotion: vi.fn(() => false), useInView: vi.fn(() => true) };
});
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.mocked(useReducedMotion).mockReturnValue(false);
});

describe('Landing story previews', () => {
  it('calculates minor-unit totals and rounds fractional cents consistently', () => {
    render(
      <MemoryRouter>
        <WhyNova />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Sample order total')).toHaveTextContent('$0.15');
    fireEvent.click(screen.getByRole('button', { name: '2,500' }));
    expect(screen.getByLabelText('Sample order total')).toHaveTextContent('$0.38');
    fireEvent.click(screen.getByRole('button', { name: '5,000' }));
    expect(screen.getByLabelText('Sample order total')).toHaveTextContent('$0.75');
  });
  it('shows a completed demo order and supports replaying the preview', () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <HowItWorks />
      </MemoryRouter>,
    );
    expect(screen.getByRole('status', { name: 'Preview order status' })).toHaveTextContent(
      'Processing',
    );
    act(() => vi.advanceTimersByTime(1800));
    expect(screen.getByRole('status', { name: 'Preview order status' })).toHaveTextContent(
      'Completed',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Replay the preview' }));
    expect(screen.getByRole('status', { name: 'Preview order status' })).toHaveTextContent(
      'Processing',
    );
    act(() => vi.advanceTimersByTime(1800));
    expect(screen.getByRole('status', { name: 'Preview order status' })).toHaveTextContent(
      'Completed',
    );
  });
  it('keeps category selection usable with a static reduced-motion result', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    render(
      <MemoryRouter>
        <HowItWorks />
      </MemoryRouter>,
    );
    expect(screen.getByRole('status', { name: 'Preview order status' })).toHaveTextContent(
      'Completed',
    );
    const categories = screen.getByRole('group', { name: 'Preview a service category' });
    fireEvent.click(within(categories).getByRole('button', { name: 'Premium' }));
    expect(screen.getByRole('img', { name: 'Premium product preview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Static preview · reduced motion' })).toBeDisabled();
  });
});
