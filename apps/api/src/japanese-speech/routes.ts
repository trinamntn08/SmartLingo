import type { FastifyInstance } from 'fastify';
import { parseJapaneseSpeechInput, type JapaneseSpeechService } from './service';
import { withRequestCancellation } from '../request-cancellation';

export function registerJapaneseSpeechRoutes(app: FastifyInstance, service: JapaneseSpeechService): void {
  app.get('/speech/japanese/status', async () => service.status());
  app.post('/speech/japanese/play', { bodyLimit: 8192 }, async (request, reply) => {
    const input = parseJapaneseSpeechInput(request.body);
    if (!input) return reply.code(400).send({ error: 'Invalid Japanese speech request' });
    const audio = await withRequestCancellation(reply.raw, signal => service.play(input, signal));
    return reply.type('audio/wav').send(Buffer.from(audio));
  });
}
