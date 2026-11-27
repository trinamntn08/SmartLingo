import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { routeHref } from '../app/routes';
import { useNavigation } from '../app/WebNavigation';
import { TopicLessonCardList } from '../ui/TopicLessonCards';
import { colors, designTokens as tokens } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import type { KanaTopic } from './kanaTopics';
import { alphabetProgress } from './progress';

export function KanaTopicCover({ topic, thumbnail = false }: { topic: KanaTopic; thumbnail?: boolean }) {
  return <View aria-hidden style={{
    width: '100%', ...(thumbnail ? { height: '100%' } : { aspectRatio: 2.7, maxHeight: 168 }),
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.sand,
  }}>
    <Text style={{ ...tokens.typography.title, fontSize: thumbnail ? 28 : 40, lineHeight: thumbnail ? 36 : 48, color: colors.primary }}>
      {thumbnail ? topic.sample[0] : topic.sample}
    </Text>
  </View>;
}

export function KanaTopicLessonCards({ topic, visibleIds, model, headingId, compact, disabled, afterFirst }: {
  topic: KanaTopic; visibleIds: ReadonlySet<string>; model: LearningModel; headingId: string;
  compact: boolean; disabled: boolean; afterFirst?: ReactNode;
}) {
  const { navigate } = useNavigation();
  const ids = new Set(topic.lessons.map(lesson => lesson.id));
  const progress = alphabetProgress(model.events.filter(event => ids.has(event.lessonId)));
  const lessons = topic.lessons.map(lesson => {
    const completed = progress.completedIds.has(lesson.id);
    const resumingWords = !completed && (progress.wordResumeId === lesson.id || progress.taskIds.has(lesson.id));
    const route = { kind: 'letters', language: 'ja-JP', rowId: lesson.id, mode: resumingWords ? 'words' : 'study' } as const;
    return {
      id: lesson.id, title: lesson.title, outcome: lesson.summary, metadata: 'Foundations · Draft',
      completed, started: resumingWords,
      href: routeHref(route), onOpen: () => navigate(route),
    };
  });
  return <TopicLessonCardList lessons={lessons} visibleIds={visibleIds} headingId={headingId}
    progressAvailable={!model.loadError} compact={compact} disabled={disabled} afterFirst={afterFirst} resumeId={progress.wordResumeId} />;
}
