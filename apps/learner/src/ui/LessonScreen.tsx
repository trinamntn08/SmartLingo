import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { completedJapanesePracticeIds, lessonProgress, type JapanesePracticeResult, type JapanesePracticeTask, type LearningEvent, type Lesson } from '@smartlingo/domain';
import { Button } from './controls';
import { colors, designTokens as tokens, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { LessonConversation, LessonWords } from './LessonStudy';
import { PictureActivity, SentenceActivity } from './LessonPractice';
import { ListeningQuestionPlayer } from '../listening/ListeningQuestionPlayer';
import { buildLessonListeningQuestion } from '../listening/lessonQuestions';
import type { ListeningQuestion } from '../listening/comprehension';
import type { ContextPhoto } from './contextPhotos';
import { routePress } from './routePress';
import { useNavigation, useVisitState } from '../app/WebNavigation';
import { JapaneseLessonPractice } from '../japanese/JapaneseLessonPractice';
import { lessonStages, routeHref, topicRouteKey, type LessonStage } from '../app/routes';

function resumeStage(wordsStudied: boolean, progress: ReturnType<typeof lessonProgress>): LessonStage {
  return progress.completed || (wordsStudied && progress.pictureDone) ? 'sentence' : 'dialogue';
}

const focusStageKey = 'lesson.focus-stage';

interface LessonSequence {
  position: number;
  total: number;
  previous?: Lesson;
  next?: Lesson;
  open: (lesson: Lesson) => void;
}

interface LessonLink {
  title: string;
  href: string;
  onOpen: () => void;
}

interface CourseLessonSession {
  stage: LessonStage;
  progress: { wordsStudied: boolean; pictureDone: boolean; sentenceDone: boolean; completed: boolean };
  exitHref: string;
  disabled: boolean;
  browseOnly: boolean;
  stageHref: (step: LessonStage) => string;
  changeStage: (step: LessonStage, snapshot: Record<string, unknown>) => void;
  studyDialogue: (snapshot: Record<string, unknown>) => void;
  studyWords: (next: 'listening' | 'picture', snapshot: Record<string, unknown>) => void;
  record: (activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints: number, after?: () => void) => void;
  nextLesson?: LessonLink;
  dialoguePhoto?: ContextPhoto;
  listeningQuestion?: ListeningQuestion;
  practiceCompletedIds?: readonly string[];
  onPracticeResult?: (task: JapanesePracticeTask, result: JapanesePracticeResult, assisted: boolean) => void;
}

export function LessonScreen({ lesson, model, onExit, studyDayHref, sequence, routed = false, courseSession, timeEstimate, extraPractice }: {
  lesson: Lesson; model: LearningModel; onExit: () => void; studyDayHref?: string; sequence?: LessonSequence; routed?: boolean;
  courseSession?: CourseLessonSession;
  timeEstimate?: string;
  extraPractice?: ReactNode;
}) {
  const { route, navigate, read } = useNavigation();
  const [focusRoutedStage, setFocusRoutedStage] = useVisitState<LessonStage | null>(focusStageKey, null);
  const topicProgress = lessonProgress(lesson, model.events);
  const progress = courseSession?.progress ?? topicProgress;
  const studiedWords = courseSession ? (courseSession.progress.wordsStudied ? lesson.vocabulary.length : 0)
    : lesson.vocabulary.filter(entry => topicProgress.viewedIds.has(entry.id)).length;
  const wordsStudied = studiedWords === lesson.vocabulary.length;
  const recordedItems = studiedWords + Number(progress.pictureDone) + Number(progress.sentenceDone);
  const resume = resumeStage(wordsStudied, topicProgress);
  const [localStage, setLocalStage] = useState(resume);
  const [returnAfterCompletion, setReturnAfterCompletion] = useState(false);
  const lessonRoute = routed && route.kind === 'lesson' && route.lessonId === lesson.id && route.language === lesson.language ? route : undefined;
  const stage = courseSession?.stage ?? (lessonRoute ? lessonRoute.stage ?? resume : localStage);
  const usesVisitState = !!lessonRoute || !!courseSession;
  const titleId = useId();
  const headingId = useId();
  const focusLocalStage = useRef<LessonStage | null>(null);
  const restoringScroll = useRef(Number(read('learner.scroll') ?? 0) > 0);
  const compact = useWindowDimensions().width < tokens.layout.compactBreakpoint;
  const phone = compact && usesVisitState;
  const lessonStatus = lesson.status === 'draft' ? 'Draft' : 'Published';
  const lessonMeta = compact ? `${lesson.level} · ${lessonStatus}` : `${lesson.level} · ${lesson.topic} · ${lessonStatus}`;
  const meaningMatch = lesson.pictureActivity.mode === 'meaning';
  const courseListeningQuestion = courseSession?.listeningQuestion;
  const listeningQuestion = useMemo(() => courseListeningQuestion ?? buildLessonListeningQuestion(lesson), [lesson, courseListeningQuestion]);
  const { heading } = stageLabels(stage, meaningMatch);
  const practiceLabel = meaningMatch ? 'Try meaning practice' : 'Try picture practice';
  const canComplete = wordsStudied && progress.pictureDone && !progress.completed;
  const skipStudiedPhrases = wordsStudied && !courseSession;
  const exitBlocked = model.busy || !!model.saveError || !!courseSession?.disabled;
  const browseOnly = courseSession?.browseOnly ?? !!model.loadError;
  const exerciseBlocked = courseSession ? exitBlocked || browseOnly : model.blocked;
  const returnFocus = routed || !!courseSession;

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
    if (usesVisitState) {
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
  }, [headingId, stage, usesVisitState, focusRoutedStage, setFocusRoutedStage]);

  useLayoutEffect(() => {
    if (!returnFocus || Platform.OS !== 'web' || restoringScroll.current) return;
    const title = document.getElementById(titleId);
    if (!title) return;
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
  }, [returnFocus, titleId]);

  function setStage(next: LessonStage, afterSave = false) {
    if (next === stage) return;
    const snapshot = { [focusStageKey]: next };
    if (courseSession) courseSession.changeStage(next, snapshot);
    else if (lessonRoute) navigate({ ...lessonRoute, stage: next }, { afterSave, snapshot });
    else {
      focusLocalStage.current = next;
      setLocalStage(next);
    }
  }

  const stageHref = (next: LessonStage) => courseSession?.stageHref(next) ?? (lessonRoute ? routeHref({ ...lessonRoute, stage: next }) : undefined);
  const topicHref = lessonRoute ? routeHref({ kind: 'topics', language: lessonRoute.language, topic: topicRouteKey(lesson.topic) }) : undefined;
  const exitHref = courseSession?.exitHref ?? studyDayHref ?? topicHref;
  const returnLabel = courseSession ? 'Exit lesson' : studyDayHref ? 'Back to guided lesson' : undefined;

  function lessonLink(target: Lesson | undefined) {
    if (!sequence || !target) return undefined;
    const href = routeHref({ kind: 'lesson', language: target.language === 'ja-JP' ? 'ja-JP' : 'fr-FR', lessonId: target.id });
    return { title: target.subtitle, href, onOpen: () => sequence.open(target) };
  }

  const previousLesson = lessonLink(sequence?.previous);
  const nextLesson = progress.completed ? courseSession?.nextLesson ?? lessonLink(sequence?.next) : undefined;

  function entry(activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints: number): LearningEvent {
    return { id: crypto.randomUUID(), lessonId: lesson.id, revision: lesson.revision, itemId, activity, result, hints,
      occurredAt: new Date().toISOString(), ...(activity === 'completion' ? { automaticCompletion: true } : {}) };
  }

  function record(activity: LearningEvent['activity'], itemId: string, result: LearningEvent['result'], hints = 0, after?: () => void) {
    if (courseSession) {
      courseSession.record(activity, itemId, result, hints, after);
      return;
    }
    const attempt = entry(activity, itemId, result, hints);
    if (activity === 'sentence' && result === 'correct' && canComplete) {
      model.recordMany([attempt, entry('completion', lesson.id, 'completed', 0)], after);
    } else {
      model.record(attempt, after);
    }
  }

  function reviewVocabulary(next: 'listening' | 'picture') {
    if (browseOnly || wordsStudied) setStage(next);
    else if (courseSession) courseSession.studyWords(next, { [focusStageKey]: next });
    else record('vocabulary', lesson.id, 'viewed', 0, () => setStage(next, true));
  }

  function recordPractice(task: JapanesePracticeTask, result: JapanesePracticeResult, assisted: boolean) {
    if (courseSession) {
      courseSession.onPracticeResult?.(task, result, assisted);
    } else {
      record('practice', task.id, result === 'self-reviewed' ? 'viewed' : result, Number(assisted));
    }
  }

  const practical = lesson.japanesePractice;
  const completedPracticeIds = courseSession?.practiceCompletedIds ?? completedJapanesePracticeIds(lesson, model.events);
  const reviewStage = progress.completed || !wordsStudied ? 'vocabulary' : 'picture';
  const reviewLabel = progress.completed ? 'Revisit the words' : !wordsStudied ? 'Review key phrases' : meaningMatch ? 'Match the meanings' : 'Match the picture';

  return <View style={[layout.page, compact && layout.compactPage]}>
    {!courseSession && <View style={[s.row, layout.breadcrumb]}>
      <Button compact quiet icon="arrow-left" iconOnly={phone} label={returnLabel ?? 'All lessons'}
        href={exitHref} disabled={exitBlocked} onPress={onExit}>{returnLabel ?? 'All lessons'}</Button>
      {!phone && <Text style={[s.muted, layout.meta]}>{lessonMeta}</Text>}
    </View>}
    <View style={layout.intro}>
      {sequence && <View style={[s.row, { justifyContent: 'space-between', gap: 8 }]}>
        <Text style={phone ? layout.stepCount : s.eyebrow}>Lesson {sequence.position} of {sequence.total}</Text>
        {previousLesson && <Button compact quiet icon="arrow-left" label={`Previous lesson: ${previousLesson.title}`}
          href={previousLesson.href} onPress={previousLesson.onOpen} disabled={exitBlocked}>{phone ? 'Previous' : 'Previous lesson'}</Button>}
      </View>}
      {courseSession && !compact && <Text style={s.eyebrow}>{lesson.level === 'foundation' ? 'Foundations' : lesson.level}</Text>}
      <Text nativeID={titleId} accessibilityRole="header"
        style={[s.title, compact && s.compactTitle, phone && layout.phoneTitle]}>{lesson.subtitle}</Text>
      {stage === 'dialogue' && <Text style={[s.body, layout.outcome, compact && s.muted, phone && layout.phoneOutcome]}>{lesson.outcome}</Text>}
      {timeEstimate && !phone && <Text style={[s.muted, layout.meta]}>{timeEstimate}</Text>}
      <LessonProgress stage={stage} compact={compact} phone={phone} meaningMatch={meaningMatch}
        recorded={browseOnly || phone ? undefined : recordedItems} total={lesson.vocabulary.length + 2}
        disabled={exitBlocked} hrefForStep={stageHref} onStep={setStage} />
    </View>
    <View testID="lesson-stage" style={[layout.stage, phone && layout.phoneStage]}>
      <Text key={stage} nativeID={headingId} testID="lesson-stage-heading" accessibilityRole="header"
        {...(Platform.OS === 'web' ? { 'aria-level': 2 } : {})} style={[s.heading, layout.stageHeading, phone && tokens.typography.compactHeading]}>{heading}</Text>
      {stage === 'dialogue' && <>
        {practical?.prerequisites && <Text style={s.muted}>{practical.prerequisites}</Text>}
        <LessonConversation lesson={lesson} photo={courseSession?.dialoguePhoto} phone={phone} />
        <View style={phone ? layout.phoneActions : [s.row, layout.actions]}>
          {skipStudiedPhrases
          ? <Button primary
            href={stageHref(listeningQuestion ? 'listening' : 'picture')} disabled={exitBlocked}
            onPress={() => setStage(listeningQuestion ? 'listening' : 'picture')}>{listeningQuestion ? 'Start listening' : practiceLabel}</Button>
          : <Button primary label="Continue to key phrases"
            href={stageHref('vocabulary')} disabled={exitBlocked}
            onPress={() => courseSession ? courseSession.studyDialogue({ [focusStageKey]: 'vocabulary' }) : setStage('vocabulary')}>
            {phone ? 'Continue' : 'Continue to key phrases'}
          </Button>}
        </View>
      </>}
      {stage === 'vocabulary' && <LessonWords lesson={lesson} model={model} guided={!!courseSession}>
        <View style={phone ? layout.phoneActions : [s.row, layout.actions]}>
          {listeningQuestion
          ? <Button primary label="Continue to listening"
            disabled={exerciseBlocked && !browseOnly} onPress={() => reviewVocabulary('listening')}>
            {phone ? 'Continue' : 'Continue to listening'}
          </Button>
          : <Button primary disabled={exerciseBlocked && !browseOnly}
            onPress={() => reviewVocabulary('picture')}>{practiceLabel}</Button>}
          {listeningQuestion && <Button quiet label={practiceLabel} disabled={exerciseBlocked && !browseOnly}
            onPress={() => reviewVocabulary('picture')}>{phone ? (meaningMatch ? 'Meaning practice' : 'Picture practice') : practiceLabel}</Button>}
        </View>
      </LessonWords>}
      {stage === 'listening' && (listeningQuestion
        ? <ListeningQuestionPlayer question={listeningQuestion} revision={lesson.revision} compact={compact}
          continuation={{ label: 'Continue to matching', skipLabel: 'Skip listening', href: stageHref('picture'),
            onPress: () => setStage('picture'), disabled: exitBlocked }} />
        : <View style={s.notice}>
          <Text style={s.body}>Listening practice is unavailable for this lesson.</Text>
          <Button primary href={stageHref('picture')} disabled={exitBlocked} onPress={() => setStage('picture')}>Continue to matching</Button>
        </View>)}
      {stage === 'picture' && <PictureActivity lesson={lesson} routed={usesVisitState} disabled={exerciseBlocked} browseOnly={browseOnly} phone={phone}
        done={progress.pictureDone} record={record} nextHref={stageHref('sentence')} onNext={() => setStage('sentence')} />}
      {stage === 'sentence' && <SentenceActivity lesson={lesson} routed={usesVisitState} disabled={exerciseBlocked} browseOnly={browseOnly} phone={phone}
        done={progress.sentenceDone || (!courseSession && progress.completed)} completed={progress.completed} canComplete={canComplete && progress.sentenceDone}
        record={record} nextHref={exitHref} onNext={onExit} returnLabel={returnLabel} nextLesson={nextLesson} extraPractice={practical
          ? <JapaneseLessonPractice practice={practical} completedIds={completedPracticeIds}
            disabled={exerciseBlocked} browseOnly={browseOnly} onResult={recordPractice} />
          : extraPractice}
        onComplete={() => record('completion', lesson.id, 'completed', 0, () => setReturnAfterCompletion(true))}
        reviewLabel={reviewLabel} onReview={() => setStage(reviewStage)} />}
    </View>
  </View>;
}

