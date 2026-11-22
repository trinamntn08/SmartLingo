import { Text, View } from 'react-native';
import { frenchCoursePractice } from '@smartlingo/content';
import type { Lesson } from '@smartlingo/domain';
import { useNavigation } from '../app/WebNavigation';
import { routeHref, type AppRoute } from '../app/routes';
import { Button } from '../ui/controls';
import { styles as s } from '../ui/theme';

type CourseSection = Extract<AppRoute, { kind: 'course' }> & { dayId: string; sectionId: string };

export function RelatedCoursePractice({ section, lessons, disabled }: {
  section: CourseSection; lessons: readonly Lesson[]; disabled: boolean;
}) {
  const { navigate } = useNavigation();
  const { language, courseId, dayId, sectionId } = section;
  if (language !== 'fr-FR') return null;
  const choices = (frenchCoursePractice[dayId] ?? [])
    .map(id => lessons.find(lesson => lesson.id === id && lesson.language === language))
    .filter(lesson => lesson !== undefined);
  if (!choices.length) return null;

  return <View testID="daily-related-practice" style={s.notice}>
    <Text accessibilityRole="header" style={s.heading}>Related practice</Text>
    <View style={s.row}>
      {choices.map(lesson => {
        const destination = { kind: 'lesson', language, lessonId: lesson.id, studyDay: { courseId, dayId, sectionId } } as const;
        return <Button key={lesson.id} compact href={routeHref(destination)} disabled={disabled}
          onPress={() => navigate(destination)}>{lesson.subtitle}</Button>;
      })}
    </View>
  </View>;
}
