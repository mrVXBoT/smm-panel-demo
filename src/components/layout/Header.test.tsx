import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';
import { resetDemoSystem } from '../../core/db/reset';

describe('Header Component', () => {
  beforeEach(async () => {
    await resetDemoSystem();
  });

  it('renders the brand title and DEMO badge', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText('NovaSMM')).toBeInTheDocument();
    expect(screen.getAllByText('DEMO')[0]).toBeInTheDocument();
  });

  it('renders customer balance showing initial $87.00 seed', async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('$87.00')).toBeInTheDocument();
    });
  });

  it('renders navigation links and role switch button', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Admin View')).toBeInTheDocument();
  });
});
