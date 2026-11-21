import type { FastifyInstance } from 'fastify';
import { parseJapaneseSpeechInput, type JapaneseSpeechService } from './service';

export function registerJapaneseSpeechRoutes(app: FastifyInstance, service: JapaneseSpeechService): void {
  app.get('/speech/japanese/status', async () => service.status());
  app.post('/speech/japanese/play', { bodyLimit: 8192 }, async (request, reply) => {
    const input = parseJapaneseSpeechInput(request.body);
    if (!input) return reply.code(400).send({ error: 'Invalid Japanese speech request' });
    const controller = new AbortController();
    const disconnect = () => { if (!reply.raw.writableEnded) controller.abort(); };
    reply.raw.once('close', disconnect);
    try {
      const audio = await service.play(input, controller.signal);
      return reply.type('audio/wav').send(Buffer.from(audio));
    }
    finally { reply.raw.removeListener('close', disconnect); }
  });
}
