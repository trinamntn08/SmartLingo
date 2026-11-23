import { useId, useLayoutEffect, useRef, useState, type ComponentRef, type RefObject } from 'react';
import type { TargetLanguage } from '@smartlingo/domain';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useVisitState } from '../app/WebNavigation';
import { audio } from '../audio';
import { Button } from '../ui/controls';
import { Icon } from '../ui/Icon';
import { colors, designTokens as tokens, styles as s } from '../ui/theme';
import type { ListeningQuestion } from './comprehension';

type PlayRef = RefObject<ComponentRef<typeof Pressable> | null>;

interface Attempt {
  selected: number | null;
  checked: boolean;
  transcriptOverride: boolean | null;
  usedTranscript: boolean;
  played: boolean;
}

const emptyAttempt: Attempt = { selected: null, checked: false, transcriptOverride: null, usedTranscript: false, played: false };

interface QuestionContinuation {
  label: string;
  skipLabel: string;
  href?: string;
  onPress: () => void;
  disabled?: boolean;
}

export function ListeningQuestionPlayer({ question, revision, position, total, active = true, playRef, compact,
  onPrevious, onNext, continuation }: {
  question: ListeningQuestion; revision: number; compact: boolean; active?: boolean; playRef?: PlayRef;
  position?: number; total?: number; onPrevious?: () => void; onNext?: () => void; continuation?: QuestionContinuation;
}) {
  // A changed recording, prompt or answer set needs a clean attempt.
  const attemptKey = JSON.stringify(['listening-attempt', question.id, revision, question.sentence, question.reading,
    question.prompt, question.meaning, question.choices, question.correctIndex]);
  const [attempt, setAttempt] = useVisitState(attemptKey, emptyAttempt);
  const { selected, checked, transcriptOverride, usedTranscript, played } = attempt;
  const transcriptVisible = transcriptOverride ?? checked;
  const embedded = position === undefined || total === undefined;
  const [playing, setPlaying] = useState(false);
  const [playFocused, setPlayFocused] = useState(false);
  const [transcriptFocused, setTranscriptFocused] = useState(false);
  const [error, setError] = useState('');
  const localPlayRef = useRef<ComponentRef<typeof Pressable>>(null);
  const playerRef = playRef ?? localPlayRef;
  const request = useRef<symbol | null>(null);
  const focusFeedback = useRef(false);
  const transcriptId = useId();
  const feedbackId = useId();

  useLayoutEffect(() => {
    setPlaying(false);
    setError('');
    return () => {
      if (!request.current) return;
      request.current = null;
      audio.stop();
    };
  }, [active, attemptKey]);

  useLayoutEffect(() => {
    if (!checked || !focusFeedback.current || Platform.OS !== 'web') return;
    focusFeedback.current = false;
    const feedback = document.getElementById(feedbackId);
    if (feedback) {
      feedback.tabIndex = -1;
      feedback.focus();
    }
  }, [checked, feedbackId]);

  function stop() {
    if (!request.current) return;
    request.current = null;
    audio.stop();
    setPlaying(false);
  }

  async function play() {
    if (!active) return;
    if (request.current) { stop(); return; }
    const current = Symbol();
    request.current = current;
    setError('');
    setPlaying(true);
    setAttempt(previous => ({ ...previous, played: true }));
    try { await audio.speak(question.sentence, question.language as TargetLanguage); }
    catch {
      if (current !== request.current) return;
      setError('Audio could not play. Try again or use the transcript.');
      setAttempt(previous => ({ ...previous, transcriptOverride: true, usedTranscript: previous.usedTranscript || !previous.checked }));
    }
    finally {
      if (current === request.current) {
        request.current = null;
        setPlaying(false);
      }
    }
  }

  function checkAnswer() {
    stop();
    focusFeedback.current = true;
    setAttempt(previous => ({ ...previous, checked: true, transcriptOverride: embedded ? null : previous.transcriptOverride }));
  }

  function tryAgain() {
    stop();
    // Embedded feedback reveals the transcript, so a retry follows that support.
    setAttempt(previous => ({ ...previous, selected: null, checked: false, transcriptOverride: null, usedTranscript: true }));
    playerRef.current?.focus();
  }

  const playLabel = playing ? 'Stop audio' : played ? 'Replay sentence' : 'Play sentence';
  const isCorrect = selected === question.correctIndex;
  const canRetry = embedded && checked && !isCorrect;
  const answer = question.choices[question.correctIndex];
  const matchesTranslation = answer === question.meaning;
  const feedbackTitle = matchesTranslation
    ? isCorrect ? 'That’s the meaning.' : 'Here’s the meaning.'
    : isCorrect ? 'That’s right.' : 'Here’s the answer.';
  const next: QuestionContinuation | undefined = continuation ?? (onNext ? {
    label: 'Next sentence', skipLabel: 'Skip sentence', onPress: onNext,
  } : undefined);
  const languageProps = Platform.OS === 'web' ? { lang: question.language } : { accessibilityLanguage: question.language };

  return <View testID="listening-question-player" style={[s.card, layout.exercise]}>
    <View style={[layout.player, compact && layout.playerCompact, embedded && layout.embeddedPlayer,
      embedded && compact && layout.embeddedPlayerCompact]}>
      {!embedded && <View style={layout.progress}>
        <Text style={[s.eyebrow, layout.progressText]} accessibilityLiveRegion="polite">Sentence {position} of {total}</Text>
        <View aria-hidden style={layout.progressTrack}><View style={[layout.progressFill, { width: `${position / total * 100}%` }]} /></View>
      </View>}
      <View style={[layout.playerActions, embedded && layout.embeddedPlayerActions]}>
        <Pressable ref={playerRef} accessibilityRole="button" accessibilityLabel={playLabel}
          onPress={() => void play()} onFocus={() => setPlayFocused(true)} onBlur={() => setPlayFocused(false)}
          style={({ pressed }) => [layout.play, embedded && layout.embeddedPlay, playFocused && layout.focus,
            playFocused && layout.inverseFocus, pressed && layout.pressed]}>
          <Icon name={playing ? 'stop' : 'speaker'} size={embedded ? 21 : 29} />
          <Text style={[s.buttonText, layout.playText, embedded && layout.embeddedPlayText,
            embedded && compact && layout.embeddedPlayTextCompact]}>{playLabel}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: transcriptVisible }} aria-expanded={transcriptVisible}
          aria-controls={transcriptVisible ? transcriptId : undefined} onPress={() => setAttempt(previous => ({
            ...previous, transcriptOverride: !transcriptVisible, usedTranscript: previous.usedTranscript || (!transcriptVisible && !previous.checked),
          }))} onFocus={() => setTranscriptFocused(true)} onBlur={() => setTranscriptFocused(false)}
          style={({ pressed }) => [layout.transcriptAction, embedded && layout.embeddedTranscriptAction, transcriptFocused && layout.focus,
            transcriptFocused && layout.inverseFocus, pressed && layout.pressed]}>
          <Text style={[s.buttonText, layout.transcriptActionText]}>{transcriptVisible ? 'Hide transcript' : 'Show transcript'}</Text>
        </Pressable>
      </View>
    </View>
    <View style={[layout.answers, compact && layout.answersCompact]}>
      {!!error && <Text accessibilityRole="alert" style={[s.muted, layout.error]}>{error}</Text>}
      {transcriptVisible && <View nativeID={transcriptId} testID="listening-transcript" style={layout.transcript}>
        <Text style={s.eyebrow}>Transcript</Text>
        <Text {...languageProps} style={[s.body, layout.transcriptSentence]}>{question.sentence}</Text>
        {!!question.reading && <Text {...languageProps} style={s.muted}>{question.reading}</Text>}
      </View>}
      <View style={layout.question}>
        <Text accessibilityRole="header" aria-level={embedded ? 3 : undefined} style={[s.heading, layout.questionTitle]}>
          {question.prompt ?? 'What does the sentence mean?'}
        </Text>
        <View style={layout.choices}>{question.choices.map((choice, index) => <ListeningChoiceRow key={choice} label={choice} selected={selected === index}
          disabled={checked} correct={checked && index === question.correctIndex}
          onPress={() => setAttempt(previous => ({ ...previous, selected: index }))} />)}</View>
      </View>
      {checked && <View accessibilityLiveRegion="polite" testID="listening-feedback" style={[layout.feedback, isCorrect ? layout.feedbackCorrect : layout.feedbackOther]}>
        <Text nativeID={feedbackId} accessibilityRole="header" aria-level={embedded ? 3 : undefined} style={[s.heading, layout.feedbackTitle]}>
          {feedbackTitle}
        </Text>
        <Text style={s.body}>{answer}</Text>
        {!matchesTranslation && <Text style={s.muted}>{question.meaning}</Text>}
        <Text style={s.muted}>{usedTranscript ? 'You used transcript support for this sentence.' : played
          ? 'Replay and compare the sentence with its meaning.' : embedded
            ? 'Replay the sentence and listen for the answer.' : 'Try listening before answering the next sentence.'}</Text>
      </View>}
      {(!checked || next || canRetry) && <View style={[layout.footer, embedded && layout.embeddedFooter]}>
        {onNext && <Button compact={compact} quiet label="Previous sentence" disabled={!onPrevious}
          onPress={() => { stop(); onPrevious?.(); }}>{compact ? 'Previous' : 'Previous sentence'}</Button>}
        <View style={layout.answerActions}>
          {canRetry && <Button compact={compact} quiet onPress={tryAgain}>Try again</Button>}
          {next && <Button compact={compact} quiet={!checked} primary={checked} label={checked ? undefined : next.skipLabel}
            trailingIcon={checked ? 'arrow-right' : undefined} href={next.href} disabled={next.disabled}
            onPress={() => { stop(); next.onPress(); }}>
            {checked ? next.label : compact && !continuation ? 'Skip' : next.skipLabel}
          </Button>}
          {!checked && <Button compact={compact} primary disabled={selected === null} onPress={checkAnswer}>Check answer</Button>}
        </View>
      </View>}
    </View>
  </View>;
}

