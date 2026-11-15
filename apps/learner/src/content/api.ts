import {
  draftSaveSchema, lessonListResponseSchema, lessonResponseSchema, previewResponseSchema,
  publishRequestSchema, revisionRequestSchema, type Lesson,
} from '@smartlingo/domain';

const apiOrigin = 'http://127.0.0.1:3001';
export class ContentApiError extends Error {
  constructor(message: string, public readonly status?: number) { super(message); this.name = 'ContentApiError'; }
}

async function request(path: string, body?: unknown): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${apiOrigin}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json', 'X-SmartLingo-Editor': '1' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'omit', redirect: 'error', signal: controller.signal,
    });
    if (!response.ok) {
      const message = response.status === 409 ? 'This lesson changed in another editor. Reload the latest revision before saving or publishing.'
        : response.status === 403 ? 'Local editor access was refused. Open the app at http://localhost:8081 or http://localhost:8082 and retry.'
          : response.status === 400 ? 'The lesson or preview request was not accepted. Check the fields and preview the saved draft again.'
            : 'The local content server could not complete this request. Your current content was kept.';
      throw new ContentApiError(message, response.status);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ContentApiError) throw error;
    throw new ContentApiError('The local content server is unavailable or timed out. Run npm run dev:api, then retry. Your current content was kept.');
  } finally { clearTimeout(timer); }
}

function expectLesson(lesson: Lesson, id: string, revision: number, status: Lesson['status']): Lesson {
  if (lesson.id !== id || lesson.revision !== revision || lesson.status !== status) {
    throw new ContentApiError('The server returned an unexpected lesson revision. Reload the latest content.');
  }
  return lesson;
}

export const localContentApi = {
  async listLessons(): Promise<Lesson[]> {
    return lessonListResponseSchema.parse(await request('/lessons')).lessons;
  },
  async saveDraft(lesson: Lesson, expectedRevision: number): Promise<Lesson> {
    const command = draftSaveSchema.parse({ lesson: { ...lesson, status: 'draft' }, expectedRevision });
    const result = lessonResponseSchema.parse(await request(`/editor/lessons/${encodeURIComponent(lesson.id)}/draft`, command));
    return expectLesson(result.lesson, lesson.id, expectedRevision + 1, 'draft');
  },
  async previewDraft(id: string, expectedRevision: number) {
    const command = revisionRequestSchema.parse({ expectedRevision });
    const preview = previewResponseSchema.parse(await request(`/editor/lessons/${encodeURIComponent(id)}/preview`, command));
    expectLesson(preview.lesson, id, expectedRevision, 'draft');
    return preview;
  },
  async publishDraft(id: string, expectedRevision: number, previewToken: string): Promise<Lesson> {
    const command = publishRequestSchema.parse({ expectedRevision, previewToken, ownerReviewed: true });
    const result = lessonResponseSchema.parse(await request(`/editor/lessons/${encodeURIComponent(id)}/publish`, command));
    return expectLesson(result.lesson, id, expectedRevision + 1, 'published');
  },
  async getPublished(): Promise<Lesson[]> {
    const result = lessonListResponseSchema.parse(await request('/published-lessons'));
    if (result.lessons.some(lesson => lesson.status !== 'published')) throw new ContentApiError('The server returned unpublished content. Your current catalogue was kept.');
    return result.lessons;
  },
};
