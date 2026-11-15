import { Toaster as SonnerToaster } from 'sonner';
import { useAppStore } from '../../app/store';

export function Toaster() {
  const { theme } = useAppStore();

  return (
    <SonnerToaster
      theme={theme}
      position="top-right"
      toastOptions={{
        style: {
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--foreground)',
          borderRadius: '16px',
          boxShadow: '0 10px 30px -5px var(--card-shadow)',
        },
      }}
    />
  );
}
