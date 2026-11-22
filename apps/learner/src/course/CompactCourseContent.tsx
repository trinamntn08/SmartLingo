import { useId, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { gradeCourseChoice, type CourseBlock, type CourseChoice, type CourseDay, type CourseEvent, type Vocabulary } from '@smartlingo/domain';
import { Speak } from '../audio/Speak';
import { genderLabels, vocabularyPresentation } from '../content/vocabularyPresentation';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';

type DialogueBlock = Extract<CourseBlock, { kind: 'dialogue' }>;
type ReflectionBlock = Extract<CourseBlock, { kind: 'reflection' }>;
type PracticeCopy = NonNullable<CourseDay['compact']>['practice'][number];

interface CompactCourseContentProps {
  step: 'dialogue' | 'practice' | 'reflection';
  day: CourseDay;
  model: LearningModel;
  events: CourseEvent[];
  blocked: boolean;
  revealBlocked: boolean;
  onChoice: (block: CourseChoice, id: string, supported: boolean) => void;
  onSupport: (blockId: string) => void;
}

export function CompactCourseContent({ step, day, model, events, blocked, revealBlocked, onChoice, onSupport }: CompactCourseContentProps) {
  const copy = day.compact;
  if (!copy) return null;

  if (step === 'dialogue') {
    const dialogue = day.blocks.find(block => block.kind === 'dialogue');
    return dialogue && <CompactDialogue dialogue={dialogue} vocabulary={day.vocabulary} tip={copy.tip} model={model} />;
  }

  if (step === 'practice') {
    const questions = day.blocks.filter(block => block.kind === 'choice');
    return <View style={{ gap: 12 }}>
      {questions.map((block, index) => <CompactChoice key={block.id} block={block} copy={copy.practice[index]}
        events={events} blocked={blocked} revealBlocked={revealBlocked}
        onChoice={(id, supported) => onChoice(block, id, supported)} onSupport={() => onSupport(block.id)} />)}
    </View>;
  }

  const reflection = day.blocks.find(block => block.kind === 'reflection');
  return reflection && <CompactReflection block={reflection} prompt={copy.reflectionPrompt}
    hasSupport={events.some(event => event.blockId === reflection.id && event.kind === 'support')}
    revealBlocked={revealBlocked} onSupport={() => onSupport(reflection.id)} />;
}

function CompactDialogue({ dialogue, vocabulary, tip, model }: { dialogue: DialogueBlock; vocabulary: Vocabulary[]; tip: string; model: LearningModel }) {
  const [wordsOpen, setWordsOpen] = useState(false);
  const wordsId = useId();

  return <View style={{ gap: 12, minWidth: 0 }}>
    <View style={{ gap: 6 }}>
      {dialogue.lines.map((line, index) => <View key={index} testID={`course-dialogue-line-${index}`} style={[s.notice, {
        backgroundColor: index % 2 ? colors.sageTint : colors.paper, padding: 12, gap: 3,
      }]}>
        <Text style={s.eyebrow}>{line.role}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 1 }}>
          <View style={{ flexGrow: 1, flexBasis: 210, minWidth: 0 }}>
            <Text accessibilityLanguage="fr-FR" style={[s.body, { fontWeight: '700' }]}>{line.target}</Text>
            {!!line.reading && <Text style={s.muted}>{line.reading}</Text>}
          </View>
          <Text accessibilityLanguage="en" style={[s.muted, { flexGrow: 1, flexBasis: 210, minWidth: 0 }]}>{line.meaning}</Text>
        </View>
      </View>)}
    </View>
    <Text style={s.muted}>{tip}</Text>
    <View style={{ alignItems: 'flex-start' }}>
      <Button compact expanded={wordsOpen} controls={wordsId} onPress={() => setWordsOpen(value => !value)}>Useful words</Button>
    </View>
    <View nativeID={wordsId} style={{ display: wordsOpen ? 'flex' : 'none', gap: 4 }}>
      {wordsOpen && vocabulary.map(entry => <CompactWord key={entry.id} entry={entry} model={model} />)}
    </View>
    {!!model.loadError && wordsOpen && <Text accessibilityRole="alert" style={s.muted}>{model.loadError}</Text>}
    {!!model.saveError && <View style={s.error}>
      <Text accessibilityRole="alert" style={s.body}>{model.saveError}</Text>
      <View style={s.row}>
        <Button compact disabled={model.busy} onPress={model.retry}>Retry notebook save</Button>
        <Button compact disabled={model.busy} onPress={model.cancelWrite}>Discard notebook save</Button>
      </View>
    </View>}
  </View>;
}

