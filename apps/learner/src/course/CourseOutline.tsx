import { useLayoutEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { courseOutlineUnits } from '@smartlingo/content';
import { courseDayProgress, type CourseDay, type CourseEvent, type OpenCourse } from '@smartlingo/domain';
import { KanaStudyLinks } from '../alphabet/KanaStudyLinks';
import { useNavigation, useVisitState } from '../app/WebNavigation';
import { routeHref, type AppRoute } from '../app/routes';
import { Button } from '../ui/controls';
import { SidebarRow, sidebarStyles } from '../ui/SidebarRow';
import { colors, designTokens, styles as s } from '../ui/theme';

type CourseRoute = Extract<AppRoute, { kind: 'course' }>;
type CourseLevel = CourseDay['level'] | 'All';
export type CourseSidebar = 'wide' | 'medium';
type CourseOutlineProgress = 'loading' | 'unavailable' | 'available';

interface CourseOutlineProps {
  id: string;
  sidebar?: CourseSidebar;
  course: OpenCourse;
  route: CourseRoute;
  day: CourseDay;
  events: readonly CourseEvent[];
  progress: CourseOutlineProgress;
  level: CourseLevel;
  onLevelChange: (level: CourseLevel) => void;
  blocked: boolean;
  onDay: (day: CourseDay) => void;
}

const levels = ['All', 'foundation', 'A1', 'A2', 'B1'] as const;
const levelName = (value: CourseLevel) => value === 'All' ? 'All levels' : value === 'foundation' ? 'Foundations' : value;
const lessonCount = (count: number) => `${count} ${count === 1 ? 'lesson' : 'lessons'}`;

export function CourseOutline({ id, sidebar, course, route, day, events, progress,
  level: selectedLevel, onLevelChange, blocked, onDay }: CourseOutlineProps) {
  const { navigate } = useNavigation();
  const [unitChoices, setUnitChoices] = useVisitState<Record<string, boolean>>('course.outline.units', {});
  const scroll = useRef<HTMLDivElement>(null);
  const activeDayId = `${id}-active-day`;
  const activeUnitHeadingId = `${id}-active-unit`;
  const units = courseOutlineUnits(course);
  const activeUnit = units?.find(unit => unit.dayIds.includes(day.id));
  const japanese = course.language === 'ja-JP';
  const level = japanese ? 'All' : selectedLevel;
  const completedDays = useMemo(() => progress === 'available' ? new Set(course.days
    .filter(item => courseDayProgress(course, item, events).completed).map(item => item.id)) : undefined, [course, events, progress]);
  const visibleDays = level === 'All' ? course.days : course.days.filter(item => item.level === level);
  const availableLevels = levels.filter(value => value === 'All' || course.days.some(item => item.level === value));
  const proficiencyLevels = availableLevels.filter(value => value !== 'All' && value !== 'foundation');
  const showLevelFilters = !japanese && (units?.length ? proficiencyLevels.length > 1 : availableLevels.length > 2);
  const coursesRoute = { kind: 'courses', language: course.language } as const;
  const topicsRoute = { kind: 'topics', language: course.language } as const;

  function chooseLevel(value: CourseLevel) {
    const currentChoice = `All:${day.id}`;
    if (value === 'All' && level !== 'All' && unitChoices[currentChoice] === false) {
      setUnitChoices(choices => ({ ...choices, [currentChoice]: true }));
    }
    onLevelChange(value);
  }

  useLayoutEffect(() => {
    const panel = scroll.current;
    if (!panel) return;
    const active = document.getElementById(activeDayId);
    if (!active) { panel.scrollTop = 0; return; }
    const frame = panel.getBoundingClientRect();
    const row = active.getBoundingClientRect();
    const headingTop = document.getElementById(activeUnitHeadingId)?.getBoundingClientRect().top ?? row.top;
    const top = row.bottom - headingTop <= frame.height - 16 ? headingTop : row.top;
    if (row.bottom > frame.bottom - 8) panel.scrollTop += row.bottom - frame.bottom + 8;
    else if (top < frame.top + 8) panel.scrollTop += top - frame.top - 8;
  }, [activeDayId, activeUnitHeadingId, day.id, level, sidebar]);

  function renderDays(days: readonly CourseDay[]) {
    return days.map(item => {
      const current = item.id === day.id;
      const completed = completedDays?.has(item.id);
      return <View key={item.id} nativeID={current ? activeDayId : undefined} testID={`course-day-${item.id}`}>
        <SidebarRow title={item.title} marker={String(item.dayNumber)} description={current ? 'Current lesson' : undefined}
          trailingIcon={completed ? 'check' : null}
          label={`Choose lesson ${item.dayNumber}: ${item.title}${completed ? ', completed' : ''}`}
          href={routeHref({ ...route, dayId: item.id, sectionId: undefined })}
          current={current} disabled={blocked} onPress={() => onDay(item)} />
      </View>;
    });
  }

  const chooser = <View testID="course-day-chooser" style={t.chooser}>
    {showLevelFilters && <View style={t.group}>
      <Text accessibilityRole="header" aria-level={3} style={sidebarStyles.sectionLabel}>Lesson levels</Text>
      <View style={[s.row, t.filters]}>
        {availableLevels.map(value => <Button compact key={value} disabled={blocked} selected={level === value} toggle
          label={value === 'All' ? 'All course levels' : undefined} onPress={() => chooseLevel(value)}>{levelName(value)}</Button>)}
      </View>
      {level !== 'All' && <>
        <Text accessibilityLiveRegion="polite" style={sidebarStyles.meta}>
          Showing {visibleDays.length} of {lessonCount(course.days.length)}
        </Text>
        {day.level !== level && <Text style={sidebarStyles.meta}>Current lesson is outside this filter</Text>}
      </>}
    </View>}
    {units?.length ? units.map((unit, position) => {
      const current = unit.id === activeUnit?.id;
      const matching = visibleDays.filter(item => unit.dayIds.includes(item.id));
      // An unfiltered outline follows the current lesson. A filter exposes its matches.
      const choiceKey = `${level}:${current ? day.id : unit.id}`;
      const expanded = unitChoices[choiceKey] ?? (level === 'All' ? current : matching.length > 0);
      const detailsId = `${id}-unit-${position}`;
      const count = matching.length === unit.dayIds.length
        ? lessonCount(unit.dayIds.length) : `${matching.length} of ${lessonCount(unit.dayIds.length)}`;
      return <View key={unit.id} testID={`course-unit-${unit.id}`} style={t.unit}>
        <View nativeID={current ? activeUnitHeadingId : undefined} accessibilityRole="header" aria-level={3}>
          <SidebarRow title={`Unit ${position + 1}: ${unit.title}`} description={count}
            label={`Unit ${position + 1}: ${unit.title}`} expanded={expanded} controls={detailsId}
            onPress={() => setUnitChoices(choices => ({ ...choices, [choiceKey]: !expanded }))} />
        </View>
        <View nativeID={detailsId} style={expanded ? t.unitLessons : t.hidden}>
          {expanded && <>
            {current && japanese && unit.outcome && <Text style={[sidebarStyles.meta, t.unitNote]}>{unit.outcome}</Text>}
            {matching.length ? renderDays(matching) : <Text style={[sidebarStyles.meta, t.unitNote]}>No matching lessons in this unit</Text>}
          </>}
        </View>
      </View>;
    }) : renderDays(visibleDays)}
  </View>;

  const outline = <View nativeID={id} testID="course-outline" accessibilityRole="navigation" accessibilityLabel="Course outline"
    style={[sidebarStyles.panel, t.outline, !!sidebar && t.splitOutline]}>
    <View style={[sidebarStyles.group, t.header]}>
      <Text accessibilityRole="header" aria-level={2} style={sidebarStyles.title}>Course outline</Text>
      <Text style={t.courseTitle}>{course.title}</Text>
      <Text style={sidebarStyles.meta}>{units?.length ? `${units.length} ${units.length === 1 ? 'unit' : 'units'} · ` : ''}{lessonCount(course.days.length)}</Text>
      <Text accessibilityLiveRegion="polite" style={[sidebarStyles.meta, t.progress]}>
        {completedDays ? `${completedDays.size} of ${lessonCount(course.days.length)} complete`
          : progress === 'loading' ? 'Loading saved progress…' : 'Saved progress unavailable'}
      </Text>
    </View>
    {japanese && <KanaStudyLinks disabled={blocked} />}
    {sidebar ? <div ref={scroll} style={{ overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${colors.inputBorder} transparent`,
      minHeight: 0, flex: '0 1 auto', padding: 4, margin: -4 }}>{chooser}</div> : chooser}
    <View style={t.more}>
      <SidebarRow title="Browse guided courses" href={routeHref(coursesRoute)}
        icon="layers" onPress={() => navigate(coursesRoute)} disabled={blocked} />
      <SidebarRow title="Browse lessons by topic" href={routeHref(topicsRoute)}
        icon="book" onPress={() => navigate(topicsRoute)} disabled={blocked} />
    </View>
  </View>;

  if (!sidebar) return outline;

  // The outline keeps its context and destinations visible while the lesson list scrolls.
  return <div style={{ position: 'sticky', top: 12, display: 'flex', flexDirection: 'column',
    flexShrink: 0, alignSelf: 'flex-start', width: sidebar === 'wide' ? designTokens.layout.sidebarWidth : 224,
    maxHeight: sidebar === 'wide' ? 'calc(100dvh - 220px)' : 'calc(100dvh - 256px)' }}>
    {outline}
  </div>;
}

const t = StyleSheet.create({
  outline: { gap: 12 },
  splitOutline: { flexShrink: 1, minHeight: 0 },
  header: { gap: 4 },
  courseTitle: { ...designTokens.typography.label, color: colors.ink },
  progress: { fontWeight: '600', color: colors.primary },
  chooser: { gap: 4, minWidth: 0 },
  group: { gap: 4, paddingBottom: 8 },
  unit: { borderTopWidth: 1, borderColor: colors.line },
  unitLessons: { gap: 2, paddingBottom: 4 },
  unitNote: { paddingHorizontal: 12, paddingVertical: 4 },
  filters: { gap: 4 },
  hidden: { display: 'none' },
  more: { borderTopWidth: 1, borderColor: colors.line, paddingTop: 8 },
});
