import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { lessonProgress, type LearningEvent, type Lesson } from '@smartlingo/domain';
import { Button } from './controls';
import { colors, designTokens as tokens, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { LessonConversation, LessonWords } from './LessonStudy';
import { PictureActivity, SentenceActivity } from './LessonPractice';
import { useNavigation } from '../app/WebNavigation';
import { lessonStages, routeHref, topicRouteKey, type LessonStage } from '../app/routes';

function resumeStage(wordsStudied: boolean, progress: ReturnType<typeof lessonProgress>): LessonStage {
  if (progress.completed) return 'sentence';
  if (!wordsStudied) return 'vocabulary';
  return progress.pictureDone ? 'sentence' : 'dialogue';
}

export function LessonScreen({ lesson, model, onExit, studyDayHref, routed = false }: {
  lesson: Lesson; model: LearningModel; onExit: () => void; studyDayHref?: string; routed?: boolean;
}) {
  const { route, navigate } = useNavigation();
  const progress = lessonProgress(lesson, model.events);
  const wordsStudied = lesson.vocabulary.every(entry => progress.viewedIds.has(entry.id));
  const resume = resumeStage(wordsStudied, progress);
  const [localStage, setLocalStage] = useState(resume);
  const [returnAfterCompletion, setReturnAfterCompletion] = useState(false);
  const lessonRoute = routed && route.kind === 'lesson' && route.lessonId === lesson.id && route.language === lesson.language ? route : undefined;
  const stage = lessonRoute ? lessonRoute.stage ?? resume : localStage;
  const headingId = useId();
  const previousStage = useRef(stage);
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

  useLayoutEffect(() => {
    if (previousStage.current === stage) return;
    previousStage.current = stage;
    if (Platform.OS !== 'web') return;
    const headingElement = document.getElementById(headingId);
    if (!headingElement) return;
    headingElement.tabIndex = -1;
    headingElement.focus({ preventScroll: true });
    headingElement.scrollIntoView({ block: 'start' });
  }, [headingId, stage]);

  function setStage(next: LessonStage, afterSave = false) {
    if (lessonRoute) navigate({ ...lessonRoute, stage: next }, { afterSave });
    else setLocalStage(next);
  }

  const stageHref = (next: LessonStage) => lessonRoute ? routeHref({ ...lessonRoute, stage: next }) : undefined;
  const topicHref = lessonRoute ? routeHref({ kind: 'topics', language: lessonRoute.language, topic: topicRouteKey(lesson.topic) }) : undefined;
  const exitHref = studyDayHref ?? topicHref;
  const returnLabel = studyDayHref ? 'Back to study day' : undefined;

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
    <View style={layout.intro}>
      <Text accessibilityRole="header" style={[s.title, compact && s.compactTitle]}>{lesson.subtitle}</Text>
      <Text style={[s.body, layout.outcome]}>{lesson.outcome}</Text>
    </View>
    <LessonProgress stage={stage} compact={compact} meaningMatch={meaningMatch} />
    <View testID="lesson-stage" style={layout.stage}>
      <Text nativeID={headingId} accessibilityRole="header" style={[s.heading, layout.stageHeading]}>{heading}</Text>
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
        record={record} nextHref={exitHref} onNext={onExit} returnLabel={returnLabel}
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

function LessonProgress({ stage, compact, meaningMatch }: { stage: LessonStage; compact: boolean; meaningMatch: boolean }) {
  const current = lessonStages.indexOf(stage);
  return <View accessibilityLabel="Lesson steps in order" style={layout.progress}>
    {lessonStages.map((step, index) => {
      const { label, short } = stageLabels(step, meaningMatch);
      const active = step === stage;
      return <View key={step} testID={'lesson-step-' + step} aria-current={active ? 'step' : undefined}
        accessibilityLabel={label + ', step ' + (index + 1) + ' of ' + lessonStages.length}
        style={[layout.segment, active && layout.activeSegment]}>
        <Text style={[s.badgeText, layout.stepLabel, active && layout.activeLabel]}>{compact ? short : label}</Text>
      </View>;
    })}
    <Text accessibilityLiveRegion="polite" style={layout.screenReaderText}>{'Step ' + (current + 1) + ' of ' + lessonStages.length}</Text>
  </View>;
}

const layout = StyleSheet.create({
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', minWidth: 0, gap: 16 },
  breadcrumb: { gap: 8 },
  meta: { flexShrink: 1, minWidth: 0 },
  intro: { gap: 4 },
  outcome: { color: colors.muted, maxWidth: 690 },
  stage: { minWidth: 0, gap: 14 },
  stageHeading: { outlineWidth: 0 },
  actions: { alignItems: 'flex-end' },
  progress: { flexDirection: 'row', gap: 5, marginTop: 2 },
  segment: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, paddingVertical: 9,
    borderRadius: 8, borderWidth: 1, borderColor: 'transparent', backgroundColor: colors.sand },
  activeSegment: { backgroundColor: colors.goldTint, borderColor: colors.yellow },
  stepLabel: { textAlign: 'center', color: colors.muted },
  activeLabel: { color: colors.ink, fontWeight: '700' },
  screenReaderText: { position: 'absolute', width: 1, height: 1, overflow: 'hidden' },
});
