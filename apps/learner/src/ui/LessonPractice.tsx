import { useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { checkAnswer, normalizeAnswer, type LearningEvent, type Lesson, type TargetLanguage } from '@smartlingo/domain';
import { useVisitState } from '../app/WebNavigation';
import { Button } from './controls';
import { Icon } from './Icon';
import { Illustration } from './Illustration';
import { colors, designTokens as tokens, styles as s } from './theme';

interface ActivityProps {
  lesson: Lesson; routed: boolean; browseOnly: boolean; disabled: boolean; done: boolean;
  record: (activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints?: number, after?: () => void) => void;
  nextHref?: string;
  onNext: () => void;
}

function useActivityState<T>(routed: boolean, field: string, initial: T) {
  const local = useState(initial);
  const visit = useVisitState(field, initial);
  return routed ? visit : local;
}

export function PictureActivity({ lesson, routed, browseOnly, disabled, done, record, nextHref, onNext }: ActivityProps) {
  const key = `lesson:${lesson.id}:${lesson.revision}:picture`;
  const [feedback, setFeedback] = useActivityState(routed, `${key}:feedback`, '');
  const [hint, setHint] = useActivityState(routed, `${key}:hint`, false);
  const [hintUsed, setHintUsed] = useActivityState(routed, `${key}:hint-used`, false);
  const target = lesson.vocabulary.find(entry => entry.id === lesson.pictureActivity.entryId)!;
  const meaningMode = lesson.pictureActivity.mode === 'meaning';
  const matched = meaningMode ? 'That’s it. You matched the meaning.' : 'That’s it. You matched the picture.';
  const language = lesson.language === 'ja-JP' ? 'ja-JP' : 'fr-FR';

  function choose(id: string) {
    const correct = id === target.id;
    record('picture', target.id, correct ? 'correct' : 'incorrect', Number(hintUsed), () => setFeedback(correct ? matched
      : meaningMode ? 'Try again. Match the meaning with the phrase.' : 'Take another look. Compare the picture with the choices.'));
  }

  return <View style={layout.card}>
    <View style={layout.lead}>
      <Text accessibilityRole="header" style={[s.body, layout.prompt]}>{lesson.pictureActivity.prompt}</Text>
      {meaningMode ? <Text style={[s.heading, layout.clue]}>{target.meaning}</Text>
        : <View style={layout.illustration}><Illustration picture={target.picture} alt={target.pictureAlt} size={160} /></View>}
    </View>
    <View style={layout.body}>
      <View style={layout.choices}>
        {lesson.pictureActivity.choices.map(id => <MatchChoice key={id} name={lesson.vocabulary.find(entry => entry.id === id)!.target} language={language}
          correct={done && id === target.id} disabled={disabled || done} onPress={() => choose(id)} />)}
      </View>
      {!!(done || feedback) && <Text accessibilityLiveRegion="polite" style={[s.body, layout.feedback, done && layout.correct]}>{done ? matched : feedback}</Text>}
      {hint && <Text style={[s.body, layout.hint]}>{meaningMode ? target.example : target.meaning}</Text>}
      <View style={layout.actions}>
        <Button quiet onPress={() => { setHint(!hint); setHintUsed(true); }}>{hint ? 'Hide hint' : 'Show a hint'}</Button>
        {(done || browseOnly) && <Button primary trailingIcon="arrow-right" href={nextHref} disabled={disabled && !browseOnly} onPress={onNext}>Next</Button>}
      </View>
    </View>
  </View>;
}

function MatchChoice({ name, language, correct, disabled, onPress }: {
  name: string; language: TargetLanguage; correct: boolean; disabled: boolean; onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };
  return <Pressable {...languageProps} accessibilityRole="button" accessibilityLabel={name} accessibilityState={{ disabled, selected: correct }}
    disabled={disabled} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [layout.choice, correct && layout.choiceCorrect, focused && layout.focus, pressed && layout.pressed]}>
    <View aria-hidden={true} style={[layout.indicator, correct && layout.indicatorCorrect]}>
      {correct && <Icon name="check" size={13} color={colors.onPrimary} />}
    </View>
    <Text style={[s.body, layout.choiceText]}>{name}</Text>
  </Pressable>;
}

interface SentenceProps extends ActivityProps {
  completed: boolean; canComplete: boolean; onComplete: () => void;
  returnLabel?: string;
  nextLesson?: { title: string; href: string; onOpen: () => void };
  extraPractice?: ReactNode;
}

