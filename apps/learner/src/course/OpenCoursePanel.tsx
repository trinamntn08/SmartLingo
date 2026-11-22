import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Platform, Text, useWindowDimensions, View } from 'react-native';
import { courseDayProgress, courseDayProgressRevision, gradeCourseChoice, nextCourseDay, resumeCourseDay, type CourseChoice, type CourseDay, type CourseEvent, type OpenCourse } from '@smartlingo/domain';
import { Badge, Button } from '../ui/controls';
import { Icon } from '../ui/Icon';
import { colors, designTokens, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { CourseCredits } from './CourseCredits';
import { CourseBlockView } from './CourseBlockView';
import { CourseDayChooser } from './CourseDayChooser';
import { CompactCourseContent } from './CompactCourseContent';
import { compactCourseStepKind, compactCourseSteps } from './compactCourseSteps';
import { useCourseLearning } from './useCourseLearning';

export function OpenCoursePanel({ course, model, onWriteBlocked }: { course: OpenCourse; model: LearningModel; onWriteBlocked?: (blocked: boolean) => void }) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const [open, setOpen] = useState(false);
  const [writeBlocked, setWriteBlocked] = useState(false);
  const reportWrite = useCallback((blocked: boolean) => { setWriteBlocked(blocked); onWriteBlocked?.(blocked); }, [onWriteBlocked]);
  return <View testID="open-course-panel" style={[s.card, { minWidth: 0, padding: compact ? 14 : 16, gap: 24, borderTopWidth: 4, borderTopColor: colors.yellow }]}>
    <View style={[s.row, { alignItems: 'center', justifyContent: 'space-between', gap: compact ? 10 : 16 }]}>
      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 260, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: colors.goldTint, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="calendar" size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text accessibilityRole="header" style={[s.heading, { fontSize: 21 }]}>{course.units?.length ? course.title : 'Your daily course'}</Text>
          <Text style={s.muted}>{course.days.length} guided study {course.days.length === 1 ? 'day' : 'days'} · Draft preview</Text>
        </View>
      </View>
      <Button expanded={open} primary={!open} disabled={writeBlocked || model.busy || !!model.saveError} onPress={() => setOpen(value => !value)}>{open ? 'Close daily course' : 'Open daily course'}</Button>
    </View>
    {open && <CourseJourney course={course} model={model} onWriteBlocked={reportWrite} />}
  </View>;
}

