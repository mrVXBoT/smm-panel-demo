import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';

describe('Header Component', () => {
  it('renders the brand title and DEMO badge', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText('NovaSMM')).toBeInTheDocument();
    expect(screen.getAllByText('DEMO')[0]).toBeInTheDocument();
  });

  it('renders customer balance showing initial $87.00 seed', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText('$87.00')).toBeInTheDocument();
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
