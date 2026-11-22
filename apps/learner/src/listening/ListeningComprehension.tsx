import { useId, useLayoutEffect, useMemo, useRef, useState, type ComponentRef, type RefObject } from 'react';
import { matchesLesson, type Lesson, type TargetLanguage } from '@smartlingo/domain';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { AppRoute } from '../app/routes';
import { useNavigation, useVisitState } from '../app/WebNavigation';
import { audio } from '../audio';
import { Button } from '../ui/controls';
import { Icon } from '../ui/Icon';
import { colors, designTokens as tokens, styles as s } from '../ui/theme';
import { buildListeningQuestions, type ListeningQuestion } from './comprehension';

type PlayRef = RefObject<ComponentRef<typeof Pressable> | null>;
type ListeningRoute = Extract<AppRoute, { kind: 'listening' }>;

export function ListeningComprehension({ lessons, onBrowse, active = true, headingId }: {
  lessons: Lesson[];
  onBrowse?: () => void;
  active?: boolean;
  headingId?: string;
}) {
  const { route, navigate, backTo, visit } = useNavigation();
  const compact = useWindowDimensions().width < tokens.layout.compactBreakpoint;
  const questions = useMemo(() => buildListeningQuestions(lessons), [lessons]);
  const lessonIds = useMemo(() => new Set(questions.map(question => question.lessonId)), [questions]);
  const available = useMemo(() => lessons.filter(lesson => lessonIds.has(lesson.id)), [lessons, lessonIds]);
  const listeningRoute = route.kind === 'listening' && !route.library ? route : undefined;
  const choosing = listeningRoute?.chooser === true;
  const requestedLesson = available.find(item => item.id === listeningRoute?.lessonId);
  const lesson = requestedLesson ?? available[0];
  const deck = useMemo(() => questions.filter(question => question.lessonId === lesson?.id), [questions, lesson?.id]);
  const requestedIndex = deck.findIndex(question => question.id === listeningRoute?.questionId);
  const position = Math.max(0, requestedIndex);
  const question = deck[position];
  const unavailable = Boolean((listeningRoute?.lessonId && !requestedLesson) || (listeningRoute?.questionId && requestedIndex < 0));
  const pickerId = useId();
  const playRef = useRef<ComponentRef<typeof Pressable>>(null);
  const previousVisit = useRef(visit);

  useLayoutEffect(() => {
    const changed = previousVisit.current !== visit;
    previousVisit.current = visit;
    if (changed && !choosing && active) playRef.current?.focus();
  }, [active, choosing, visit]);

  if (!listeningRoute) return null;

  const playerRoute: ListeningRoute = {
    kind: 'listening',
    language: listeningRoute.language,
    topic: listeningRoute.topic,
    lessonId: listeningRoute.lessonId,
    questionId: listeningRoute.questionId,
  };

  function questionRoute(question: ListeningQuestion): ListeningRoute {
    return { ...playerRoute, lessonId: question.lessonId, questionId: question.id };
  }

  function closeChooser() {
    backTo(playerRoute, candidate => sameDeck(candidate, playerRoute) &&
      candidate.lessonId === playerRoute.lessonId && candidate.questionId === playerRoute.questionId);
  }

  function choose(id: string) {
    if (id === lesson?.id && !unavailable) closeChooser();
    else navigate({ ...playerRoute, lessonId: id, questionId: undefined }, { replace: true });
  }

  function previous() {
    const previousQuestion = deck[position - 1];
    if (!previousQuestion) return;
    backTo(questionRoute(previousQuestion), candidate => {
      if (!sameDeck(candidate, playerRoute)) return false;
      const candidateLesson = candidate.lessonId ?? available[0]?.id;
      const candidateQuestion = candidate.questionId ?? deck[0]?.id;
      return candidateLesson === previousQuestion.lessonId && candidateQuestion === previousQuestion.id;
    });
  }

  return <View testID="listening-comprehension" style={layout.page}>
    <View style={layout.pageHeader}>
      <Text nativeID={headingId} accessibilityRole="header" style={[s.title, layout.destinationHeading, compact && s.compactTitle]}>
        Listening
      </Text>
      {onBrowse && <Button compact quiet label="Browse videos & audio" icon={compact ? undefined : 'headphones'} onPress={onBrowse}>
        {compact ? 'Videos & audio' : 'Browse videos & audio'}
      </Button>}
    </View>
    {unavailable && <View style={s.notice}>
      <Text accessibilityRole="alert" style={s.body}>
        {question ? 'That listening sentence is unavailable. Here is a sentence you can practise instead.' : 'That listening link is unavailable.'}
      </Text>
      {question && <Button compact onPress={() => navigate(questionRoute(question), { replace: true })}>Use this sentence</Button>}
    </View>}
    {lesson && question ? <>
      <View style={layout.lessonRow}>
        <Text style={[s.heading, layout.lessonTitle]}>{lesson.title}</Text>
        {available.length > 1 && <Button compact quiet label="Change lesson" trailingIcon="chevron-down" expanded={choosing}
          controls={choosing ? pickerId : undefined} onPress={() => choosing ? closeChooser() : navigate({ ...playerRoute, chooser: true })}>
          {compact ? 'Change' : 'Change lesson'}
        </Button>}
      </View>
      {choosing && <LessonPicker id={pickerId} lessons={available} selected={lesson.id} onChoose={choose} compact={compact} />}
      {!choosing && <SentenceQuestion key={`${visit}:${lesson.revision}:${question.id}`} question={question} revision={lesson.revision}
        position={position + 1} total={deck.length} active={active} playRef={playRef} compact={compact}
        onPrevious={position > 0 ? previous : undefined}
        onNext={() => navigate(questionRoute(deck[(position + 1) % deck.length]!), { repeat: true })} />}
    </> : <View style={s.notice}>
      <Text style={s.body}>There are no listening questions for these lessons yet.</Text>
      {listeningRoute.topic && <Button compact onPress={() => navigate({ kind: 'listening', language: listeningRoute.language }, { replace: true })}>
        Listen across all topics
      </Button>}
    </View>}
  </View>;
}

