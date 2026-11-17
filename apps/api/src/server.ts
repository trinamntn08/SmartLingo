import { pathToFileURL } from 'node:url';
import { extname, resolve } from 'node:path';
import { lessons, previousSeedFingerprints } from '@smartlingo/content';
import { createApp } from './app';
import { SqliteLessonRepository } from './repository';
import { contentDatabasePath, projectRoot } from './database-path';
import { inspectCurriculumSnapshot } from './curriculum-backup';
import { readPracticeOptions, type PracticeEnvironment } from './practice/provider';
import { readSpeechOptions, type SpeechEnvironment } from './speech/provider';
import { readApiAccessConfig, type AccessEnvironment } from './hosted-access';

function speechDatabasePath(configured?: string): string {
  if (configured !== undefined && (!configured.trim() || configured.includes('\0') || extname(configured).toLowerCase() !== '.sqlite')) {
    throw new Error('SMARTLINGO_SPEECH_DATABASE_PATH must name a .sqlite speech cache.');
  }
  return resolve(projectRoot, configured ?? 'data/generated-speech.sqlite');
}

export function readServerConfig(environment: AccessEnvironment & { HOST?: string; PORT?: string }) {
  const hosted = readApiAccessConfig(environment).mode === 'hosted';
  const host = environment.HOST ?? (hosted ? '0.0.0.0' : '127.0.0.1');
  if (host !== '127.0.0.1' && host !== '::1' && !(hosted && ['0.0.0.0', '::'].includes(host))) {
    throw new Error(hosted ? 'HOST must be 127.0.0.1, ::1, 0.0.0.0 or :: in hosted mode.'
      : 'HOST must be 127.0.0.1 or ::1; LAN access requires authentication');
  }
  const rawPort = environment.PORT ?? '3001';
  if (!/^[0-9]+$/.test(rawPort)) throw new Error('PORT must be an integer from 1 to 65535');
  const port = Number(rawPort);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer from 1 to 65535');
  }
  return { host, port };
}

export async function startServer(environment: PracticeEnvironment & SpeechEnvironment & AccessEnvironment & { HOST?: string; PORT?: string; SMARTLINGO_DATABASE_PATH?: string; SMARTLINGO_SPEECH_DATABASE_PATH?: string } = {
  HOST: process.env.HOST, PORT: process.env.PORT, SMARTLINGO_DATABASE_PATH: process.env.SMARTLINGO_DATABASE_PATH,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY, OPENAI_TEXT_MODEL: process.env.OPENAI_TEXT_MODEL, SMARTLINGO_AI_DAILY_LIMIT: process.env.SMARTLINGO_AI_DAILY_LIMIT,
  OPENAI_TRANSCRIPTION_MODEL: process.env.OPENAI_TRANSCRIPTION_MODEL,
  AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY, AZURE_SPEECH_REGION: process.env.AZURE_SPEECH_REGION,
  SMARTLINGO_SPEECH_DAILY_LIMIT: process.env.SMARTLINGO_SPEECH_DAILY_LIMIT,
  SMARTLINGO_SPEECH_DATABASE_PATH: process.env.SMARTLINGO_SPEECH_DATABASE_PATH,
  SMARTLINGO_API_MODE: process.env.SMARTLINGO_API_MODE,
  SMARTLINGO_ALLOWED_ORIGINS: process.env.SMARTLINGO_ALLOWED_ORIGINS,
  SMARTLINGO_PUBLIC_HOST: process.env.SMARTLINGO_PUBLIC_HOST,
  SMARTLINGO_ADMIN_TOKEN: process.env.SMARTLINGO_ADMIN_TOKEN,
  SMARTLINGO_BETA_TOKEN: process.env.SMARTLINGO_BETA_TOKEN,
}) {
  const config = readServerConfig(environment);
  const access = readApiAccessConfig(environment);
  const practice = readPracticeOptions(environment);
  const speech = { ...readSpeechOptions(environment), databasePath: speechDatabasePath(environment.SMARTLINGO_SPEECH_DATABASE_PATH) };
  const path = contentDatabasePath(environment.SMARTLINGO_DATABASE_PATH);
  if (environment.SMARTLINGO_DATABASE_PATH !== undefined) inspectCurriculumSnapshot(path);
  const repository = new SqliteLessonRepository(path);
  try {
    const app = createApp(repository, { practice, speech, access });
    try {
      repository.seed(lessons, previousSeedFingerprints);
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
    console.log('SmartLingo content API listening at', app.listeningOrigin);
    const stop = async () => {
      await app.close();
      process.removeListener('SIGINT', stop);
      process.removeListener('SIGTERM', stop);
    };
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
  } catch {
    console.error('Unable to start API. Check HOST, PORT, hosted access settings, database paths, and provider configuration.');
    process.exitCode = 1;
  }
}
