import type { FastifyInstance } from 'fastify';
import { speechRequestSchema } from '@smartlingo/domain';
import type { SpeechService } from './service';

export function registerSpeechRoutes(app: FastifyInstance, service: SpeechService): void {
  app.get('/speech/status', async (_request, reply) => { reply.header('Cache-Control', 'no-store'); return service.status(); });
  app.post('/speech/generate', { bodyLimit: 8192 }, async (request, reply) => {
    reply.header('Cache-Control', 'no-store');
    const parsed = speechRequestSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid speech request' });
    const controller = new AbortController();
    const disconnect = () => { if (!reply.raw.writableEnded) controller.abort(); };
    reply.raw.once('close', disconnect);
    try { return await service.generate(parsed.data, controller.signal); }
    finally { reply.raw.removeListener('close', disconnect); }
  });
}
