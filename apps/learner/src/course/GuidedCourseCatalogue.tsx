import { useId, useLayoutEffect, useMemo } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { courseOutlineUnits } from '@smartlingo/content';
import { courseDayProgress, type CourseDay, type CourseEvent, type OpenCourse, type TargetLanguage } from '@smartlingo/domain';
import { KanaStudyLinks } from '../alphabet/KanaStudyLinks';
import { routeHref } from '../app/routes';
import { SidebarRow, sidebarStyles } from '../ui/SidebarRow';
import { colors, designTokens as tokens, styles as s } from '../ui/theme';

interface GuidedCourseCatalogueProps {
  language: TargetLanguage;
  courses: readonly OpenCourse[];
  events: readonly CourseEvent[];
  loading: boolean;
  progressAvailable: boolean;
  disabled: boolean;
  onOpenDay: (course: OpenCourse, day: CourseDay) => void;
}

export function GuidedCourseCatalogue({ language, courses, events, loading, progressAvailable, disabled, onOpenDay }: GuidedCourseCatalogueProps) {
  const headingId = useId();
  const compact = useWindowDimensions().width < tokens.layout.compactBreakpoint;
  const completedByCourse = useMemo(() => {
    if (loading || !progressAvailable) return undefined;
    const eventsByDay = new Map<string, CourseEvent[]>();
    for (const event of events) {
      const dayEvents = eventsByDay.get(event.dayId);
      if (dayEvents) dayEvents.push(event);
      else eventsByDay.set(event.dayId, [event]);
    }
    return new Map(courses.map(course => [course.id, new Set(course.days
      .filter(day => courseDayProgress(course, day, eventsByDay.get(day.id) ?? []).completed)
      .map(day => day.id))]));
  }, [courses, events, loading, progressAvailable]);

  useLayoutEffect(() => {
    if (Platform.OS !== 'web') return;
    const heading = document.getElementById(headingId);
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }, [headingId]);

  function renderCourse(course: OpenCourse) {
    const units = courseOutlineUnits(course);
    const complete = completedByCourse?.get(course.id);

    function renderLesson(day: CourseDay) {
      const completed = complete?.has(day.id);
      return <SidebarRow key={day.id} title={day.title} marker={String(day.dayNumber)}
        label={`Lesson ${day.dayNumber}: ${day.title}${completed ? ', completed' : ''}`}
        trailingIcon={completed ? 'check' : undefined}
        href={routeHref({ kind: 'course', language, courseId: course.id, dayId: day.id })}
        disabled={disabled || loading} onPress={() => onOpenDay(course, day)} />;
    }

    return <View key={course.id} style={[s.card, compact && t.compactCard]}>
      <View style={t.courseHeading}>
        <Text accessibilityRole="header" aria-level={2} style={sidebarStyles.title}>{course.title}</Text>
        <Text style={sidebarStyles.meta}>
          {course.days.length} {course.days.length === 1 ? 'lesson' : 'lessons'}
          {complete ? ` · ${complete.size} completed` : ''}
        </Text>
      </View>
      {units?.length ? <View style={t.units}>
        {units.map((unit, index) => <View key={unit.id} style={[t.unit, compact && t.compactUnit]}>
          <Text accessibilityRole="header" aria-level={3} style={sidebarStyles.sectionLabel}>
            Unit {index + 1}: {unit.title}
          </Text>
          <View style={t.rows}>{course.days.filter(day => unit.dayIds.includes(day.id)).map(renderLesson)}</View>
        </View>)}
      </View> : <View style={t.rows}>{course.days.map(renderLesson)}</View>}
    </View>;
  }

  return <View testID="guided-course-catalogue" style={t.catalogue}>
    <View style={t.courseHeading}>
      <Text nativeID={headingId} accessibilityRole="header" aria-level={1}
        style={[s.title, compact && s.compactTitle]}>Guided courses</Text>
      <Text style={s.muted}>Choose a lesson to start or resume.</Text>
    </View>
    {language === 'ja-JP' && <KanaStudyLinks disabled={disabled} />}
    {loading && <Text accessibilityLiveRegion="polite" style={sidebarStyles.meta}>Loading saved course progress…</Text>}
    {!loading && !progressAvailable && <Text accessibilityLiveRegion="polite" style={sidebarStyles.meta}>Saved course progress is unavailable.</Text>}
    {courses.length ? courses.map(renderCourse) : <Text style={s.muted}>No guided courses are available yet.</Text>}
  </View>;
}

const t = StyleSheet.create({
  catalogue: { width: '100%', maxWidth: 1000, alignSelf: 'center', gap: tokens.space.lg },
  courseHeading: { gap: tokens.space.xs },
  compactCard: { padding: tokens.space.md },
  units: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.space.lg },
  unit: { flexGrow: 1, flexBasis: 256, minWidth: 0, gap: tokens.space.xs },
  compactUnit: { flexBasis: '100%' },
  rows: { borderTopWidth: 1, borderColor: colors.line, paddingTop: tokens.space.xs },
});
