import { createHash, timingSafeEqual } from 'node:crypto';
import type { FastifyInstance, FastifyRequest } from 'fastify';

export interface HostedAccessOptions {
  mode: 'hosted';
  allowedOrigins: readonly string[];
  publicHost: string;
  adminToken: string;
  betaToken: string;
}

export type ApiAccessOptions = { mode: 'local' } | HostedAccessOptions;

export interface AccessEnvironment {
  SMARTLINGO_API_MODE?: string;
  SMARTLINGO_ALLOWED_ORIGINS?: string;
  SMARTLINGO_PUBLIC_HOST?: string;
  SMARTLINGO_ADMIN_TOKEN?: string;
  SMARTLINGO_BETA_TOKEN?: string;
}

function validOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    return origin === url.origin && !url.username && !url.password
      && (url.protocol === 'https:' || (url.protocol === 'http:' && local));
  } catch { return false; }
}

function canonicalHost(host: string): string | undefined {
  if (!host || !/^[a-zA-Z0-9.\-\[\]:]+$/.test(host)) return;
  try {
    const url = new URL(`https://${host}`);
    if (url.host.toLowerCase() !== host.toLowerCase() || url.username || url.password) return;
    if (url.port && Number(url.port) < 1) return;
    return url.host.toLowerCase();
  } catch { return; }
}

function validateOptions(options: HostedAccessOptions): void {
  if (!options.allowedOrigins.length || options.allowedOrigins.some(origin => !validOrigin(origin))) {
    throw new Error('SMARTLINGO_ALLOWED_ORIGINS must contain exact HTTPS origins (HTTP is allowed only for loopback development).');
  }
  if (!canonicalHost(options.publicHost)) throw new Error('SMARTLINGO_PUBLIC_HOST must be the exact API host, optionally including its port.');
  for (const [name, value] of [['SMARTLINGO_ADMIN_TOKEN', options.adminToken], ['SMARTLINGO_BETA_TOKEN', options.betaToken]]) {
    if (!/^[\x21-\x7e]{32,512}$/.test(value)) throw new Error(`${name} must contain 32–512 non-space ASCII characters.`);
  }
  if (options.adminToken === options.betaToken) throw new Error('Administrator and beta access tokens must be different.');
}

/** Hosted mode is explicit and fails closed before any server/database startup. */
export function readApiAccessConfig(environment: AccessEnvironment): ApiAccessOptions {
  if (environment.SMARTLINGO_API_MODE === undefined || environment.SMARTLINGO_API_MODE === 'local') return { mode: 'local' };
  if (environment.SMARTLINGO_API_MODE !== 'hosted') throw new Error('SMARTLINGO_API_MODE must be local or hosted.');
  const options: HostedAccessOptions = {
    mode: 'hosted',
    allowedOrigins: (environment.SMARTLINGO_ALLOWED_ORIGINS ?? '').split(',').map(origin => origin.trim()).filter(Boolean),
    publicHost: environment.SMARTLINGO_PUBLIC_HOST ?? '',
    adminToken: environment.SMARTLINGO_ADMIN_TOKEN ?? '',
    betaToken: environment.SMARTLINGO_BETA_TOKEN ?? '',
  };
  validateOptions(options);
  return options;
}

type RouteAccess = 'public' | 'admin' | 'beta' | undefined;

function routeAccess(route: string | undefined): RouteAccess {
  if (route === '/health' || route === '/published-lessons') return 'public';
  if (route === '/lessons' || route?.startsWith('/lessons/') || route?.startsWith('/editor/')) return 'admin';
  if (route?.startsWith('/ai/') || route?.startsWith('/speech/')) return 'beta';
  // New matched endpoints remain private unless explicitly classified above.
  if (route) return 'admin';
}

function featureHeader(route: string): string | undefined {
  return route.startsWith('/editor/') ? 'x-smartlingo-editor'
    : route.startsWith('/ai/') ? 'x-smartlingo-practice'
      : route.startsWith('/speech/') ? 'x-smartlingo-speech' : undefined;
}

