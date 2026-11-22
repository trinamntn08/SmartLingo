import { Text, View, useWindowDimensions } from 'react-native';
import type { CourseDay, OpenCourse } from '@smartlingo/domain';
import { ContextImage } from '../ui/ContextImage';
import { getContextPhoto } from '../ui/contextPhotos';
import { getDailyDialoguePhoto } from '../ui/dialoguePhotos';
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
  const noteColor = featured ? '#C5DCD3' : colors.muted;
  const message = loading ? 'Loading course progress…' : progressMessages[status];
  const textColor = featured ? colors.card : colors.ink;

  return <View testID="open-course-panel" style={featured
    ? { flexDirection: compact ? 'column-reverse' : 'row', backgroundColor: colors.dark, borderRadius: 20, overflow: 'hidden' }
    : [s.card, { padding: compact ? 16 : 20, borderTopWidth: 3, borderTopColor: colors.yellow }]}>
    <View style={{ flex: featured && !compact ? 1 : undefined, minWidth: 0, gap: compact ? 6 : 8,
      padding: featured ? (compact ? 16 : 24) : 0, justifyContent: 'center' }}>
      <Text accessibilityRole="header" style={[s.muted, { color: featured ? colors.yellow : colors.primary, fontWeight: '700', fontSize: 15 }]}>
        {course.title}
      </Text>
      {!loading && <>
        <Text accessibilityRole="header" style={[featured ? s.title : s.heading, { color: textColor },
          featured ? { fontSize: compact ? 28 : 36, lineHeight: compact ? 34 : 43 } : { fontSize: 22, lineHeight: 29 }]}>
          Lesson {day.dayNumber}: {day.title}
        </Text>
        <Text style={[s.body, { color: textColor, fontSize: featured && !compact ? 18 : 16, lineHeight: 25 }]}>{day.outcome}</Text>
      </>}
      <Text style={[s.muted, { color: noteColor, fontSize: 14, lineHeight: 20 }]}>
        {course.days.length} guided {course.days.length === 1 ? 'lesson' : 'lessons'} · Draft preview
      </Text>
      {message && <Text accessibilityLiveRegion="polite" style={[s.muted, { color: noteColor, fontSize: 14, lineHeight: 20 }]}>{message}</Text>}
      <View style={[s.row, { marginTop: 4 }]}>
        <Button accent={featured} primary={!featured} compact={!featured} href={href} onPress={onOpen}
          disabled={loading || disabled} trailingIcon="chevron">Open daily course</Button>
      </View>
    </View>
    {featured && <ContextImage photo={getDailyDialoguePhoto(day.id) ?? getContextPhoto(course.language, day.title)}
      style={compact ? { width: '100%', height: 104 } : { flex: 1.15, minHeight: 244 }} />}
  </View>;
}
