import { deployment } from './config';

type AccessRole = 'beta' | 'owner';
let betaToken = '';
let ownerToken = '';

/** Access tokens last only for this tab's JS lifetime; provider keys are never accepted as configuration. */
export function setAccessToken(role: AccessRole, value: string): void {
  const token = value.trim();
  if (token && (!/^[\x21-\x7E]{32,512}$/.test(token))) throw new Error('Use the beta or owner access token supplied by the site owner (32–512 characters). Do not enter an OpenAI or Azure key.');
  if (role === 'owner') ownerToken = token;
  else betaToken = token;
}
export function clearAccessTokens(): void { betaToken = ''; ownerToken = ''; }
export function accessState(): { beta: boolean; owner: boolean } { return { beta: !!betaToken, owner: !!ownerToken }; }

/** Credentials are attached only to the configured API, and owner access never leaks to public reads. */
export function accessHeaders(role: AccessRole): Record<string, string> {
  if (!deployment().hosted) return {};
  const token = role === 'owner' ? ownerToken : betaToken || ownerToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
