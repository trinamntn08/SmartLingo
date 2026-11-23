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
  const message = loading ? 'Loading course progress…' : progressMessages[status];

  return <View testID="open-course-panel" style={[
    s.card,
    featured ? launch.featured : launch.regular,
    compact && (featured ? launch.featuredCompact : launch.regularCompact),
  ]}>
    <View style={[launch.copy, compact && launch.copyCompact]}>
      <Text accessibilityRole="header" aria-level={2} style={launch.courseTitle}>
        {course.title}
      </Text>
      {!loading && <>
        <Text accessibilityRole="header" aria-level={3} style={[s.heading,
          featured ? launch.featuredTitle : launch.lessonTitle, featured && compact && launch.featuredTitleCompact]}>
          Lesson {day.dayNumber}: {day.title}
        </Text>
        <Text style={[s.body, launch.outcome]}>{day.outcome}</Text>
      </>}
      <Text style={launch.note}>
        {course.days.length} guided {course.days.length === 1 ? 'lesson' : 'lessons'} · Draft preview
      </Text>
      {message && <Text accessibilityLiveRegion="polite" style={launch.note}>{message}</Text>}
    </View>
    <View style={[s.row, !featured && launch.regularAction]}>
      <Button accent={featured} primary={!featured} compact={!featured} href={href} onPress={onOpen}
        disabled={loading || disabled} trailingIcon="arrow-right">{featured ? featuredActions[status] : 'Open course'}</Button>
    </View>
  </View>;
}

const launch = StyleSheet.create({
  regular: { padding: 20, borderTopWidth: 3, borderTopColor: colors.yellow, gap: 8 },
  regularCompact: { padding: 16, gap: 6 },
  featured: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.goldTint, borderBottomWidth: 3, gap: 18 },
  featuredCompact: { padding: 16, gap: 14 },
  copy: { minWidth: 0, gap: 8 },
  copyCompact: { gap: 6 },
  courseTitle: { ...designTokens.typography.smallLabel, color: colors.primary, fontWeight: '700' },
  lessonTitle: { fontSize: 22, lineHeight: 29 },
  featuredTitle: { fontSize: 34, lineHeight: 40 },
  featuredTitleCompact: { fontSize: 27, lineHeight: 33 },
  outcome: { fontSize: 16, lineHeight: 25 },
  note: { ...designTokens.typography.caption, color: colors.muted },
  regularAction: { marginTop: 4 },
});
