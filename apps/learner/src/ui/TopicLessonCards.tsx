import { useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getFrenchTopicPractice } from '@smartlingo/content';
import { lessonProgress, type LearningEvent, type Lesson, type TargetLanguage } from '@smartlingo/domain';
import { routeHref } from '../app/routes';
import { Button } from './controls';
import { frenchTopicPracticeMinutes } from './FrenchTransferPractice';
import { Icon } from './Icon';
import { colors, designTokens as tokens, styles as s } from './theme';

export function TopicLessonCards({ language, lessons, visibleLessons, headingId, events, progressAvailable, onOpen, compact, disabled, afterFirst }: {
  language: TargetLanguage; lessons: readonly Lesson[]; visibleLessons: readonly Lesson[]; events: LearningEvent[];
  headingId: string; progressAvailable: boolean; onOpen: (lesson: Lesson) => void; compact: boolean; disabled: boolean; afterFirst?: ReactNode;
}) {
  const [gridWidth, setGridWidth] = useState(0);
  const visibleIds = new Set(visibleLessons.map(lesson => lesson.id));
  const leadId = afterFirst ? lessons.find(lesson => visibleIds.has(lesson.id))?.id : undefined;
  const progress = lessons.map(lesson => lessonProgress(lesson, events));
  const completeCount = progress.filter(item => item.completed).length;
  const nextIndex = progressAvailable ? progress.findIndex(item => !item.completed) : -1;
  const gap = tokens.space.md;
  const preferredWidth = 260;
  const columns = compact ? 1 : Math.max(1, Math.min(3, lessons.length, Math.floor((gridWidth + gap) / (preferredWidth + gap))));
  const cardWidth = columns === 1 ? '100%' : (gridWidth - gap * (columns - 1)) / columns;

  const cards = lessons.flatMap((lesson, index) => {
    if (!visibleIds.has(lesson.id)) return [];
    const { completed, viewedIds, pictureDone, sentenceDone } = progress[index];
    const started = viewedIds.size > 0 || pictureDone || sentenceDone;
    const next = index === nextIndex;
    const status = completed ? 'Completed' : next ? 'Up next' : started ? 'In progress' : undefined;
    return <View key={lesson.id} testID={`topic-lesson-${lesson.id}`} role="listitem"
      style={[s.card, layout.lesson, compact && layout.compactLesson, { width: lesson.id === leadId ? '100%' : cardWidth }, next && layout.nextLesson]}>
      <View style={[s.row, { justifyContent: 'space-between', gap: 6 }]}>
        <Text style={layout.position}>Lesson {index + 1}</Text>
        {progressAvailable && status && <View style={[layout.status, completed && layout.completedStatus, next && layout.nextStatus]}>
          {completed && <Icon name="check" size={14} color={colors.primary} />}
          <Text style={layout.statusText}>{status}</Text>
        </View>}
      </View>
      <Text accessibilityRole="header" aria-level={3} style={layout.lessonTitle}>{lesson.subtitle}</Text>
      <Text style={layout.outcome}>{lesson.outcome}</Text>
      <View style={[layout.footer, compact && next && layout.mobileAction]}>
        <Button compact={!next} primary={next} trailingIcon="arrow-right" label={`Open ${lesson.subtitle}`} disabled={disabled}
          href={routeHref({ kind: 'lesson', language, lessonId: lesson.id })} onPress={() => onOpen(lesson)}>
          {completed ? 'Revisit lesson' : started ? 'Continue lesson' : 'Start lesson'}
        </Button>
        <Text style={layout.metadata}>{getFrenchTopicPractice(lesson) ? frenchTopicPracticeMinutes : `${lesson.durationMinutes} min`}
          {' · '}{lesson.level === 'foundation' ? 'Foundations' : lesson.level} · {lesson.status === 'published' ? 'Published' : 'Draft'}</Text>
      </View>
    </View>;
  });

  function list(items: ReactNode[]) {
    return items.length > 0 && <View role="list" aria-labelledby={headingId} style={[s.split, { gap }]}>{items}</View>;
  }

  return <View style={{ gap }}>
    <View style={[s.row, { justifyContent: 'space-between', rowGap: 4 }]}>
      <Text nativeID={headingId} accessibilityRole="header" aria-level={2} style={[s.heading, compact && tokens.typography.compactHeading]}>Lessons in this topic</Text>
      {progressAvailable && completeCount > 0 && <Text style={[s.muted, compact && tokens.typography.caption]}>
        {completeCount} of {lessons.length} complete
      </Text>}
    </View>
    {visibleLessons.length > 0 && visibleLessons.length < lessons.length && <Text accessibilityLiveRegion="polite" style={s.muted}>
      Showing {visibleLessons.length} of {lessons.length} lessons
    </Text>}
    <View testID="topic-lesson-cards" onLayout={event => setGridWidth(event.nativeEvent.layout.width)} style={{ gap }}>
      {afterFirst ? <>{list(cards.slice(0, 1))}{afterFirst}{list(cards.slice(1))}</> : list(cards)}
    </View>
  </View>;
}

const layout = StyleSheet.create({
  lesson: {
    padding: 16, gap: 8, minWidth: 0, maxWidth: '100%', borderBottomWidth: 3,
  },
  compactLesson: { padding: 13, gap: 6 },
  nextLesson: { backgroundColor: colors.goldTint, borderColor: colors.yellow },
  position: { ...tokens.typography.smallLabel, color: colors.primary },
  status: { backgroundColor: colors.sand, borderRadius: tokens.radius.sm, paddingHorizontal: 8, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 4 },
  completedStatus: { backgroundColor: colors.sageTint },
  nextStatus: { backgroundColor: colors.yellow },
  statusText: { ...tokens.typography.caption, fontWeight: '600', color: colors.ink },
  lessonTitle: { ...tokens.typography.sectionHeading, fontSize: 22, lineHeight: 28, color: colors.ink },
  outcome: { ...tokens.typography.muted, fontSize: 16, lineHeight: 23, color: colors.ink },
  footer: { marginTop: 'auto', paddingTop: 4, gap: 10, alignItems: 'flex-start' },
  mobileAction: { alignItems: 'stretch' },
  metadata: { ...tokens.typography.caption, color: colors.muted },
});
