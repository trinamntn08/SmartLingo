import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Platform, Text, useWindowDimensions, View } from 'react-native';
import { courseDayProgress, courseDayProgressRevision, gradeCourseChoice, nextCourseDay, resumeCourseDay, type CourseChoice, type CourseDay, type CourseEvent, type OpenCourse } from '@smartlingo/domain';
import { Badge, Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { CourseCredits } from './CourseCredits';
import { CourseBlockView } from './CourseBlockView';
import { CourseDayChooser } from './CourseDayChooser';
import { CompactCourseContent } from './CompactCourseContent';
import { compactCourseStepKind, compactCourseSteps } from './compactCourseSteps';
import { useCourseLearning } from './useCourseLearning';
import { useNavigation } from '../app/WebNavigation';
import { routeHref, type AppRoute } from '../app/routes';

type CourseRoute = Extract<AppRoute, { kind: 'course' }>;

export function OpenCoursePanel({ course, model, onWriteBlocked }: { course: OpenCourse; model: LearningModel; onWriteBlocked?: (blocked: boolean) => void }) {
  const { route, navigate, backTo } = useNavigation();
  const courseRoute = route.kind === 'course' && route.courseId === course.id && route.language === course.language ? route : undefined;
  const open = !!courseRoute;
  const today = { kind: 'today', language: course.language } as const;
  const courseStart = { kind: 'course', language: course.language, courseId: course.id } as const;
  const [writeBlocked, setWriteBlocked] = useState(false);
  const reportWrite = useCallback((blocked: boolean) => { setWriteBlocked(blocked); onWriteBlocked?.(blocked); }, [onWriteBlocked]);
  function toggle() {
    if (open) backTo(today, previous => previous.kind === 'today' && previous.language === course.language, true);
    else navigate(courseStart);
  }

  return <View testID="open-course-panel" style={[s.card, { minWidth: 0, padding: 20, gap: 24, borderTopWidth: 4, borderTopColor: colors.yellow }]}>
    <View style={[s.row, { alignItems: 'center', justifyContent: 'space-between', gap: 16 }]}>
      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 240, minWidth: 0, gap: 5 }}>
        <Text accessibilityRole="header" style={[s.heading, { fontSize: 21 }]}>{course.units?.length ? course.title : 'Your daily course'}</Text>
        <Text style={s.muted}>{course.days.length} study {course.days.length === 1 ? 'day' : 'days'} available · Draft preview</Text>
      </View>
      <Button expanded={open} primary={!open} href={routeHref(open ? today : courseStart)} disabled={writeBlocked || model.busy || !!model.saveError} onPress={toggle}>{open ? 'Close daily course' : 'Open daily course'}</Button>
    </View>
    {courseRoute && <CourseJourney course={course} route={courseRoute} model={model} onWriteBlocked={reportWrite} />}
  </View>;
}