function sameDeck(candidate: AppRoute, route: ListeningRoute): candidate is ListeningRoute {
  return candidate.kind === 'listening' && !candidate.library && !candidate.chooser
    && candidate.language === route.language && candidate.topic === route.topic;
}

function LessonPicker({ id, lessons, selected, onChoose, compact }: {
  id: string; lessons: Lesson[]; selected: string; onChoose: (id: string) => void; compact: boolean;
}) {
  const [query, setQuery] = useVisitState('listening-lesson-search', '');
  const visibleLessons = lessons.filter(lesson => matchesLesson(lesson, query));

  return <View nativeID={id} style={[s.card, layout.picker]}>
    <TextInput accessibilityLabel="Search listening lessons" autoFocus={!compact} autoCapitalize="none" autoCorrect={false}
      value={query} onChangeText={setQuery} placeholder="Search by lesson or topic" placeholderTextColor={colors.muted} style={s.input} />
    {visibleLessons.length ? <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{ maxHeight: 310 }}
      contentContainerStyle={layout.pickerRows}>
      {visibleLessons.map(lesson => <ChoiceRow key={lesson.id} label={lesson.title} detail={lesson.topic === lesson.title ? undefined : lesson.topic}
        selected={lesson.id === selected} leading="none" onPress={() => onChoose(lesson.id)} />)}
    </ScrollView> : <Text accessibilityLiveRegion="polite" style={s.muted}>No matching lessons.</Text>}
  </View>;
}

interface Attempt {
  selected: number | null;
  checked: boolean;
  transcriptOverride: boolean | null;
  usedTranscript: boolean;
  played: boolean;
}

const emptyAttempt: Attempt = { selected: null, checked: false, transcriptOverride: null, usedTranscript: false, played: false };

