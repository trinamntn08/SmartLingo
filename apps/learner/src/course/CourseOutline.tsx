import { useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { japaneseDailyUnits } from '@smartlingo/content';
import { courseDayProgress, type CourseDay, type CourseEvent, type OpenCourse } from '@smartlingo/domain';
import { routeHref, type AppRoute } from '../app/routes';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';

type CourseRoute = Extract<AppRoute, { kind: 'course' }>;
type CourseLevel = CourseDay['level'] | 'All';
export type CourseSidebar = 'wide' | 'medium';

interface CourseOutlineProps {
  id: string;
  sidebar?: CourseSidebar;
  course: OpenCourse;
  route: CourseRoute;
  day: CourseDay;
  events: readonly CourseEvent[];
  level: CourseLevel;
  onLevelChange: (level: CourseLevel) => void;
  blocked: boolean;
  onDay: (day: CourseDay) => void;
}

const neighborCount = 10;
const levels = ['All', 'foundation', 'A1', 'A2', 'B1'] as const;

export function CourseOutline({ id, sidebar, course, route, day, events,
  level, onLevelChange, blocked, onDay }: CourseOutlineProps) {
  const [showAll, setShowAll] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const activeDayId = `${id}-active-day`;
  const index = course.days.findIndex(candidate => candidate.id === day.id);
  const nearbyDays = course.days.slice(Math.max(0, index - neighborCount), index + neighborCount + 1);
  const visibleDays = level !== 'All' ? course.days.filter(candidate => candidate.level === level)
    : showAll ? course.days : nearbyDays;
  const units = course.units ?? (course.language === 'ja-JP' ? japaneseDailyUnits : undefined);
  const unitGroups = units?.map((unit, position) => ({
    unit, position, days: visibleDays.filter(candidate => unit.dayIds.includes(candidate.id)),
  })).filter(group => group.days.length);

  useLayoutEffect(() => {
    const panel = scroll.current;
    if (!panel) return;
    const active = document.getElementById(activeDayId);
    if (!active) return;
    const frame = panel.getBoundingClientRect();
    const row = active.getBoundingClientRect();
    if (row.bottom > frame.bottom - 8) panel.scrollTop += row.bottom - frame.bottom + 8;
    else if (row.top < frame.top + 8) panel.scrollTop += row.top - frame.top - 8;
  }, [activeDayId, day.id, level, showAll, sidebar]);

  function renderDays(days: readonly CourseDay[]) {
    return days.map(item => {
      const active = item.id === day.id;
      const completed = courseDayProgress(course, item, events).completed;
      return <View key={item.id} nativeID={active ? activeDayId : undefined} testID={`course-day-${item.id}`} style={[t.day, active && t.currentDay]}>
        <Button compact marker={String(item.dayNumber)} trailingIcon={completed ? 'check' : undefined}
          label={`Choose lesson ${item.dayNumber}: ${item.title}${completed ? ', completed' : ''}`}
          href={routeHref({ ...route, dayId: item.id, sectionId: undefined })}
          quiet selected={active} disabled={blocked} onPress={() => onDay(item)}>{item.title}</Button>
      </View>;
    });
  }

  const outline = <View nativeID={id} testID="course-outline" accessibilityRole="navigation" accessibilityLabel="Course outline"
    style={t.outline}>
    {sidebar && <Text accessibilityRole="header" style={[s.heading, t.title]}>Course outline</Text>}
    <View testID="course-day-chooser" style={t.group}>
      <Text accessibilityRole="header" style={t.label}>Lessons</Text>
      {level === 'All' && nearbyDays.length < course.days.length && <View style={{ alignItems: 'flex-start' }}>
        <Button compact quiet onPress={() => setShowAll(value => !value)}>{showAll ? 'Show nearby lessons' : 'Show all lessons'}</Button>
      </View>}
      {!course.units?.length && <View style={[s.row, t.filters]}>
        {levels.filter(value => value === 'All' || course.days.some(item => item.level === value)).map(value =>
          <Button compact key={value} disabled={blocked} selected={level === value} onPress={() => onLevelChange(value)}
            label={value === 'All' ? 'All course levels' : undefined}>
            {value === 'All' ? 'All levels' : value === 'foundation' ? 'Foundations' : value}
          </Button>)}
      </View>}
      {unitGroups ? unitGroups.map(({ unit, position, days }) =>
        <View key={unit.id} testID={`course-unit-${unit.id}`} style={t.group}>
          <Text accessibilityRole="header" style={[s.muted, t.unit]}>Unit {position + 1}: {unit.title}</Text>
          {course.language === 'ja-JP' && unit.dayIds.includes(day.id) && <Text style={s.muted}>{unit.outcome}</Text>}
          {renderDays(days)}
        </View>) : renderDays(visibleDays)}
    </View>
  </View>;

  if (!sidebar) return outline;

  // The learner shell already scrolls the lesson. Give a long outline its own scroll area.
  return <div ref={scroll} style={{ position: 'sticky', top: 12, flexShrink: 0, alignSelf: 'flex-start',
    width: sidebar === 'wide' ? 250 : 220, maxHeight: sidebar === 'wide' ? 'calc(100dvh - 96px)' : 'calc(100dvh - 160px)',
    overflowY: 'auto', padding: 4, margin: -4 }}>
    {outline}
  </div>;
}

const t = StyleSheet.create({
  outline: { backgroundColor: colors.card, borderRadius: 12, padding: 12, gap: 12, minWidth: 0, borderWidth: 1, borderColor: colors.line },
  title: { fontSize: 20, lineHeight: 28 },
  group: { gap: 4, minWidth: 0 },
  label: { ...s.eyebrow, fontSize: 14, lineHeight: 20 },
  unit: { fontSize: 14, lineHeight: 20, fontWeight: '600', paddingBottom: 4 },
  filters: { gap: 4, marginBottom: 4 },
  day: { borderLeftWidth: 3, borderLeftColor: 'transparent' },
  currentDay: { borderLeftColor: colors.yellow },
});
