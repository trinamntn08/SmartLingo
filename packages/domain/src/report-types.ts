import type { Lesson } from './content';
import type { OpenCourse, CourseEvent } from './course';
import type { LearningEvent, NotebookEntry } from './learning';
import type { TargetLanguage } from './languages';
import type { ReviewEvent } from './review-schema';

export type LearningReportInput = {
  language: TargetLanguage; lessons: readonly Lesson[]; courses: readonly OpenCourse[];
  events: readonly LearningEvent[]; courseEvents: readonly CourseEvent[];
  notebook: readonly NotebookEntry[]; reviewEvents: readonly ReviewEvent[];
  now: string; timeZone: string;
};
export type ReportDay = { date: string; label: string; actions: number; today: boolean; future: boolean };
export type ReportTopic = {
  name: string; totalLessons: number; completedLessons: number;
  totalWords: number; exploredWords: number;
};
export type LearningReport = {
  language: TargetLanguage; today: string; timeZone: string; weekStart: string; weekEnd: string;
  completedLessons: number; totalLessons: number; exploredWords: number; totalWords: number;
  savedWords: number; completedStudyDays: number; totalStudyDays: number;
  activeDaysThisWeek: number; actionsThisWeek: number; week: ReportDay[]; topics: ReportTopic[];
};
