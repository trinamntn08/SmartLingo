import { StyleSheet, Text, View } from 'react-native';
import type { CourseDay, OpenCourse } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { colors, designTokens, styles as s } from '../ui/theme';

export interface CourseLaunchProps {
  course: OpenCourse;
  day: CourseDay;
  status: 'start' | 'resume' | 'next' | 'complete' | 'unavailable';
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
  const message = progressMessages[status];
  const title = concise ? day.title : `Lesson ${day.dayNumber}: ${day.title}`;
  return <View testID="open-course-panel" style={[s.card, launch.container, featured && launch.featured]}>
    {showCourseName && <Text style={launch.courseTitle}>{concise ? course.title.split(':', 1)[0] : course.title}</Text>}
    <Text accessibilityRole="header" aria-level={2} style={[s.heading, !concise && launch.largeTitle]}>
      {loading ? 'Loading lesson…' : title}
    </Text>
    {!loading && message && <Text accessibilityLiveRegion="polite" style={s.muted}>{message}</Text>}
    <View style={s.row}><Button primary={featured} quiet={!featured} href={href} onPress={onOpen} disabled={loading || disabled}>
      {featuredActions[status]}
    </Button></View>
  </View>;
}

const launch = StyleSheet.create({
  container: { padding: 16, gap: 12, borderWidth: 0, minWidth: 0 },
  featured: { flexGrow: 1, padding: 20, justifyContent: 'center', backgroundColor: colors.sageTint },
  largeTitle: { fontSize: 34, lineHeight: 40 },
  courseTitle: { ...designTokens.typography.smallLabel, color: colors.primary, fontWeight: '700' },
});
