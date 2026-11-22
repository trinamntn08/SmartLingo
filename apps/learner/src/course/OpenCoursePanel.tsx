import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { courseDayProgress, courseDayProgressRevision, gradeCourseChoice, nextCourseDay, resumeCourseDay, type CourseDay, type CourseEvent, type OpenCourse } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { CourseCredits } from './CourseCredits';
import { CourseBlockView } from './CourseBlockView';
import { useCourseLearning } from './useCourseLearning';

export function OpenCoursePanel({ course, model, onWriteBlocked }: { course: OpenCourse; model: LearningModel; onWriteBlocked?: (blocked: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [writeBlocked, setWriteBlocked] = useState(false);
  const reportWrite = useCallback((blocked: boolean) => { setWriteBlocked(blocked); onWriteBlocked?.(blocked); }, [onWriteBlocked]);
  return <View testID="open-course-panel" style={[s.card, { minWidth: 0, padding: 18 }]}>
    <View style={[s.row, { alignItems: 'center', justifyContent: 'space-between', gap: 16 }]}>
      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 240, minWidth: 0, gap: 5 }}>
        <Text accessibilityRole="header" style={[s.heading, { fontSize: 21 }]}>Your daily course</Text>
        <Text style={s.muted}>{course.days.length} study {course.days.length === 1 ? 'day' : 'days'} available · Draft preview</Text>
      </View>
      <Button disabled={writeBlocked || model.busy || !!model.saveError} onPress={() => setOpen(value => !value)}>{open ? 'Close daily course' : 'Open daily course'}</Button>
    </View>
    {open && <CourseJourney course={course} model={model} onWriteBlocked={reportWrite} />}
  </View>;
}