function stageLabels(stage: LessonStage, meaningMatch: boolean) {
  switch (stage) {
    case 'vocabulary': return { label: 'Key phrases', short: 'Phrases', heading: 'Key phrases' };
    case 'dialogue': return { label: 'Read dialogue', short: 'Read', heading: 'Read a conversation' };
    case 'listening': return { label: 'Listen', short: 'Listen', heading: 'Listening practice' };
    case 'picture': return { label: meaningMatch ? 'Match meanings' : 'Match a picture', short: 'Match', heading: meaningMatch ? 'Match the meaning' : 'Match a picture' };
    case 'sentence': return { label: 'Build a sentence', short: 'Build', heading: 'Build a sentence' };
  }
}

function LessonProgress({ stage, compact, phone, meaningMatch, recorded, total, disabled, hrefForStep, onStep }: {
  stage: LessonStage; compact: boolean; phone: boolean; meaningMatch: boolean; recorded?: number; total: number;
  disabled: boolean; hrefForStep: (step: LessonStage) => string | undefined; onStep: (step: LessonStage) => void;
}) {
  const current = lessonStages.indexOf(stage);
  return <View style={[layout.progress, compact && layout.compactProgress, phone && layout.phoneProgress]}>
    <View style={layout.progressLabels}>
      <Text style={layout.stepCount}>Step {current + 1} of {lessonStages.length}</Text>
      {recorded !== undefined && <Text style={layout.recorded}>
        {compact ? `${recorded}/${total} items recorded` : `${recorded} of ${total} study items recorded`}
      </Text>}
    </View>
    {recorded !== undefined && <View accessibilityRole="progressbar" accessibilityLabel="Lesson study progress"
      aria-valuemin={0} aria-valuemax={total} aria-valuenow={recorded} style={[s.progressTrack, layout.progressTrack]}>
      <View style={[s.progressFill, { width: `${recorded / total * 100}%` }]} />
    </View>}
    <View role="navigation" accessibilityLabel="Lesson steps" style={[layout.steps, phone && layout.phoneSteps]}>
      {lessonStages.map((step, index) => {
        const { label, short } = stageLabels(step, meaningMatch);
        return <LessonStep key={step} step={step} number={index + 1} label={label} text={compact ? short : label}
          current={step === stage} compact={compact} phone={phone} disabled={disabled} href={hrefForStep(step)} onPress={() => onStep(step)} />;
      })}
    </View>
  </View>;
}

