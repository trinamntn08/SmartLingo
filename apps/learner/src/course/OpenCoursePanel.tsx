import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { courseDayProgress, gradeCourseChoice, nextCourseDay, type CourseEvent, type OpenCourse } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { CourseCredits } from './CourseCredits';
import { CourseBlockView } from './CourseBlockView';
import { useCourseLearning } from './useCourseLearning';

export function OpenCoursePanel({ course, model }: { course: OpenCourse; model: LearningModel }) {
  const [open, setOpen] = useState(false);
  return <View testID="open-course-panel" style={[s.card, { minWidth: 0, padding: 18 }]}>
    <Text accessibilityRole="header" style={s.heading}>Your daily course</Text>
    <Text style={s.eyebrow}>{course.days.length} study {course.days.length === 1 ? 'day' : 'days'} available · Draft preview</Text>
    <Text style={s.body}>{course.title}</Text>
    <Text style={s.muted}>Study at your own pace. Your next study day waits for you; missed dates never skip material.</Text>
    <Button primary onPress={() => setOpen(value => !value)}>{open ? 'Close daily course' : 'Open daily course'}</Button>
    {open && <CourseJourney course={course} model={model} />}
  </View>;
}

function CourseJourney({ course, model }: { course: OpenCourse; model: LearningModel }) {
  const learning = useCourseLearning();
  // Keep a selected day stable while its completion event changes nextCourseDay.
  const [selectedDay, setSelectedDay] = useState<string>();
  const [selectedBlock, setSelectedBlock] = useState<string>();
  const clock = useRef(0);
  const day = course.days.find(item => item.id === selectedDay) ?? nextCourseDay(course, learning.events) ?? course.days.at(-1);
  if (!day) return <View style={s.notice}><Text style={s.body}>No study days are available in this draft yet.</Text><CourseCredits course={course} /></View>;
  const progress = courseDayProgress(course, day, learning.events);
  const block = day.blocks.find(item => item.id === selectedBlock) ?? day.blocks.find(item => item.id === progress.lastBlockId) ?? day.blocks[0];
  const index = day.blocks.findIndex(item => item.id === block.id);
  const scopedEvents = learning.events.filter(event => event.courseId === course.id && event.courseRevision === course.revision && event.dayId === day.id);
  const done = progress.completedBlockIds.has(block.id);
  const browseOnly = !!learning.loadError;

  function event(kind: CourseEvent['kind'], blockId = block.id): CourseEvent {
    const latest = learning.events.reduce((value, saved) => Math.max(value, Date.parse(saved.occurredAt)), 0);
    clock.current = Math.max(Date.now(), clock.current + 1, latest + 1);
    return { id: crypto.randomUUID(), courseId: course.id, courseRevision: course.revision, dayId: day!.id,
      blockId, occurredAt: new Date(clock.current).toISOString(), kind } as CourseEvent;
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
    <CourseCredits course={course} />
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
    <Text accessibilityRole="header" style={s.heading}>Day {day.dayNumber}: {day.title}</Text>
    <Text style={s.body}>{day.outcome}</Text>
    <Text accessibilityLiveRegion="polite" style={s.muted}>{progress.completedBlockIds.size} of {day.blocks.length} sections saved</Text>
    <View style={s.progressTrack}><View style={[s.progressFill, { width: `${100 * progress.completedBlockIds.size / day.blocks.length}%` }]} /></View>
    <Text style={s.muted}>Browse any section. Save each study section and finish the practice before completing the day.</Text>
    <View style={s.row}>{day.blocks.map((item, position) => <Button key={item.id} label={`Section ${position + 1}: ${item.title}`}
      selected={item.id === block.id} disabled={learning.loading || learning.busy || !!learning.saveError} onPress={() => navigate(item.id)}>
      {position + 1}. {item.title}{progress.completedBlockIds.has(item.id) ? ' ✓' : ''}
    </Button>)}</View>
    <View testID={`course-block-${block.id}`} style={{ gap: 16, minWidth: 0 }}>
      <Text style={s.eyebrow}>Section {index + 1} of {day.blocks.length}</Text>
      <Text accessibilityRole="header" style={s.heading}>{block.title}</Text>
      <CourseBlockView key={block.id} block={block} day={day} model={model} events={scopedEvents}
        blocked={learning.blocked} revealBlocked={learning.loading || learning.busy || !!learning.saveError} onChoice={choose} onSupport={support} />
      {done && <Text accessibilityLiveRegion="polite" style={[s.muted, { color: '#246944' }]}>Section saved.</Text>}
      {block.kind !== 'choice' && <Button primary disabled={learning.blocked || done} onPress={saveStep}>
        {block.kind === 'reflection' ? 'Save manual self-review' : 'Save study section'}
      </Button>}
      <View style={s.row}>
        {index > 0 && <Button disabled={learning.loading || learning.busy || !!learning.saveError} onPress={() => navigate(day.blocks[index - 1].id)}>Previous section</Button>}
        {index < day.blocks.length - 1 && <Button primary disabled={learning.loading || learning.busy || !!learning.saveError || (!done && !browseOnly)} onPress={next}>Next section</Button>}
      </View>
    </View>
    {!progress.completed && <View style={s.notice}>
      <Text style={s.body}>{progress.canComplete ? 'Every section is saved. You can now finish this study day.' : 'Keep going at your own pace. Complete every section to save the day.'}</Text>
      <Button primary disabled={learning.blocked || !progress.canComplete} onPress={() => {
        setSelectedDay(day.id); learning.save([event('completion')]);
      }}>Complete study day</Button>
    </View>}
    {progress.completed && <View style={[s.notice, { backgroundColor: colors.green }]}>
      <Text accessibilityRole="header" style={s.heading}>Study day saved</Text>
      <Text style={s.body}>You have finished the available draft day. Revisit any section or explore another topic whenever you like.</Text>
      <Text style={s.muted}>This records your study activity, not a proficiency level. More study days are not yet available in this pilot.</Text>
    </View>}
  </View>;
}
