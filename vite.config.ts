import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/proxy-moltx': {
          target: 'https://moltx.io',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy-moltx/, '/v1')
        },
        '/proxy-moltbook': {
          target: 'https://www.moltbook.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy-moltbook/, '/api/v1')
        },
        '/proxy-4claw': {
          target: 'https://www.4claw.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy-4claw/, '/api/v1')
        }
      }
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom', 'recharts', 'framer-motion', 'lucide-react']
          }
        }
      }
    }
  };
});
