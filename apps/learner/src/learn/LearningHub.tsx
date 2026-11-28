import { useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { type Lesson, type LessonTopic, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { Disclosure } from '../ui/Disclosure';
import { colors, designTokens, styles as s } from '../ui/theme';
import { TopicCatalogue, type CatalogueSearch } from '../ui/TopicCatalogue';
import type { LearningModel } from '../ui/useLearning';
import { ListeningResources } from '../listening/ListeningResources';
import { ListeningComprehension } from '../listening/ListeningComprehension';
import { GuidedSpeaking } from '../practice/GuidedSpeaking';
import { FrenchPractice } from '../practice/FrenchPractice';
import { JapaneseAlphabet } from '../alphabet/JapaneseAlphabet';
import { useNavigation } from '../app/WebNavigation';
import { routeHref, topicRouteKey } from '../app/routes';
import { learnRoute } from '../app/useLearnerNavigation';
import { CourseLaunchCard, type CourseLaunchProps } from '../course/CourseLaunchCard';

export const learnModes = ['Lessons', 'Listening & videos', 'Speaking'] as const;
export type LearnMode = typeof learnModes[number];

export function LearningHub({ language, lessons, model, mode, kanaLesson, onMode, selectedTopic, onSelectTopic, onOpen, disabled, active, catalogueSearch, topics, topicNavigation, courseLaunch }: {
  language: TargetLanguage; lessons: Lesson[]; model: LearningModel; mode: LearnMode; courseLaunch: CourseLaunchProps;
  kanaLesson: boolean;
  onMode: (mode: LearnMode) => void; selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void; onOpen: (lesson: Lesson) => void;
  disabled: boolean; active: boolean;
  catalogueSearch: CatalogueSearch;
  topics: LessonTopic[];
  topicNavigation: ReactNode;
}) {
  const studyLessons = selectedTopic ? lessons.filter(lesson => lesson.topic === selectedTopic) : lessons;
  const conversationLessons = studyLessons.filter(lesson => lesson.language === 'fr-FR' && lesson.level !== 'B1');
  const { width } = useWindowDimensions();
  const compact = width < designTokens.layout.compactBreakpoint;
  const materialFirst = kanaLesson || (!!selectedTopic && mode === 'Lessons' && compact);
  const showCourseCard = !kanaLesson && !selectedTopic && mode === 'Lessons';
  const courseCard = showCourseCard && (compact ? <CompactCourseEntry {...courseLaunch} /> : <CourseLaunchCard {...courseLaunch} />);
  const courseShortcut = !showCourseCard && <Button compact icon="calendar" href={courseLaunch.href}
    disabled={courseLaunch.disabled || courseLaunch.loading} onPress={courseLaunch.onOpen}>Course</Button>;
  const hrefForMode = (choice: LearnMode) => routeHref(learnRoute(choice, language, selectedTopic ? topicRouteKey(selectedTopic) : undefined));
  const sectionNavigation = <View style={[hub.sectionNavigation, materialFirst && hub.trailingNavigation]}>
    <View role="navigation" accessibilityLabel="Learning sections" style={hub.modes}>
      {learnModes.map(choice => <Button compact quiet key={choice} selected={choice === mode} disabled={disabled} onPress={() => onMode(choice)} href={hrefForMode(choice)}>{choice}</Button>)}
      {courseShortcut}
    </View>
    {!!selectedTopic && mode !== 'Lessons' && <View style={hub.modes}>
      <Text style={s.muted}>{selectedTopic}</Text><Button compact quiet disabled={disabled} onPress={() => onSelectTopic(null)}>All topics</Button>
    </View>}
  </View>;
  return <View style={hub.page}>
    {courseCard}
    {!materialFirst && sectionNavigation}
    {topicNavigation}
    {kanaLesson ? <JapaneseAlphabet model={model} />
      : mode === 'Lessons' ? <TopicCatalogue key={language} language={language} lessons={lessons} topics={topics} model={model}
        onOpen={onOpen} selectedTopic={selectedTopic} onSelectTopic={onSelectTopic} search={catalogueSearch} disabled={disabled} />
      : mode === 'Listening & videos' ? <ListeningSection key={`${language}:${selectedTopic ?? 'all'}`}
        lessons={studyLessons} language={language} active={active} /> : <>
        <GuidedSpeaking key={`${language}:${selectedTopic ?? 'all'}`} lessons={studyLessons} />
        {active && conversationLessons.length > 0 && <Disclosure title="Optional AI conversation" description="Try a temporary French exchange with English feedback." keepMounted={false}>
          <FrenchPractice lessons={conversationLessons} model={model} active={active} />
        </Disclosure>}
      </>}
    {materialFirst && sectionNavigation}
  </View>;
}

function CompactCourseEntry({ course, day, status, loading, disabled, href, onOpen }: CourseLaunchProps) {
  return <View style={[s.card, hub.courseEntry]} testID="open-course-panel">
    <Text style={hub.courseTitle}>{course.title}</Text>
    <Text style={s.body}>{loading ? 'Loading course progress…' : `Lesson ${day.dayNumber}: ${day.title}`}</Text>
    {status === 'unavailable' && <Text accessibilityLiveRegion="polite" style={s.muted}>Saved course progress is unavailable. You can still study.</Text>}
    <View style={hub.modes}>
      <Button compact primary href={href} disabled={loading || disabled} onPress={onOpen}>Open course</Button>
    </View>
  </View>;
}

const hub = StyleSheet.create({
  page: { gap: 20, minWidth: 0 },
  sectionNavigation: { gap: 4, paddingBottom: 8, borderBottomWidth: 1, borderColor: colors.line },
  trailingNavigation: { paddingBottom: 0, paddingTop: 8, borderBottomWidth: 0, borderTopWidth: 1 },
  modes: { ...s.row, gap: 4 },
  courseEntry: { padding: 12, gap: 4 },
  courseTitle: { ...designTokens.typography.smallLabel, color: colors.primary },
});

function ListeningSection({ lessons, language, active }: { lessons: Lesson[]; language: TargetLanguage; active: boolean }) {
  const { route, navigate, backTo } = useNavigation();
  const listening = route.kind === 'listening' ? route : undefined;
  const browsing = !!listening?.library;
  const previousView = useRef(browsing);
  const practiceHeading = useId();
  const libraryHeading = useId();

  useLayoutEffect(() => {
    if (previousView.current === browsing) return;
    previousView.current = browsing;
    if (Platform.OS !== 'web') return;
    const heading = document.getElementById(browsing ? libraryHeading : practiceHeading);
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'nearest' });
  }, [browsing, libraryHeading, practiceHeading]);

  const topic = listening?.topic;
  if (browsing) return <ListeningResources language={language} headingId={libraryHeading} onClose={() => backTo({ kind: 'listening', language, topic },
    previous => previous.kind === 'listening' && previous.language === language && previous.topic === topic && !previous.library && !previous.chooser, true)} />;
  return <ListeningComprehension lessons={lessons} active={active} headingId={practiceHeading} onBrowse={() => navigate({ kind: 'listening', language, topic, library: true }, { replace: listening?.chooser })} />;
}
