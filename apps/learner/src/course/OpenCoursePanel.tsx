import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Platform, Text, useWindowDimensions, View } from 'react-native';
import { courseDayProgress, courseDayProgressRevision, gradeCourseChoice, nextCourseDay, type CourseChoice, type CourseDay, type CourseEvent, type Lesson, type OpenCourse } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { Icon } from '../ui/Icon';
import { colors, designTokens, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { CourseCredits } from './CourseCredits';
import { CourseBlockView } from './CourseBlockView';
import { CourseListeningCheck } from './CourseListeningCheck';
import { CourseOutline, type CourseSidebar } from './CourseOutline';
import { CompactCourseContent } from './CompactCourseContent';
import { compactCourseStepKind, compactCourseSteps } from './compactCourseSteps';
import type { CourseLearningModel } from './useCourseLearning';
import { RelatedCoursePractice } from './RelatedCoursePractice';
import { CourseWriteStatus } from './CourseWriteStatus';
import { useNavigation } from '../app/WebNavigation';
import { routeHref, type AppRoute } from '../app/routes';
import { tabRoute } from '../app/useLearnerNavigation';

type CourseRoute = Extract<AppRoute, { kind: 'course' }>;

interface CourseProps {
  course: OpenCourse;
  route: CourseRoute;
  recommendedDay: CourseDay;
  learning: CourseLearningModel;
  model: LearningModel;
  lessons: readonly Lesson[];
}

export function OpenCoursePanel({ course, route, recommendedDay, learning, model, lessons }: CourseProps) {
  const { width } = useWindowDimensions();
  const compact = width < designTokens.layout.compactBreakpoint;
  const sidebar: CourseSidebar | undefined = Platform.OS === 'web' && width >= 900
    ? (width >= designTokens.layout.desktopNavBreakpoint ? 'wide' : 'medium') : undefined;
  const { backTo } = useNavigation();
  const learn = tabRoute('Learn', course.language);
  const outlineId = useId();
  const [outlineOpen, setOutlineOpen] = useState(false);
  function close() {
    backTo(learn, previous => 'language' in previous && previous.language === course.language
      && ['today', 'topics', 'letters', 'listening', 'speaking'].includes(previous.kind), true);
  }

  return <View testID="open-course-panel" style={[s.card, { minWidth: 0, padding: compact ? 12 : 16, gap: compact ? 12 : 24, borderTopWidth: 4, borderTopColor: colors.yellow }]}>
    <View style={[s.row, { justifyContent: 'space-between', gap: compact ? 6 : 16 }]}>
      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: compact ? '100%' : 260, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {!compact && <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: colors.goldTint, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="calendar" size={22} color={colors.primary} />
        </View>}
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text accessibilityRole="header" style={[s.heading, compact ? designTokens.typography.label : { fontSize: 21 }]}>{course.title}</Text>
          <Text style={[s.muted, compact && designTokens.typography.caption]}>{course.days.length} guided {course.days.length === 1 ? 'lesson' : 'lessons'} · Draft preview</Text>
        </View>
      </View>
      <View style={[s.row, { gap: 8, maxWidth: '100%' }, compact && { width: '100%', justifyContent: 'space-between' }]}>
        {!sidebar && <Button compact expanded={outlineOpen} controls={outlineOpen ? outlineId : undefined}
          trailingIcon={outlineOpen ? 'chevron-down' : 'chevron'} onPress={() => setOutlineOpen(value => !value)}>Course outline</Button>}
        <Button compact quiet href={routeHref(learn)} label="Close daily course"
          disabled={learning.busy || !!learning.saveError || model.busy || !!model.saveError} onPress={close}>
          {compact ? 'Close' : 'Close daily course'}
        </Button>
      </View>
    </View>
    <CourseJourney course={course} route={route} recommendedDay={recommendedDay} learning={learning} model={model} lessons={lessons}
      sidebar={sidebar} outlineId={sidebar || outlineOpen ? outlineId : undefined} onCloseOutline={() => setOutlineOpen(false)} />
  </View>;
}

function CourseJourney({ course, route, model, recommendedDay, learning, lessons, outlineId, onCloseOutline, sidebar }: CourseProps & {
  outlineId?: string; onCloseOutline: () => void; sidebar?: CourseSidebar;
}) {
  const { navigate, backTo } = useNavigation();
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const [level, setLevel] = useState<CourseDay['level'] | 'All'>('All');
  const clock = useRef(0);
  const requestedDay = course.days.find(item => item.id === route.dayId);
  const invalidDay = !!route.dayId && !requestedDay;
  const resolvedDay = requestedDay ?? recommendedDay;
  const progress = resolvedDay && courseDayProgress(course, resolvedDay, learning.events);
  const requestedBlock = !invalidDay && resolvedDay ? resolvedDay.blocks.find(item => item.id === route.sectionId) : undefined;
  const invalidSection = !!route.sectionId && !requestedBlock;
  const resumeBlock = requestedBlock ?? resolvedDay?.blocks.find(item => item.id === progress?.lastBlockId) ?? resolvedDay?.blocks[0];
  const compactSteps = resolvedDay && compactCourseSteps(resolvedDay);
  const currentStep = resumeBlock && compactSteps?.find(step => step.kind === compactCourseStepKind(resumeBlock));
  const resolvedBlock = currentStep?.anchor ?? resumeBlock;
  const dayId = resolvedDay?.id;
  const sectionId = resolvedBlock?.id;

  // Pin the resolved day and section without creating navigation or study events.
  useEffect(() => {
    if (learning.loading || invalidDay || invalidSection || !dayId || !sectionId) return;
    if (route.dayId !== dayId || route.sectionId !== sectionId) navigate({ ...route, dayId, sectionId }, { replace: true });
  }, [dayId, invalidDay, invalidSection, learning.loading, navigate, route, sectionId]);

  if (!resolvedDay || !progress || !resolvedBlock) return <View style={s.notice}><Text style={s.body}>This draft has no lessons yet.</Text><CourseCredits course={course} /></View>;
  const day = resolvedDay;
  const block = resolvedBlock;
  const revision = courseDayProgressRevision(course, day);
  const currentUnit = course.units?.find(unit => unit.dayIds.includes(day.id));
  const sections = compactSteps?.map(step => ({ id: step.anchor.id, title: step.title })) ?? day.blocks;
  const index = sections.findIndex(item => item.id === block.id);
  const previousSection = index > 0 ? { ...route, dayId, sectionId: sections[index - 1].id } : undefined;
  const scopedEvents = learning.events.filter(event => event.courseId === course.id && event.courseRevision === revision && event.dayId === day.id);
  const done = progress.completedBlockIds.has(block.id);
  const browseOnly = !!learning.loadError;
  const navigationBlocked = learning.loading || learning.busy || !!learning.saveError;
  const nextDay = nextCourseDay(course, learning.events);
  const listeningCheck = block === day.blocks.find(item => item.kind === 'dialogue') &&
    <CourseListeningCheck day={day} language={course.language} revision={revision} compact={compact} />;

  function openSelection(destination: CourseRoute, afterSave = false) {
    onCloseOutline();
    navigate(destination, { afterSave });
  }
  function event(kind: CourseEvent['kind'], blockId = block.id, targetDay = day): CourseEvent {
    const latest = learning.events.reduce((value, saved) => Math.max(value, Date.parse(saved.occurredAt)), 0);
    clock.current = Math.max(Date.now(), clock.current + 1, latest + 1);
    return { id: crypto.randomUUID(), courseId: course.id, courseRevision: courseDayProgressRevision(course, targetDay), dayId: targetDay.id,
      blockId, occurredAt: new Date(clock.current).toISOString(), kind } as CourseEvent;
  }
  function selectDay(target: CourseDay) {
    if (navigationBlocked || target.id === day.id) return;
    const targetBlock = courseDayProgress(course, target, learning.events).lastBlockId;
    const targetSection = target.blocks.find(item => item.id === targetBlock);
    const targetStep = targetSection && compactCourseSteps(target)?.find(step => step.kind === compactCourseStepKind(targetSection));
    const destination = { ...route, dayId: target.id, sectionId: targetStep?.anchor.id ?? targetBlock };
    if (browseOnly) { openSelection(destination); return; }
    learning.save([event('navigation', targetBlock, target)], () => openSelection(destination, true));
  }
  function selectSection(id: string, studyBlockId?: string) {
    if (navigationBlocked || id === block.id) return;
    const destination = { ...route, dayId, sectionId: id };
    if (browseOnly) { openSelection(destination); return; }
    const events = studyBlockId ? [event('study', studyBlockId)] : [];
    learning.save([...events, event('navigation', id)], () => openSelection(destination, true));
  }
  function saveStep() {
    learning.save([event(block.kind === 'reflection' ? 'reflection' : 'study')]);
  }
  function next() {
    const target = sections[index + 1];
    if (target) selectSection(target.id, currentStep?.kind === 'dialogue' && !done ? block.id : undefined);
  }
  function previous() {
    if (!previousSection) return;
    backTo(previousSection, previousRoute => previousRoute.kind === 'course'
      && previousRoute.courseId === course.id && previousRoute.language === course.language
      && previousRoute.dayId === dayId && previousRoute.sectionId === previousSection.sectionId);
  }
  function support(blockId = block.id) {
    if (!learning.blocked) learning.save([event('support', blockId)]);
  }
  function choose(choice: CourseChoice, choiceId: string, supported: boolean) {
    learning.save([{ ...event('choice', choice.id), kind: 'choice', choiceId, result: gradeCourseChoice(choice, choiceId), supported }]);
  }
  function finish() {
    learning.save([event('completion')], () => {
      if (invalidDay || invalidSection) navigate({ ...route, dayId, sectionId }, { replace: true, afterSave: true });
    });
  }
  const nextButton = index < sections.length - 1 && <Button primary
    disabled={navigationBlocked || (!currentStep && !done && !browseOnly)} onPress={next}>Next section</Button>;
  const outline = outlineId && <CourseOutline id={outlineId} sidebar={sidebar} course={course} route={route} day={day}
    sections={sections} sectionId={block.id} completedSections={currentStep ? undefined : progress.completedBlockIds} events={learning.events}
    level={level} onLevelChange={setLevel} blocked={navigationBlocked} onDay={selectDay} onSection={selectSection} />;

  const lesson = <View style={{ flex: sidebar ? 1 : undefined, gap: compact ? 12 : 18, minWidth: 0 }}>
    {learning.loading && <Text accessibilityLiveRegion="polite" style={s.muted}>Loading saved course progress… You can read this section while it loads.</Text>}
    {!learning.loading && (invalidDay || invalidSection) && <View style={s.notice}>
      <Text accessibilityRole="alert" style={s.body}>{invalidDay ? 'That lesson is unavailable. Your current lesson is shown here.' : 'That section is unavailable. Your available section is shown here.'}</Text>
      <Button disabled={navigationBlocked} onPress={() => navigate({ ...route, dayId, sectionId }, { replace: true })}>Open this section</Button>
    </View>}
    {!!learning.loadError && <View style={s.error}>
      <Text accessibilityRole="alert" style={s.body}>{learning.loadError}</Text>
      <Text style={s.muted}>You can browse every section. Progress cannot be saved until browser storage is available.</Text>
      <Button onPress={() => void learning.load()}>Retry course storage</Button>
    </View>}
    <CourseWriteStatus learning={learning} />
    {!sidebar && outline}
    <View style={[s.notice, { backgroundColor: colors.paper, gap: 16 }, compact && { padding: 11, gap: 7 }]}>
      {currentUnit && !compact && <Text style={[s.muted, { color: colors.primary, fontWeight: '600' }]}>{currentUnit.title}</Text>}
      <Text accessibilityRole="header" style={[s.heading, { fontSize: compact ? 25 : 32, lineHeight: compact ? 33 : 40 }]}>Lesson {day.dayNumber}: {day.title}</Text>
      <Text style={compact ? s.muted : s.body}>{day.outcome}</Text>
      <View style={[s.row, { justifyContent: 'space-between', gap: 8 }]}>
        <Text style={[s.eyebrow, compact && { fontSize: 13 }]}>{day.level === 'foundation' ? 'Foundations' : day.level}</Text>
        <Text accessibilityLiveRegion="polite" style={[s.muted, compact && designTokens.typography.caption]}>
          {currentStep ? `Step ${index + 1} of ${sections.length}` : `${progress.completedBlockIds.size} of ${sections.length} sections saved`}
        </Text>
      </View>
      <View style={s.progressTrack}><View style={[s.progressFill, { width: `${100 * (currentStep ? index + 1 : progress.completedBlockIds.size) / sections.length}%` }]} /></View>
    </View>
    <View testID={`course-block-${block.id}`} style={{ gap: compact ? 12 : 24, minWidth: 0, paddingHorizontal: compact || sidebar ? 0 : 22, paddingVertical: compact ? 4 : 22 }}>
      {currentStep ? <>
        <View style={[s.row, { justifyContent: 'space-between', gap: 10 }]}>
          <CourseStepHeading stepId={block.id} title={currentStep.title} narrow={compact} compactCourse />
          {currentStep.kind === 'practice' && <Button compact quiet disabled={navigationBlocked} onPress={next}>Skip practice</Button>}
        </View>
        <CompactCourseContent key={block.id} step={currentStep.kind} day={day} model={model} events={scopedEvents}
          blocked={learning.blocked} revealBlocked={navigationBlocked} onChoice={choose} onSupport={support}
          listeningCheck={listeningCheck} />
      </> : <>
        <View style={{ gap: 10 }}><Text style={s.eyebrow}>Section {index + 1} of {sections.length} · {block.kind === 'choice' ? 'Practice' : block.kind === 'reflection' ? 'Self-review' : 'Study'}</Text>
        <CourseStepHeading stepId={block.id} title={block.title} narrow={compact} /></View>
        <CourseBlockView key={block.id} language={course.language} block={block} day={day} model={model} events={scopedEvents}
          blocked={learning.blocked} revealBlocked={navigationBlocked} onChoice={(id, supported) => {
            if (block.kind === 'choice') choose(block, id, supported);
          }} onSupport={support} />
        {listeningCheck}
        {done && <Text accessibilityLiveRegion="polite" style={[s.muted, { color: '#246944' }]}>Section saved.</Text>}
        {block.kind !== 'choice' && <Button primary={!done} disabled={learning.blocked || done} onPress={saveStep}>
          {block.kind === 'reflection' ? 'Save manual self-review' : 'Save study section'}
        </Button>}
      </>}
      <View style={s.row}>
        {previousSection && <Button href={routeHref(previousSection)} disabled={navigationBlocked} onPress={previous}>Previous section</Button>}
        {nextButton}
        {currentStep?.kind === 'reflection' && !progress.completed && (progress.canComplete || browseOnly
          ? <Button primary disabled={learning.blocked} onPress={finish}>Finish lesson</Button>
          : <Button primary disabled={navigationBlocked} onPress={() => selectSection(sections[0].id)}>Read the dialogue</Button>)}
      </View>
    </View>
    {!currentStep && !progress.completed && <View style={s.notice}>
      <Text style={s.body}>{progress.canComplete ? 'Every section is saved.' : 'Complete every section to finish this lesson.'}</Text>
      <Button primary={progress.canComplete} disabled={learning.blocked || !progress.canComplete} onPress={finish}>Complete lesson</Button>
    </View>}
    {progress.completed && <View style={[s.notice, { backgroundColor: colors.green }]}>
      <Text accessibilityRole="header" style={s.heading}>Lesson saved</Text>
      {!currentStep && !nextDay && <Text style={s.body}>You have finished all available draft lessons.</Text>}
      {nextDay && <Button primary disabled={navigationBlocked} onPress={() => selectDay(nextDay)}>Continue to Lesson {nextDay.dayNumber}: {nextDay.title}</Button>}
    </View>}
    {(currentStep?.kind === 'reflection' || progress.completed) && <RelatedCoursePractice
      section={{ ...route, dayId: day.id, sectionId: block.id }} lessons={lessons}
      disabled={navigationBlocked || model.busy || !!model.saveError} />}
    <CourseCredits course={course} />
  </View>;

  return <View testID="course-journey" style={sidebar && { flexDirection: 'row', alignItems: 'flex-start', gap: 20 }}>
    {sidebar && outline}
    {lesson}
  </View>;
}

function CourseStepHeading({ stepId, title, narrow, compactCourse = false }: { stepId: string; title: string; narrow: boolean; compactCourse?: boolean }) {
  const headingId = useId();
  const previousStep = useRef(stepId);

  useLayoutEffect(() => {
    if (previousStep.current === stepId) return;
    previousStep.current = stepId;
    if (Platform.OS !== 'web') return;
    const heading = document.getElementById(headingId);
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start' });
  }, [headingId, stepId]);

  return <Text nativeID={headingId} accessibilityRole="header"
    style={[s.heading, { minWidth: 0, flexShrink: 1 }, compactCourse
      ? { fontSize: narrow ? 24 : 30, lineHeight: narrow ? 32 : 38 }
      : { fontSize: narrow ? 27 : 36, lineHeight: narrow ? 35 : 44, fontWeight: '500' }]}>{title}</Text>;
}
