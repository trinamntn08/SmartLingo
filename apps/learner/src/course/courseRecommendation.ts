import { courseDayProgress, courseDayProgressRevision, courseLessonEventStage, nextCourseDay, resumeCourseDay,
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