export function ListeningChoiceRow({ label, detail, selected, correct = false, disabled = false, leading = 'indicator', onPress }: {
  label: string; detail?: string; selected: boolean; correct?: boolean; disabled?: boolean; leading?: 'indicator' | 'none'; onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected, disabled }}
    aria-pressed={selected} disabled={disabled} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [layout.choice, selected && layout.choiceSelected, correct && layout.choiceSelected,
      disabled && selected && !correct && layout.choiceOther, !disabled && pressed && layout.pressed, focused && layout.focus]}>
    {leading === 'indicator' && <View aria-hidden style={[layout.indicator, (selected || correct) && layout.indicatorSelected]}>
      {correct ? <Icon name="check" size={14} color={colors.onPrimary} /> : selected && <View style={layout.indicatorDot} />}
    </View>}
    <View style={layout.choiceCopy}>
      <Text style={[s.body, layout.choiceText]}>{label}</Text>
      {!!detail && <Text style={s.muted}>{detail}</Text>}
    </View>
    {leading === 'none' && <Icon name={selected ? 'check' : 'chevron'} size={18} color={colors.primary} />}
  </Pressable>;
}

const layout = StyleSheet.create({
  exercise: { padding: 0, gap: 0, minWidth: 0 },
  player: { backgroundColor: colors.dark, borderRadius: 17, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: 20, gap: 18 },
  playerCompact: { padding: 16, gap: 14 },
  embeddedPlayer: { paddingHorizontal: 14, paddingVertical: 10 },
  embeddedPlayerCompact: { paddingHorizontal: 10 },
  progress: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressText: { color: colors.sageTint, textTransform: 'none', letterSpacing: 0, fontSize: 14 },
  progressTrack: { height: 3, flex: 1, backgroundColor: '#3F6259', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: colors.yellow, borderRadius: 3 },
  playerActions: { alignItems: 'center', gap: 2 },
  embeddedPlayerActions: { ...s.row, justifyContent: 'space-between', gap: 4 },
  play: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
    minHeight: 64, minWidth: 178, paddingHorizontal: 18, paddingVertical: 12, gap: 10, borderRadius: 34, backgroundColor: colors.yellow },
  playText: { fontWeight: '700' },
  embeddedPlay: { minHeight: tokens.control.minimumTarget, minWidth: 0, paddingHorizontal: 12, paddingVertical: 6, gap: 7 },
  embeddedPlayText: { fontSize: 16 },
  embeddedPlayTextCompact: { fontSize: 14 },
  transcriptAction: { minHeight: tokens.control.minimumTarget, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 10 },
  embeddedTranscriptAction: { paddingHorizontal: 5 },
  transcriptActionText: { color: colors.onPrimary, fontSize: 14, textDecorationLine: 'underline' },
  answers: { padding: 22, gap: 16, minWidth: 0 },
  answersCompact: { padding: 14, gap: 14 },
  error: { color: colors.danger },
  transcript: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: tokens.radius.md, backgroundColor: colors.sageTint, gap: 3 },
  transcriptSentence: { fontWeight: '600', fontSize: 20, lineHeight: 29 },
  question: { gap: 10 },
  questionTitle: { fontSize: 21, lineHeight: 27 },
  choices: { gap: 7 },
  choice: { minHeight: 49, borderRadius: tokens.radius.input, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card,
    flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 11, gap: 11, minWidth: 0 },
  choiceCopy: { flex: 1, minWidth: 0 },
  choiceText: { fontSize: 16, lineHeight: 23, fontWeight: '500' },
  choiceSelected: { borderColor: colors.primary, backgroundColor: colors.sageTint },
  choiceOther: { borderColor: colors.yellow, backgroundColor: colors.goldTint },
  indicator: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: colors.inputBorder,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  indicatorSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  indicatorDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.onPrimary },
  feedback: { padding: 14, gap: 3, borderRadius: tokens.radius.md },
  feedbackCorrect: { backgroundColor: colors.sageTint },
  feedbackOther: { backgroundColor: colors.goldTint },
  feedbackTitle: { fontSize: 20, lineHeight: 27 },
  footer: { ...s.row, justifyContent: 'space-between', gap: 5 },
  embeddedFooter: { justifyContent: 'flex-end' },
  answerActions: { ...s.row, justifyContent: 'flex-end', gap: 5 },
  focus: { outlineColor: colors.focusRing, outlineWidth: tokens.focus.outlineWidth, outlineStyle: 'solid', outlineOffset: 2 },
  inverseFocus: { outlineColor: colors.onPrimary },
  pressed: { opacity: tokens.opacity.pressed },
});
