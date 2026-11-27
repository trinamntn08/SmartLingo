import { Text, View } from 'react-native';
import type { JapaneseAlphabetLesson } from '@smartlingo/content';
import type { JapanesePracticeTask } from '@smartlingo/domain';
import { JapanesePractice } from '../japanese/JapanesePractice';
import { Speak } from '../audio/Speak';
import { colors, designTokens, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';

export function KanaExamples({ lesson }: { lesson: JapaneseAlphabetLesson }) {
  return <View style={{ gap: 4 }}>
    {!!lesson.characters.length && <Text accessibilityRole="header" style={s.heading}>Words</Text>}
    {lesson.examples?.map(example => <View key={example.text} style={{ gap: 4, paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.line }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 148, minWidth: 0, gap: 2 }}>
          <Text {...{ lang: 'ja', accessibilityLanguage: 'ja-JP' }} style={[s.target, { fontSize: 28, lineHeight: 38 }]}>{example.text}</Text>
          {example.reading !== example.text && <Text style={[s.muted, designTokens.typography.caption]}>{example.reading}</Text>}
          <Text style={s.body}>{example.meaning}</Text>
        </View>
        <Speak text={example.text} language="ja-JP" />
      </View>
      {!!example.note && <Text style={s.muted}>{example.note}</Text>}
    </View>)}
  </View>;
}

export function KanaWordPractice({ lesson, model, completedIds, headingId }: {
  lesson: JapaneseAlphabetLesson; model: LearningModel; completedIds: readonly string[]; headingId: string;
}) {
  function record(task: JapanesePracticeTask, result: 'correct' | 'incorrect' | 'self-reviewed', assisted: boolean) {
    if (model.blocked) return;
    model.record({ id: crypto.randomUUID(), lessonId: lesson.id, revision: lesson.revision, itemId: task.id,
      activity: 'sentence', result: result === 'self-reviewed' ? 'correct' : result, hints: assisted ? 1 : 0, occurredAt: new Date().toISOString() });
  }
  return <View style={{ gap: 16 }}>
    <Text nativeID={headingId} accessibilityRole="header" aria-level={2} style={s.heading}>Word recall</Text>
    <JapanesePractice tasks={lesson.practice ?? []} completedIds={completedIds} onResult={record} disabled={model.blocked} />
    <Text accessibilityLiveRegion="polite" style={s.muted}>{completedIds.length} of {lesson.practice?.length ?? 0} tasks saved.</Text>
  </View>;
}
