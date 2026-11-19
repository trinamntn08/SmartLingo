import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { gradeCourseChoice, type CourseBlock, type CourseDay, type CourseEvent } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { VocabularyCard } from '../ui/VocabularyCard';
import { styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { JapaneseVocabularyCard } from './JapaneseVocabularyCard';

export function CourseBlockView({ block, day, language = 'fr-FR', model, events, blocked, revealBlocked, onChoice, onSupport }: {
  block: CourseBlock; day: CourseDay; model: LearningModel; events: CourseEvent[]; blocked: boolean; revealBlocked: boolean;
  language?: 'fr-FR' | 'ja-JP';
  onChoice: (id: string, supported: boolean) => void; onSupport: () => void;
}) {
  const supported = events.some(event => event.blockId === block.id && (event.kind === 'support' || (event.kind === 'choice' && event.supported)));
  const [revealed, setRevealed] = useState(supported);
  const [draft, setDraft] = useState('');
  const attempts = events.filter((event): event is Extract<CourseEvent, { kind: 'choice' }> => event.blockId === block.id && event.kind === 'choice');
  const latest = attempts.at(-1);
  function reveal() { setRevealed(true); onSupport(); }

  if (block.kind === 'study') return <View style={{ gap: 16 }}>
    <Text style={s.body}>{block.explanation}</Text>
    {block.examples.map((example, index) => <View key={index} style={s.notice}>
      <Text style={s.body}>{example.target}</Text>
      {!!example.reading && <Text style={s.muted}>Reading: {example.reading}</Text>}
      <Text style={s.muted}>{example.meaning}</Text>
    </View>)}
  </View>;
  if (block.kind === 'vocabulary') return <View style={{ gap: 16 }}>
    <Text style={s.body}>{language === 'ja-JP' ? 'Read the words, kana readings and examples. Save any useful words to your notebook.' : 'Read the words and examples. Save any useful words to your notebook; listening is optional.'}</Text>
    {day.vocabulary.map(entry => language === 'ja-JP' ? <JapaneseVocabularyCard key={entry.id} entry={entry} model={model} /> : <VocabularyCard key={entry.id} entry={entry} model={model} />)}
    {!!model.loadError && <Text accessibilityRole="alert" style={s.muted}>{model.loadError}</Text>}
    {!!model.saveError && <View style={s.error}>
      <Text accessibilityRole="alert" style={s.body}>{model.saveError}</Text>
      <Button disabled={model.busy} onPress={model.retry}>Retry notebook save</Button>
      <Button disabled={model.busy} onPress={model.cancelWrite}>Discard notebook save</Button>
    </View>}
  </View>;
  if (block.kind === 'dialogue') return <View style={{ gap: 16 }}>
    <Text style={s.body}>{block.explanation}</Text>
    {block.lines.map((line, index) => <View key={index} style={s.notice}>
      <Text style={s.eyebrow}>{line.role}</Text><Text style={s.body}>{line.target}</Text>
      {!!line.reading && <Text style={s.muted}>Reading: {line.reading}</Text>}
      <Text style={s.muted}>{line.meaning}</Text>
    </View>)}
  </View>;
  if (block.kind === 'choice') {
    const validAnswer = latest && block.choices.some(choice => choice.id === latest.choiceId)
      && gradeCourseChoice(block, latest.choiceId) === latest.result;
    return <View style={{ gap: 16 }}>
    <Text style={s.body}>{block.prompt}</Text>
    {block.choices.map(choice => <Button key={choice.id} disabled={blocked} selected={latest?.choiceId === choice.id}
      onPress={() => onChoice(choice.id, revealed || supported)}>{choice.target}</Button>)}
    {!revealed && <Button disabled={revealBlocked} onPress={reveal}>Show practice hint</Button>}
    {revealed && <View style={s.notice}><Text style={s.body}>{block.hint}</Text>
      {block.choices.map(choice => <View key={choice.id} style={{ gap: 4 }}>
        <Text style={s.muted}>{choice.target} — {choice.meaning}</Text>
        {!!choice.reading && <Text style={s.muted}>Reading: {choice.reading}</Text>}
      </View>)}
      <Text style={s.muted}>Practising with support.</Text>
    </View>}
    {latest && <View accessibilityLiveRegion="polite" style={s.notice}>
      <Text style={s.body}>{!validAnswer ? 'This saved answer does not match the current activity. Please answer again.'
        : latest.result === 'correct' ? 'Correct — answer saved.' : 'Not quite — answer saved. Try another option.'}</Text>
      {validAnswer && <><Text style={s.body}>{block.feedback}</Text>
        <Text style={s.muted}>{latest.supported ? 'Saved as practice with support.' : 'Saved without a hint.'}</Text></>}
    </View>}
  </View>;
  }
  return <View style={{ gap: 16 }}>
    <Text style={s.body}>{block.prompt}</Text>
    <Text style={s.muted}>Try the exchange aloud or quietly to yourself. Nothing is recorded or automatically graded.</Text>
    <TextInput accessibilityLabel="Your optional practice exchange" placeholder="Or write your exchange here" multiline value={draft}
      onChangeText={setDraft} style={[s.input, { minHeight: 120, textAlignVertical: 'top' }]} />
    <Text style={s.muted}>Optional writing stays on this screen and is cleared when you leave this section. Only your self-review activity is saved.</Text>
    {!revealed && <Button disabled={revealBlocked} onPress={reveal}>Read model exchange</Button>}
    {revealed && <View style={s.notice}><Text style={s.body}>{block.modelTarget}</Text><Text style={s.muted}>{block.modelMeaning}</Text></View>}
    {block.checklist.map(item => <Text key={item} style={s.body}>• {item}</Text>)}
    <Text style={s.muted}>Manual self-review records that you reviewed this activity. It does not judge your language ability.</Text>
  </View>;
}
