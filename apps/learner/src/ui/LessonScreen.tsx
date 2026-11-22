import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { checkAnswer, lessonProgress, type LearningEvent, type Lesson } from '@smartlingo/domain';
import { Badge, Button, Speak } from './controls';
import { Illustration } from './Illustration';
import { VocabularyCard } from './VocabularyCard';
import { colors, frenchTextProps, styles as s } from './theme';
import type { LearningModel } from './useLearning';

const stageNames = {
  vocabulary: 'Vocabulary',
  dialogue: 'Dialogue',
  picture: 'Matching',
  sentence: 'Sentence building',
  finish: 'Finish',
} as const;

type Stage = keyof typeof stageNames;
const stages = Object.keys(stageNames) as Stage[];

function resumeStage(lesson: Lesson, model: LearningModel): Stage {
  const progress = lessonProgress(lesson, model.events);
  if (progress.completed) return 'finish';
  if (lesson.vocabulary.some(entry => !progress.viewedIds.has(entry.id))) return 'vocabulary';
  if (!progress.pictureDone) return 'dialogue';
  return progress.sentenceDone ? 'finish' : 'sentence';
}

type LessonScreenProps = {
  lesson: Lesson;
  model: LearningModel;
  onExit: () => void;
  onStageChange?: () => void;
};