function SentenceQuestion({ question, revision, position, total, active, playRef, compact, onPrevious, onNext }: {
  question: ListeningQuestion; revision: number; position: number; total: number; active: boolean; playRef: PlayRef;
  compact: boolean; onPrevious?: () => void; onNext: () => void;
}) {
  // A revised example or a different set or order of options needs a clean attempt.
  const attemptKey = JSON.stringify(['listening-attempt', question.id, revision, question.sentence, question.reading, question.choices, question.correctIndex]);
  const [attempt, setAttempt] = useVisitState(attemptKey, emptyAttempt);
  const { selected, checked, transcriptOverride, usedTranscript, played } = attempt;
  const transcriptVisible = transcriptOverride ?? checked;
  const [playing, setPlaying] = useState(false);
  const [playFocused, setPlayFocused] = useState(false);
  const [transcriptFocused, setTranscriptFocused] = useState(false);
  const [error, setError] = useState('');
  const request = useRef<symbol | null>(null);
  const focusFeedback = useRef(false);
  const transcriptId = useId();
  const feedbackId = useId();

  useLayoutEffect(() => {
    if (!active) setPlaying(false);
    return () => {
      if (!request.current) return;
      request.current = null;
      audio.stop();
    };
  }, [active]);

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

  const playLabel = playing ? 'Stop audio' : played ? 'Replay sentence' : 'Play sentence';
  const isCorrect = selected === question.correctIndex;
  const languageProps = Platform.OS === 'web' ? { lang: question.language } : { accessibilityLanguage: question.language };

  return <View style={[s.card, layout.exercise]}>
    <View style={[layout.player, compact && layout.playerCompact]}>
      <View style={layout.progress}>
        <Text style={[s.eyebrow, layout.progressText]} accessibilityLiveRegion="polite">Sentence {position} of {total}</Text>
        <View aria-hidden style={layout.progressTrack}><View style={[layout.progressFill, { width: `${position / total * 100}%` }]} /></View>
      </View>
      <View style={layout.playerActions}>
        <Pressable ref={playRef} accessibilityRole="button" accessibilityLabel={playLabel}
          onPress={() => void play()} onFocus={() => setPlayFocused(true)} onBlur={() => setPlayFocused(false)}
          style={({ pressed }) => [layout.play, playFocused && layout.focus, playFocused && layout.inverseFocus, pressed && layout.pressed]}>
          <Icon name={playing ? 'stop' : 'speaker'} size={29} />
          <Text style={[s.buttonText, layout.playText]}>{playLabel}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: transcriptVisible }} aria-expanded={transcriptVisible}
          aria-controls={transcriptVisible ? transcriptId : undefined} onPress={() => setAttempt(previous => ({
            ...previous, transcriptOverride: !transcriptVisible, usedTranscript: previous.usedTranscript || (!transcriptVisible && !previous.checked),
          }))} onFocus={() => setTranscriptFocused(true)} onBlur={() => setTranscriptFocused(false)}
          style={({ pressed }) => [layout.transcriptAction, transcriptFocused && layout.focus,
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
        <Text accessibilityRole="header" style={[s.heading, layout.questionTitle]}>What does the sentence mean?</Text>
        <View style={layout.choices}>{question.choices.map((choice, index) => <ChoiceRow key={choice} label={choice} selected={selected === index}
          disabled={checked} correct={checked && index === question.correctIndex}
          onPress={() => setAttempt(previous => ({ ...previous, selected: index }))} />)}</View>
      </View>
      {checked && <View accessibilityLiveRegion="polite" testID="listening-feedback" style={[layout.feedback, isCorrect ? layout.feedbackCorrect : layout.feedbackOther]}>
        <Text nativeID={feedbackId} accessibilityRole="header" style={[s.heading, layout.feedbackTitle]}>
          {isCorrect ? 'That’s the meaning.' : 'Here’s the meaning.'}
        </Text>
        <Text style={s.body}>{question.meaning}</Text>
        <Text style={s.muted}>{usedTranscript ? 'You used transcript support for this sentence.' : played
          ? 'Replay and compare the sentence with its meaning.' : 'Try listening before answering the next sentence.'}</Text>
      </View>}
      <View style={layout.footer}>
        <Button compact={compact} quiet label="Previous sentence" disabled={!onPrevious}
          onPress={() => { stop(); onPrevious?.(); }}>{compact ? 'Previous' : 'Previous sentence'}</Button>
        <View style={layout.answerActions}>
          {!checked && <Button compact={compact} quiet label="Skip sentence" onPress={() => { stop(); onNext(); }}>{compact ? 'Skip' : 'Skip sentence'}</Button>}
          {checked
            ? <Button compact={compact} primary trailingIcon="arrow-right" onPress={() => { stop(); onNext(); }}>Next sentence</Button>
            : <Button compact={compact} primary disabled={selected === null} onPress={() => {
              stop();
              focusFeedback.current = true;
              setAttempt(previous => ({ ...previous, checked: true }));
            }}>Check answer</Button>}
        </View>
      </View>
    </View>
  </View>;
}

function ChoiceRow({ label, detail, selected, correct = false, disabled = false, leading = 'indicator', onPress }: {
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
  page: { alignSelf: 'center', width: '100%', maxWidth: 760, minWidth: 0, gap: 12 },
  pageHeader: { ...s.row, justifyContent: 'space-between', columnGap: 16, rowGap: 0 },
  destinationHeading: { outlineWidth: 0 },
  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 },
  lessonTitle: { flex: 1, minWidth: 0, fontSize: 20, lineHeight: 26, letterSpacing: -0.3 },
  exercise: { padding: 0, gap: 0, minWidth: 0 },
  player: { backgroundColor: colors.dark, borderRadius: 17, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: 20, gap: 18 },
  playerCompact: { padding: 16, gap: 14 },
  progress: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressText: { color: colors.sageTint, textTransform: 'none', letterSpacing: 0, fontSize: 14 },
  progressTrack: { height: 3, flex: 1, backgroundColor: '#3F6259', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: colors.yellow, borderRadius: 3 },
  playerActions: { alignItems: 'center', gap: 2 },
  play: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
    minHeight: 64, minWidth: 178, paddingHorizontal: 18, paddingVertical: 12, gap: 10, borderRadius: 34, backgroundColor: colors.yellow },
  playText: { fontWeight: '700' },
  transcriptAction: { minHeight: tokens.control.minimumTarget, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 10 },
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
  answerActions: { ...s.row, justifyContent: 'flex-end', gap: 5 },
  picker: { padding: 12, gap: 9 },
  pickerRows: { padding: 4, gap: 6 },
  focus: { outlineColor: colors.focusRing, outlineWidth: tokens.focus.outlineWidth, outlineStyle: 'solid', outlineOffset: 2 },
  inverseFocus: { outlineColor: colors.onPrimary },
  pressed: { opacity: tokens.opacity.pressed },
});
