import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { useAppStore } from './store';

function TestRouteSetup({ initialEntry }: { initialEntry: string }) {
  return (
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div>Login Page Screen</div>} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <div>Customer Dashboard Workspace</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <div>Admin Operations Console</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('Route Authorization & Protected Route Guards', () => {
  beforeEach(() => {
    useAppStore.getState().resetDemoSession();
  });

  it('redirects unauthenticated visitor accessing /app directly to /login', () => {
    useAppStore.getState().logout();
    expect(useAppStore.getState().isAuthenticated).toBe(false);

    render(<TestRouteSetup initialEntry="/app" />);

    expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
    expect(screen.queryByText('Customer Dashboard Workspace')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated visitor accessing /admin directly to /login', () => {
    useAppStore.getState().logout();
    expect(useAppStore.getState().isAuthenticated).toBe(false);

    render(<TestRouteSetup initialEntry="/admin" />);

    expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
    expect(screen.queryByText('Admin Operations Console')).not.toBeInTheDocument();
  });

  it('redirects customer with role="customer" attempting to access /admin directly to /app', () => {
    useAppStore.getState().loginAsDemo('customer');
    expect(useAppStore.getState().currentUser.role).toBe('customer');

    render(<TestRouteSetup initialEntry="/admin" />);

    // Customer cannot access admin; redirected to /app
    expect(screen.getByText('Customer Dashboard Workspace')).toBeInTheDocument();
    expect(screen.queryByText('Admin Operations Console')).not.toBeInTheDocument();
  });

  it('allows authenticated admin user direct access to /admin', () => {
    useAppStore.getState().loginAsDemo('admin');
    expect(useAppStore.getState().currentUser.role).toBe('admin');

    render(<TestRouteSetup initialEntry="/admin" />);

    expect(screen.getByText('Admin Operations Console')).toBeInTheDocument();
  });

  it('allows authenticated customer direct access to /app', () => {
    useAppStore.getState().loginAsDemo('customer');
    expect(useAppStore.getState().currentUser.role).toBe('customer');

    render(<TestRouteSetup initialEntry="/app" />);

    expect(screen.getByText('Customer Dashboard Workspace')).toBeInTheDocument();
  });

  it('redirects to /login when user logs out and attempts protected route access', () => {
    useAppStore.getState().loginAsDemo('customer');
    useAppStore.getState().logout();
    expect(useAppStore.getState().isAuthenticated).toBe(false);

    render(<TestRouteSetup initialEntry="/app" />);

    expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
    expect(screen.queryByText('Customer Dashboard Workspace')).not.toBeInTheDocument();
  });
});
