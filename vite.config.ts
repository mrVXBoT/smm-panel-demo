import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

function safeUriPlugin(): Plugin {
  return {
    name: 'safe-uri-plugin',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        try {
          if (req.url) {
            decodeURI(req.url);
          }
        } catch {
          if (req.url) {
            req.url = req.url.replace(/%(?![0-9a-fA-F]{2})/g, '%25');
            try {
              decodeURI(req.url);
            } catch {
              req.url = '/';
            }
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        try {
          if (req.url) {
            decodeURI(req.url);
          }
        } catch {
          if (req.url) {
            req.url = req.url.replace(/%(?![0-9a-fA-F]{2})/g, '%25');
            try {
              decodeURI(req.url);
            } catch {
              req.url = '/';
            }
          }
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), safeUriPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 5173,
    host: true,
    allowedHosts: true,
  },
});
