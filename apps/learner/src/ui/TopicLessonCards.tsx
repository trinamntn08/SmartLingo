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
  const cards = lessons.map(lesson => {
    const { completed, viewedIds, pictureDone, sentenceDone } = lessonProgress(lesson, events);
    const duration = getFrenchTopicPractice(lesson) ? frenchTopicPracticeMinutes : `${lesson.durationMinutes} min`;
    return {
      id: lesson.id, title: lesson.subtitle, outcome: lesson.outcome,
      metadata: `${duration} · ${lesson.level === 'foundation' ? 'Foundations' : lesson.level} · ${lesson.status === 'published' ? 'Published' : 'Draft'}`,
      completed, started: viewedIds.size > 0 || pictureDone || sentenceDone,
      href: routeHref({ kind: 'lesson', language, lessonId: lesson.id }), onOpen: () => onOpen(lesson),
    };
  });
  return <TopicLessonCardList lessons={cards} visibleIds={new Set(visibleLessons.map(lesson => lesson.id))}
    headingId={headingId} progressAvailable={progressAvailable} compact={compact} disabled={disabled} afterFirst={afterFirst} />;
}

interface TopicLessonCard {
  id: string; title: string; outcome: string; metadata: string; completed: boolean; started: boolean;
  href: string; onOpen: () => void;
}

export function TopicLessonCardList({ lessons, visibleIds, headingId, progressAvailable, compact, disabled, afterFirst, resumeId }: {
  lessons: readonly TopicLessonCard[]; visibleIds: ReadonlySet<string>; headingId: string;
  progressAvailable: boolean; compact: boolean; disabled: boolean; afterFirst?: ReactNode; resumeId?: string;
}) {
  const [gridWidth, setGridWidth] = useState(0);
  const leadId = afterFirst ? lessons.find(lesson => visibleIds.has(lesson.id))?.id : undefined;
  const completeCount = lessons.filter(item => item.completed).length;
  const nextId = progressAvailable ? resumeId ?? lessons.find(item => !item.completed)?.id : undefined;
  const gap = tokens.space.md;
  const preferredWidth = 260;
  const columns = compact ? 1 : Math.max(1, Math.min(3, lessons.length, Math.floor((gridWidth + gap) / (preferredWidth + gap))));
  const cardWidth = columns === 1 ? '100%' : (gridWidth - gap * (columns - 1)) / columns;

  const cards = lessons.flatMap((lesson, index) => {
    if (!visibleIds.has(lesson.id)) return [];
    const { completed, started } = lesson;
    const next = lesson.id === nextId;
    const status = completed ? 'Completed' : next ? 'Up next' : started ? 'In progress' : undefined;
    return <View key={lesson.id} testID={`topic-lesson-${lesson.id}`} role="listitem"
      style={[s.card, layout.lesson, compact && layout.compactLesson, { width: lesson.id === leadId ? '100%' : cardWidth }, next && layout.nextLesson]}>
      <View style={layout.cardHeader}>
        <Text style={layout.position}>Lesson {index + 1}</Text>
        {progressAvailable && status && <View style={layout.status}>
          {completed && <Icon name="check" size={16} color={colors.primary} />}
          <Text style={[layout.statusText, completed && layout.completedStatus]}>{status}</Text>
        </View>}
      </View>
      <Text accessibilityRole="header" aria-level={3} style={layout.lessonTitle}>{lesson.title}</Text>
      <Text style={layout.outcome}>{lesson.outcome}</Text>
      <View style={[layout.footer, compact && next && layout.mobileAction]}>
        <Button compact={!next} accent={next} trailingIcon="arrow-right" label={`Open ${lesson.title}`} disabled={disabled}
          href={lesson.href} onPress={lesson.onOpen}>
          {completed ? 'Revisit lesson' : started ? 'Continue lesson' : 'Start lesson'}
        </Button>
        <Text style={layout.metadata}>{lesson.metadata}</Text>
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
    {visibleIds.size > 0 && visibleIds.size < lessons.length && <Text accessibilityLiveRegion="polite" style={s.muted}>
      Showing {visibleIds.size} of {lessons.length} lessons
    </Text>}
    <View testID="topic-lesson-cards" onLayout={event => setGridWidth(event.nativeEvent.layout.width)} style={{ gap }}>
      {afterFirst ? <>{list(cards.slice(0, 1))}{afterFirst}{list(cards.slice(1))}</> : list(cards)}
    </View>
  </View>;
}

const layout = StyleSheet.create({
  lesson: { padding: 16, gap: 8, minWidth: 0, maxWidth: '100%', borderLeftWidth: 4 },
  compactLesson: { padding: 12 },
  nextLesson: { borderLeftColor: colors.yellow },
  cardHeader: { ...s.row, gap: 8, justifyContent: 'space-between' },
  position: { ...tokens.typography.caption, color: colors.muted, fontVariant: ['tabular-nums'] },
  status: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  completedStatus: { color: colors.primary },
  statusText: { ...tokens.typography.caption, fontWeight: '500', color: colors.ink },
  lessonTitle: { ...tokens.typography.sectionHeading, fontSize: 20, lineHeight: 28, color: colors.ink },
  outcome: { ...tokens.typography.muted, fontSize: 16, lineHeight: 24, color: colors.ink },
  footer: { marginTop: 'auto', paddingTop: 4, gap: 8, alignItems: 'flex-start' },
  mobileAction: { alignItems: 'stretch' },
  metadata: { ...tokens.typography.caption, color: colors.muted },
});
