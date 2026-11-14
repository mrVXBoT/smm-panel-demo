import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useAppStore } from './store';
import { Toaster } from '../components/ui/toaster';
import { SmoothScroll } from '../components/animation/SmoothScroll';
import { seedDatabase } from '../core/db/seed';

export function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);

    // Initialize Dexie IndexedDB with seed data
    seedDatabase().catch((err) => {
      console.warn('Failed to initialize Dexie database seed:', err);
    });
  }, [theme]);

  return (
    <SmoothScroll>
      <RouterProvider router={router} />
      <Toaster />
    </SmoothScroll>
  );
}

export default App;
