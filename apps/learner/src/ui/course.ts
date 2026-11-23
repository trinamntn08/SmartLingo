import type { NotebookEntry } from '@smartlingo/domain';
import type { LearningModel } from './useLearning';

export type Course = 'French' | 'Japanese';

export function notebookCourse(entry: NotebookEntry): Course {
  return entry.sourceEntryId.startsWith('ja.') || entry.sourceEntryId.startsWith('personal.ja.') ? 'Japanese' : 'French';
}

// Keep the original repository and IDs so older French data and backups stay valid.
export function courseLearningModel(model: LearningModel, course: Course): LearningModel {
  return { ...model,
    events: model.events.filter(event => event.lessonId.startsWith('ja.') === (course === 'Japanese')),
    notebook: model.notebook.filter(entry => notebookCourse(entry) === course),
  };
}

export function initialCourse(): Course {
  try { return globalThis.localStorage?.getItem('smartlingo.course.v1') === 'Japanese' ? 'Japanese' : 'French'; }
  catch { return 'French'; }
}

export function saveCourse(course: Course): void {
  try { globalThis.localStorage?.setItem('smartlingo.course.v1', course); }
  catch { /* Course selection still works when preferences cannot be stored. */ }
}
