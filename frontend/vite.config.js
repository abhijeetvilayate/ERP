import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allows using '@' to represent 'src' directory in imports
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true, // Listens on all network interfaces (useful for testing on local devices)
    proxy: {
      // Proxy API calls to the deployed CollegeERP WAR during development
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (requestPath) => requestPath.replace(/^\/api/, '/CollegeERP/api')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});