function CompactWord({ entry, model }: { entry: Vocabulary; model: LearningModel }) {
  const saved = model.notebook.some(note => note.sourceEntryId === entry.id || note.id === `notebook.${entry.id}`);
  const { gender } = vocabularyPresentation(entry);

  function saveWord() {
    model.captureEntry({ id: `notebook.${entry.id}`, sourceEntryId: entry.id, language: 'fr-FR',
      reading: entry.reading, exampleReading: entry.exampleReading, target: entry.target, meaning: entry.meaning,
      example: entry.example, updatedAt: new Date().toISOString() });
  }

  return <View testID={`vocabulary-${entry.id}`} style={[s.row, {
    alignItems: 'center', paddingVertical: 4, borderBottomWidth: 1, borderColor: colors.line, gap: 4,
  }]}>
    <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 156, minWidth: 0 }}>
      <Text style={[s.body, { fontWeight: '600' }]} accessibilityLanguage="fr-FR">{entry.target}</Text>
      <Text style={s.muted}>{entry.meaning}
        {gender && <Text accessibilityLabel={genderLabels[gender].accessible}> · {genderLabels[gender].short}</Text>}
      </Text>
    </View>
    <Speak text={entry.target} />
    <Button compact quiet label={saved ? `${entry.target} saved to notebook` : `Save ${entry.target}`}
      disabled={model.blocked || saved} onPress={saveWord}>{saved ? 'Saved' : 'Save word'}</Button>
  </View>;
}

function CompactChoice({ block, copy, events, blocked, revealBlocked, onChoice, onSupport }: {
  block: CourseChoice; copy: PracticeCopy; events: CourseEvent[]; blocked: boolean; revealBlocked: boolean;
  onChoice: (id: string, supported: boolean) => void; onSupport: () => void;
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const supported = events.some(event => event.blockId === block.id && (event.kind === 'support' || (event.kind === 'choice' && event.supported)));
  const latest = events.filter((event): event is Extract<CourseEvent, { kind: 'choice' }> =>
    event.blockId === block.id && event.kind === 'choice').at(-1);
  const valid = latest && block.choices.some(choice => choice.id === latest.choiceId) && gradeCourseChoice(block, latest.choiceId) === latest.result;
  const showHint = hintOpen || supported;

  return <View testID={`course-choice-${block.id}`} style={[s.notice, { backgroundColor: colors.paper, padding: 12, gap: 8 }]}>
    <Text style={[s.body, { fontWeight: '600' }]}>{copy.prompt}</Text>
    <View style={[s.row, { gap: 6 }]}>
      {block.choices.map(choice => <Button compact key={choice.id} selected={valid && latest.choiceId === choice.id} disabled={blocked}
        onPress={() => onChoice(choice.id, showHint)}>{choice.target}</Button>)}
    </View>
    {showHint ? <View>
      <Text style={s.muted}>{copy.hint}</Text>
      {block.choices.map(choice => <Text key={choice.id} style={s.muted}>{choice.target} — {choice.meaning}</Text>)}
    </View> : <View style={{ alignItems: 'flex-start' }}>
      <Button compact quiet disabled={revealBlocked} onPress={() => { setHintOpen(true); onSupport(); }}>Show hint</Button>
    </View>}
    {latest && <Text accessibilityLiveRegion="polite" style={[s.muted, valid && latest.result === 'correct' && { color: colors.primary }]}>
      {valid ? latest.result === 'correct' ? `Correct. ${copy.feedback}` : 'Try again.' : 'Please answer again to update your saved choice.'}
    </Text>}
  </View>;
}

function CompactReflection({ block, prompt, hasSupport, revealBlocked, onSupport }: {
  block: ReflectionBlock; prompt: string; hasSupport: boolean; revealBlocked: boolean; onSupport: () => void;
}) {
  const [draft, setDraft] = useState('');
  const [modelOpen, setModelOpen] = useState(false);
  const modelId = useId();
  const showModel = hasSupport || modelOpen;

  return <View style={{ gap: 10 }}>
    <Text style={s.body}>{prompt}</Text>
    <TextInput accessibilityLabel="Optional practice response" placeholder="Write a reply (optional)" multiline value={draft}
      onChangeText={setDraft} style={[s.input, { minHeight: 75, textAlignVertical: 'top' }]} />
    {!showModel && <View style={{ alignItems: 'flex-start' }}>
      <Button compact expanded={showModel} controls={modelId} disabled={revealBlocked}
        onPress={() => { setModelOpen(true); onSupport(); }}>Show example</Button>
    </View>}
    <View nativeID={modelId} style={[s.notice, { display: showModel ? 'flex' : 'none', padding: 12, gap: 3 }]}>
      {showModel && <>
        <Text accessibilityLanguage="fr-FR" style={[s.body, { fontWeight: '600' }]}>{block.modelTarget}</Text>
        <Text style={s.muted}>{block.modelMeaning}</Text>
      </>}
    </View>
  </View>;
}
