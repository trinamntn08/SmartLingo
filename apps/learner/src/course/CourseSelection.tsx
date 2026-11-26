import { useId, useLayoutEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { courseDayProgress, type CourseDay, type CourseEvent } from '@smartlingo/domain';
import { routeHref } from '../app/routes';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import { CourseLaunchCard, type CourseLaunchProps } from './CourseLaunchCard';

export function CourseSelection({ courses, current, selected, events, onClose, onChoose, onOpenDay }: {
  courses: readonly CourseLaunchProps[];
  current: string;
  selected?: CourseLaunchProps;
  events: readonly CourseEvent[];
  onClose: () => void;
  onChoose: (courseId?: string) => void;
  onOpenDay: (day: CourseDay) => void;
}) {
  const headingId = useId();
  const language = courses[0]!.course.language;
  const course = selected?.course;

  useLayoutEffect(() => {
    if (Platform.OS !== 'web') return;
    const heading = document.getElementById(headingId);
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }, [headingId, course]);

  return <View style={layout.screen} testID={selected ? 'chosen-course' : 'course-picker'}>
    <View style={layout.header}>
      <Text nativeID={headingId} accessibilityRole="header" aria-level={1} style={[s.heading, layout.title]}>{course?.title ?? 'Courses'}</Text>
      {selected ? <Button compact icon="layers" href={routeHref({ kind: 'courses', language })}
        disabled={selected.disabled} onPress={() => onChoose()}>Courses</Button>
        : <Button compact iconOnly icon="close" label="Close courses" onPress={onClose} />}
    </View>
    {!selected ? <View style={layout.list}>
      {courses.map(({ course, disabled }) =>
        <Button key={course.id} label={course.title + (course.id === current ? ', current course' : '')} icon="book" selected={course.id === current}
          trailingIcon={course.id === current ? 'check' : 'chevron'} href={routeHref({ kind: 'courses', language, courseId: course.id })}
          disabled={disabled} onPress={() => onChoose(course.id)}>{course.title}</Button>)}
    </View> : <>
      <CourseLaunchCard {...selected} concise featured showCourseName={false} />
      <Text accessibilityRole="header" aria-level={2} style={s.heading}>Lessons</Text>
      <View style={layout.list}>
        {selected.course.days.map(day => {
          const completed = courseDayProgress(selected.course, day, events).completed;
          return <Button key={day.id} compact marker={String(day.dayNumber)} disabled={selected.disabled || selected.loading}
            label={`Lesson ${day.dayNumber}: ${day.title}${completed ? ', completed' : ''}`}
            href={routeHref({ kind: 'course', language, courseId: selected.course.id, dayId: day.id })}
            trailingIcon={completed ? 'check' : 'chevron'} onPress={() => onOpenDay(day)}>{day.title}</Button>;
        })}
      </View>
    </>}
  </View>;
}

const layout = StyleSheet.create({
  screen: { maxWidth: 640, width: '100%', alignSelf: 'center', minWidth: 0, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { flex: 1, minWidth: 0 },
  list: { minWidth: 0, gap: 8 },
});
