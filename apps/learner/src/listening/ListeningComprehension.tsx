import { useId, useLayoutEffect, useMemo, useRef, type ComponentRef } from 'react';
import { matchesLesson, type Lesson } from '@smartlingo/domain';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { AppRoute } from '../app/routes';
import { useNavigation, useVisitState } from '../app/WebNavigation';
import { Button } from '../ui/controls';
import { colors, designTokens as tokens, styles as s } from '../ui/theme';
import { buildListeningQuestions, type ListeningQuestion } from './comprehension';
import { ListeningChoiceRow, ListeningQuestionPlayer } from './ListeningQuestionPlayer';

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
      <Text nativeID={headingId} accessibilityRole="header" aria-level={1} style={[s.title, layout.destinationHeading, compact && s.compactTitle]}>
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
        <Text accessibilityRole="header" aria-level={2} style={[s.heading, layout.lessonTitle]}>{lesson.title}</Text>
        {available.length > 1 && <Button compact quiet label="Change lesson" trailingIcon="chevron-down" expanded={choosing}
          controls={choosing ? pickerId : undefined} onPress={() => choosing ? closeChooser() : navigate({ ...playerRoute, chooser: true })}>
          {compact ? 'Change' : 'Change lesson'}
        </Button>}
      </View>
      {choosing && <LessonPicker id={pickerId} lessons={available} selected={lesson.id} onChoose={choose} compact={compact} />}
      {!choosing && <ListeningQuestionPlayer key={`${visit}:${lesson.revision}:${question.id}`} question={question} revision={lesson.revision}
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
      {visibleLessons.map(lesson => <ListeningChoiceRow key={lesson.id} label={lesson.title} detail={lesson.topic === lesson.title ? undefined : lesson.topic}
        selected={lesson.id === selected} leading="none" onPress={() => onChoose(lesson.id)} />)}
    </ScrollView> : <Text accessibilityLiveRegion="polite" style={s.muted}>No matching lessons.</Text>}
  </View>;
}

const layout = StyleSheet.create({
  page: { alignSelf: 'center', width: '100%', maxWidth: 840, minWidth: 0, gap: 16 },
  pageHeader: { ...s.row, justifyContent: 'space-between', columnGap: 16, rowGap: 0 },
  destinationHeading: { outlineWidth: 0 },
  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 },
  lessonTitle: { flex: 1, minWidth: 0, fontSize: 20, lineHeight: 28, letterSpacing: -0.3 },
  picker: { padding: 12, gap: 8 },
  pickerRows: { padding: 4, gap: 4 },
});
