import { useId, useState, type ReactNode } from 'react';
import { Text, TextInput, useWindowDimensions, View } from 'react-native';
import { gradeCourseChoice, type CourseBlock, type CourseChoice, type CourseDay, type CourseEvent, type Vocabulary } from '@smartlingo/domain';
import { Speak } from '../audio/Speak';
import { genderLabels, vocabularyPresentation } from '../content/vocabularyPresentation';
import { BilingualDialogue } from '../ui/BilingualDialogue';
import { Button } from '../ui/controls';
import { getDailyDialoguePhoto } from '../ui/dialoguePhotos';
import type { ContextPhoto } from '../ui/contextPhotos';
import { colors, designTokens, styles as s } from '../ui/theme';
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
  listeningCheck?: ReactNode;
}

export function CompactCourseContent({ step, day, model, events, blocked, revealBlocked, onChoice, onSupport, listeningCheck }: CompactCourseContentProps) {
  const copy = day.compact;
  if (!copy) return null;

  if (step === 'dialogue') {
    const dialogue = day.blocks.find(block => block.kind === 'dialogue');
    return dialogue && <CompactDialogue dialogue={dialogue} vocabulary={day.vocabulary} tip={copy.tip}
      photo={getDailyDialoguePhoto(day.id)} model={model} listeningCheck={listeningCheck} />;
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

function CompactDialogue({ dialogue, vocabulary, tip, photo, model, listeningCheck }: {
  dialogue: DialogueBlock; vocabulary: Vocabulary[]; tip: string; photo?: ContextPhoto; model: LearningModel; listeningCheck?: ReactNode;
}) {
  const [wordsOpen, setWordsOpen] = useState(false);
  const wordsId = useId();

  return <View style={{ gap: 12, minWidth: 0 }}>
    <BilingualDialogue turns={dialogue.lines} photo={photo} />
    {listeningCheck}
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
  const narrow = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const [hintOpen, setHintOpen] = useState(false);
  const supported = events.some(event => event.blockId === block.id && (event.kind === 'support' || (event.kind === 'choice' && event.supported)));
  const latest = events.filter((event): event is Extract<CourseEvent, { kind: 'choice' }> =>
    event.blockId === block.id && event.kind === 'choice').at(-1);
  const valid = latest && block.choices.some(choice => choice.id === latest.choiceId) && gradeCourseChoice(block, latest.choiceId) === latest.result;
  const showHint = hintOpen || supported;
  const options = block.choices.map((choice, index) => ({ ...choice, letter: String.fromCharCode(65 + index) }));

  return <View testID={`course-choice-${block.id}`} style={[s.notice, { backgroundColor: colors.paper, padding: narrow ? 14 : 18, gap: 10 }]}>
    <Text accessibilityRole="header" style={[s.body, { fontWeight: '700' }]}>{copy.prompt}</Text>
    <View style={[s.row, { gap: 8, alignItems: 'stretch' }]}>
      {options.map(({ id, target, letter }) => <View key={id} style={{ flexBasis: narrow ? '100%' : 0, flexGrow: 1, minWidth: 0 }}>
        <Button compact marker={letter} label={`${letter}. ${target}`} selected={valid && latest.choiceId === id} disabled={blocked}
          onPress={() => onChoice(id, showHint)}>{target.replace(/ (?=[!?])/g, '\u202F')}</Button>
      </View>)}
    </View>
    <View style={[s.row, { gap: 8 }]}>
      {!showHint && <Button compact quiet disabled={revealBlocked} onPress={() => { setHintOpen(true); onSupport(); }}>Hint</Button>}
      <Text accessibilityLiveRegion="polite" style={[s.muted, { flexShrink: 1 }, valid && latest.result === 'correct' && { color: colors.primary }]}>
        {latest && (valid ? latest.result === 'correct' ? `Correct. ${copy.feedback}` : 'Try again.' : 'Please answer again to update your saved choice.')}
      </Text>
    </View>
    {showHint && <View style={{ gap: 3 }}>
      <Text style={[s.muted, { fontWeight: '600' }]}>{copy.hint}</Text>
      {options.map(({ id, meaning, letter }) => <Text key={id} style={s.muted}>{letter}. {meaning}</Text>)}
    </View>}
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
