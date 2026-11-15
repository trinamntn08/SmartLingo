import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultDirectory = fileURLToPath(new URL('../apps/learner/dist/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };

/** Local exported-build preview; never a public deployment or SPA/API fallback. */
export function createWebPreview(directory = defaultDirectory) {
  const root = path.resolve(directory);
  return createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    if (!/^(?:localhost|127\.0\.0\.1)(?::[0-9]+)?$/i.test(request.headers.host ?? '')) {
      response.writeHead(403).end(); return;
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405).end(); return; }
    try {
      const url = new URL(request.url ?? '/', 'http://localhost');
      const relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname).slice(1);
      const filename = path.resolve(root, relative);
      if (!filename.startsWith(`${root}${path.sep}`) || relative.includes('\\') || relative.split('/').some(part => part.startsWith('.'))) {
        response.writeHead(404).end(); return;
      }
      const bytes = await readFile(filename);
      response.setHeader('Content-Type', types[path.extname(filename)] ?? 'application/octet-stream');
      response.setHeader('Content-Length', bytes.byteLength);
      response.writeHead(200).end(request.method === 'HEAD' ? undefined : bytes);
    } catch { response.writeHead(404).end('Preview file unavailable. Run npm run build:web first.'); }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await readFile(path.join(defaultDirectory, 'offline-manifest.json'));
  const server = createWebPreview();
  server.listen(8082, '127.0.0.1', () => console.log('Offline-ready preview: http://localhost:8082 (separate browser storage from development on 8081).'));
}