function LessonStep({ step, number, label, text, current, compact, phone, disabled, href, onPress }: {
  step: LessonStage; number: number; label: string; text: string; current: boolean;
  compact: boolean; phone: boolean; disabled: boolean; href?: string; onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return <Pressable testID={'lesson-step-' + step} accessibilityRole={href ? 'link' : 'button'} accessibilityLabel={label}
    aria-current={current ? 'step' : undefined} disabled={disabled} accessibilityState={{ disabled }}
    {...routePress(disabled ? undefined : href, onPress)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => [layout.segment, compact && layout.compactSegment, phone && layout.phoneSegment,
      hovered && !disabled && layout.hoverSegment, current && layout.activeSegment, focused && layout.focusSegment,
      pressed && layout.pressedSegment, disabled && layout.disabledSegment]}>
    {phone ? <Text aria-hidden style={[layout.phoneNumber, current && layout.activeLabel]}>{number}</Text> : <>
      <View aria-hidden style={[layout.stepNumber, current && layout.activeNumber]}>
        <Text style={[layout.numberText, current && layout.activeNumberText]}>{number}</Text>
      </View>
      <Text style={[layout.stepLabel, compact && layout.compactLabel, current && layout.activeLabel]}>{text}</Text>
    </>}
  </Pressable>;
}

const layout = StyleSheet.create({
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', minWidth: 0, gap: 16 },
  compactPage: { gap: 12 },
  breadcrumb: { gap: 8 },
  meta: { flexShrink: 1, minWidth: 0 },
  intro: { minWidth: 0, gap: 8 },
  phoneTitle: { fontSize: 28, lineHeight: 34, outlineWidth: 0 },
  phoneOutcome: { fontSize: 16, lineHeight: 23 },
  outcome: { color: colors.muted, maxWidth: 690 },
  stage: { minWidth: 0, gap: 14 },
  phoneStage: { gap: 10 },
  stageHeading: { alignSelf: 'flex-start', outlineColor: colors.focusRing, outlineOffset: 2 },
  actions: { gap: 8 },
  phoneActions: { gap: 4 },
  progress: { gap: 8, marginTop: 4, paddingTop: 12, borderTopWidth: 1, borderColor: colors.line },
  compactProgress: { gap: 6, marginTop: 2, paddingTop: 8 },
  phoneProgress: { marginTop: 0, paddingTop: 4, borderTopWidth: 0 },
  progressLabels: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: 12, rowGap: 2 },
  stepCount: { ...tokens.typography.smallLabel, color: colors.ink },
  recorded: { ...tokens.typography.caption, color: colors.muted },
  progressTrack: { height: 4 },
  steps: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: tokens.radius.md, backgroundColor: colors.paper },
  phoneSteps: { flexWrap: 'wrap', padding: 0 },
  segment: { flex: 1, minWidth: 0, minHeight: tokens.control.minimumTarget, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, paddingHorizontal: 6, paddingVertical: 6,
    borderRadius: tokens.radius.sm, borderWidth: 1, borderColor: 'transparent' },
  compactSegment: { flexDirection: 'column', gap: 3, paddingHorizontal: 2, paddingVertical: 4 },
  phoneSegment: { minWidth: 48, minHeight: 48, backgroundColor: colors.sand, borderColor: colors.line },
  phoneNumber: { ...tokens.typography.label, color: colors.primary },
  hoverSegment: { backgroundColor: colors.card, borderColor: colors.line },
  activeSegment: { backgroundColor: colors.goldTint, borderColor: colors.yellow },
  focusSegment: { outlineColor: colors.focusRing, outlineWidth: tokens.focus.outlineWidth, outlineStyle: 'solid', outlineOffset: 1 },
  pressedSegment: { opacity: tokens.opacity.pressed },
  disabledSegment: { opacity: tokens.opacity.disabled },
  stepNumber: { width: 22, height: 22, flexShrink: 0, alignItems: 'center', justifyContent: 'center',
    borderRadius: 11, backgroundColor: colors.green },
  activeNumber: { backgroundColor: colors.primary },
  numberText: { ...tokens.typography.smallLabel, fontSize: 12, lineHeight: 16, color: colors.primary },
  activeNumberText: { color: colors.onPrimary },
  stepLabel: { ...tokens.typography.smallLabel, flexShrink: 1, fontSize: 13, lineHeight: 17, textAlign: 'center', color: colors.muted },
  compactLabel: { fontSize: 11, lineHeight: 14 },
  activeLabel: { color: colors.ink, fontWeight: '700' },
});
