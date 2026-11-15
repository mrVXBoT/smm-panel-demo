import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DemoUser, UserRole } from '../core/types/models';
import { INITIAL_DEMO_CUSTOMER, INITIAL_DEMO_ADMIN } from '../core/fixtures/demoUser';

export interface AppState {
  // Theme state
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Session & Demo User (purely UI authentication/persona context)
  currentUser: DemoUser;
  isAuthenticated: boolean;
  setCurrentUser: (user: DemoUser) => void;
  switchRole: (role: UserRole) => void;
  loginAsDemo: (role?: UserRole) => void;
  logout: () => void;

  // UI Navigation state
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Reset transient demo session state
  resetDemoSession: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (typeof document !== 'undefined') {
            const root = document.documentElement;
            root.classList.remove('dark', 'light');
            root.classList.add(nextTheme);
          }
          return { theme: nextTheme };
        }),
      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          root.classList.remove('dark', 'light');
          root.classList.add(theme);
        }
        set({ theme });
      },

      currentUser: { ...INITIAL_DEMO_CUSTOMER },
      isAuthenticated: false,

      setCurrentUser: (user) => set({ currentUser: user }),

      switchRole: (role) =>
        set(() => {
          const targetUser = role === 'admin' ? INITIAL_DEMO_ADMIN : INITIAL_DEMO_CUSTOMER;
          return { currentUser: { ...targetUser }, isAuthenticated: true };
        }),

      loginAsDemo: (role = 'customer') =>
        set(() => ({
          currentUser: role === 'admin' ? { ...INITIAL_DEMO_ADMIN } : { ...INITIAL_DEMO_CUSTOMER },
          isAuthenticated: true,
        })),

      logout: () =>
        set(() => ({
          isAuthenticated: false,
        })),

      sidebarCollapsed: false,
      toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      resetDemoSession: () =>
        set(() => ({
          currentUser: { ...INITIAL_DEMO_CUSTOMER },
          isAuthenticated: true,
          sidebarOpen: false,
        })),
    }),
    {
      name: 'smm_panel_demo_session_v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.currentUser?.role === 'customer' && state.currentUser.username === 'demouser') {
          state.currentUser = { ...INITIAL_DEMO_CUSTOMER };
        }
      },
    },
  ),
);
