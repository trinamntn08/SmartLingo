import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { lessonProgress, type LearningEvent, type Lesson } from '@smartlingo/domain';
import { Button } from './controls';
import { colors, designTokens as tokens, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { LessonConversation, LessonWords } from './LessonStudy';
import { PictureActivity, SentenceActivity } from './LessonPractice';
import { useNavigation, useVisitState } from '../app/WebNavigation';
import { lessonStages, routeHref, topicRouteKey, type LessonStage } from '../app/routes';

function resumeStage(wordsStudied: boolean, progress: ReturnType<typeof lessonProgress>): LessonStage {
  if (progress.completed) return 'sentence';
  if (!wordsStudied) return 'vocabulary';
  return progress.pictureDone ? 'sentence' : 'dialogue';
}

const focusStageKey = 'lesson.focus-stage';

interface LessonSequence {
  position: number;
  total: number;
  previous?: Lesson;
  next?: Lesson;
  open: (lesson: Lesson) => void;
}

export function LessonScreen({ lesson, model, onExit, studyDayHref, sequence, routed = false }: {
  lesson: Lesson; model: LearningModel; onExit: () => void; studyDayHref?: string; sequence?: LessonSequence; routed?: boolean;
}) {
  const { route, navigate, read } = useNavigation();
  const [focusRoutedStage, setFocusRoutedStage] = useVisitState<LessonStage | null>(focusStageKey, null);
  const progress = lessonProgress(lesson, model.events);
  const studiedWords = lesson.vocabulary.filter(entry => progress.viewedIds.has(entry.id)).length;
  const wordsStudied = studiedWords === lesson.vocabulary.length;
  const recordedItems = studiedWords + Number(progress.pictureDone) + Number(progress.sentenceDone);
  const resume = resumeStage(wordsStudied, progress);
  const [localStage, setLocalStage] = useState(resume);
  const [returnAfterCompletion, setReturnAfterCompletion] = useState(false);
  const lessonRoute = routed && route.kind === 'lesson' && route.lessonId === lesson.id && route.language === lesson.language ? route : undefined;
  const stage = lessonRoute ? lessonRoute.stage ?? resume : localStage;
  const titleId = useId();
  const headingId = useId();
  const focusLocalStage = useRef<LessonStage | null>(null);
  const restoringScroll = useRef(Number(read('learner.scroll') ?? 0) > 0);
  const compact = useWindowDimensions().width < tokens.layout.compactBreakpoint;
  const meaningMatch = lesson.pictureActivity.mode === 'meaning';
  const { heading } = stageLabels(stage, meaningMatch);
  const canComplete = wordsStudied && progress.pictureDone && !progress.completed;
  const exitBlocked = model.busy || !!model.saveError;
  const browseOnly = !!model.loadError;

  useEffect(() => {
    if (lessonRoute && !lessonRoute.stage && !model.loading) navigate({ ...lessonRoute, stage }, { replace: true });
  }, [lessonRoute, model.loading, navigate, stage]);

  useEffect(() => {
    if (!returnAfterCompletion || exitBlocked) return;
    setReturnAfterCompletion(false);
    onExit();
  }, [exitBlocked, onExit, returnAfterCompletion]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    // The parent restores its scroll in a layout effect. Focus only after an
    // explicit step action, without scrolling revisited history entries.
    if (lessonRoute) {
      if (focusRoutedStage !== stage) return;
      setFocusRoutedStage(null);
    } else {
      if (focusLocalStage.current !== stage) return;
      focusLocalStage.current = null;
    }
    const headingElement = document.getElementById(headingId);
    if (!headingElement) return;
    headingElement.tabIndex = -1;
    headingElement.focus({ preventScroll: true });
    headingElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [headingId, stage, lessonRoute, focusRoutedStage, setFocusRoutedStage]);

  useLayoutEffect(() => {
    if (!routed || Platform.OS !== 'web' || restoringScroll.current) return;
    const title = document.getElementById(titleId);
    if (!title) return;
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
  }, [routed, titleId]);

  function setStage(next: LessonStage, afterSave = false) {
    if (next === stage) return;
    if (lessonRoute) navigate({ ...lessonRoute, stage: next }, { afterSave, snapshot: { [focusStageKey]: next } });
    else {
      focusLocalStage.current = next;
      setLocalStage(next);
    }
  }

  const stageHref = (next: LessonStage) => lessonRoute ? routeHref({ ...lessonRoute, stage: next }) : undefined;
  const topicHref = lessonRoute ? routeHref({ kind: 'topics', language: lessonRoute.language, topic: topicRouteKey(lesson.topic) }) : undefined;
  const exitHref = studyDayHref ?? topicHref;
  const returnLabel = studyDayHref ? 'Back to guided lesson' : undefined;

  function lessonLink(target: Lesson | undefined) {
    if (!sequence || !target) return undefined;
    const href = routeHref({ kind: 'lesson', language: target.language === 'ja-JP' ? 'ja-JP' : 'fr-FR', lessonId: target.id });
    return { title: target.subtitle, href, onOpen: () => sequence.open(target) };
  }

  const previousLesson = lessonLink(sequence?.previous);
  const nextLesson = progress.completed ? lessonLink(sequence?.next) : undefined;

  function entry(activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints: number): LearningEvent {
    return { id: crypto.randomUUID(), lessonId: lesson.id, revision: lesson.revision, itemId, activity, result, hints,
      occurredAt: new Date().toISOString(), ...(activity === 'completion' ? { automaticCompletion: true } : {}) };
  }

  function record(activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints = 0, after?: () => void) {
    const attempt = entry(activity, itemId, result, hints);
    if (activity === 'sentence' && result === 'correct' && canComplete) {
      model.recordMany([attempt, entry('completion', lesson.id, 'completed', 0)], after);
    } else {
      model.record(attempt, after);
    }
  }

  function reviewVocabulary() {
    if (browseOnly || wordsStudied) setStage('dialogue');
    else record('vocabulary', lesson.id, 'viewed', 0, () => setStage('dialogue', true));
  }

  const reviewStage = progress.completed || !wordsStudied ? 'vocabulary' : 'picture';
  const reviewLabel = progress.completed ? 'Revisit the words' : !wordsStudied ? 'Study the words' : meaningMatch ? 'Match the meanings' : 'Match the picture';

  return <View style={layout.page}>
    <View style={[s.row, layout.breadcrumb]}>
      <Button compact quiet icon="arrow-left" href={exitHref} disabled={exitBlocked} onPress={onExit}>{returnLabel ?? 'All lessons'}</Button>
      <Text style={[s.muted, layout.meta]}>{lesson.level} · {lesson.topic} · {lesson.status === 'draft' ? 'Draft' : 'Published'}</Text>
    </View>
    <View style={[s.card, layout.intro, compact && layout.compactIntro]}>
      {sequence && <View style={[s.row, { justifyContent: 'space-between', gap: 8 }]}>
        <Text style={s.eyebrow}>Lesson {sequence.position} of {sequence.total}</Text>
        {previousLesson && <Button compact quiet icon="arrow-left" label={`Previous lesson: ${previousLesson.title}`}
          href={previousLesson.href} onPress={previousLesson.onOpen} disabled={exitBlocked}>Previous lesson</Button>}
      </View>}
      <Text nativeID={titleId} accessibilityRole="header" style={[s.title, compact && s.compactTitle]}>{lesson.subtitle}</Text>
      <Text style={[s.body, layout.outcome]}>{lesson.outcome}</Text>
      <LessonProgress stage={stage} compact={compact} meaningMatch={meaningMatch}
        recorded={browseOnly ? undefined : recordedItems} total={lesson.vocabulary.length + 2} />
    </View>
    <View testID="lesson-stage" style={layout.stage}>
      <Text key={stage} nativeID={headingId} testID="lesson-stage-heading" accessibilityRole="header"
        {...(Platform.OS === 'web' ? { 'aria-level': 2 } : {})} style={s.heading}>{heading}</Text>
      {stage === 'vocabulary' && <>
        <LessonWords lesson={lesson} model={model} compact={compact} />
        <WordsAction disabled={model.blocked && !browseOnly} onNext={reviewVocabulary} />
      </>}
      {stage === 'dialogue' && <>
        <LessonConversation lesson={lesson} />
        <View style={layout.actions}>
          <Button primary trailingIcon="arrow-right" href={stageHref('picture')} disabled={exitBlocked} onPress={() => setStage('picture')}>
            {meaningMatch ? 'Try meaning practice' : 'Try picture practice'}
          </Button>
        </View>
      </>}
      {stage === 'picture' && <PictureActivity lesson={lesson} routed={!!lessonRoute} disabled={model.blocked} browseOnly={browseOnly}
        done={progress.pictureDone} record={record} nextHref={stageHref('sentence')} onNext={() => setStage('sentence')} />}
      {stage === 'sentence' && <SentenceActivity lesson={lesson} routed={!!lessonRoute} disabled={model.blocked} browseOnly={browseOnly}
        done={progress.sentenceDone || progress.completed} completed={progress.completed} canComplete={canComplete && progress.sentenceDone}
        record={record} nextHref={exitHref} onNext={onExit} returnLabel={returnLabel} nextLesson={nextLesson}
        onComplete={() => record('completion', lesson.id, 'completed', 0, () => setReturnAfterCompletion(true))}
        reviewLabel={reviewLabel} onReview={() => setStage(reviewStage)} />}
    </View>
  </View>;
}

function WordsAction({ disabled, onNext }: { disabled: boolean; onNext: () => void }) {
  const button = <Button primary trailingIcon="arrow-right" disabled={disabled} onPress={onNext}>Continue to dialogue</Button>;
  if (Platform.OS !== 'web') return <View style={layout.actions}>{button}</View>;
  return <div style={{ position: 'sticky', bottom: 0, zIndex: 1, display: 'flex', justifyContent: 'flex-end',
    paddingBlock: 8, backgroundColor: colors.paper, borderTop: '1px solid ' + colors.line }}>{button}</div>;
}

function stageLabels(stage: LessonStage, meaningMatch: boolean) {
  switch (stage) {
    case 'vocabulary': return { label: 'Study words', short: 'Words', heading: 'Study words' };
    case 'dialogue': return { label: 'Conversation', short: 'Talk', heading: 'Read a conversation' };
    case 'picture': return { label: meaningMatch ? 'Match meanings' : 'Match a picture', short: 'Match', heading: meaningMatch ? 'Match the meaning' : 'Match a picture' };
    case 'sentence': return { label: 'Build a sentence', short: 'Build', heading: 'Build a sentence' };
  }
}

function LessonProgress({ stage, compact, meaningMatch, recorded, total }: {
  stage: LessonStage; compact: boolean; meaningMatch: boolean; recorded?: number; total: number;
}) {
  const current = lessonStages.indexOf(stage);
  return <View style={layout.progress}>
    <View style={layout.progressLabels}>
      <Text style={layout.stepCount}>Step {current + 1} of {lessonStages.length}</Text>
      {recorded !== undefined && <Text style={layout.recorded}>{recorded} of {total} study items recorded</Text>}
    </View>
    {recorded !== undefined && <View accessibilityRole="progressbar" accessibilityLabel="Lesson study progress"
      aria-valuemin={0} aria-valuemax={total} aria-valuenow={recorded} style={s.progressTrack}>
      <View style={[s.progressFill, { width: `${recorded / total * 100}%` }]} />
    </View>}
    <View accessibilityLabel="Lesson steps in order" style={layout.steps}>
      {lessonStages.map((step, index) => {
        const { label, short } = stageLabels(step, meaningMatch);
        const active = step === stage;
        return <View key={step} testID={'lesson-step-' + step} aria-current={active ? 'step' : undefined}
          accessibilityLabel={label + ', step ' + (index + 1) + ' of ' + lessonStages.length}
          style={[layout.segment, active && layout.activeSegment]}>
          <Text style={[s.badgeText, layout.stepLabel, active && layout.activeLabel]}>{compact ? short : label}</Text>
        </View>;
      })}
    </View>
  </View>;
}

const layout = StyleSheet.create({
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', minWidth: 0, gap: 16 },
  breadcrumb: { gap: 8 },
  meta: { flexShrink: 1, minWidth: 0 },
  intro: { gap: 8 },
  compactIntro: { padding: 14 },
  outcome: { color: colors.muted, maxWidth: 690 },
  stage: { minWidth: 0, gap: 14 },
  actions: { alignItems: 'flex-end' },
  progress: { gap: 8, marginTop: 4, paddingTop: 12, borderTopWidth: 1, borderColor: colors.line },
  progressLabels: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: 12, rowGap: 2 },
  stepCount: { ...tokens.typography.smallLabel, color: colors.ink },
  recorded: { ...tokens.typography.caption, color: colors.muted },
  steps: { flexDirection: 'row', gap: 5, marginTop: 2 },
  segment: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, paddingVertical: 9,
    borderRadius: 8, borderWidth: 1, borderColor: 'transparent', backgroundColor: colors.sand },
  activeSegment: { backgroundColor: colors.goldTint, borderColor: colors.yellow },
  stepLabel: { textAlign: 'center', color: colors.muted },
  activeLabel: { color: colors.ink, fontWeight: '700' },
});
