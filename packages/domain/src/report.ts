import { courseDayProgress, courseDayProgressRevision, courseLessonEventStage, type CourseEvent, type OpenCourse } from './course';
import { lessonProgress, type LearningEvent } from './learning';
import { notebookLanguage } from './languages';
import { localStudyDate } from './review-schema';
import type { Lesson } from './content';
import type { LearningReport, LearningReportInput, ReportDay } from './report-types';

function uniqueEvents<T extends { id: string }>(events: readonly T[]): T[] {
  const byId = new Map<string, T>();
  for (const event of events) {
    const previous = byId.get(event.id);
    if (previous && JSON.stringify(previous) !== JSON.stringify(event)) throw new Error('Conflicting saved activity IDs prevent opening this report.');
    byId.set(event.id, event);
  }
  return [...byId.values()];
}

function currentById<T extends { id: string; revision: number }>(items: readonly T[]): T[] {
  const byId = new Map<string, T>();
  for (const item of items) if (!byId.has(item.id) || byId.get(item.id)!.revision < item.revision) byId.set(item.id, item);
  return [...byId.values()];
}

function calendarWeek(today: string): ReportDay[] {
  // UTC is only calendar arithmetic on a viewer-local YYYY-MM-DD, never elapsed-hour math.
  const monday = new Date(`${today}T00:00:00Z`);
  monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, index) => {
    const day = new Date(monday); day.setUTCDate(day.getUTCDate() + index);
    const date = day.toISOString().slice(0, 10);
    return { date, label, actions: 0, today: date === today, future: date > today };
  });
}

function isLessonAction(event: LearningEvent, lesson: Lesson): boolean {
  if (event.activity === 'vocabulary') return event.result === 'viewed';
  if (event.activity === 'completion') return event.result === 'completed';
  if (event.activity === 'practice') {
    const task = lesson.japanesePractice?.tasks.find(task => task.id === event.itemId);
    return !!task && (task.mode === 'self' ? event.result === 'viewed' : ['correct', 'incorrect'].includes(event.result));
  }
  return ['correct', 'almost', 'incorrect'].includes(event.result);
}

function isCourseAction(event: CourseEvent, course: OpenCourse): boolean {
  const day = course.days.find(day => day.id === event.dayId);
  if (!day) return false;
  if (courseLessonEventStage(event)) return event.kind !== 'navigation' && event.courseRevision <= courseDayProgressRevision(course, day);
  const block = day.blocks.find(block => block.id === event.blockId);
  if (!block) return false;
  if (event.kind === 'study') return ['study', 'vocabulary', 'dialogue'].includes(block.kind);
  if (event.kind === 'choice') return block.kind === 'choice';
  if (event.kind === 'reflection') return block.kind === 'reflection';
  return event.kind === 'completion';
}

/** Read-only activity summary. It never assigns points, mastery, or time studied. */
export function buildLearningReport(input: LearningReportInput): LearningReport {
  const now = Date.parse(input.now);
  if (!Number.isFinite(now)) throw new Error('A valid current time is needed for the learning report.');
  const today = localStudyDate(input.now, input.timeZone);
  const week = calendarWeek(today);
  const days = new Map(week.map(day => [day.date, day]));
  const recorded = (instant: string) => Number.isFinite(Date.parse(instant)) && Date.parse(instant) <= now;
  const lessons = currentById(input.lessons.filter(lesson => lesson.language === input.language));
  const courses = currentById(input.courses.filter(course => course.language === input.language));
  const lessonById = new Map(lessons.map(lesson => [lesson.id, lesson]));
  const courseById = new Map(courses.map(course => [course.id, course]));
  const events = uniqueEvents(input.events).filter(event => {
    const lesson = lessonById.get(event.lessonId);
    return lesson && event.revision > 0 && event.revision <= lesson.revision && recorded(event.occurredAt) && isLessonAction(event, lesson);
  });
  const courseEvents = uniqueEvents(input.courseEvents).filter(event => {
    const course = courseById.get(event.courseId);
    return course && event.courseRevision > 0 && event.courseRevision <= course.revision && recorded(event.occurredAt);
  });
  const notebook = new Map(input.notebook.filter(entry => notebookLanguage(entry) === input.language).map(entry => [entry.id, entry]));
  const reviews = uniqueEvents(input.reviewEvents).filter(event => notebook.has(event.notebookId) && recorded(event.occurredAt));
  const addAction = (instant: string) => { const day = days.get(localStudyDate(instant, input.timeZone)); if (day && !day.future) day.actions++; };
  events.filter(event => event.activity !== 'completion' || !event.automaticCompletion)
    .forEach(event => addAction(event.occurredAt));
  courseEvents.filter(event => isCourseAction(event, courseById.get(event.courseId)!)).forEach(event => addAction(event.occurredAt));
  reviews.forEach(event => addAction(event.occurredAt));

  const explored = new Set<string>();
  const vocabulary = new Set<string>();
  const completed = new Set<string>();
  for (const lesson of lessons) {
    const progress = lessonProgress(lesson, events);
    if (progress.completed) completed.add(lesson.id);
    for (const entry of lesson.vocabulary) {
      vocabulary.add(entry.id);
      if (progress.viewedIds.has(entry.id)) explored.add(entry.id);
    }
  }
  let completedStudyDays = 0;
  for (const course of courses) for (const day of course.days) {
    const progress = courseDayProgress(course, day, courseEvents);
    if (progress.completed) completedStudyDays++;
    for (const entry of day.vocabulary) { vocabulary.add(entry.id); if (progress.lessonWordsStudied) explored.add(entry.id); }
  }
  const grouped = new Map<string, Lesson[]>();
  for (const lesson of lessons) grouped.set(lesson.topic, [...(grouped.get(lesson.topic) ?? []), lesson]);
  const topics = [...grouped].map(([name, items]) => {
    const words = new Set(items.flatMap(lesson => lesson.vocabulary.map(entry => entry.id)));
    return { name, totalLessons: items.length, completedLessons: items.filter(lesson => completed.has(lesson.id)).length,
      totalWords: words.size, exploredWords: [...words].filter(id => explored.has(id)).length };
  });
  return { language: input.language, today, timeZone: input.timeZone, weekStart: week[0].date, weekEnd: week[6].date,
    completedLessons: completed.size, totalLessons: lessons.length, exploredWords: explored.size, totalWords: vocabulary.size,
    savedWords: notebook.size, completedStudyDays, totalStudyDays: courses.reduce((count, course) => count + course.days.length, 0),
    activeDaysThisWeek: week.filter(day => day.actions > 0).length,
    actionsThisWeek: week.reduce((count, day) => count + day.actions, 0), week, topics };
}
