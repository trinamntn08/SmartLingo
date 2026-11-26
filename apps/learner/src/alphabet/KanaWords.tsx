import { Text, View } from 'react-native';
import type { JapaneseAlphabetLesson } from '@smartlingo/content';
import type { JapanesePracticeTask } from '@smartlingo/domain';
import { JapanesePractice } from '../japanese/JapanesePractice';
import { Speak } from '../audio/Speak';
import { styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';

export function KanaExamples({ lesson }: { lesson: JapaneseAlphabetLesson }) {
  return <View style={{ gap: 18 }}>
    <Text accessibilityRole="header" style={s.heading}>Read useful words</Text>
    {lesson.examples?.map(example => <View key={example.text} style={s.notice}>
      <View style={s.row}><Text style={s.target}>{example.text}</Text><Speak courseClip text={example.text} language="ja-JP" /></View>
      <Text style={s.body}>{example.reading} · {example.meaning}</Text>
      {!!example.note && <Text style={s.muted}>{example.note}</Text>}
    </View>)}
    <Text style={s.muted}>Typing: switch to a Japanese keyboard or IME and commit the kana before checking. Handwriting is optional: copy a form on paper, cover it, write it from memory and compare. Typed answers do not assess handwriting or stroke order.</Text>
  </View>;
}

export function KanaWordPractice({ lesson, model, completedIds }: { lesson: JapaneseAlphabetLesson; model: LearningModel; completedIds: readonly string[] }) {
  function record(task: JapanesePracticeTask, result: 'correct' | 'incorrect' | 'self-reviewed', assisted: boolean) {
    if (model.blocked) return;
    model.record({ id: crypto.randomUUID(), lessonId: lesson.id, revision: lesson.revision, itemId: task.id,
      activity: 'sentence', result: result === 'self-reviewed' ? 'correct' : result, hints: assisted ? 1 : 0, occurredAt: new Date().toISOString() });
  }
  return <View style={{ gap: 16 }}>
    <Text style={s.muted}>Read without the Latin-letter guide, then recall the kana with your keyboard. Correct checks and explicit self-reviews save separately, so you can resume this group. Revealed support is recorded as assisted practice.</Text>
    <JapanesePractice tasks={lesson.practice ?? []} completedIds={completedIds} onResult={record} disabled={model.blocked} />
    <Text accessibilityLiveRegion="polite" style={s.muted}>{completedIds.length} of {lesson.practice?.length ?? 0} word and timing tasks saved.</Text>
  </View>;
}
