export interface PublicDeploymentConfig { apiUrl?: string; beta?: boolean }
export interface Deployment { apiUrl: string | null; hosted: boolean; beta: boolean }

declare global {
  interface Window { __SMARTLINGO_CONFIG__?: PublicDeploymentConfig }
}

const localHost = (hostname: string) => ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname);

/** Invalid or missing hosted settings disable remote features; never probe a visitor's localhost. */
export function resolveDeployment(config: PublicDeploymentConfig | undefined, pageOrigin?: string): Deployment {
  const local = pageOrigin === undefined || (() => { try { return localHost(new URL(pageOrigin).hostname); } catch { return false; } })();
  const hosted = !local || config?.beta === true;
  const fallback = !hosted && config?.apiUrl === undefined ? 'http://127.0.0.1:3001' : null;
  let apiUrl = fallback;
  if (typeof config?.apiUrl === 'string' && config.apiUrl.trim()) {
    try {
      const url = new URL(config.apiUrl.trim());
      if (!url.username && !url.password && url.pathname === '/' && !url.search && !url.hash
        && (url.protocol === 'https:' || local && url.protocol === 'http:' && localHost(url.hostname))
        && (local || !localHost(url.hostname))) apiUrl = url.origin;
    } catch { /* Leave remote features disabled for invalid public configuration. */ }
  }
  const connectedHostedApi = !!apiUrl && !localHost(new URL(apiUrl).hostname);
  return { apiUrl, hosted: hosted || connectedHostedApi, beta: config?.beta === true || !local };
}

export function deployment(): Deployment {
  return resolveDeployment(typeof window === 'undefined' ? undefined : window.__SMARTLINGO_CONFIG__, typeof window === 'undefined' ? undefined : window.location.origin);
}

export class BackendUnavailableError extends Error {
  constructor() { super('Online services are not configured for this beta yet. Lessons, notebook, review and backups remain available.'); this.name = 'BackendUnavailableError'; }
}
export function apiUrl(path: string): string {
  const origin = deployment().apiUrl;
  if (!origin) throw new BackendUnavailableError();
  return `${origin}${path}`;
}
