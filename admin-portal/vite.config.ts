import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const dir = typeof import.meta.dirname !== 'undefined' ? import.meta.dirname : path.resolve();

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(dir, './src'),
      },
    },
    server: {
      port: 5174,
      host: '0.0.0.0',
    },
  };
});