function CourseJourney({ course, model, onWriteBlocked }: { course: OpenCourse; model: LearningModel; onWriteBlocked: (blocked: boolean) => void }) {
  const compact = useWindowDimensions().width < 600;
  const learning = useCourseLearning();
  useEffect(() => { onWriteBlocked(learning.busy || !!learning.saveError); }, [learning.busy, learning.saveError, onWriteBlocked]);
  // Keep a selected day stable while its completion event changes nextCourseDay.
  const [level, setLevel] = useState<CourseDay['level'] | 'All'>('All');
  const [selectedDay, setSelectedDay] = useState<string>();
  const [selectedBlock, setSelectedBlock] = useState<string>();
  const [choosingDay, setChoosingDay] = useState(false);
  const [choosingSection, setChoosingSection] = useState(false);
  const clock = useRef(0);
  const day = course.days.find(item => item.id === selectedDay) ?? resumeCourseDay(course, learning.events);
  if (!day) return <View style={s.notice}><Text style={s.body}>No study days are available in this draft yet.</Text><CourseCredits course={course} /></View>;
  const currentUnit = course.units?.find(unit => unit.dayIds.includes(day.id));
  const progress = courseDayProgress(course, day, learning.events);
  const resumeBlock = day.blocks.find(item => item.id === selectedBlock) ?? day.blocks.find(item => item.id === progress.lastBlockId) ?? day.blocks[0];
  const compactSteps = compactCourseSteps(day);
  const currentStep = compactSteps?.find(step => step.kind === compactCourseStepKind(resumeBlock));
  const block = currentStep?.anchor ?? resumeBlock;
  const sections = compactSteps?.map(step => ({ id: step.anchor.id, title: step.title })) ?? day.blocks;
  const index = sections.findIndex(item => item.id === block.id);
  const scopedEvents = learning.events.filter(event => event.courseId === course.id && event.courseRevision === courseDayProgressRevision(course, day) && event.dayId === day.id);
  const done = progress.completedBlockIds.has(block.id);
  const browseOnly = !!learning.loadError;
  const navigationBlocked = learning.loading || learning.busy || !!learning.saveError;
  const nextDay = nextCourseDay(course, learning.events);

  function event(kind: CourseEvent['kind'], blockId = block.id, targetDay = day!): CourseEvent {
    const latest = learning.events.reduce((value, saved) => Math.max(value, Date.parse(saved.occurredAt)), 0);
    clock.current = Math.max(Date.now(), clock.current + 1, latest + 1);
    return { id: crypto.randomUUID(), courseId: course.id, courseRevision: courseDayProgressRevision(course, targetDay), dayId: targetDay.id,
      blockId, occurredAt: new Date(clock.current).toISOString(), kind } as CourseEvent;
  }
  function selectDay(target: CourseDay) {
    if (navigationBlocked || target.id === day!.id) return;
    const targetBlock = courseDayProgress(course, target, learning.events).lastBlockId;
    const select = () => { setSelectedDay(target.id); setSelectedBlock(targetBlock); };
    if (browseOnly) { select(); return; }
    learning.save([event('navigation', targetBlock, target)], select);
  }
  function navigate(id: string, studyBlockId?: string) {
    if (learning.busy || learning.loading || learning.saveError) return;
    if (browseOnly) { setSelectedBlock(id); return; }
    const events = studyBlockId ? [event('study', studyBlockId)] : [];
    learning.save([...events, event('navigation', id)], () => setSelectedBlock(id));
  }
  function saveStep() {
    learning.save([event(block.kind === 'reflection' ? 'reflection' : 'study')]);
  }
  function next() {
    const target = sections[index + 1];
    if (target) navigate(target.id, currentStep?.kind === 'dialogue' && !done ? block.id : undefined);
  }
  function support(blockId = block.id) {
    if (!learning.blocked) learning.save([event('support', blockId)]);
  }
  function choose(choice: CourseChoice, choiceId: string, supported: boolean) {
    learning.save([{ ...event('choice', choice.id), kind: 'choice', choiceId, result: gradeCourseChoice(choice, choiceId), supported }]);
  }
  function finish() {
    setSelectedDay(day!.id);
    learning.save([event('completion')]);
  }
  const nextButton = index < sections.length - 1 && <Button primary
    disabled={navigationBlocked || (!currentStep && !done && !browseOnly)} onPress={next}>Next section</Button>;

  return <View testID="course-journey" style={{ gap: 18, minWidth: 0 }}>
    {learning.loading && <Text accessibilityLiveRegion="polite" style={s.muted}>Loading saved course progress… You can read this section while it loads.</Text>}
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
          disabled={navigationBlocked} onPress={() => navigate(item.id)}>
          {position + 1}. {item.title}{!currentStep && progress.completedBlockIds.has(item.id) ? ' ✓' : ''}
        </Button>
      </View>)}
    </View>}
    <View testID={`course-block-${block.id}`} style={{ gap: 24, minWidth: 0, padding: compact ? 0 : 22, paddingVertical: 22 }}>
      {currentStep ? <>
        <View style={[s.row, { justifyContent: 'space-between', gap: 10 }]}>
          <CompactStepHeading stepId={block.id} title={currentStep.title} narrow={compact} />
          {currentStep.kind === 'practice' && <Button compact quiet disabled={navigationBlocked} onPress={next}>Skip practice</Button>}
        </View>
        <CompactCourseContent key={block.id} step={currentStep.kind} day={day} model={model} events={scopedEvents}
          blocked={learning.blocked} revealBlocked={navigationBlocked} onChoice={choose} onSupport={support} />
      </> : <>
        <View style={{ gap: 10 }}><Text style={s.eyebrow}>Section {index + 1} of {sections.length} · {block.kind === 'choice' ? 'Practice' : block.kind === 'reflection' ? 'Self-review' : 'Study'}</Text>
        <Text accessibilityRole="header" style={[s.heading, { fontSize: compact ? 27 : 36, lineHeight: compact ? 35 : 44, fontWeight: '500' }]}>{block.title}</Text></View>
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
        {index > 0 && <Button disabled={navigationBlocked} onPress={() => navigate(sections[index - 1].id)}>Previous section</Button>}
        {nextButton}
        {currentStep?.kind === 'reflection' && !progress.completed && (progress.canComplete || browseOnly
          ? <Button primary disabled={learning.blocked} onPress={finish}>Finish lesson</Button>
          : <Button primary disabled={navigationBlocked} onPress={() => navigate(sections[0].id)}>Read the dialogue</Button>)}
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

function CompactStepHeading({ stepId, title, narrow }: { stepId: string; title: string; narrow: boolean }) {
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
    style={[s.heading, { minWidth: 0, flexShrink: 1, fontSize: narrow ? 24 : 30, lineHeight: narrow ? 32 : 38 }]}>{title}</Text>;
}
