import type { FastifyInstance, FastifyRequest } from 'fastify';

const origins = new Set(['http://localhost:8081', 'http://127.0.0.1:8081']);
const editorPath = /^\/editor\/lessons\/[a-z0-9][a-z0-9.-]{1,119}\/(draft|preview|publish)$/;
const readPath = /^\/(health|lessons|published-lessons|lessons\/[a-z0-9][a-z0-9.-]{1,119})$/;

function isLoopbackHost(host: string | undefined): boolean {
  if (!host) return false;
  const match = /^(localhost|127\.0\.0\.1|\[::1\])(?::([0-9]{1,5}))?$/i.exec(host);
  return !!match && (!match[2] || (Number(match[2]) >= 1 && Number(match[2]) <= 65535));
}

function isApprovedPreflight(request: FastifyRequest): boolean {
  const path = request.url.split('?')[0];
  const method = request.headers['access-control-request-method'];
  const rawHeaders = request.headers['access-control-request-headers'];
  if (Array.isArray(rawHeaders)) return false;
  const headers = rawHeaders ? rawHeaders.toLowerCase().split(',').map(header => header.trim()) : [];
  if (method === 'GET' && readPath.test(path)) return headers.length === 0;
  return method === 'POST' && editorPath.test(path)
    && headers.includes('content-type') && headers.includes('x-smartlingo-editor')
    && headers.every(header => header === 'content-type' || header === 'x-smartlingo-editor');
}

/** Browser-origin protection for a loopback preview, not user authentication. */
export function registerLocalAccess(app: FastifyInstance): void {
  app.addHook('onRequest', async (request, reply) => {
    reply.header('Vary', 'Origin');
    if (!isLoopbackHost(request.headers.host)) return reply.code(403).send({ error: 'Loopback Host required' });
    const origin = request.headers.origin;
    if (origin !== undefined && !origins.has(origin)) return reply.code(403).send({ error: 'Origin is not allowed' });
    if (request.method === 'OPTIONS') {
      if (!origin || !isApprovedPreflight(request)) return reply.code(403).send({ error: 'Preflight is not allowed' });
      reply.header('Access-Control-Allow-Origin', origin);
      reply.header('Vary', 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
      reply.header('Access-Control-Allow-Methods', request.headers['access-control-request-method']);
      if (request.headers['access-control-request-method'] === 'POST') {
        reply.header('Access-Control-Allow-Headers', 'Content-Type, X-SmartLingo-Editor');
      }
      return reply.code(204).send();
    }
    if (origin) reply.header('Access-Control-Allow-Origin', origin);
    // Use the matched route, not the raw URL: encoded path segments must not bypass the guard.
    if (request.routeOptions.url?.startsWith('/editor/') && request.method === 'POST') {
      if (!origin || request.headers['x-smartlingo-editor'] !== '1') {
        return reply.code(403).send({ error: 'Local editor Origin and header required' });
      }
      if (request.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') {
        return reply.code(415).send({ error: 'JSON content required' });
      }
    }
  });
  app.options('/*', async (_request, reply) => reply.code(403).send({ error: 'Preflight is not allowed' }));
}
