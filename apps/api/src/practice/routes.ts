import type { FastifyInstance } from 'fastify';
import { practiceSessionRequestSchema, practiceSessionIdSchema, practiceTurnRequestSchema, practiceTranscriptionRequestSchema } from '@smartlingo/domain';
import { PracticeService } from './service';

export function registerPracticeRoutes(app: FastifyInstance, service: PracticeService): void {
  app.get('/ai/practice/status', async (_request, reply) => { reply.header('Cache-Control', 'no-store'); return service.status(); });
  app.post('/ai/practice/sessions', async (request, reply) => {
    const parsed = practiceSessionRequestSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid practice context' });
    return service.create(parsed.data.context);
  });
  app.post('/ai/practice/turns', async (request, reply) => {
    reply.header('Cache-Control', 'no-store');
    const parsed = practiceTurnRequestSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid practice turn' });
    const controller = new AbortController();
    const disconnect = () => { if (!reply.raw.writableEnded) controller.abort(); };
    reply.raw.once('close', disconnect);
    try { return await service.turn(parsed.data, controller.signal); }
    finally { reply.raw.removeListener('close', disconnect); }
  });
  app.post('/ai/practice/stop', async (request, reply) => {
    const parsed = practiceSessionIdSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid practice session' });
    service.stop(parsed.data.sessionId);
    return { stopped: true };
  });
  app.post('/ai/practice/transcribe', { bodyLimit: 2_900_000 }, async (request, reply) => {
    const parsed = practiceTranscriptionRequestSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid audio transcription request' });
    const controller = new AbortController();
    const disconnect = () => { if (!reply.raw.writableEnded) controller.abort(); };
    reply.raw.once('close', disconnect);
    try { return await service.transcribe(parsed.data, controller.signal); }
    finally { reply.raw.removeListener('close', disconnect); }
  });
}
