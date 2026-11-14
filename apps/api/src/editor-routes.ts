import type { FastifyInstance } from 'fastify';
import { publishRequestSchema, revisionRequestSchema } from '@smartlingo/domain';
import { EditorError } from './editor-error';
import { PreviewReceipts } from './preview-receipts';
import type { LessonRepository } from './repository';

export const lessonParams = {
  type: 'object', required: ['id'], additionalProperties: false,
  properties: { id: { type: 'string', pattern: '^[a-z0-9][a-z0-9.-]+$', maxLength: 120 } },
};

export function registerEditorRoutes(app: FastifyInstance, repository: LessonRepository, receipts: PreviewReceipts): void {
  const schema = { params: lessonParams };
  app.post<{ Params: { id: string } }>('/editor/lessons/:id/draft', { schema }, async request => {
    const lesson = repository.saveDraft(request.params.id, request.body);
    receipts.invalidate(lesson.id);
    return { lesson };
  });
  app.post<{ Params: { id: string } }>('/editor/lessons/:id/preview', { schema }, async request => {
    const command = revisionRequestSchema.safeParse(request.body);
    if (!command.success) throw new EditorError(400, 'Invalid preview request');
    const lesson = repository.getLesson(request.params.id);
    if (!lesson) throw new EditorError(404, 'Lesson not found');
    if (lesson.revision !== command.data.expectedRevision || lesson.status !== 'draft') {
      throw new EditorError(409, 'Preview requires the latest saved draft');
    }
    return { lesson, previewToken: receipts.issue(lesson.id, lesson.revision) };
  });
  app.post<{ Params: { id: string } }>('/editor/lessons/:id/publish', { schema }, async request => {
    const command = publishRequestSchema.safeParse(request.body);
    if (!command.success) throw new EditorError(400, 'Explicit owner review and a saved preview are required');
    receipts.verify(command.data.previewToken, request.params.id, command.data.expectedRevision);
    const lesson = repository.publishDraft(request.params.id, command.data.expectedRevision);
    receipts.invalidate(lesson.id);
    return { lesson };
  });
}
