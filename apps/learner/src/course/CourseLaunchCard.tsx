import type { OpenCourse } from '@smartlingo/domain';
import { StudyLaunchCard } from '../ui/StudyLaunchCard';
import type { CourseRecommendation } from './courseRecommendation';

export interface CourseLaunchProps extends CourseRecommendation {
  course: OpenCourse;
  loading: boolean;
  href: string;
  onOpen: () => void;
  disabled: boolean;
}

const progressMessages: Record<CourseLaunchProps['status'], string | undefined> = {
  start: undefined,
  resume: undefined,
  next: undefined,
  complete: 'Course complete.',
  unavailable: 'Saved progress unavailable.',
};

const featuredActions: Record<CourseLaunchProps['status'], string> = {
  start: 'Start lesson',
  resume: 'Continue lesson',
  next: 'Start lesson',
  complete: 'Revisit lesson',
  unavailable: 'Start lesson',
};

export function CourseLaunchCard({ course, day, status, loading, href, onOpen, disabled, featured = false, concise = false, showCourseName = true }: CourseLaunchProps & {
  featured?: boolean; concise?: boolean; showCourseName?: boolean;
}) {
  const title = concise ? day.title : `Lesson ${day.dayNumber}: ${day.title}`;
  const name = concise ? course.title.split(':', 1)[0] : course.title;
  return <StudyLaunchCard testID="open-course-panel" featured={featured} largeTitle={!concise}
    context={showCourseName ? name : undefined} title={loading ? 'Loading lesson…' : title}
    status={loading ? undefined : progressMessages[status]}
    action={{ label: featuredActions[status], href, onOpen, disabled: loading || disabled }} />;
}
