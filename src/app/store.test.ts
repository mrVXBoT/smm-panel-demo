import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './store';
import { INITIAL_DEMO_CUSTOMER } from '../core/fixtures/demoUser';

describe('Global App State (Zustand)', () => {
  beforeEach(() => {
    useAppStore.getState().resetDemoData();
  });

  it('starts with initial demo customer having $87.00 (8,700 cents)', () => {
    const state = useAppStore.getState();
    expect(state.currentUser.balanceCents).toBe(8700);
    expect(state.currentUser.role).toBe('customer');
    expect(state.currentUser.displayName).toBe(INITIAL_DEMO_CUSTOMER.displayName);
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
    expect(useAppStore.getState().currentUser.balanceCents).toBe(8700);
  });
});
