// Isolated test content only: never open the owner's on-disk curriculum database.
import { lessons, previousSeedFingerprints } from '@smartlingo/content';
import { SqliteLessonRepository } from '../../apps/api/src/repository';
import { createApp } from '../../apps/api/src/app';

async function main() {
  const repository = new SqliteLessonRepository(':memory:');
  repository.seed(lessons, previousSeedFingerprints);
  const app = createApp(repository);
  await app.listen({ host: '127.0.0.1', port: 3002 });
  const stop = async () => { await app.close(); process.exit(0); };
  process.once('SIGTERM', stop);
  process.once('SIGINT', stop);
}
void main().catch(() => { console.error('Isolated content test server could not start.'); process.exitCode = 1; });
