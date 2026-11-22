import { Text, View } from 'react-native';
import { courseDayProgress, type CourseDay, type CourseEvent, type OpenCourse } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';

type CourseLevelFilter = CourseDay['level'] | 'All';

interface CourseDayChooserProps {
  course: OpenCourse;
  currentDay: CourseDay;
  events: readonly CourseEvent[];
  level: CourseLevelFilter;
  onLevelChange: (level: CourseLevelFilter) => void;
  onSelectDay: (day: CourseDay) => void;
  compact: boolean;
  loading: boolean;
  browseOnly: boolean;
  navigationBlocked: boolean;
}

const levels = ['All', 'foundation', 'A1', 'A2', 'B1'] as const;

export function CourseDayChooser({ course, currentDay, events, level, onLevelChange, onSelectDay, compact, loading, browseOnly, navigationBlocked }: CourseDayChooserProps) {
  function renderDayCards(days: readonly CourseDay[]) {
    return <View style={[s.row, { alignItems: 'stretch' }]} accessibilityLabel="Available study days">
      {days.map(day => {
        const saved = courseDayProgress(course, day, events);
        const status = loading ? 'Loading saved progress…' : browseOnly ? 'Browsing only · progress unavailable'
          : saved.completed ? 'Study day saved' : saved.completedBlockIds.size ? `${saved.completedBlockIds.size} of ${day.blocks.length} sections saved` : 'Not started';
        return <View key={day.id} testID={`course-day-${day.id}`} style={{ gap: 10, flexBasis: compact ? '100%' : 230,
          flexGrow: 1, flexShrink: 1, minWidth: 0, maxWidth: compact ? '100%' : 320, padding: 14, borderRadius: 14,
          backgroundColor: day.id === currentDay.id ? colors.goldTint : colors.card, borderWidth: 1, borderColor: colors.line }}>
          <Text style={s.eyebrow}>Day {String(day.dayNumber).padStart(2, '0')} · {day.level === 'foundation' ? 'Foundations' : day.level}</Text>
          <Button label={`Choose day ${day.dayNumber}: ${day.title}`} selected={day.id === currentDay.id}
            disabled={navigationBlocked} onPress={() => onSelectDay(day)}>Day {day.dayNumber}: {day.title}</Button>
          <Text style={s.muted}>{status}</Text>
        </View>;
      })}
    </View>;
  }

  return <View testID="course-day-chooser" style={[s.notice, { gap: 12 }]}>
    <Text accessibilityRole="header" style={s.heading}>Choose a study day</Text>
    <Text style={s.muted}>Every day is open. Return whenever you like.</Text>
    {course.units?.length ? course.units.map((unit, index) =>
      <View key={unit.id} testID={`course-unit-${unit.id}`} style={{ gap: 10, minWidth: 0 }}>
        <Text accessibilityRole="header" style={[s.heading, { fontSize: 19, lineHeight: 26 }]}>Unit {index + 1}: {unit.title}</Text>
        <Text style={s.muted}>{unit.outcome}</Text>
        {renderDayCards(course.days.filter(day => unit.dayIds.includes(day.id)))}
      </View>) : <>
      <View style={s.row}>
        {levels.filter(value => value === 'All' || course.days.some(day => day.level === value)).map(value =>
          <Button key={value} disabled={navigationBlocked} selected={level === value} onPress={() => onLevelChange(value)}>
            {value === 'All' ? 'All course levels' : value === 'foundation' ? 'Foundations' : value}
          </Button>)}
      </View>
      {renderDayCards(course.days.filter(day => level === 'All' || day.level === level))}
    </>}
  </View>;
}
