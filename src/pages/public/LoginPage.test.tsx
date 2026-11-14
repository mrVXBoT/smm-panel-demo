import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { useAppStore } from '../../app/store';

describe('LoginPage Validation & Credential Checking', () => {
  beforeEach(() => {
    useAppStore.getState().resetDemoSession();
  });

  it('rejects invalid or arbitrary credentials with an error alert', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const userInput = screen.getByPlaceholderText('demouser');
    const passInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /Enter Demo Workspace/i });

    // Enter wrong credentials
    fireEvent.change(userInput, { target: { value: 'wrong_hacker' } });
    fireEvent.change(passInput, { target: { value: 'invalid_pass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument();
    });
  });

  it('populates and accepts customer demo credentials', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const customerQuickBtn = screen.getByRole('button', { name: /Customer.*\$87\.00/i });
    fireEvent.click(customerQuickBtn);

    const submitBtn = screen.getByRole('button', { name: /Enter Demo Workspace/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(useAppStore.getState().currentUser.role).toBe('customer');
      expect(useAppStore.getState().currentUser.username).toBe('demouser');
    });
  });

  it('populates and accepts admin demo credentials', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const adminQuickBtn = screen.getByRole('button', { name: /Admin.*Ops/i });
    fireEvent.click(adminQuickBtn);

    const submitBtn = screen.getByRole('button', { name: /Enter Demo Workspace/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(useAppStore.getState().currentUser.role).toBe('admin');
      expect(useAppStore.getState().currentUser.username).toBe('admin');
    });
  });
});