const readPath = /^\/(health|published-lessons|lessons|lessons\/[a-z0-9][a-z0-9.-]{1,119}|ai\/practice\/status|speech\/status)$/;
const writePath = /^(?:\/editor\/lessons\/[a-z0-9][a-z0-9.-]{1,119}\/(draft|preview|publish)|\/ai\/practice\/(sessions|turns|stop|transcribe)|\/speech\/generate)$/;

function approvedPreflight(request: FastifyRequest): boolean {
  const path = request.url.split('?')[0];
  const method = request.headers['access-control-request-method'];
  const raw = request.headers['access-control-request-headers'];
  if (Array.isArray(raw)) return false;
  const headers = raw ? raw.toLowerCase().split(',').map(header => header.trim()) : [];
  if (method === 'GET' && readPath.test(path)) return headers.every(header => header === 'authorization');
  const feature = featureHeader(path);
  return method === 'POST' && writePath.test(path) && !!feature
    && headers.includes('authorization') && headers.includes('content-type') && headers.includes(feature)
    && headers.every(header => ['authorization', 'content-type', feature].includes(header));
}

/** Bearer-authenticated, single-instance personal beta. CORS is never authentication. */
export function registerHostedAccess(app: FastifyInstance, options: HostedAccessOptions): void {
  validateOptions(options);
  const allowedOrigins = new Set(options.allowedOrigins);
  const publicHost = canonicalHost(options.publicHost);
  const digest = (value: string) => createHash('sha256').update(value).digest();
  const adminDigest = digest(options.adminToken);
  const betaDigest = digest(options.betaToken);

  app.addHook('onRequest', async (request, reply) => {
    reply.header('Vary', 'Origin');
    reply.header('Cache-Control', 'no-store');
    reply.header('X-Content-Type-Options', 'nosniff');
    if (canonicalHost(request.headers.host ?? '') !== publicHost) return reply.code(403).send({ error: 'API Host is not allowed' });
    const origin = request.headers.origin;
    if (origin !== undefined && !allowedOrigins.has(origin)) return reply.code(403).send({ error: 'Origin is not allowed' });
    if (request.method === 'OPTIONS') {
      if (!origin || !approvedPreflight(request)) return reply.code(403).send({ error: 'Preflight is not allowed' });
      reply.header('Access-Control-Allow-Origin', origin);
      reply.header('Vary', 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
      reply.header('Access-Control-Allow-Methods', request.headers['access-control-request-method']);
      const feature = featureHeader(request.url.split('?')[0]);
      reply.header('Access-Control-Allow-Headers', feature ? `Authorization, Content-Type, ${feature}` : 'Authorization');
      return reply.code(204).send();
    }
    if (origin) reply.header('Access-Control-Allow-Origin', origin);
    // Classify the router's matched route, including encoded lesson IDs, rather than trusting the raw path.
    const route = request.routeOptions.url;
    const access = routeAccess(route);
    if (access !== undefined && access !== 'public') {
      const header = request.headers.authorization;
      const match = typeof header === 'string' && /^Bearer ([\x21-\x7e]{32,512})$/.exec(header);
      const suppliedDigest = digest(match ? match[1] : '');
      const administrator = timingSafeEqual(suppliedDigest, adminDigest);
      const beta = timingSafeEqual(suppliedDigest, betaDigest);
      if (!administrator && !(access === 'beta' && beta)) {
        reply.header('WWW-Authenticate', 'Bearer realm="SmartLingo beta"');
        return reply.code(401).send({ error: 'Access token required' });
      }
    }
    const feature = route && featureHeader(route);
    if (request.method === 'POST' && feature) {
      if (request.headers[feature] !== '1') return reply.code(403).send({ error: 'Feature header required' });
      if (request.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') {
        return reply.code(415).send({ error: 'JSON content required' });
      }
    }
  });
  app.options('/*', async (_request, reply) => reply.code(403).send({ error: 'Preflight is not allowed' }));
}
