import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
  build: {
    // Optimize for mobile
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge'],
        },
      },
      external: [
        // Remove unused heavy dependencies
        '@react-three/fiber',
        '@react-three/drei', 
        '@react-three/postprocessing',
        'three',
        'framer-motion',
        'gsap',
        'matter-js',
        'pixi.js',
        'ogl',
        'postprocessing',
        'meshline',
        'gl-matrix',
        'react-leaflet',
        'recharts',
        'react-confetti',
      ],
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
  },
});