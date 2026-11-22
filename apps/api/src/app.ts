import Fastify, { type FastifyError } from 'fastify';
import type { LessonRepository } from './repository';
import { EditorError } from './editor-error';
import { registerEditorRoutes, lessonParams } from './editor-routes';
import { registerLocalAccess } from './local-access';
import { PreviewReceipts } from './preview-receipts';
import { PracticeError, PracticeService, type PracticeOptions } from './practice/service';
import { registerPracticeRoutes } from './practice/routes';
import { SpeechError, SpeechService, type SpeechOptions } from './speech/service';
import { registerSpeechRoutes } from './speech/routes';
import { JapaneseSpeechError, JapaneseSpeechService, type JapaneseSpeechOptions } from './japanese-speech/service';
import { registerJapaneseSpeechRoutes } from './japanese-speech/routes';

/** The app takes ownership of the repository and closes it with the server. */
export function createApp(repository: LessonRepository, options: { now?: () => number; practice?: PracticeOptions; speech?: SpeechOptions; japaneseSpeech?: JapaneseSpeechOptions } = {}) {
  const app = Fastify({
    logger: false,
    bodyLimit: 131_072,
    routerOptions: { maxParamLength: 120 },
    // Leave room for the bounded 30-second provider operation and its response.
    connectionTimeout: 40_000,
    requestTimeout: 10_000,
    keepAliveTimeout: 5_000,
  });

  const receipts = new PreviewReceipts(options.now);
  // Validate resource-free services before opening the speech database.
  const practice = new PracticeService({ now: options.now, ...options.practice });
  const japaneseSpeech = new JapaneseSpeechService(options.japaneseSpeech);
  const speech = new SpeechService({ now: options.now, ...options.speech });
  registerLocalAccess(app);
  app.addHook('preClose', async () => { practice.close(); speech.close(); japaneseSpeech.close(); });
  app.addHook('onClose', async () => { receipts.clear(); repository.close(); });
  app.setErrorHandler<FastifyError>((error, _request, reply) => {
    if (error instanceof JapaneseSpeechError) return reply.code(error.statusCode).send({ error: error.message });
    if (error instanceof SpeechError) return reply.code(error.statusCode).send({ error: error.message, ...(error.terminal ? { code: 'attempt_ended' } : {}) });
    if (error instanceof PracticeError) return reply.code(error.statusCode).send({ error: error.message, ...(error.terminal ? { code: 'attempt_ended' } : {}) });
    if (error instanceof EditorError) return reply.code(error.statusCode).send({ error: error.message });
    if (error.validation) return reply.code(400).send({ error: 'Invalid request' });
    if (error.statusCode === 400 || error.statusCode === 413 || error.statusCode === 415) {
      return reply.code(error.statusCode).send({ error: 'Invalid request body' });
    }
    return reply.code(500).send({ error: 'Content is unavailable. Check the local content database.' });
  });
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/lessons', async () => ({ lessons: repository.listLessons() }));
  app.get('/published-lessons', async () => ({ lessons: repository.listPublishedLessons() }));
  app.get<{ Params: { id: string } }>('/lessons/:id', {
    schema: {
      params: lessonParams,
    },
  }, async (request, reply) => {
    const lesson = repository.getLesson(request.params.id);
    if (!lesson) return reply.code(404).send({ error: 'Lesson not found' });
    return { lesson };
  });
  registerEditorRoutes(app, repository, receipts);
  registerPracticeRoutes(app, practice);
  registerSpeechRoutes(app, speech);
  registerJapaneseSpeechRoutes(app, japaneseSpeech);
  return app;
}
