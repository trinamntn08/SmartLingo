import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { courseDayProgress, gradeCourseChoice, nextCourseDay, type CourseDay, type CourseEvent, type OpenCourse } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { CourseCredits } from './CourseCredits';
import { CourseBlockView } from './CourseBlockView';
import { useCourseLearning } from './useCourseLearning';

export function OpenCoursePanel({ course, model, title = 'Your daily course', testID = 'open-course-panel',
  openLabel = 'Open daily course', closeLabel = 'Close daily course' }: {
  course: OpenCourse; model: LearningModel; title?: string; testID?: string; openLabel?: string; closeLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  return <View testID={testID} style={[s.card, { minWidth: 0, padding: 18 }]}>
    <Text accessibilityRole="header" style={s.heading}>{title}</Text>
    <Text style={s.eyebrow}>{course.days.length} study {course.days.length === 1 ? 'day' : 'days'} available · Draft preview</Text>
    <Text style={s.body}>{course.title}</Text>
    <Text style={s.body}>{course.description}</Text>
    {course.days.length > 1 && <Text style={s.muted}>Level labels are estimated draft task levels. This route does not establish complete CEFR coverage or certify proficiency.</Text>}
    <Text style={s.muted}>Study at your own pace. Your next study day waits for you; missed dates never skip material.</Text>
    <Button primary onPress={() => setOpen(value => !value)}>{open ? closeLabel : openLabel}</Button>
    {open && <CourseJourney key={`${course.id}.${course.revision}`} course={course} model={model} />}
  </View>;
}

function CourseJourney({ course, model }: { course: OpenCourse; model: LearningModel }) {
  const learning = useCourseLearning();
  // Restore the latest valid cursor for this course before suggesting unfinished work.
  // Keep day and section together so a saved next-day navigation cannot inherit the old section.
  const [cursor, setCursor] = useState<{ dayId: string; blockId: string }>();
  const [level, setLevel] = useState<string>('all');
  const clock = useRef(0);
  const courseEvents = learning.events.filter(event => event.courseId === course.id && event.courseRevision === course.revision);
  const resume = [...courseEvents].sort((left, right) => Date.parse(right.occurredAt) - Date.parse(left.occurredAt) || right.id.localeCompare(left.id))
    .find(event => course.days.some(item => item.id === event.dayId && item.blocks.some(block => block.id === event.blockId)));
  const day = course.days.find(item => item.id === (cursor?.dayId ?? resume?.dayId)) ?? nextCourseDay(course, courseEvents) ?? course.days.at(-1);
  if (!day) return <View style={s.notice}><Text style={s.body}>No study days are available in this draft yet.</Text><CourseCredits course={course} /></View>;
  const progress = courseDayProgress(course, day, learning.events);
  const block = day.blocks.find(item => item.id === (cursor?.dayId === day.id ? cursor.blockId : resume?.dayId === day.id ? resume.blockId : progress.lastBlockId)) ?? day.blocks[0];
  const index = day.blocks.findIndex(item => item.id === block.id);
  const scopedEvents = learning.events.filter(event => event.courseId === course.id && event.courseRevision === course.revision && event.dayId === day.id);
  const done = progress.completedBlockIds.has(block.id);
  const browseOnly = !!learning.loadError;
  const navigationBlocked = learning.loading || learning.busy || !!learning.saveError;
  const followingDay = course.days[course.days.findIndex(item => item.id === day.id) + 1];

  function event(kind: CourseEvent['kind'], blockId = block.id, dayId = day!.id): CourseEvent {
    const latest = learning.events.reduce((value, saved) => Math.max(value, Date.parse(saved.occurredAt)), 0);
    clock.current = Math.max(Date.now(), clock.current + 1, latest + 1);
    return { id: crypto.randomUUID(), courseId: course.id, courseRevision: course.revision, dayId,
      blockId, occurredAt: new Date(clock.current).toISOString(), kind } as CourseEvent;
  }
  function navigate(id: string, targetDay: CourseDay = day!) {
    if (navigationBlocked) return;
    const target = { dayId: targetDay.id, blockId: id };
    if (browseOnly) { setCursor(target); return; }
    learning.save([event('navigation', id, targetDay.id)], () => setCursor(target));
  }
  function visitDay(target: CourseDay) {
    const saved = courseDayProgress(course, target, courseEvents);
    navigate(saved.lastBlockId, target);
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
    {course.days.length > 1 && <View testID="course-day-browser" style={[s.notice, { gap: 12 }]}>
      <Text accessibilityRole="header" style={s.heading}>Choose a study day</Text>
      <Text style={s.muted}>Explore freely or continue in order. Browsing a day does not complete it.</Text>
      <View style={s.row}>{['all', ...new Set(course.days.map(item => item.level))].map(value => <Button key={value}
        selected={level === value} onPress={() => setLevel(value)}>{value === 'all' ? 'All levels' : value === 'foundation' ? 'Foundations' : value}</Button>)}</View>
      <View style={s.row}>{course.days.filter(item => level === 'all' || item.level === level).map(item => <Button key={item.id}
        label={`Day ${item.dayNumber}: ${item.title}`} selected={item.id === day.id} disabled={navigationBlocked} onPress={() => visitDay(item)}>
        {item.dayNumber}. {item.title} · {item.level === 'foundation' ? 'Foundations' : item.level}
      </Button>)}</View>
    </View>}
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
      <CourseBlockView key={block.id} block={block} day={day} language={course.language} model={model} events={scopedEvents}
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
        setCursor({ dayId: day.id, blockId: block.id }); learning.save([event('completion')]);
      }}>Complete study day</Button>
    </View>}
    {progress.completed && <View style={[s.notice, { backgroundColor: colors.green }]}>
      <Text accessibilityRole="header" style={s.heading}>Study day saved</Text>
      <Text style={s.body}>{followingDay ? 'Continue when you are ready, or revisit any section of this day.' : 'You have finished the available draft day. Revisit any section or explore another topic whenever you like.'}</Text>
      <Text style={s.muted}>This records your study activity, not a proficiency level.{course.days.length === 1 ? ' More study days are not yet available in this pilot.' : ''}</Text>
      {followingDay && <Button primary disabled={navigationBlocked} onPress={() => { setLevel('all'); visitDay(followingDay); }}>Continue to next study day</Button>}
    </View>}
  </View>;
}
