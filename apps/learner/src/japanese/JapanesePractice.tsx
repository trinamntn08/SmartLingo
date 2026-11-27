import { useId, useRef, useState } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';
import { checkJapaneseAnswer, type JapanesePracticeResult, type JapanesePracticeTask } from '@smartlingo/domain';
import { hasJapaneseCourseClip, japaneseCourseVoiceCredit } from '../audio/japanese/course-clips';
import { useVisitState } from '../app/WebNavigation';
import { Speak } from '../audio/Speak';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import { JapaneseText } from './JapaneseText';

type Props = {
  tasks: readonly JapanesePracticeTask[];
  onResult?: (task: JapanesePracticeTask, result: JapanesePracticeResult, assisted: boolean) => void;
  disabled?: boolean;
  completedIds?: readonly string[];
};

export function JapanesePractice({ tasks, onResult, disabled, completedIds = [] }: Props) {
  return <View style={{ gap: 18, minWidth: 0 }}>{tasks.map(task =>
    <PracticeTask key={task.id} task={task} onResult={onResult} disabled={disabled} saved={completedIds.includes(task.id)} />
  )}</View>;
}

interface PracticeAttempt {
  answer: string;
  writing: string;
  result?: JapanesePracticeResult;
  showSupport: boolean;
  usedSupport: boolean;
  showModel: boolean;
  played: boolean;
}

const emptyAttempt: PracticeAttempt = { answer: '', writing: '', showSupport: false, usedSupport: false, showModel: false, played: false };

const skills = { listening: 'Listen', reading: 'Read', writing: 'Write', speaking: 'Say it aloud', script: 'Script practice' };

function PracticeTask({ task, disabled, saved, onResult }: Omit<Props, 'tasks' | 'completedIds'> & {
  task: JapanesePracticeTask; saved: boolean;
}) {
  const [attempt, setAttempt] = useVisitState<PracticeAttempt>(`japanese-practice:${task.id}`, emptyAttempt);
  const { answer, result, showSupport, usedSupport, showModel, played, writing } = attempt;
  const [playingError, setPlayingError] = useState('');
  const listening = task.skill === 'listening';
  const source = task.source;
  const answerBlocked = disabled || (listening && !played && !usedSupport);

  function submit(next: JapanesePracticeResult) {
    if (answerBlocked) return;
    setAttempt(previous => ({ ...previous, result: next, usedSupport: previous.usedSupport || next === 'incorrect' }));
    onResult?.(task, next, usedSupport);
  }

  function toggleSupport() {
    setAttempt(previous => ({ ...previous, showSupport: !previous.showSupport, usedSupport: true }));
  }

  function submitText() {
    if (task.mode === 'text' && answer.trim()) submit(checkJapaneseAnswer(answer, task) ? 'correct' : 'incorrect');
  }

  return <View testID={task.id} style={[s.notice, { gap: 12, minWidth: 0 }]}>
    {task.skill && <Text style={s.eyebrow}>{skills[task.skill]}</Text>}
    <Text accessibilityRole="header" style={s.heading}>{task.prompt}</Text>
    {source && <>
      {listening && <View style={s.row}>
        <Speak text={source.text} language="ja-JP" courseClip label="Play Japanese audio" onError={setPlayingError} onPlayed={() => setAttempt(previous => ({ ...previous, played: true }))} />
        <Text style={s.muted}>{hasJapaneseCourseClip(source.text) ? japaneseCourseVoiceCredit : 'Replay as often as you need.'}</Text>
      </View>}
      {listening && !played && !usedSupport && !playingError && <Text style={s.muted}>Play the audio or open the transcript before answering.</Text>}
      {!!playingError && <Text accessibilityRole="alert" style={s.body}>{playingError} Open the transcript to continue with reading support.</Text>}
      {!listening && <Text style={s.body}><JapaneseText text={source.text} ruby={showSupport ? source.ruby : undefined} /></Text>}
      {(listening || source.reading || source.ruby || source.meaning) && <View style={s.row}>
        <Button quiet compact expanded={showSupport} onPress={toggleSupport}>
          {showSupport ? 'Hide' : 'Show'} {listening ? 'transcript' : 'reading support'}
        </Button>
      </View>}
      {showSupport && <View style={{ gap: 5 }}>
        {listening && <Text style={s.body}><JapaneseText text={source.text} ruby={source.ruby} /></Text>}
        {!!source.reading && source.reading !== source.text && <Text style={s.body}><JapaneseText text={source.reading} /></Text>}
        {!!source.meaning && (result === 'correct' || result === 'self-reviewed') && <Text style={s.muted}>{source.meaning}</Text>}
      </View>}
    </>}
    {task.mode === 'choice' && <View style={s.row}>
      {task.choices.map(choice => <Button key={choice} disabled={answerBlocked} onPress={() => submit(choice === task.answer ? 'correct' : 'incorrect')}>{choice}</Button>)}
    </View>}
    {task.mode === 'text' && <>
      <PracticeInput value={answer} onChange={answer => setAttempt(previous => ({ ...previous, answer }))} onSubmit={submitText} label="Type your answer" disabled={disabled} />
      <View style={s.row}><Button primary disabled={answerBlocked || !answer.trim()} onPress={submitText}>Check answer</Button></View>
    </>}
    {task.mode === 'self' && <>
      {task.response === 'write' && <PracticeInput value={writing} onChange={writing => setAttempt(previous => ({ ...previous, writing }))} label="Draft your Japanese reply" multiline disabled={disabled} />}
      <Text style={s.muted}>{task.response === 'speak' || task.skill === 'speaking'
        ? 'Say your reply aloud. Compare it with the model and checklist.'
        : 'Try your own reply first. Then compare it with the model and checklist.'}</Text>
      <View style={s.row}><Button quiet compact expanded={showModel} onPress={() => setAttempt(previous => ({ ...previous, showModel: !previous.showModel, usedSupport: true }))}>{showModel ? 'Hide model' : 'Show model and checklist'}</Button></View>
      {showModel && <View style={{ gap: 8 }}>
        {task.response === 'speak' || task.skill === 'speaking'
          ? <Speak text={task.model} language="ja-JP" courseClip wordStyle={s.body} label="Listen to model reply" />
          : <Text style={s.body}><JapaneseText text={task.model} /></Text>}
        {task.modelMeaning && <Text style={s.muted}>{task.modelMeaning}</Text>}
        {task.criteria.map(criterion => <Text key={criterion} style={s.body}>• {criterion}</Text>)}
        <Text style={s.muted}>You judge your reply against the checklist.</Text>
        <View style={s.row}><Button disabled={disabled || (task.response === 'write' && !writing.trim())} onPress={() => submit('self-reviewed')}>Mark self-review complete</Button></View>
      </View>}
    </>}
    <Text accessibilityLiveRegion="polite" style={[s.body, { color: result === 'incorrect' ? colors.danger : colors.ink }]}>{result === 'incorrect' ? `${task.retry} ${task.feedback}`
      : result ? task.feedback : saved ? 'Practice recorded. You can try it again.' : ''}</Text>
  </View>;
}

