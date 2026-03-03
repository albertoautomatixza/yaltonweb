import { defineConfig } from 'vite';
import { cpSync, readdirSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  publicDir: false,
  plugins: [
    {
      name: 'copy-public-safe',
      writeBundle(options) {
        const outDir = options.dir || 'dist';
        const publicDir = resolve(__dirname, 'public');
        readdirSync(publicDir).forEach(file => {
          if (!file.includes(' ')) {
            cpSync(resolve(publicDir, file), resolve(outDir, file), { recursive: true });
          }
        });
      }
    }
  ]
});
