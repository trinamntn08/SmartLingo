import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Platform, Text, useWindowDimensions, View } from 'react-native';
import { frenchCourseLessonsByDay, getFrenchTopicPractice } from '@smartlingo/content';
import { courseDayProgress, courseDayProgressRevision, courseLessonStageForBlock, courseLessonStageId,
  type CourseDay, type CourseEvent, type LearningEvent, type Lesson, type OpenCourse } from '@smartlingo/domain';
import { useNavigation } from '../app/WebNavigation';
import { routeHref, type AppRoute, type LessonStage } from '../app/routes';
import { tabRoute } from '../app/useLearnerNavigation';
import { buildCourseListeningQuestion } from '../listening/lessonQuestions';
import { Button } from '../ui/controls';
import { getDailyDialoguePhoto } from '../ui/dialoguePhotos';
import { FrenchTransferPractice } from '../ui/FrenchTransferPractice';
import { LessonScreen } from '../ui/LessonScreen';
import { colors, designTokens, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { CourseCredits } from './CourseCredits';
import { buildCourseLesson } from './courseLessonContent';
import { CourseOutline } from './CourseOutline';
import { CourseWriteStatus } from './CourseWriteStatus';
import { RelatedCoursePractice } from './RelatedCoursePractice';
import type { CourseLearningModel } from './useCourseLearning';

type CourseRoute = Extract<AppRoute, { kind: 'course' }>;

interface CourseProps {
  course: OpenCourse;
  route: CourseRoute;
  recommendedDay: CourseDay;
  learning: CourseLearningModel;
  model: LearningModel;
  lessons: readonly Lesson[];
}

function resumeStage(day: CourseDay, progress: ReturnType<typeof courseDayProgress>): LessonStage {
  return courseLessonStageForBlock(day, progress.lastBlockId) ?? (progress.completed ? 'sentence' : 'dialogue');
}

export function OpenCoursePanel({ course, route, recommendedDay, learning, model, lessons }: CourseProps) {
  const { width } = useWindowDimensions();
  const compact = width < designTokens.layout.compactBreakpoint;
  const sidebar = Platform.OS === 'web' && width >= 900
    ? (width >= designTokens.layout.desktopNavBreakpoint ? 'wide' : 'medium') : undefined;
  const { backTo, navigate } = useNavigation();
  const learn = tabRoute('Learn', course.language);
  const outlineId = useId();
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [level, setLevel] = useState<CourseDay['level'] | 'All'>('All');
  const clock = useRef(0);

  const requestedDay = course.days.find(item => item.id === route.dayId);
  const day = requestedDay ?? recommendedDay;
  const progress = useMemo(() => courseDayProgress(course, day, learning.events), [course, day, learning.events]);
  const lesson = useMemo(() => buildCourseLesson(course, day), [course, day]);
  const authored = frenchCourseLessonsByDay.get(day.id);
  const transfer = authored && getFrenchTopicPractice(authored);
  const listeningQuestion = useMemo(() => buildCourseListeningQuestion(day, course.language), [day, course.language]);
  const invalidDay = !!route.dayId && !requestedDay;
  const requestedStage = !invalidDay ? courseLessonStageForBlock(day, route.sectionId) : undefined;
  const invalidStage = !invalidDay && !!route.sectionId && !requestedStage;
  const stage = requestedStage ?? resumeStage(day, progress);
  const sectionId = courseLessonStageId(stage);
  const browseOnly = !!learning.loadError;
  const disabled = learning.loading || learning.busy || !!learning.saveError || model.busy || !!model.saveError;

  useEffect(() => {
    if (learning.loading || invalidDay || invalidStage) return;
    if (route.dayId !== day.id || route.sectionId !== sectionId) {
      navigate({ ...route, dayId: day.id, sectionId }, { replace: true });
    }
  }, [day.id, invalidDay, invalidStage, learning.loading, navigate, route, sectionId]);

  function close() {
    backTo(learn, previous => 'language' in previous && previous.language === course.language
      && ['today', 'topics', 'letters', 'listening', 'speaking'].includes(previous.kind), true);
  }

  function eventFields(target: CourseDay, targetStage: LessonStage) {
    const latest = learning.events.reduce((value, saved) => Math.max(value, Date.parse(saved.occurredAt)), 0);
    clock.current = Math.max(Date.now(), clock.current + 1, latest + 1);
    return { id: crypto.randomUUID(), courseId: course.id, courseRevision: courseDayProgressRevision(course, target), dayId: target.id,
      blockId: courseLessonStageId(targetStage), occurredAt: new Date(clock.current).toISOString() };
  }

  function select(target: CourseDay, targetStage: LessonStage, snapshot?: Record<string, unknown>, studiedStage?: 'dialogue' | 'vocabulary') {
    if (disabled) return;
    if (target.id === day.id && targetStage === stage) { setOutlineOpen(false); return; }
    const destination = { ...route, dayId: target.id, sectionId: courseLessonStageId(targetStage) };
    function open(afterSave: boolean) {
      setOutlineOpen(false);
      navigate(destination, { afterSave, snapshot });
    }
    if (browseOnly) { open(false); return; }
    const events: CourseEvent[] = [];
    if (studiedStage) events.push({ ...eventFields(target, studiedStage), kind: 'study' });
    events.push({ ...eventFields(target, targetStage), kind: 'navigation' });
    learning.save(events, () => open(true));
  }

  function record(activity: LearningEvent['activity'], _itemId: string, result: LearningEvent['result'], hints: number, after?: () => void) {
    if (disabled || browseOnly || (activity !== 'picture' && activity !== 'sentence')) return;
    const outcome = result === 'correct' ? 'correct' : 'incorrect';
    learning.save([{ ...eventFields(day, activity), kind: 'choice', choiceId: outcome, result: outcome, supported: hints > 0 }], after);
  }

  const following = course.days[day.dayNumber];
  const nextLesson = following && {
    title: `Lesson ${following.dayNumber}: ${following.title}`,
    href: routeHref({ ...route, dayId: following.id, sectionId: undefined }),
    onOpen: () => select(following, resumeStage(following, courseDayProgress(course, following, learning.events))),
  };
  const outline = (sidebar || outlineOpen) && <CourseOutline id={outlineId} sidebar={sidebar} course={course} route={route} day={day}
    events={learning.events} level={level} onLevelChange={setLevel} blocked={disabled}
    onDay={target => select(target, resumeStage(target, courseDayProgress(course, target, learning.events)))} />;

  return <View testID="open-course-panel" style={[s.card,
    { minWidth: 0, padding: compact ? 8 : 16, gap: compact ? 8 : 20, borderTopWidth: 4, borderTopColor: colors.yellow }]}>
    <View style={[s.row, { justifyContent: 'space-between', gap: compact ? 6 : 16 }]}>
      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: compact ? '100%' : 260, minWidth: 0, gap: 2 }}>
        <Text accessibilityRole="header" style={[s.heading, compact ? designTokens.typography.label : { fontSize: 21 }]}>{course.title}</Text>
        {!compact && <Text style={s.muted}>{course.days.length} guided {course.days.length === 1 ? 'lesson' : 'lessons'} · Draft preview</Text>}
      </View>
      <View style={[s.row, { flexGrow: compact ? 1 : 0, justifyContent: compact ? 'space-between' : 'flex-end', gap: 6 }]}>
        <Button compact quiet icon="arrow-left" label="Close course" href={routeHref(learn)} disabled={disabled} onPress={close}>
          {compact ? 'Close' : 'Close course'}
        </Button>
        {!sidebar && <Button compact expanded={outlineOpen} controls={outlineOpen ? outlineId : undefined}
          trailingIcon={outlineOpen ? 'chevron-down' : 'chevron'} onPress={() => setOutlineOpen(value => !value)}>Course outline</Button>}
      </View>
    </View>
    {learning.loading && <Text accessibilityLiveRegion="polite" style={s.muted}>Loading saved course progress…</Text>}
    {!learning.loading && (invalidDay || invalidStage) && <View style={s.notice}>
      <Text accessibilityRole="alert" style={s.body}>{invalidDay ? 'That lesson is unavailable. Your current lesson is shown here.' : 'That step is unavailable. Your available step is shown here.'}</Text>
      <Button disabled={disabled} onPress={() => navigate({ ...route, dayId: day.id, sectionId }, { replace: true })}>Open this step</Button>
    </View>}
    {browseOnly && <View style={s.error}>
      <Text accessibilityRole="alert" style={s.body}>{learning.loadError}</Text>
      <Text style={s.muted}>You can browse every step. Progress cannot be saved until browser storage is available.</Text>
      <Button onPress={() => void learning.load()}>Retry course storage</Button>
    </View>}
    <CourseWriteStatus learning={learning} />
    <View testID="course-journey" style={{ gap: compact ? 8 : 16, minWidth: 0,
      ...(sidebar ? { flexDirection: 'row', alignItems: 'flex-start' } : {}) }}>
      {outline}
      <View style={{ gap: 16, minWidth: 0, flex: sidebar ? 1 : undefined }}>
        <LessonScreen key={`${lesson.id}.${lesson.revision}`} lesson={lesson} model={model} onExit={close}
          extraPractice={transfer && <FrenchTransferPractice lessonId={lesson.id} {...transfer} checks={[transfer.check]} />}
          timeEstimate={course.language === 'fr-FR' ? `About ${lesson.durationMinutes} min` : undefined} courseSession={{
          stage, progress: { wordsStudied: progress.lessonWordsStudied, pictureDone: progress.lessonPictureDone,
            sentenceDone: progress.lessonSentenceDone, completed: progress.completed },
          exitHref: routeHref(learn), disabled, browseOnly, nextLesson, listeningQuestion, dialoguePhoto: getDailyDialoguePhoto(day.id),
          stageHref: targetStage => routeHref({ ...route, dayId: day.id, sectionId: courseLessonStageId(targetStage) }),
          changeStage: (targetStage, snapshot) => select(day, targetStage, snapshot),
          studyDialogue: snapshot => select(day, 'vocabulary', snapshot, 'dialogue'),
          studyWords: (targetStage, snapshot) => select(day, targetStage, snapshot, 'vocabulary'), record,
        }} />
        {stage === 'sentence' && <RelatedCoursePractice section={{ ...route, dayId: day.id, sectionId }} lessons={lessons} disabled={disabled} />}
        <CourseCredits course={course} />
      </View>
    </View>
  </View>;
}
