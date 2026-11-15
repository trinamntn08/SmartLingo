import { pathToFileURL } from 'node:url';
import { lessons, previousSeedFingerprints } from '@smartlingo/content';
import { createApp } from './app';
import { SqliteLessonRepository } from './repository';
import { contentDatabasePath } from './database-path';
import { inspectCurriculumSnapshot } from './curriculum-backup';
import { readPracticeOptions, type PracticeEnvironment } from './practice/provider';

export function readServerConfig(environment: { HOST?: string; PORT?: string }) {
  const host = environment.HOST ?? '127.0.0.1';
  if (host !== '127.0.0.1' && host !== '::1') {
    throw new Error('HOST must be 127.0.0.1 or ::1; LAN access requires authentication');
  }
  const rawPort = environment.PORT ?? '3001';
  if (!/^[0-9]+$/.test(rawPort)) throw new Error('PORT must be an integer from 1 to 65535');
  const port = Number(rawPort);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer from 1 to 65535');
  }
  return { host, port };
}

export async function startServer(environment: PracticeEnvironment & { HOST?: string; PORT?: string; SMARTLINGO_DATABASE_PATH?: string } = {
  HOST: process.env.HOST, PORT: process.env.PORT, SMARTLINGO_DATABASE_PATH: process.env.SMARTLINGO_DATABASE_PATH,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY, OPENAI_TEXT_MODEL: process.env.OPENAI_TEXT_MODEL, SMARTLINGO_AI_DAILY_LIMIT: process.env.SMARTLINGO_AI_DAILY_LIMIT,
  OPENAI_TRANSCRIPTION_MODEL: process.env.OPENAI_TRANSCRIPTION_MODEL,
}) {
  const config = readServerConfig(environment);
  const practice = readPracticeOptions(environment);
  const path = contentDatabasePath(environment.SMARTLINGO_DATABASE_PATH);
  if (environment.SMARTLINGO_DATABASE_PATH !== undefined) inspectCurriculumSnapshot(path);
  const repository = new SqliteLessonRepository(path);
  try {
    repository.seed(lessons, previousSeedFingerprints);
    const app = createApp(repository, { practice });
    try {
      await app.listen(config);
      return app;
    } catch (error) {
      await app.close();
      throw error;
    }
  } catch (error) {
    repository.close();
    throw error;
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    const app = await startServer();
    console.log('SmartLingo local content preview listening at', app.listeningOrigin);
    const stop = async () => {
      await app.close();
      process.removeListener('SIGINT', stop);
      process.removeListener('SIGTERM', stop);
    };
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
  } catch {
    console.error('Unable to start local API. Check HOST, PORT, SMARTLINGO_DATABASE_PATH, and the content database.');
    process.exitCode = 1;
  }
}
