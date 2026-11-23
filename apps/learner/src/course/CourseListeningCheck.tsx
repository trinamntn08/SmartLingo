import { useId } from 'react';
import { View } from 'react-native';
import type { CourseDay, TargetLanguage } from '@smartlingo/domain';
import { useVisitState } from '../app/WebNavigation';
import { buildCourseListeningQuestion } from '../listening/lessonQuestions';
import { ListeningQuestionPlayer } from '../listening/ListeningQuestionPlayer';
import { Button } from '../ui/controls';
import { styles as s } from '../ui/theme';

export function CourseListeningCheck({ day, language, revision, compact }: {
  day: CourseDay; language: TargetLanguage; revision: number; compact: boolean;
}) {
  const [expanded, setExpanded] = useVisitState(`guided-listening-open:${day.id}:${revision}`, false);
  const contentId = useId();
  const question = buildCourseListeningQuestion(day, language);
  if (!question) return null;

  return <View testID="course-listening-check" style={{ gap: 8, minWidth: 0 }}>
    <View style={s.row}>
      <Button compact accent={!expanded} expanded={expanded} controls={contentId} icon="headphones"
        trailingIcon={expanded ? 'chevron-down' : 'chevron'} onPress={() => setExpanded(value => !value)}>Listening check</Button>
    </View>
    <View nativeID={contentId}>
      {expanded && <ListeningQuestionPlayer question={question} revision={revision} compact={compact} />}
    </View>
  </View>;
}
