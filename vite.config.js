import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        empresa: resolve(__dirname, 'empresa.html'),
        promociones: resolve(__dirname, 'promociones.html')
      }
    }
  },
  publicDir: 'public'
});
