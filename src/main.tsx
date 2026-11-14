import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './index.css';
import { enableMocking } from './mocks/browser';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element in index.html');
}

async function prepareApp() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      await enableMocking();
    } catch {
      // Graceful fallback if ServiceWorker is unsupported in environment
    }
  }
}

prepareApp().finally(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
