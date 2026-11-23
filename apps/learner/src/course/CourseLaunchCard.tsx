import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { CourseDay, OpenCourse } from '@smartlingo/domain';
import { Icon } from '../ui/Icon';
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
  resume: 'Resume your saved section.',
  next: 'Your next lesson is ready.',
  complete: 'All lessons complete. Revisit any lesson.',
  unavailable: 'Saved course progress is unavailable. You can still study.',
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
    {featured && <View style={launch.icon}><Icon name="book" size={22} color={colors.primary} /></View>}
    <View style={[launch.copy, compact && launch.copyCompact, featured && launch.featuredCopy]}>
      <Text accessibilityRole="header" aria-level={2} style={launch.courseTitle}>
        {course.title}
      </Text>
      {!loading && <>
        <Text accessibilityRole="header" aria-level={3} style={[s.heading, launch.lessonTitle]}>
          Lesson {day.dayNumber}: {day.title}
        </Text>
        <Text style={[s.body, launch.outcome]}>{day.outcome}</Text>
      </>}
      <Text style={launch.note}>
        {course.days.length} guided {course.days.length === 1 ? 'lesson' : 'lessons'} · Draft preview
      </Text>
      {message && <Text accessibilityLiveRegion="polite" style={launch.note}>{message}</Text>}
    </View>
    <View style={[s.row, !featured && launch.regularAction, featured && compact && launch.fullWidth]}>
      <Button accent={featured} primary={!featured} compact href={href} onPress={onOpen}
        disabled={loading || disabled} trailingIcon="chevron">Open daily course</Button>
    </View>
  </View>;
}

const launch = StyleSheet.create({
  regular: { padding: 20, borderTopWidth: 3, borderTopColor: colors.yellow, gap: 8 },
  regularCompact: { padding: 16, gap: 6 },
  featured: { padding: 16, backgroundColor: colors.goldTint, borderBottomWidth: 3, flexDirection: 'row', alignItems: 'center', gap: 12 },
  featuredCompact: { padding: 12, flexWrap: 'wrap', alignItems: 'flex-start' },
  copy: { minWidth: 0, gap: 8, justifyContent: 'center' },
  copyCompact: { gap: 6 },
  featuredCopy: { flex: 1, gap: 3 },
  icon: { borderRadius: 10, backgroundColor: colors.yellow, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  courseTitle: { ...designTokens.typography.smallLabel, color: colors.primary, fontWeight: '700' },
  lessonTitle: { fontSize: 22, lineHeight: 29 },
  outcome: { fontSize: 16, lineHeight: 25 },
  note: { ...designTokens.typography.caption, color: colors.muted },
  regularAction: { marginTop: 4 },
  fullWidth: { flexBasis: '100%' },
});
