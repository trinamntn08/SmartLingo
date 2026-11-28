import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
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
  resume: 'Resume your saved step.',
  next: 'Your next lesson is ready.',
  complete: 'All lessons complete. Revisit any lesson.',
  unavailable: 'Saved course progress is unavailable. You can still study.',
};

const featuredActions: Record<CourseLaunchProps['status'], string> = {
  start: 'Start lesson',
  resume: 'Continue lesson',
  next: 'Start lesson',
  complete: 'Revisit lesson',
  unavailable: 'Start lesson',
};

export function CourseLaunchCard({ course, day, status, loading, href, onOpen, disabled, featured = false }: CourseLaunchProps & {
  featured?: boolean;
}) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const showProgress = !featured || status === 'unavailable' || status === 'complete';
  const message = loading ? 'Loading course progress…' : showProgress ? progressMessages[status] : undefined;

  return <View testID="open-course-panel" style={[
    s.card,
    featured ? launch.featured : launch.regular,
    compact && (featured ? launch.featuredCompact : launch.regularCompact),
  ]}>
    <View style={[launch.copy, compact && launch.copyCompact]}>
      {!featured && <Text accessibilityRole="header" aria-level={2} style={launch.courseTitle}>
        {course.title}
      </Text>}
      {!loading && <>
        <Text accessibilityRole="header" aria-level={featured ? 2 : 3} style={[s.heading,
          featured ? launch.featuredTitle : launch.lessonTitle, featured && compact && launch.featuredTitleCompact]}>
          Lesson {day.dayNumber}: {day.title}
        </Text>
        <Text style={[s.body, launch.outcome]}>{day.outcome}</Text>
      </>}
      {!featured && <Text style={launch.note}>
        {course.days.length} guided {course.days.length === 1 ? 'lesson' : 'lessons'} · Draft preview
      </Text>}
      {message && <Text accessibilityLiveRegion="polite" style={launch.note}>{message}</Text>}
    </View>
    <View style={[s.row, !featured && launch.regularAction]}>
      <Button accent={featured} primary={!featured} compact={!featured} href={href} onPress={onOpen}
        disabled={loading || disabled} trailingIcon="arrow-right">{featured ? featuredActions[status] : 'Open course'}</Button>
    </View>
  </View>;
}

const launch = StyleSheet.create({
  regular: { padding: 20, gap: 12 },
  regularCompact: { padding: 16 },
  featured: { padding: 32, borderLeftWidth: 4, borderLeftColor: colors.yellow, boxShadow: 'none', gap: 20 },
  featuredCompact: { padding: 20, gap: 16 },
  copy: { minWidth: 0, gap: 12 },
  copyCompact: { gap: 8 },
  courseTitle: { ...designTokens.typography.smallLabel, color: colors.primary },
  lessonTitle: { fontSize: 22, lineHeight: 28 },
  featuredTitle: { fontSize: 36, lineHeight: 44, letterSpacing: -0.9 },
  featuredTitleCompact: { fontSize: 28, lineHeight: 36, letterSpacing: -0.5 },
  outcome: { fontSize: 16, lineHeight: 24 },
  note: { ...designTokens.typography.caption, color: colors.muted },
  regularAction: { alignSelf: 'flex-start' },
});