export function LessonScreen({ lesson, model, onExit, onStageChange }: LessonScreenProps) {
  const progress = lessonProgress(lesson, model.events);
  const [stage, setStage] = useState<Stage>(() => resumeStage(lesson, model));
  const previousStage = useRef(stage);
  const allWordsViewed = lesson.vocabulary.every(entry => progress.viewedIds.has(entry.id));
  const readyToFinish = allWordsViewed && progress.pictureDone && progress.sentenceDone;
  const count = lesson.vocabulary.filter(entry => progress.viewedIds.has(entry.id)).length + Number(progress.pictureDone) + Number(progress.sentenceDone);
  const activityCount = lesson.vocabulary.length + 2;

  useEffect(() => {
    if (previousStage.current === stage) return;
    previousStage.current = stage;
    onStageChange?.();
  }, [stage, onStageChange]);

  function record(activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints = 0, after?: () => void) {
    model.record({
      id: crypto.randomUUID(), lessonId: lesson.id, revision: lesson.revision,
      itemId, activity, result, hints, occurredAt: new Date().toISOString(),
    }, after);
  }

  function reviewVocabulary() {
    if (allWordsViewed) setStage('dialogue');
    else record('vocabulary', lesson.id, 'viewed', 0, () => setStage('dialogue'));
  }

  return (
    <View style={ui.screen}>
      <View style={s.row}><Button onPress={onExit}>← All lessons</Button></View>
      <View style={[s.card, ui.intro]}>
        <View style={[s.row, ui.meta]}>
          <Text style={s.eyebrow}>{lesson.topic}</Text>
          <Badge>{lesson.level === 'foundation' ? 'Foundations' : lesson.level}</Badge>
          <Badge>{lesson.status === 'draft' ? 'Draft' : 'Published'}</Badge>
        </View>
        <Text accessibilityRole="header" style={s.title}>{lesson.subtitle}</Text>
        <Text style={[s.body, ui.outcome]}>{lesson.outcome}</Text>
        <Text style={s.muted}>{lesson.durationMinutes} min · Your role is {lesson.role}</Text>
        <View style={ui.progress}>
          <View style={[s.row, ui.progressLabels]}>
            <Text style={[s.muted, ui.progressStep]}>Step {stages.indexOf(stage) + 1} of {stages.length} · {stageNames[stage]}</Text>
            <Text style={s.muted}>{count}/{activityCount} activities saved</Text>
          </View>
          <View accessibilityRole="progressbar" accessibilityLabel="Lesson activities saved"
            accessibilityValue={{ min: 0, max: activityCount, now: count }} style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${count / activityCount * 100}%` }]} />
          </View>
        </View>
      </View>

      {stage === 'vocabulary' && (
        <View style={ui.screen}>
          <View style={ui.sectionTitle}>
            <StageHeading>Vocabulary</StageHeading>
            <Text style={s.muted}>{lesson.vocabulary.length} words and phrases</Text>
          </View>
          <View style={[s.split, ui.wordGrid]}>
            {lesson.vocabulary.map(entry => (
              <View key={entry.id} style={ui.word}><VocabularyCard entry={entry} model={model} /></View>
            ))}
          </View>
          <View style={[s.row, ui.sectionEnd]}>
            <Button primary disabled={model.blocked} onPress={reviewVocabulary}>Continue to dialogue →</Button>
          </View>
        </View>
      )}

      {stage === 'dialogue' && (
        <View style={[s.card, ui.activity]}>
          <StageHeading>A small conversation</StageHeading>
          <Text style={s.muted}>Read both roles, then try saying your lines aloud.</Text>
          <View style={ui.dialogue}>
            {lesson.dialogue.map((line, index) => <DialogueLine key={index} line={line} highlighted={line.role === lesson.role} />)}
          </View>
          <View style={[s.notice, ui.grammar]}>
            <Text style={s.eyebrow}>Grammar</Text>
            <Text style={s.heading}>{lesson.grammar.title}</Text>
            <Text style={s.body}>{lesson.grammar.explanation}</Text>
          </View>
          <View style={[s.row, ui.sectionEnd]}>
            <Button primary onPress={() => setStage('picture')}>
              {lesson.pictureActivity.mode === 'meaning' ? 'Try meaning practice →' : 'Try picture practice →'}
            </Button>
          </View>
        </View>
      )}

      {stage === 'picture' && <PictureActivity lesson={lesson} disabled={model.blocked} done={progress.pictureDone} record={record} onNext={() => setStage('sentence')} />}
      {stage === 'sentence' && <SentenceActivity lesson={lesson} disabled={model.blocked} done={progress.sentenceDone} record={record} onNext={() => setStage('finish')} />}

      {stage === 'finish' && (
        <View style={[s.card, ui.activity, ui.successSurface]}>
          <View accessibilityLiveRegion="polite" style={ui.sectionTitle}>
            {progress.completed && <Text style={[s.eyebrow, ui.greenText]}>Session saved</Text>}
            <StageHeading>{progress.completed ? 'Lesson complete' : 'Ready to finish?'}</StageHeading>
          </View>
          <Text style={s.body}>{progress.completed ? 'Revisit the words whenever you want a refresher.' : 'Save this session to keep a record of your practice.'}</Text>
          {!readyToFinish && <Text style={s.muted}>Study every word and solve both activities before finishing.</Text>}
          <View style={s.row}>
            {!progress.completed && <Button primary disabled={model.blocked || !readyToFinish} onPress={() => record('completion', lesson.id, 'completed')}>Finish and save session</Button>}
            <Button onPress={() => setStage('vocabulary')}>Revisit the words</Button>
            <Button primary={progress.completed} onPress={onExit}>Back to lessons →</Button>
          </View>
        </View>
      )}
    </View>
  );
}

function StageHeading({ children }: { children: string }) {
  return <View accessibilityRole="header" testID="lesson-stage-heading" tabIndex={-1}><Text style={s.heading}>{children}</Text></View>;
}

type ActivityProps = {
  lesson: Lesson;
  disabled: boolean;
  done: boolean;
  record: (activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints?: number, after?: () => void) => void;
  onNext: () => void;
};

function DialogueLine({ line, highlighted }: { line: Lesson['dialogue'][number]; highlighted: boolean }) {
  const [voiceError, setVoiceError] = useState('');
  return (
    <View style={[s.notice, ui.dialogueLine, highlighted && ui.learnerLine]}>
      <Text style={[s.eyebrow, highlighted && ui.greenText]}>{line.role}</Text>
      <View style={[s.row, ui.dialogueContents]}>
        <View style={ui.dialogueText}>
          <Text {...frenchTextProps} style={[s.heading, ui.dialogueTarget]}>{line.target}</Text>
          <Text style={s.muted}>{line.meaning}</Text>
        </View>
        <Speak text={line.target} onError={setVoiceError} />
      </View>
      {!!voiceError && <Text accessibilityRole="alert" style={[s.muted, ui.errorText]}>{voiceError}</Text>}
    </View>
  );
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
      : meaningMode ? 'Try again. Match the meaning with the French phrase.' : 'Take another look. Compare the object in the picture with the words. You can try again.'));
  }

  return (
    <View style={[s.card, ui.activity]}>
      <StageHeading>{lesson.pictureActivity.prompt}</StageHeading>
      <View style={[s.notice, ui.practiceArea]}>
        {meaningMode
          ? <Text style={[s.heading, ui.meaning]}>{target.meaning}</Text>
          : <Illustration picture={target.picture} alt={target.pictureAlt} size={252} />}
      </View>
      <View style={ui.choices}>
        {lesson.pictureActivity.choices.map(id => <Button key={id} disabled={disabled || done} onPress={() => choose(id)}>{lesson.vocabulary.find(entry => entry.id === id)!.target}</Button>)}
      </View>
      <Text accessibilityLiveRegion="polite" style={[s.body, done && ui.greenText]}>
        {feedback || (done ? `✓ ${meaningMode ? 'Meaning' : 'Picture'} matched. Your result is saved.` : 'Choose a French phrase.')}
      </Text>
      {hint && <View style={[s.notice, ui.grammar]}><Text style={s.body}>{meaningMode ? target.example : target.meaning}</Text></View>}
      <View style={s.row}>
        <Button onPress={() => { setHint(!hint); setHintUsed(true); }}>{hint ? 'Hide hint' : 'Show a hint'}</Button>
        {done && <Button primary onPress={onNext}>Build a sentence →</Button>}
      </View>
    </View>
  );
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

  return (
    <View style={[s.card, ui.activity]}>
      <StageHeading>{exercise.prompt}</StageHeading>
      <View style={[s.notice, ui.practiceArea, ui.sentence]}>
        <Text style={s.eyebrow}>Your sentence</Text>
        <View style={s.row}>
          {selected.length ? selected.map((index, position) => (
            <Button key={index} disabled={disabled || done} label={`Remove ${exercise.tokens[index]}`}
              onPress={() => setSelected(selected.filter((_, at) => at !== position))}>{exercise.tokens[index]} ×</Button>
          )) : <Text style={s.muted}>Tap the pieces below to put them in order.</Text>}
        </View>
      </View>
      <View style={s.row}>
        {exercise.tokens.map((token, index) => (
          <Button key={index} disabled={selected.includes(index) || disabled || done}
            onPress={() => setSelected([...selected, index])}>{token}</Button>
        ))}
      </View>
      <View style={s.row}>
        <Button primary disabled={disabled || done || selected.length !== exercise.tokens.length} onPress={check}>Check sentence</Button>
        <Button disabled={disabled || done || !selected.length} onPress={() => { setSelected([]); setFeedback(''); }}>Clear</Button>
        <Button onPress={() => { setHint(!hint); setHintUsed(true); }}>{hint ? 'Hide hint' : 'Show a hint'}</Button>
      </View>
      {hint && <View style={[s.notice, ui.grammar]}><Text style={s.body}>{exercise.hint}</Text></View>}
      <Text accessibilityLiveRegion="polite" style={[s.body, done && ui.greenText]}>
        {feedback || (done ? '✓ Sentence solved. Your result is saved.' : 'You can change your answer and try again.')}
      </Text>
      {done && <>
        <View style={[s.notice, ui.successSurface]}><Text style={s.body}>{exercise.explanation}</Text></View>
        <View style={[s.row, ui.sectionEnd]}><Button primary onPress={onNext}>Continue →</Button></View>
      </>}
    </View>
  );
}

const ui = StyleSheet.create({
  screen: { gap: 20, minWidth: 0 },
  intro: { backgroundColor: colors.card, gap: 10 },
  meta: { gap: 8 },
  outcome: { maxWidth: 660 },
  progress: { gap: 8, paddingTop: 14, marginTop: 4, borderTopWidth: 1, borderColor: colors.line },
  progressLabels: { justifyContent: 'space-between', columnGap: 16, rowGap: 2 },
  progressStep: { fontWeight: '700', color: colors.ink },
  sectionTitle: { gap: 4 },
  wordGrid: { gap: 14 },
  word: { flexGrow: 1, flexShrink: 1, flexBasis: 284, minWidth: 0 },
  sectionEnd: { justifyContent: 'flex-end' },
  activity: { width: '100%', maxWidth: 820 },
  dialogue: { gap: 10 },
  dialogueLine: { backgroundColor: colors.paper, borderLeftWidth: 3, borderColor: colors.line, gap: 5 },
  learnerLine: { backgroundColor: colors.greenSoft, borderColor: colors.forest },
  dialogueContents: { gap: 8 },
  dialogueText: { flexBasis: 180, flexGrow: 1, flexShrink: 1, minWidth: 0, gap: 3 },
  dialogueTarget: { fontSize: 22, lineHeight: 28 },
  grammar: { backgroundColor: colors.goldSoft },
  practiceArea: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  meaning: { textAlign: 'center' },
  choices: { gap: 8 },
  sentence: { minHeight: 108 },
  successSurface: { backgroundColor: colors.greenSoft },
  greenText: { color: colors.forest },
  errorText: { color: colors.danger },
});