function CourseJourney({ course, model, onWriteBlocked }: { course: OpenCourse; model: LearningModel; onWriteBlocked: (blocked: boolean) => void }) {
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
  const progress = courseDayProgress(course, day, learning.events);
  const block = day.blocks.find(item => item.id === selectedBlock) ?? day.blocks.find(item => item.id === progress.lastBlockId) ?? day.blocks[0];
  const index = day.blocks.findIndex(item => item.id === block.id);
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
  function navigate(id: string) {
    if (learning.busy || learning.loading || learning.saveError) return;
    if (browseOnly) { setSelectedBlock(id); return; }
    learning.save([event('navigation', id)], () => setSelectedBlock(id));
  }
  function saveStep() {
    learning.save([event(block.kind === 'reflection' ? 'reflection' : 'study')]);
  }
  function next() {
    const target = day!.blocks[index + 1];
    if (target) navigate(target.id);
  }
  function support() {
    if (!learning.blocked) learning.save([event('support')]);
  }
  function choose(choiceId: string, supported: boolean) {
    if (block.kind !== 'choice') return;
    learning.save([{ ...event('choice'), kind: 'choice', choiceId, result: gradeCourseChoice(block, choiceId), supported }]);
  }

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
    <View style={s.row}>
      <Button disabled={navigationBlocked} onPress={() => setChoosingDay(value => !value)}>{choosingDay ? 'Hide study days' : 'Choose a study day'}</Button>
      <Button disabled={navigationBlocked} onPress={() => setChoosingSection(value => !value)}>{choosingSection ? 'Hide sections' : 'Browse sections'}</Button>
    </View>
    {choosingDay && <View testID="course-day-chooser" style={[s.notice, { gap: 12 }]}>
      <Text accessibilityRole="header" style={s.heading}>Choose a study day</Text>
      <Text style={s.muted}>Every day is open. Return whenever you like.</Text>
      <View style={s.row}>{(['All', 'foundation', 'A1', 'A2', 'B1'] as const).filter(value => value === 'All' || course.days.some(item => item.level === value)).map(value => <Button key={value} disabled={navigationBlocked} selected={level === value} onPress={() => setLevel(value)}>{value === 'All' ? 'All course levels' : value === 'foundation' ? 'Foundations' : value}</Button>)}</View>
      {course.days.filter(item => level === 'All' || item.level === level).map(item => {
        const saved = courseDayProgress(course, item, learning.events);
        const status = learning.loading ? 'Loading saved progress…' : browseOnly ? 'Browsing only · progress unavailable'
          : saved.completed ? 'Study day saved' : saved.completedBlockIds.size ? `${saved.completedBlockIds.size} of ${item.blocks.length} sections saved` : 'Not started';
        return <View key={item.id} testID={`course-day-${item.id}`} style={{ gap: 6, minWidth: 0 }}>
          <Button label={`Choose day ${item.dayNumber}: ${item.title}`} selected={item.id === day.id}
            disabled={navigationBlocked} onPress={() => selectDay(item)}>Day {item.dayNumber}: {item.title}</Button>
          <Text style={s.muted}>{status}</Text>
        </View>;
      })}
    </View>}
    <Text accessibilityRole="header" style={s.heading}>Day {day.dayNumber}: {day.title}</Text>
    <Text style={s.body}>{day.outcome}</Text>
    <Text accessibilityLiveRegion="polite" style={s.muted}>{progress.completedBlockIds.size} of {day.blocks.length} sections saved</Text>
    <View style={s.progressTrack}><View style={[s.progressFill, { width: `${100 * progress.completedBlockIds.size / day.blocks.length}%` }]} /></View>
    {choosingSection && <View style={s.row}>{day.blocks.map((item, position) => <Button key={item.id} label={`Section ${position + 1}: ${item.title}`}
      selected={item.id === block.id} disabled={learning.loading || learning.busy || !!learning.saveError} onPress={() => navigate(item.id)}>
      {position + 1}. {item.title}{progress.completedBlockIds.has(item.id) ? ' ✓' : ''}
    </Button>)}</View>}
    <View testID={`course-block-${block.id}`} style={{ gap: 16, minWidth: 0 }}>
      <Text style={s.eyebrow}>Section {index + 1} of {day.blocks.length}</Text>
      <Text accessibilityRole="header" style={s.heading}>{block.title}</Text>
      <CourseBlockView key={block.id} language={course.language} block={block} day={day} model={model} events={scopedEvents}
        blocked={learning.blocked} revealBlocked={learning.loading || learning.busy || !!learning.saveError} onChoice={choose} onSupport={support} />
      {done && <Text accessibilityLiveRegion="polite" style={[s.muted, { color: '#246944' }]}>Section saved.</Text>}
      {block.kind !== 'choice' && <Button primary={!done} disabled={learning.blocked || done} onPress={saveStep}>
        {block.kind === 'reflection' ? 'Save manual self-review' : 'Save study section'}
      </Button>}
      <View style={s.row}>
        {index > 0 && <Button disabled={learning.loading || learning.busy || !!learning.saveError} onPress={() => navigate(day.blocks[index - 1].id)}>Previous section</Button>}
        {index < day.blocks.length - 1 && <Button primary disabled={learning.loading || learning.busy || !!learning.saveError || (!done && !browseOnly)} onPress={next}>Next section</Button>}
      </View>
    </View>
    {!progress.completed && <View style={s.notice}>
      <Text style={s.body}>{progress.canComplete ? 'Every section is saved. You can now finish this study day.' : 'Keep going at your own pace. Complete every section to save the day.'}</Text>
      <Button primary={progress.canComplete} disabled={learning.blocked || !progress.canComplete} onPress={() => {
        setSelectedDay(day.id); learning.save([event('completion')]);
      }}>Complete study day</Button>
    </View>}
    {progress.completed && <View style={[s.notice, { backgroundColor: colors.green }]}>
      <Text accessibilityRole="header" style={s.heading}>Study day saved</Text>
      <Text style={s.body}>{nextDay ? 'This day is saved. Continue with another study day whenever you are ready, or revisit any section.' : 'You have finished all available draft days. Revisit either day or explore another topic whenever you like.'}</Text>
      <Text style={s.muted}>This records your study activity, not a proficiency level. These draft days await owner review; a complete course is not yet available.</Text>
      {nextDay && <Button primary disabled={navigationBlocked} onPress={() => selectDay(nextDay)}>Continue to day {nextDay.dayNumber}: {nextDay.title}</Button>}
    </View>}
    <CourseCredits course={course} />
  </View>;
}