export function SentenceActivity({ lesson, routed, browseOnly, disabled, done, record, nextHref, onNext,
  completed, canComplete, onComplete, returnLabel = 'Back to lessons', nextLesson, extraPractice }: SentenceProps) {
  const key = `lesson:${lesson.id}:${lesson.revision}:sentence`;
  const [selected, setSelected] = useActivityState<number[]>(routed, `${key}:selected`, []);
  const [hint, setHint] = useActivityState(routed, `${key}:hint`, false);
  const [hintUsed, setHintUsed] = useActivityState(routed, `${key}:hint-used`, false);
  const [feedback, setFeedback] = useActivityState(routed, `${key}:feedback`, '');
  const exercise = lesson.sentenceActivity;
  const remainingTiles = exercise.tokens.length - selected.length;
  const answer = selected.map(index => exercise.tokens[index]).join(' ');
  const accepted = done ? exercise.answers.find(value => normalizeAnswer(value) === normalizeAnswer(answer)) ?? exercise.answers[0] : '';
  const language = lesson.language === 'ja-JP' ? 'ja-JP' : 'fr-FR';
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };
  const nextLessonButton = nextLesson && <Button primary trailingIcon="arrow-right" label={`Next lesson: ${nextLesson.title}`}
    href={nextLesson.href} disabled={disabled && !browseOnly} onPress={nextLesson.onOpen}>Next lesson · {nextLesson.title}</Button>;
  const showExit = completed || canComplete || browseOnly;

  function check() {
    const result = checkAnswer(answer, exercise);
    record('sentence', exercise.id, result, Number(hintUsed), () => setFeedback(result === 'correct' ? ''
      : result === 'almost' ? 'Very close. Check the accents, then try again.' : 'Try a different order. Tap a piece in your sentence to move it back.'));
  }

  return <View style={layout.card}>
    <View style={layout.lead}>
      <Text accessibilityRole="header" style={[s.body, layout.prompt]}>{exercise.prompt}</Text>
      <View style={layout.tray} accessibilityLiveRegion={done ? 'polite' : undefined}>
        {done ? <Text {...languageProps} style={[s.heading, layout.clue]}>{accepted}</Text>
          : selected.length ? <View style={layout.pieces}>
            {selected.map(index => <Button compact accent disabled={disabled} key={index} label={`Remove ${exercise.tokens[index]}`}
              onPress={() => setSelected(selected.filter(item => item !== index))}>{exercise.tokens[index]} ×</Button>)}
          </View> : <Text style={[s.muted, layout.trayPlaceholder]}>{browseOnly ? 'Sentence practice' : 'Tap the pieces below to build your sentence.'}</Text>}
      </View>
    </View>
    {done
      ? (showExit || extraPractice) && <View style={layout.body}>
        {completed && <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={s.muted}>Lesson complete</Text>}
        {extraPractice}
        {showExit && <View style={layout.actions}>
          <Button primary={!nextLesson} quiet={!!nextLesson}
            trailingIcon={nextLesson ? undefined : 'arrow-right'} href={nextHref} disabled={disabled && !browseOnly}
            onPress={canComplete && !browseOnly ? onComplete : onNext}>{returnLabel}</Button>
          {nextLessonButton}
        </View>}
      </View>
      : <View style={layout.body}>
        <View style={layout.pieces}>
          {exercise.tokens.map((token, index) => <Button key={index} disabled={selected.includes(index) || disabled} onPress={() => setSelected([...selected, index])}>{token}</Button>)}
        </View>
        {!!feedback && <Text accessibilityLiveRegion="polite" style={[s.body, layout.feedback]}>{feedback}</Text>}
        {hint && <Text style={[s.body, layout.hint]}>{exercise.hint}</Text>}
        {(browseOnly || completed) && extraPractice}
        <View style={layout.actions}>
          <View style={layout.secondary}>
            <Button quiet onPress={() => { setHint(!hint); setHintUsed(true); }}>{hint ? 'Hide hint' : 'Show a hint'}</Button>
            {!!selected.length && <Button quiet disabled={disabled} onPress={() => { setSelected([]); setFeedback(''); }}>Clear</Button>}
          </View>
          {browseOnly ? <Button primary trailingIcon="arrow-right" href={nextHref} onPress={onNext}>{returnLabel}</Button>
            : <View style={layout.checkActions}>
              {selected.length > 0 && remainingTiles > 0 && <Text style={s.muted} accessibilityLiveRegion="polite">
                {remainingTiles === 1 ? '1 tile left' : `${remainingTiles} tiles left`}
              </Text>}
              <Button primary disabled={disabled || remainingTiles !== 0} onPress={check}>Check sentence</Button>
            </View>}
        </View>
        {completed && nextLessonButton && <View style={layout.actions}>
          <Text style={s.muted}>Lesson already completed</Text>{nextLessonButton}
        </View>}
      </View>}
  </View>;
}

const layout = StyleSheet.create({
  card: { minWidth: 0, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  lead: { padding: 16, gap: 12, borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: colors.paper, borderBottomWidth: 1, borderColor: colors.line },
  prompt: { fontWeight: '600', fontSize: 17, lineHeight: 24 },
  clue: { color: colors.dark, fontSize: 27, lineHeight: 35 },
  illustration: { alignSelf: 'flex-start', backgroundColor: colors.card, borderRadius: 10, maxWidth: '100%' },
  body: { padding: 16, gap: 12, minWidth: 0 },
  choices: { gap: 8, minWidth: 0 },
  choice: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.line, borderRadius: 10, backgroundColor: colors.card },
  choiceCorrect: { backgroundColor: colors.sageTint, borderColor: colors.primary },
  choiceText: { fontSize: 17, lineHeight: 24, fontWeight: '500', flex: 1, minWidth: 0 },
  indicator: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: colors.inputBorder, alignItems: 'center', justifyContent: 'center' },
  indicatorCorrect: { backgroundColor: colors.primary, borderColor: colors.primary },
  focus: { outlineColor: colors.focusRing, outlineWidth: tokens.focus.outlineWidth, outlineStyle: 'solid', outlineOffset: 2 },
  pressed: { backgroundColor: colors.paper },
  feedback: { fontSize: 16, lineHeight: 24 },
  correct: { color: colors.primary, fontWeight: '600' },
  hint: { padding: 12, backgroundColor: colors.sand, borderRadius: 8 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  tray: { minHeight: 60, justifyContent: 'center', padding: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.inputBorder, borderRadius: 8, backgroundColor: colors.card },
  trayPlaceholder: { paddingHorizontal: 4 },
  pieces: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, minWidth: 0 },
  secondary: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  checkActions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
});
