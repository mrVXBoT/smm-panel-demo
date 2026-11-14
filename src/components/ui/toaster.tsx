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
          backgroundColor: '#111B2E',
          borderColor: '#1E293B',
          color: '#F1F5F9',
          borderRadius: '16px',
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5)',
        },
      }}
    />
  );
}
