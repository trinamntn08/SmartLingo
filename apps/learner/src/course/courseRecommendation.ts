import { courseDayProgress, courseDayProgressRevision, courseLessonEventStage, courseLessonStageForBlock, courseLessonStageId, nextCourseDay, resumeCourseDay,
  type CourseDay, type CourseEvent, type OpenCourse } from '@smartlingo/domain';

export function courseRecommendation(course: OpenCourse, events: readonly CourseEvent[], unavailable: boolean): {
  day: CourseDay; status: 'start' | 'resume' | 'next' | 'complete' | 'unavailable';
} {
  if (unavailable) return { day: course.days[0], status: 'unavailable' };
  const last = resumeCourseDay(course, events) ?? course.days[0];
  const day = courseDayProgress(course, last, events).completed ? nextCourseDay(course, events) : last;
  if (!day) return { day: last, status: 'complete' };
  const started = events.some(event => event.courseId === course.id && event.dayId === day.id
    && event.courseRevision === courseDayProgressRevision(course, day)
    && event.kind !== 'support' && (courseLessonEventStage(event) || day.blocks.some(block => block.id === event.blockId)));
  return { day, status: started ? 'resume' : day.id === last.id ? 'start' : 'next' };
}

/** Use the most recent valid activity, including activity saved by earlier APKs. */
export function latestCourseStudy(courses: readonly OpenCourse[], events: readonly CourseEvent[]): CourseEvent | undefined {
  let latest: CourseEvent | undefined;
  const byId = new Map(courses.map(course => [course.id, course]));
  for (const event of events) {
    if (event.kind === 'support') continue;
    const course = byId.get(event.courseId);
    const day = course?.days.find(item => item.id === event.dayId);
    if (!course || !day || courseDayProgressRevision(course, day) !== event.courseRevision) continue;
    if (!(courseLessonEventStage(event) || day.blocks.some(block => block.id === event.blockId))) continue;
    if (!latest || Date.parse(event.occurredAt) > Date.parse(latest.occurredAt)
      || (Date.parse(event.occurredAt) === Date.parse(latest.occurredAt) && event.id > latest.id)) latest = event;
  }
  return latest;
}

/** An explicit course start or lesson choice uses the same cursor as the reader. */
export function courseNavigationEvent(course: OpenCourse, day: CourseDay, events: readonly CourseEvent[]): CourseEvent {
  const progress = courseDayProgress(course, day, events);
  const step = courseLessonStageForBlock(day, progress.lastBlockId) ?? (progress.completed ? 'sentence' : 'dialogue');
  const timestamp = events.reduce((latest, saved) => Math.max(latest, Date.parse(saved.occurredAt) + 1), Date.now());
  return { id: crypto.randomUUID(), kind: 'navigation', courseId: course.id,
    courseRevision: courseDayProgressRevision(course, day), dayId: day.id,
    blockId: courseLessonStageId(step), occurredAt: new Date(timestamp).toISOString() };
}
