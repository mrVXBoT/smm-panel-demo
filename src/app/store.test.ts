import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './store';
import { INITIAL_DEMO_CUSTOMER } from '../core/fixtures/demoUser';

describe('Global App State (Zustand UI & Session Context)', () => {
  beforeEach(() => {
    useAppStore.getState().resetDemoSession();
  });

  it('starts a fresh browser session as a visitor', () => {
    expect(useAppStore.getInitialState().isAuthenticated).toBe(false);
  });

  it('starts with initial demo customer context', () => {
    const state = useAppStore.getState();
    expect(state.currentUser.role).toBe('customer');
    expect(state.currentUser.displayName).toBe(INITIAL_DEMO_CUSTOMER.displayName);
    expect(state.isAuthenticated).toBe(true);
  });

  it('toggles theme between dark and light', () => {
    const store = useAppStore.getState();
    expect(store.theme).toBe('dark');

    store.toggleTheme();
    expect(useAppStore.getState().theme).toBe('light');

    store.toggleTheme();
    expect(useAppStore.getState().theme).toBe('dark');
  });

  it('switches between customer and admin roles', () => {
    const store = useAppStore.getState();
    store.switchRole('admin');
    expect(useAppStore.getState().currentUser.role).toBe('admin');
    expect(useAppStore.getState().currentUser.username).toBe('admin');

    store.switchRole('customer');
    expect(useAppStore.getState().currentUser.role).toBe('customer');
    expect(useAppStore.getState().currentUser.username).toBe('user77007');
  });

  it('handles loginAsDemo and logout', () => {
    const store = useAppStore.getState();
    store.logout();
    expect(useAppStore.getState().isAuthenticated).toBe(false);

    store.loginAsDemo('customer');
    expect(useAppStore.getState().isAuthenticated).toBe(true);
    expect(useAppStore.getState().currentUser.role).toBe('customer');
  });

  it('manages sidebar navigation state', () => {
    const store = useAppStore.getState();
    expect(store.sidebarOpen).toBe(false);

    store.toggleSidebar();
    expect(useAppStore.getState().sidebarOpen).toBe(true);

    store.setSidebarOpen(false);
    expect(useAppStore.getState().sidebarOpen).toBe(false);
  });

  it('does not store orders or ledger arrays in Zustand localStorage', () => {
    const rawStorage = localStorage.getItem('smm_panel_demo_session_v2');
    if (rawStorage) {
      const parsed = JSON.parse(rawStorage);
      expect(parsed.state.orders).toBeUndefined();
      expect(parsed.state.ledgerEntries).toBeUndefined();
    }
  });
});
