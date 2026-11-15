import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { useAppStore } from '../../app/store';
import { DEMO_CREDENTIALS, INITIAL_DEMO_ADMIN } from '../../core/fixtures/demoUser';
function Location() {
  const location = useLocation();
  return (
    <output aria-label="Current route">
      {location.pathname}
      {location.search}
      {location.hash}
    </output>
  );
}
function setup(from?: { pathname: string; search?: string; hash?: string }) {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/login', state: { from } }]}>
      <LoginPage />
      <Location />
    </MemoryRouter>,
  );
}
function enter(username: string, password: string) {
  fireEvent.change(screen.getByLabelText('Email or username'), { target: { value: username } });
  fireEvent.change(screen.getByLabelText('Password', { exact: true }), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole('button', { name: /Enter Workspace/ }));
}
describe('LoginPage', () => {
  beforeEach(() => useAppStore.getState().resetDemoSession());
  it('starts empty and rejects invalid credentials without navigating', async () => {
    setup();
    expect(screen.getByLabelText('Email or username')).toHaveValue('');
    expect(screen.getByLabelText('Password', { exact: true })).toHaveValue('');
    enter('unknown', 'invalid_password');
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid username or password');
    expect(screen.getByLabelText('Current route')).toHaveTextContent('/login');
  });
  it.each(['customer', 'admin'] as const)(
    'routes the %s account to its workspace',
    async (role) => {
      setup();
      enter(DEMO_CREDENTIALS[role].username, DEMO_CREDENTIALS[role].password);
      expect(screen.getByRole('button', { name: /Signing you in/ })).toBeDisabled();
      await waitFor(() =>
        expect(screen.getByLabelText('Current route')).toHaveTextContent(
          role === 'admin' ? '/admin' : '/app',
        ),
      );
      expect(useAppStore.getState().currentUser.role).toBe(role);
    },
  );
  it('accepts the account email and identifies the role automatically', async () => {
    setup();
    enter(INITIAL_DEMO_ADMIN.email, DEMO_CREDENTIALS.admin.password);
    await waitFor(() => expect(screen.getByLabelText('Current route')).toHaveTextContent('/admin'));
  });
  it('resumes the selected bundle after customer login', async () => {
    setup({ pathname: '/app/premium', search: '?service=srv_tg_premium_12m', hash: '#details' });
    enter(DEMO_CREDENTIALS.customer.username, DEMO_CREDENTIALS.customer.password);
    await waitFor(() =>
      expect(screen.getByLabelText('Current route')).toHaveTextContent(
        '/app/premium?service=srv_tg_premium_12m#details',
      ),
    );
  });
  it('does not resume an admin route for a customer', async () => {
    setup({ pathname: '/admin/settings' });
    enter(DEMO_CREDENTIALS.customer.username, DEMO_CREDENTIALS.customer.password);
    await waitFor(() =>
      expect(screen.getByLabelText('Current route')).toHaveTextContent(/^\/app$/),
    );
  });
  it('shows the privacy pose on password focus and toggles visibility accessibly', () => {
    setup();
    const password = screen.getByLabelText('Password', { exact: true });
    fireEvent.focus(password);
    expect(screen.getByAltText(/covering its eyes/)).toHaveAttribute(
      'src',
      '/images/nova-login-private.png',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(password).toHaveAttribute('type', 'text');
    fireEvent.blur(password);
    expect(screen.getByAltText(/covering its eyes/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(password).toHaveAttribute('type', 'password');
    expect(screen.getByAltText(/welcoming you/)).toBeInTheDocument();
  });
  it('opens honest recovery help without pretending to send an email', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Forgot password?' }));
    expect(screen.getByText(/Email password recovery is not available yet/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close account help' }));
    expect(
      screen.queryByText(/Email password recovery is not available yet/),
    ).not.toBeInTheDocument();
  });
});
