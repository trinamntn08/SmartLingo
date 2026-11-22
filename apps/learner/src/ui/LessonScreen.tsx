import { useId, useLayoutEffect, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { checkAnswer, lessonProgress, type LearningEvent, type Lesson, type TargetLanguage } from '@smartlingo/domain';
import { Button } from './controls';
import { Speak } from '../audio/Speak';
import { Illustration } from './Illustration';
import { VocabularyCard } from './VocabularyCard';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { getContextPhoto } from './contextPhotos';
import { ContextImage } from './ContextImage';
import { BilingualDialogue } from './BilingualDialogue';
import { getLessonDialoguePhoto } from './dialoguePhotos';

type Stage = 'vocabulary' | 'dialogue' | 'picture' | 'sentence' | 'finish';
const stageOrder: Stage[] = ['vocabulary', 'dialogue', 'picture', 'sentence', 'finish'];

function resumeStage(lesson: Lesson, model: LearningModel): Stage {
  const progress = lessonProgress(lesson, model.events);
  if (progress.completed) return 'finish';
  if (lesson.vocabulary.some(entry => !progress.viewedIds.has(entry.id))) return 'vocabulary';
  if (!progress.pictureDone) return 'dialogue';
  return progress.sentenceDone ? 'finish' : 'sentence';
}

export function LessonScreen({ lesson, model, onExit }: { lesson: Lesson; model: LearningModel; onExit: () => void }) {
  const progress = lessonProgress(lesson, model.events);
  const [stage, setStage] = useState<Stage>(() => resumeStage(lesson, model));
  const [canvasWidth, setCanvasWidth] = useState(0);
  const headingId = useId();
  const outlineId = useId();
  const previousStage = useRef(stage);
  const compact = canvasWidth > 0 && canvasWidth < 600;
  const step = stageOrder.indexOf(stage) + 1;
  const french = lesson.language !== 'ja-JP';
  const dialoguePhoto = french && stage === 'dialogue' ? getLessonDialoguePhoto(lesson.id) : undefined;
  const stepTitle = stage === 'vocabulary' ? `Study ${lesson.vocabulary.length} words together`
    : stage === 'dialogue' ? 'Read a conversation' : stage === 'picture' ? lesson.pictureActivity.mode === 'meaning' ? 'Match the meaning' : 'Match a picture'
      : stage === 'sentence' ? 'Build a sentence' : 'Save your session';
  const readyToFinish = lesson.vocabulary.every(entry => progress.viewedIds.has(entry.id)) && progress.pictureDone && progress.sentenceDone;
  const count = lesson.vocabulary.filter(entry => progress.viewedIds.has(entry.id)).length + Number(progress.pictureDone) + Number(progress.sentenceDone);
  const exitBlocked = model.busy || !!model.saveError;

  useLayoutEffect(() => {
    if (previousStage.current === stage) return;
    previousStage.current = stage;
    if (Platform.OS !== 'web') return;
    const heading = document.getElementById(headingId);
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start' });
  }, [headingId, stage]);

  function record(activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints = 0, after?: () => void) {
    model.record({ id: crypto.randomUUID(), lessonId: lesson.id, revision: lesson.revision, itemId, activity, result, hints, occurredAt: new Date().toISOString() }, after);
  }
  function reviewVocabulary() {
    if (lesson.vocabulary.every(entry => progress.viewedIds.has(entry.id))) setStage('dialogue');
    else record('vocabulary', lesson.id, 'viewed', 0, () => setStage('dialogue'));
  }
  return <View onLayout={event => setCanvasWidth(event.nativeEvent.layout.width)} style={{ gap: 16, minWidth: 0 }}>
    <View style={[s.row, { gap: 8 }]}><Button compact quiet disabled={exitBlocked} onPress={onExit}>← All lessons</Button><Text style={s.muted}>{lesson.level} · {lesson.topic} · {lesson.status === 'draft' ? 'Draft' : 'Published'}</Text></View>
    <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', minWidth: 0 }}>
      <View style={{ gap: 6, flex: 1, minWidth: 0 }}><Text accessibilityRole="header" style={[s.title, compact && s.compactTitle]}>{lesson.subtitle}</Text><Text style={s.body}>{lesson.outcome}</Text><Text style={s.muted}>{lesson.vocabulary.length} words · {lesson.durationMinutes} min · Read, listen, then practise</Text></View>
      {!compact && canvasWidth > 0 && !dialoguePhoto && <ContextImage photo={getContextPhoto(french ? 'fr-FR' : 'ja-JP', lesson.topic)} style={{ width: 190, height: 112, borderRadius: 14 }} />}
    </View>
    <LessonOutline id={outlineId} lesson={lesson} stage={stage} progress={progress} compact={compact} />
    <View testID="lesson-stage" style={[s.card, { minWidth: 0, padding: compact ? 14 : 24, gap: 18, boxShadow: 'none', borderRadius: 18 }]}>
      <View style={{ gap: 7 }} accessibilityLabel={`${count} of ${lesson.vocabulary.length + 2} activities saved`}>
        <View style={[s.row, { justifyContent: 'space-between', gap: 8 }]}><Text accessibilityLiveRegion="polite" style={s.eyebrow}>Step {step} of 5 · {stage === 'vocabulary' ? 'Study' : stage === 'dialogue' ? 'Conversation' : stage === 'picture' ? 'Match' : stage === 'sentence' ? 'Build' : 'Save'}</Text><Text style={s.muted}>{count}/{lesson.vocabulary.length + 2} activities saved</Text></View>
        <View style={[s.progressTrack, { height: 4 }]}><View style={[s.progressFill, { width: `${step / 5 * 100}%`, height: 4 }]} /></View>
      </View>
      <View style={[s.row, { justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }]}>
        <Text nativeID={headingId} accessibilityRole="header" style={[s.heading, { flexShrink: 1 }]}>{stepTitle}</Text>
        {stage === 'vocabulary' && <Button compact primary disabled={model.blocked} onPress={reviewVocabulary}>Continue to dialogue →</Button>}
      </View>
    {stage === 'vocabulary' && <View style={{ gap: 20 }}>
      <View style={[s.split, { gap: 16 }]}>{lesson.vocabulary.map(entry => <View key={entry.id} style={{ flexGrow: 1, flexShrink: 1, flexBasis: compact ? '100%' : 340, minWidth: 0 }}>
        <VocabularyCard entry={entry} model={model} language={lesson.language === 'ja-JP' ? 'ja-JP' : 'fr-FR'} />
      </View>)}</View>
      <Text style={s.muted}>Continue when you have reviewed these words.</Text>
      <View style={s.row}><Button primary disabled={model.blocked} label="Continue after studying" onPress={reviewVocabulary}>Continue to conversation →</Button></View>
    </View>}
    {stage === 'dialogue' && <View style={{ gap: 20, minWidth: 0 }}><Text accessibilityRole="header" style={s.heading}>A small conversation</Text>
      {french ? <BilingualDialogue turns={lesson.dialogue} photo={dialoguePhoto} highlightedRole={lesson.role} /> : <>
        <Text style={s.muted}>Read both roles. Try saying your lines aloud.</Text>
        {lesson.dialogue.map((line, index) => <DialogueLine key={index} line={line} highlighted={line.role === lesson.role} language="ja-JP" />)}
      </>}
      <View style={s.notice}><Text style={s.eyebrow}>Grammar</Text><Text style={s.heading}>{lesson.grammar.title}</Text><Text style={s.body}>{lesson.grammar.explanation}</Text></View>
      <Button primary onPress={() => setStage('picture')}>{lesson.pictureActivity.mode === 'meaning' ? 'Try meaning practice →' : 'Try picture practice →'}</Button>
    </View>}
    {stage === 'picture' && <PictureActivity lesson={lesson} disabled={model.blocked} done={progress.pictureDone} record={record} onNext={() => setStage('sentence')} />}
    {stage === 'sentence' && <SentenceActivity lesson={lesson} disabled={model.blocked} done={progress.sentenceDone} record={record} onNext={() => setStage('finish')} />}
    {stage === 'finish' && <View style={{ gap: 20, minWidth: 0 }}>
      <Text style={s.eyebrow}>{progress.completed ? 'Session saved' : 'One final step'}</Text><Text accessibilityRole="header" style={s.heading}>{progress.completed ? 'Your practice is saved.' : 'You’ve put the pieces together.'}</Text>
      <Text style={s.muted}>This records your practice. Revisit the lesson whenever you need.</Text>
      {!progress.completed && <Button primary disabled={model.blocked || !readyToFinish} onPress={() => record('completion', lesson.id, 'completed')}>Finish and save session</Button>}
      {!readyToFinish && <Text style={s.muted}>Study every word and solve both activities before finishing.</Text>}
      <View style={s.row}><Button onPress={() => setStage('vocabulary')}>Revisit the words</Button><Button primary={progress.completed} disabled={exitBlocked} onPress={onExit}>Back to lessons →</Button></View>
    </View>}
    </View>
  </View>;
}

function LessonOutline({ id, lesson, stage, progress, compact }: { id: string; lesson: Lesson; stage: Stage; progress: ReturnType<typeof lessonProgress>; compact: boolean }) {
  const labels = ['Study words', 'Conversation', lesson.pictureActivity.mode === 'meaning' ? 'Match meanings' : 'Match a picture', 'Build a sentence', 'Save session'];
  const shortLabels = ['Words', 'Talk', 'Match', 'Build', 'Save'];
  const saved = [lesson.vocabulary.every(entry => progress.viewedIds.has(entry.id)), false, progress.pictureDone, progress.sentenceDone, progress.completed];
  return <View nativeID={id} accessibilityLabel="Lesson steps in order" style={{ flexDirection: 'row', gap: compact ? 4 : 8 }}>
    {stageOrder.map((item, index) => {
      const current = stage === item;
      const status = current ? 'Current step' : saved[index] ? 'Saved' : item === 'dialogue' ? 'Read together' : 'To do';
      return <View key={item} accessibilityLabel={`${index + 1}. ${labels[index]}. ${status}`} style={{ flex: 1, minWidth: 0, flexDirection: compact ? 'column' : 'row', alignItems: compact ? 'center' : 'flex-start', padding: compact ? 6 : 10, gap: compact ? 4 : 8, borderRadius: 12,
        borderWidth: 1, borderColor: current ? colors.ink : colors.line, backgroundColor: current ? colors.goldTint : colors.card }}>
        <View style={{ width: compact ? 24 : 28, height: compact ? 24 : 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: current ? colors.yellow : saved[index] ? colors.sageTint : colors.sand }}>
          <Text style={[s.body, { fontWeight: '700', fontSize: 14, lineHeight: 20 }]}>{saved[index] ? '✓' : index + 1}</Text>
        </View>
        <View style={{ flex: compact ? undefined : 1, minWidth: 0 }}>
          <Text style={[s.body, { fontWeight: current ? '700' : '500', fontSize: compact ? 12 : 15, lineHeight: compact ? 18 : 21, textAlign: compact ? 'center' : 'left' }]}>{compact ? shortLabels[index] : labels[index]}</Text>
          {!compact && <Text style={[s.muted, { fontSize: 12, lineHeight: 18 }]}>{status}</Text>}
        </View>
      </View>;
    })}
  </View>;
}

type ActivityProps = { lesson: Lesson; disabled: boolean; done: boolean; record: (activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints?: number, after?: () => void) => void; onNext: () => void };

function DialogueLine({ line, highlighted, language }: { language: TargetLanguage; line: Lesson['dialogue'][number]; highlighted: boolean }) {
  const [voiceError, setVoiceError] = useState('');
  return <View style={[s.notice, { backgroundColor: highlighted ? colors.goldTint : colors.skyTint, padding: 18, gap: 8, borderRadius: 14 }, highlighted && { borderLeftWidth: 4, borderColor: colors.yellow }]}>
    <Text style={s.eyebrow}>{line.role}</Text><View style={s.row}>
      <Text style={[s.target, { flex: 1, minWidth: 0, fontSize: 30, lineHeight: 42 }]}>{line.target}</Text><Speak language={language} text={line.target} onError={setVoiceError} />
    </View>{!!line.reading && <Text style={s.muted}>{line.reading}</Text>}<Text style={s.body}>{line.meaning}</Text>
    {!!voiceError && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{voiceError}</Text>}
  </View>;
}

function PictureActivity({ lesson, disabled, done, record, onNext }: ActivityProps) {
  const [feedback, setFeedback] = useState('');
  const [hint, setHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const target = lesson.vocabulary.find(entry => entry.id === lesson.pictureActivity.entryId)!;
  const meaningMode = lesson.pictureActivity.mode === 'meaning';
  function choose(id: string) {
    const correct = id === target.id;
    record('picture', target.id, correct ? 'correct' : 'incorrect', Number(hintUsed), () => setFeedback(correct
      ? meaningMode ? 'That’s it. You matched the meaning.' : 'That’s it. You matched the picture.'
      : meaningMode ? 'Try again. Match the meaning with the phrase.' : 'Take another look. Compare the object in the picture with the words. You can try again.'));
  }
  return <View style={{ gap: 20, minWidth: 0 }}><Text style={s.eyebrow}>{meaningMode ? 'Meaning practice' : 'Picture practice'}</Text><Text accessibilityRole="header" style={s.heading}>{lesson.pictureActivity.prompt}</Text>
    {meaningMode ? <View style={s.notice}><Text accessibilityRole="header" style={s.heading}>{target.meaning}</Text></View>
      : <View style={[s.notice, { backgroundColor: colors.skyTint }]}><Illustration picture={target.picture} alt={target.pictureAlt} size={250} /></View>}
    <View style={{ gap: 10 }}>{lesson.pictureActivity.choices.map(id => <Button key={id} disabled={disabled || done} onPress={() => choose(id)}>{lesson.vocabulary.find(entry => entry.id === id)!.target}</Button>)}</View>
    <Text accessibilityLiveRegion="polite" style={[s.body, { color: done ? '#2C653B' : colors.ink }]}>{feedback || (done ? `✓ ${meaningMode ? 'Meaning' : 'Picture'} matched. Your result is saved.` : 'Choose a phrase. There’s no timer.')}</Text>
    <View style={s.row}><Button compact quiet onPress={() => { setHint(!hint); setHintUsed(true); }}>{hint ? 'Hide hint' : 'Show a hint'}</Button></View>{hint && <Text style={s.body}>{meaningMode ? target.example : target.meaning}</Text>}
    {done && <Button primary onPress={onNext}>Build a sentence →</Button>}
  </View>;
}

function SentenceActivity({ lesson, disabled, done, record, onNext }: ActivityProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [hint, setHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [feedback, setFeedback] = useState('');
  const exercise = lesson.sentenceActivity;
  const answer = selected.map(index => exercise.tokens[index]).join(' ');
  function check() {
    const result = checkAnswer(answer, exercise);
    record('sentence', exercise.id, result, Number(hintUsed), () => setFeedback(result === 'correct' ? 'That works. Your sentence is saved.' : result === 'almost' ? 'Very close. Check the accents, then try again.' : 'Try a different order. Tap a chosen piece to return it, or use the hint.'));
  }
  return <View style={{ gap: 20, minWidth: 0 }}><Text style={s.eyebrow}>Sentence building</Text><Text accessibilityRole="header" style={s.heading}>{exercise.prompt}</Text>
    <View style={[s.notice, { minHeight: 110 }]}><Text style={s.eyebrow}>Your sentence</Text><View style={s.row}>
      {selected.length ? selected.map((index, position) => <Button key={index} disabled={disabled || done} label={`Remove ${exercise.tokens[index]}`} onPress={() => setSelected(selected.filter((_, at) => at !== position))}>{exercise.tokens[index]} ×</Button>) : <Text style={s.muted}>Tap the pieces below to put them in order.</Text>}
    </View></View>
    <View style={s.row}>{exercise.tokens.map((token, index) => <Button key={index} disabled={selected.includes(index) || disabled || done} onPress={() => setSelected([...selected, index])}>{token}</Button>)}</View>
    {!done && <View style={s.row}><Button primary disabled={disabled || selected.length !== exercise.tokens.length} onPress={check}>Check sentence</Button><Button disabled={disabled || !selected.length} onPress={() => { setSelected([]); setFeedback(''); }}>Clear</Button><Button onPress={() => { setHint(!hint); setHintUsed(true); }}>{hint ? 'Hide hint' : 'Show a hint'}</Button></View>}
    {hint && <Text style={s.body}>{exercise.hint}</Text>}<Text accessibilityLiveRegion="polite" style={s.body}>{feedback || (done ? '✓ Sentence solved. Your result is saved.' : 'You can change your answer and try again.')}</Text>
    {done && <><Text style={s.body}>{exercise.explanation}</Text><Button primary onPress={onNext}>Continue →</Button></>}
  </View>;
}