function CourseJourney({ course, route, model, onWriteBlocked }: { course: OpenCourse; route: CourseRoute; model: LearningModel; onWriteBlocked: (blocked: boolean) => void }) {
  const { navigate, backTo } = useNavigation();
  const compact = useWindowDimensions().width < 600;
  const learning = useCourseLearning();
  useLayoutEffect(() => { onWriteBlocked(learning.busy || !!learning.saveError); }, [learning.busy, learning.saveError, onWriteBlocked]);
  useLayoutEffect(() => () => onWriteBlocked(false), [onWriteBlocked]);
  const [level, setLevel] = useState<CourseDay['level'] | 'All'>('All');
  const [choosingDay, setChoosingDay] = useState(false);
  const [choosingSection, setChoosingSection] = useState(false);
  const clock = useRef(0);
  const requestedDay = course.days.find(item => item.id === route.dayId);
  const invalidDay = !!route.dayId && !requestedDay;
  const resolvedDay = requestedDay ?? resumeCourseDay(course, learning.events);
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

  if (!resolvedDay || !progress || !resolvedBlock) return <View style={s.notice}><Text style={s.body}>No study days are available in this draft yet.</Text><CourseCredits course={course} /></View>;
  const day = resolvedDay;
  const block = resolvedBlock;
  const currentUnit = course.units?.find(unit => unit.dayIds.includes(day.id));
  const sections = compactSteps?.map(step => ({ id: step.anchor.id, title: step.title })) ?? day.blocks;
  const index = sections.findIndex(item => item.id === block.id);
  const previousSection = index > 0 ? { ...route, dayId, sectionId: sections[index - 1].id } : undefined;
  const scopedEvents = learning.events.filter(event => event.courseId === course.id && event.courseRevision === courseDayProgressRevision(course, day) && event.dayId === day.id);
  const done = progress.completedBlockIds.has(block.id);
  const browseOnly = !!learning.loadError;
  const navigationBlocked = learning.loading || learning.busy || !!learning.saveError;
  const nextDay = nextCourseDay(course, learning.events);

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
    if (browseOnly) { navigate(destination); return; }
    learning.save([event('navigation', targetBlock, target)], () => navigate(destination, { afterSave: true }));
  }
  function selectSection(id: string, studyBlockId?: string) {
    if (navigationBlocked || id === block.id) return;
    const destination = { ...route, dayId, sectionId: id };
    if (browseOnly) { navigate(destination); return; }
    const events = studyBlockId ? [event('study', studyBlockId)] : [];
    learning.save([...events, event('navigation', id)], () => navigate(destination, { afterSave: true }));
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

  return <View testID="course-journey" style={{ gap: 18, minWidth: 0 }}>
    {learning.loading && <Text accessibilityLiveRegion="polite" style={s.muted}>Loading saved course progress… You can read this section while it loads.</Text>}
    {!learning.loading && (invalidDay || invalidSection) && <View style={s.notice}>
      <Text accessibilityRole="alert" style={s.body}>{invalidDay ? 'That study day is unavailable. Your available study day is shown here.' : 'That section is unavailable. Your available section is shown here.'}</Text>
      <Button disabled={navigationBlocked} onPress={() => navigate({ ...route, dayId, sectionId }, { replace: true })}>Open this section</Button>
    </View>}
    {!!learning.loadError && <View style={s.error}>
      <Text accessibilityRole="alert" style={s.body}>{learning.loadError}</Text>
      <Text style={s.muted}>You can browse every section. Progress cannot be saved until browser storage is available.</Text>
      <Button onPress={() => void learning.load()}>Retry course storage</Button>
    </View>}
    {!!learning.saveError && <View style={s.error}>
      <Text accessibilityRole="alert" style={s.body}>{learning.saveError}</Text>
      <Text style={s.muted}>This action has not finished saving. Retry keeps the same event IDs.</Text>
      <Button disabled={learning.busy} onPress={learning.retry}>Retry course save</Button>
      <Button disabled={learning.busy} onPress={learning.discard}>Discard unsaved course action</Button>
    </View>}
    {learning.busy && <Text accessibilityLiveRegion="polite" style={s.muted}>Saving course progress…</Text>}
    <View style={[s.notice, { backgroundColor: colors.paper, gap: 16 }]}>
      {currentUnit && <Text style={[s.muted, { color: colors.primary, fontWeight: '600' }]}>{currentUnit.title}</Text>}
      <View style={s.row}><Badge>DAY {String(day.dayNumber).padStart(2, '0')}</Badge><Text style={s.eyebrow}>{day.level === 'foundation' ? 'Foundations' : day.level} · Guided study</Text></View>
      <Text accessibilityRole="header" style={[s.heading, { fontSize: compact ? 25 : 32, lineHeight: compact ? 33 : 40 }]}>Day {day.dayNumber}: {day.title}</Text>
      <Text style={s.body}>{day.outcome}</Text>
      <View style={[s.row, { justifyContent: 'space-between' }]}><Text accessibilityLiveRegion="polite" style={s.muted}>
        {currentStep ? `Step ${index + 1} of ${sections.length}` : `${progress.completedBlockIds.size} of ${sections.length} sections saved`}
      </Text>
        <View style={[s.row, { maxWidth: '100%', flexShrink: 1 }, compact && { width: '100%' }]}>
          <Button compact expanded={choosingDay} disabled={navigationBlocked} onPress={() => setChoosingDay(value => !value)}>{choosingDay ? 'Hide study days' : 'Choose a study day'}</Button>
          <Button compact expanded={choosingSection} disabled={navigationBlocked} onPress={() => setChoosingSection(value => !value)}>{choosingSection ? 'Hide sections' : 'Browse sections'}</Button>
        </View>
      </View>
      <View style={s.progressTrack}><View style={[s.progressFill, { width: `${100 * (currentStep ? index + 1 : progress.completedBlockIds.size) / sections.length}%` }]} /></View>
    </View>
    {choosingDay && <CourseDayChooser course={course} currentDay={day} events={learning.events} level={level}
      onLevelChange={setLevel} onSelectDay={selectDay} compact={compact} loading={learning.loading}
      browseOnly={browseOnly} navigationBlocked={navigationBlocked} />}
    {choosingSection && <View style={[s.row, { alignItems: 'stretch', gap: 8 }]} accessibilityLabel="Study day sections">
      {sections.map((item, position) => <View key={item.id} style={{ flexBasis: compact ? '46%' : 192, flexGrow: 1,
        flexShrink: 1, minWidth: 0, maxWidth: compact ? '100%' : 270 }}>
        <Button compact label={`Section ${position + 1}: ${item.title}`} selected={item.id === block.id}
          disabled={navigationBlocked} onPress={() => selectSection(item.id)}>
          {position + 1}. {item.title}{!currentStep && progress.completedBlockIds.has(item.id) ? ' ✓' : ''}
        </Button>
      </View>)}
    </View>}
    <View testID={`course-block-${block.id}`} style={{ gap: 24, minWidth: 0, padding: compact ? 0 : 22, paddingVertical: 22 }}>
      {currentStep ? <>
        <View style={[s.row, { justifyContent: 'space-between', gap: 10 }]}>
          <CourseStepHeading stepId={block.id} title={currentStep.title} narrow={compact} compactCourse />
          {currentStep.kind === 'practice' && <Button compact quiet disabled={navigationBlocked} onPress={next}>Skip practice</Button>}
        </View>
        <CompactCourseContent key={block.id} step={currentStep.kind} day={day} model={model} events={scopedEvents}
          blocked={learning.blocked} revealBlocked={navigationBlocked} onChoice={choose} onSupport={support} />
      </> : <>
        <View style={{ gap: 10 }}><Text style={s.eyebrow}>Section {index + 1} of {sections.length} · {block.kind === 'choice' ? 'Practice' : block.kind === 'reflection' ? 'Self-review' : 'Study'}</Text>
        <CourseStepHeading stepId={block.id} title={block.title} narrow={compact} /></View>
        <CourseBlockView key={block.id} language={course.language} block={block} day={day} model={model} events={scopedEvents}
          blocked={learning.blocked} revealBlocked={navigationBlocked} onChoice={(id, supported) => {
            if (block.kind === 'choice') choose(block, id, supported);
          }} onSupport={support} />
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
      <Text style={s.body}>{progress.canComplete ? 'Every section is saved. You can now finish this study day.' : 'Keep going at your own pace. Complete every section to save the day.'}</Text>
      <Button primary={progress.canComplete} disabled={learning.blocked || !progress.canComplete} onPress={finish}>Complete study day</Button>
    </View>}
    {progress.completed && <View style={[s.notice, { backgroundColor: colors.green }]}>
      <Text accessibilityRole="header" style={s.heading}>Study day saved</Text>
      {!currentStep && <>
        <Text style={s.body}>{nextDay ? 'This day is saved. Continue with another study day whenever you are ready, or revisit any section.' : 'You have finished all available draft days. Revisit a study day or explore another topic whenever you like.'}</Text>
        <Text style={s.muted}>This records your study activity, not a proficiency level. These draft days await owner review; a complete course is not yet available.</Text>
      </>}
      {nextDay && <Button primary disabled={navigationBlocked} onPress={() => selectDay(nextDay)}>Continue to day {nextDay.dayNumber}: {nextDay.title}</Button>}
    </View>}
    <CourseCredits course={course} />
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
