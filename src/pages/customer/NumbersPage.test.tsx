import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NumbersPage } from './NumbersPage';
import { resetDemoSystem } from '../../core/db/reset';

describe('NumbersPage Country Switching & Simulation', () => {
  beforeEach(async () => {
    await resetDemoSystem();
  });

  it('renders default US line and switches country on selection', () => {
    render(
      <MemoryRouter>
        <NumbersPage />
      </MemoryRouter>,
    );

    // Initial US country
    expect(screen.getByText(/Active United States Test Line/i)).toBeInTheDocument();

    // Switch to United Kingdom
    const ukBtn = screen.getByRole('button', { name: /United Kingdom/i });
    fireEvent.click(ukBtn);

    expect(screen.getByText(/Active United Kingdom Test Line/i)).toBeInTheDocument();
    expect(screen.getByText(/\+44 7700/i)).toBeInTheDocument();
  });

  it('generates incoming simulated SMS on button click', () => {
    render(
      <MemoryRouter>
        <NumbersPage />
      </MemoryRouter>,
    );

    const initialMessagesCount = screen.getAllByText(/Simulated Code:/i).length;
    const simulateBtn = screen.getByRole('button', { name: /Simulate Incoming OTP/i });
    fireEvent.click(simulateBtn);

    const newMessagesCount = screen.getAllByText(/Simulated Code:/i).length;
    expect(newMessagesCount).toBe(initialMessagesCount + 1);
  });
});
