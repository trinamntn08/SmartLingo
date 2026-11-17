/** Public deployment data only. Credentials must never enter this object. */
export function parseBetaConfig(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).some(key => !['apiUrl', 'beta'].includes(key))
      || typeof value.apiUrl !== 'string' || value.beta !== true) {
    throw new Error('Beta configuration must contain only apiUrl (string) and beta (true). Never add secrets.');
  }
  const apiUrl = value.apiUrl.trim();
  if (!apiUrl) return { apiUrl: '', beta: true };
  const url = new URL(apiUrl);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('Beta API URL must be an HTTPS origin, without credentials, path, query or fragment.');
  }
  return { apiUrl: url.origin, beta: true };
}

export function betaConfigScript(config) {
  return `window.__SMARTLINGO_CONFIG__ = ${JSON.stringify(parseBetaConfig(config)).replace(/</g, '\\u003c')};\n`;
}