function PracticeInput({ value, onChange, onSubmit, label, disabled, multiline = false }: {
  value: string; onChange: (value: string) => void; onSubmit?: () => void; label: string; disabled?: boolean; multiline?: boolean;
}) {
  const composing = useRef(false);
  const id = useId();
  const [focused, setFocused] = useState(false);
  if (Platform.OS !== 'web') return <TextInput value={value} editable={!disabled} onChangeText={onChange}
    accessibilityLabel={label} placeholder={label} autoCapitalize="none" autoCorrect={false} multiline={multiline}
    style={[s.body, { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, padding: 12 }]} />;
  const inputProps = {
    id, value, disabled, lang: 'ja', autoCapitalize: 'none', spellCheck: false, autoComplete: 'off',
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.currentTarget.value),
    onFocus: () => setFocused(true),
    onBlur: () => { composing.current = false; setFocused(false); },
    onCompositionStart: () => { composing.current = true; },
    onCompositionEnd: () => { composing.current = false; },
    style: { width: '100%', boxSizing: 'border-box' as const, padding: 12, borderRadius: 8, border: `1px solid ${colors.line}`,
      outline: focused ? `2px solid ${colors.focusRing}` : undefined, background: colors.card, color: colors.ink, font: 'inherit',
      fontSize: 20, minHeight: 44 },
  };
  return <View style={{ gap: 4, minWidth: 0 }}><label htmlFor={id}>{label}</label>
    {multiline ? <textarea {...inputProps} rows={3} /> : <input {...inputProps} type="text" onKeyDown={event => {
      if (event.key !== 'Enter' || composing.current || event.nativeEvent.isComposing || event.keyCode === 229) return;
      event.preventDefault();
      onSubmit?.();
    }} />}
  </View>;
}
