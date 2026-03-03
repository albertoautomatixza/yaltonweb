import { defineConfig } from 'vite';
import { cpSync, readdirSync, readFileSync, existsSync } from 'fs';
import { resolve, join, extname } from 'path';

const mimeTypes = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
};

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  publicDir: false,
  plugins: [
    {
      name: 'serve-public-dev',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const filePath = join(resolve(__dirname, 'public'), req.url);
          if (existsSync(filePath)) {
            const ext = extname(filePath);
            const mime = mimeTypes[ext] || 'application/octet-stream';
            res.setHeader('Content-Type', mime);
            res.end(readFileSync(filePath));
            return;
          }
          next();
        });
      }
    },
    {
      name: 'copy-public-safe',
      writeBundle(options) {
        const outDir = options.dir || 'dist';
        const pubDir = resolve(__dirname, 'public');
        readdirSync(pubDir).forEach(file => {
          if (!file.includes(' ')) {
            cpSync(resolve(pubDir, file), resolve(outDir, file), { recursive: true });
          }
        });
      }
    }
  ]
});
