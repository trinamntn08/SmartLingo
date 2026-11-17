import { lessonSchema, type Lesson } from '@smartlingo/domain';
import bridgeDrafts from './beta/bridge-lessons.json';
import refinementDrafts from './beta/refined-lessons.json';

/** Owner requested all complete material in the beta on 2026-11-17.
 * Inclusion permits learning before manual review; it does not assert teacher
 * validation or publish any local curriculum database revision.
 */
export const betaCurriculumRelease = Object.freeze({
  authorisedOn: '2026-11-17',
  reviewStatus: 'beta-review-after-deployment',
  bridgeLessonIds: bridgeDrafts.map(lesson => lesson.id),
  refinedLessonIds: refinementDrafts.map(lesson => lesson.id),
});

/** Compose complete candidates while retaining the historical draft objects. */
export function integrateBetaCurriculum(baseline: readonly Lesson[]): Lesson[] {
  const originals = new Map(baseline.map(lesson => [lesson.id, lesson]));
  const vocabulary = new Map(baseline.flatMap(lesson => lesson.vocabulary).map(entry => [entry.id, entry]));
  const parseCandidate = (input: unknown): Lesson => {
    const lesson = lessonSchema.parse(input);
    lesson.vocabulary = lesson.vocabulary.map(entry => {
      const canonical = vocabulary.get(entry.id);
      if (canonical) {
        if (JSON.stringify(canonical) !== JSON.stringify(entry)) throw new Error(`Beta canonical vocabulary conflict: ${entry.id}`);
        return canonical;
      }
      vocabulary.set(entry.id, entry);
      return entry;
    });
    return lesson;
  };
  const refinements = new Map(refinementDrafts.map(input => {
    const lesson = parseCandidate(input);
    const original = originals.get(lesson.id);
    if (!original || lesson.revision !== original.revision + 1 || lesson.status !== 'draft') {
      throw new Error(`Invalid beta refinement revision: ${lesson.id}`);
    }
    return [lesson.id, lesson] as const;
  }));
  const bridges = bridgeDrafts.map(input => {
    const lesson = parseCandidate(input);
    if (originals.has(lesson.id) || lesson.revision !== 1 || lesson.status !== 'draft') {
      throw new Error(`Invalid beta bridge revision: ${lesson.id}`);
    }
    return lesson;
  });
  return [...baseline.map(lesson => refinements.get(lesson.id) ?? lesson), ...bridges];
}
