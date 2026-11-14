import Fastify, { type FastifyError } from 'fastify';
import type { LessonRepository } from './repository';

/** The app takes ownership of the repository and closes it with the server. */
export function createApp(repository: LessonRepository) {
  const app = Fastify({
    logger: false,
    bodyLimit: 16_384,
    connectionTimeout: 10_000,
    requestTimeout: 10_000,
    keepAliveTimeout: 5_000,
  });

  app.addHook('onClose', async () => { repository.close(); });
  app.setErrorHandler<FastifyError>((error, _request, reply) => {
    if (error.validation) return reply.code(400).send({ error: 'Invalid request' });
    return reply.code(500).send({ error: 'Content is unavailable. Check the local content database.' });
  });
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/lessons', async () => ({ lessons: repository.listLessons() }));
  app.get<{ Params: { id: string } }>('/lessons/:id', {
    schema: {
      params: {
        type: 'object', required: ['id'], additionalProperties: false,
        properties: { id: { type: 'string', pattern: '^[a-z0-9][a-z0-9.-]+$', maxLength: 120 } },
      },
    },
  }, async (request, reply) => {
    const lesson = repository.getLesson(request.params.id);
    if (!lesson) return reply.code(404).send({ error: 'Lesson not found' });
    return { lesson };
  });
  return app;
}
