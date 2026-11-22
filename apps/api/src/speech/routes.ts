import type { FastifyInstance } from 'fastify';
import { speechRequestSchema } from '@smartlingo/domain';
import type { SpeechService } from './service';
import { withRequestCancellation } from '../request-cancellation';

export function registerSpeechRoutes(app: FastifyInstance, service: SpeechService): void {
  app.get('/speech/status', async (_request, reply) => { reply.header('Cache-Control', 'no-store'); return service.status(); });
  app.post('/speech/generate', { bodyLimit: 8192 }, async (request, reply) => {
    reply.header('Cache-Control', 'no-store');
    const parsed = speechRequestSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid speech request' });
    return withRequestCancellation(reply.raw, signal => service.generate(parsed.data, signal));
  });
}
