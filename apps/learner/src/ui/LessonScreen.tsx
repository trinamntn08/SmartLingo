import { useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { checkAnswer, lessonProgress, type LearningEvent, type Lesson, type Vocabulary } from '@smartlingo/domain';
import { Badge, Button, Speak } from './controls';
import { Illustration } from './Illustration';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';

type Stage = 'vocabulary' | 'dialogue' | 'picture' | 'sentence' | 'finish';

function resumeStage(lesson: Lesson, model: LearningModel): Stage {
  const progress = lessonProgress(lesson, model.events);
  if (progress.completed) return 'finish';
  if (lesson.vocabulary.some(entry => !progress.viewedIds.has(entry.id))) return 'vocabulary';
  if (!progress.pictureDone) return 'dialogue';
  return progress.sentenceDone ? 'finish' : 'sentence';
}

export function LessonScreen({ lesson, model, onExit }: { lesson: Lesson; model: LearningModel; onExit: () => void }) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const progress = lessonProgress(lesson, model.events);
  const [stage, setStage] = useState<Stage>(() => resumeStage(lesson, model));
  const [wordIndex, setWordIndex] = useState(() => Math.max(0, lesson.vocabulary.findIndex(entry => !progress.viewedIds.has(entry.id))));
  const [savedMessage, setSavedMessage] = useState('');
  const readyToFinish = lesson.vocabulary.every(entry => progress.viewedIds.has(entry.id)) && progress.pictureDone && progress.sentenceDone;
  const count = lesson.vocabulary.filter(entry => progress.viewedIds.has(entry.id)).length + Number(progress.pictureDone) + Number(progress.sentenceDone);
  function record(activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints = 0, after?: () => void) {
    model.record({ id: crypto.randomUUID(), lessonId: lesson.id, revision: lesson.revision, itemId, activity, result, hints, occurredAt: new Date().toISOString() }, after);
  }
  function nextWord() {
    const entry = lesson.vocabulary[wordIndex];
    record('vocabulary', entry.id, 'viewed', 0, () => {
      setSavedMessage('');
      if (wordIndex + 1 < lesson.vocabulary.length) setWordIndex(wordIndex + 1);
      else setStage('dialogue');
    });
  }
  function saveWord(entry: Vocabulary) {
    model.captureEntry({ id: `notebook.${entry.id}`, sourceEntryId: entry.id, target: entry.target, meaning: entry.meaning,
      example: entry.example, updatedAt: new Date().toISOString() }, () => setSavedMessage('Saved to your notebook. You can edit it in Review.'));
  }
  const entry = lesson.vocabulary[wordIndex];
  return <View style={{ gap: 24 }}>
    <View style={s.row}><Button onPress={onExit}>← All lessons</Button><Badge>{lesson.level} · {lesson.topic} · {lesson.role}</Badge><Badge>{lesson.status === 'draft' ? 'Draft · owner review pending' : 'Published'}</Badge></View>
    <View style={{ gap: 10 }}><Text accessibilityRole="header" style={s.title}>{lesson.subtitle}</Text><Text style={s.muted}>A little French for a real moment. Go at your own pace.</Text></View>
    <View style={{ gap: 8 }} accessibilityLabel={`${count} of ${lesson.vocabulary.length + 2} activities saved`}>
      <View style={s.row}><Text style={s.eyebrow}>{stage === 'vocabulary' ? `Words · ${wordIndex + 1} of ${lesson.vocabulary.length}` : stage === 'finish' ? 'Your session' : stage}</Text><Text style={s.muted}>{count}/{lesson.vocabulary.length + 2} activities saved</Text></View>
      <View style={s.progressTrack}><View style={[s.progressFill, { width: `${count / (lesson.vocabulary.length + 2) * 100}%` }]} /></View>
    </View>
    {stage === 'vocabulary' && <View style={s.split}>
      {!compact && <View style={[s.card, s.column, { backgroundColor: '#E7ECD9', justifyContent: 'center', minHeight: 310 }]}><Illustration picture={entry.picture} alt={entry.pictureAlt} size={320} /><Text style={[s.eyebrow, { textAlign: 'center' }]}>Look · say it · try it</Text></View>}
      <View style={[s.card, s.column, { gap: 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, minWidth: 0, gap: 6 }}><Text style={s.eyebrow}>Word or phrase</Text><Text accessibilityRole="header" style={[s.title, compact && { fontSize: 32, lineHeight: 38 }]}>{entry.target}</Text><Text style={s.body}>{entry.meaning}</Text></View>
          {compact && <Illustration picture={entry.picture} alt={entry.pictureAlt} size={84} />}
        </View>
        <Speak text={entry.target} />
        <View style={s.divider} />
        <View style={{ gap: 6 }}><Text style={s.eyebrow}>Example</Text><Text style={s.heading}>{entry.example}</Text><Text style={s.muted}>{entry.exampleMeaning}</Text></View>
        <View style={[s.notice, { padding: 14, gap: 6 }]}><Text style={s.eyebrow}>Explanation</Text><Text style={s.body}>{entry.note}</Text></View>
        <View style={s.row}><Button disabled={model.blocked || model.notebook.some(saved => saved.sourceEntryId === entry.id)} onPress={() => saveWord(entry)}>{model.notebook.some(saved => saved.sourceEntryId === entry.id) ? '✓ In notebook' : '+ Save word'}</Button>
          <Button primary disabled={model.blocked} onPress={nextWord}>{wordIndex === lesson.vocabulary.length - 1 ? 'Continue to dialogue →' : 'Next word →'}</Button></View>
        {!!savedMessage && <Text accessibilityLiveRegion="polite" style={s.muted}>{savedMessage}</Text>}
      </View>
    </View>}
    {stage === 'dialogue' && <View style={s.card}><Text accessibilityRole="header" style={s.heading}>A small conversation</Text><Text style={s.muted}>Read both roles. If you like, say the customer’s lines aloud.</Text>
      {lesson.dialogue.map((line, index) => <View key={index} style={[s.notice, line.role === lesson.role && { backgroundColor: '#E5EEDC', marginLeft: 16 }]}>
        <Text style={s.eyebrow}>{line.role}</Text><Text style={s.heading}>{line.target}</Text><Speak text={line.target} />
        <Text style={s.body}>{line.meaning}</Text>
      </View>)}
      <View style={s.notice}><Text style={s.eyebrow}>Grammar</Text><Text style={s.heading}>{lesson.grammar.title}</Text><Text style={s.body}>{lesson.grammar.explanation}</Text></View>
      <Button primary onPress={() => setStage('picture')}>Try picture practice →</Button>
    </View>}
    {stage === 'picture' && <PictureActivity lesson={lesson} disabled={model.blocked} done={progress.pictureDone} record={record} onNext={() => setStage('sentence')} />}
    {stage === 'sentence' && <SentenceActivity lesson={lesson} disabled={model.blocked} done={progress.sentenceDone} record={record} onNext={() => setStage('finish')} />}
    {stage === 'finish' && <View style={[s.card, { backgroundColor: '#E6EEDB' }]}>
      <Text style={s.eyebrow}>{progress.completed ? 'Session saved' : 'One final step'}</Text><Text accessibilityRole="header" style={s.title}>{progress.completed ? 'A little more ready for everyday life.' : 'You’ve put the pieces together.'}</Text>
      <Text style={s.body}>{lesson.outcome}</Text><Text style={s.muted}>Completing this session records your practice. Confidence grows with revisiting and using French in real life.</Text>
      {!progress.completed && <Button primary disabled={model.blocked || !readyToFinish} onPress={() => record('completion', lesson.id, 'completed')}>Finish and save session</Button>}
      {!readyToFinish && <Text style={s.muted}>Study every word and solve both activities before finishing.</Text>}
      <View style={s.row}><Button onPress={() => { setWordIndex(0); setStage('vocabulary'); }}>Revisit the words</Button><Button primary={progress.completed} onPress={onExit}>Back to Today →</Button></View>
    </View>}
  </View>;
}

type ActivityProps = { lesson: Lesson; disabled: boolean; done: boolean; record: (activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints?: number, after?: () => void) => void; onNext: () => void };

function PictureActivity({ lesson, disabled, done, record, onNext }: ActivityProps) {
  const [feedback, setFeedback] = useState('');
  const [hint, setHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const target = lesson.vocabulary.find(entry => entry.id === lesson.pictureActivity.entryId)!;
  function choose(id: string) {
    const correct = id === target.id;
    record('picture', target.id, correct ? 'correct' : 'incorrect', Number(hintUsed), () => setFeedback(correct ? 'That’s it. You matched the picture.' : 'Take another look. Compare the object in the picture with the words. You can try again.'));
  }
  return <View style={s.card}><Text style={s.eyebrow}>Picture practice</Text><Text accessibilityRole="header" style={s.heading}>{lesson.pictureActivity.prompt}</Text>
    <View style={[s.notice, { backgroundColor: '#E7ECD9' }]}><Illustration picture={target.picture} alt={target.pictureAlt} size={290} /></View>
    <View style={{ gap: 10 }}>{lesson.pictureActivity.choices.map(id => <Button key={id} disabled={disabled || done} onPress={() => choose(id)}>{lesson.vocabulary.find(entry => entry.id === id)!.target}</Button>)}</View>
    <Text accessibilityLiveRegion="polite" style={[s.body, { color: done ? '#2C653B' : colors.ink }]}>{feedback || (done ? '✓ Picture matched. Your result is saved.' : 'Choose a phrase. There’s no timer.')}</Text>
    <Button onPress={() => { setHint(!hint); setHintUsed(true); }}>{hint ? 'Hide hint' : 'Show a hint'}</Button>{hint && <Text style={s.body}>{target.meaning}</Text>}
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
  return <View style={s.card}><Text style={s.eyebrow}>Sentence building</Text><Text accessibilityRole="header" style={s.heading}>{exercise.prompt}</Text>
    <View style={[s.notice, { minHeight: 110, backgroundColor: '#E7ECD9' }]}><Text style={s.eyebrow}>Your sentence</Text><View style={s.row}>
      {selected.length ? selected.map((index, position) => <Button key={index} disabled={disabled || done} label={`Remove ${exercise.tokens[index]}`} onPress={() => setSelected(selected.filter((_, at) => at !== position))}>{exercise.tokens[index]} ×</Button>) : <Text style={s.muted}>Tap the pieces below to put them in order.</Text>}
    </View></View>
    <View style={s.row}>{exercise.tokens.map((token, index) => <Button key={index} primary disabled={selected.includes(index) || disabled || done} onPress={() => setSelected([...selected, index])}>{token}</Button>)}</View>
    <View style={s.row}><Button primary disabled={disabled || done || selected.length !== exercise.tokens.length} onPress={check}>Check sentence</Button><Button disabled={disabled || done || !selected.length} onPress={() => { setSelected([]); setFeedback(''); }}>Clear</Button><Button onPress={() => { setHint(!hint); setHintUsed(true); }}>{hint ? 'Hide hint' : 'Show a hint'}</Button></View>
    {hint && <Text style={s.body}>{exercise.hint}</Text>}<Text accessibilityLiveRegion="polite" style={s.body}>{feedback || (done ? '✓ Sentence solved. Your result is saved.' : 'You can change your answer and try again.')}</Text>
    {done && <><Text style={s.body}>{exercise.explanation}</Text><Button primary onPress={onNext}>Continue →</Button></>}
  </View>;
}
