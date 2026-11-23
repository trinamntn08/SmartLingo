import { statSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../../../', import.meta.url));
export const defaultContentDatabasePath = resolve(projectRoot, 'data/smartlingo.sqlite');

/** An explicit recovery selection must exist; a typo must not create a seeded replacement. */
export function contentDatabasePath(configured?: string): string {
  if (configured === undefined) return defaultContentDatabasePath;
  if (!configured.trim() || configured.includes('\0') || extname(configured).toLowerCase() !== '.sqlite') {
    throw new Error('SMARTLINGO_DATABASE_PATH must name an existing .sqlite curriculum file.');
  }
  const path = resolve(projectRoot, configured);
  try { if (statSync(path).isFile()) return path; }
  catch { /* Fail explicitly below rather than creating a database. */ }
  throw new Error('The configured curriculum database does not exist or is not a file.');
}
