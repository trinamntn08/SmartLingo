import { useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import { Platform, Text, useWindowDimensions, View } from 'react-native';
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
import { isAndroidApp } from '../platform/runtime';
import { JapaneseAlphabet } from '../alphabet/JapaneseAlphabet';
import { useNavigation } from '../app/WebNavigation';
import { routeHref, topicRouteKey } from '../app/routes';
import { learnRoute } from '../app/useLearnerNavigation';
import { CourseLaunchCard, OtherFrenchCourses, type CourseLaunchProps } from '../course/CourseLaunchCard';

export const learnModes = ['Japanese letters', 'Lessons', 'Listening & videos', 'Speaking'] as const;
export type LearnMode = typeof learnModes[number];

export function LearningHub({ language, lessons, model, mode, onMode, selectedTopic, onSelectTopic, onOpen, disabled, active, catalogueSearch, topics, topicNavigation, courseLaunch, otherCourses }: {
  language: TargetLanguage; lessons: Lesson[]; model: LearningModel; mode: LearnMode; courseLaunch: CourseLaunchProps;
  otherCourses: readonly CourseLaunchProps[];
  onMode: (mode: LearnMode) => void; selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void; onOpen: (lesson: Lesson) => void;
  disabled: boolean; active: boolean;
  catalogueSearch: CatalogueSearch;
  topics: LessonTopic[];
  topicNavigation: ReactNode;
}) {
  const studyLessons = selectedTopic ? lessons.filter(lesson => lesson.topic === selectedTopic) : lessons;
  const conversationLessons = studyLessons.filter(lesson => lesson.language === 'fr-FR' && lesson.level !== 'B1');
  const visibleModes = learnModes.filter(choice => language === 'ja-JP' || choice !== 'Japanese letters');
  const activeMode = visibleModes.includes(mode) ? mode : 'Lessons';
  const { width } = useWindowDimensions();
  const lessonsLead = !!selectedTopic && activeMode === 'Lessons' && width < designTokens.layout.compactBreakpoint;
  const showCourseCard = !selectedTopic && (activeMode === 'Lessons' || activeMode === 'Japanese letters');
  const courseShortcut = !showCourseCard && <Button compact icon="calendar" href={courseLaunch.href}
    disabled={courseLaunch.disabled || courseLaunch.loading} onPress={courseLaunch.onOpen}>Course</Button>;
  const hrefForMode = (choice: LearnMode) => routeHref(learnRoute(choice, language, selectedTopic ? topicRouteKey(selectedTopic) : undefined));
  const sectionNavigation = <View style={{ gap: 10, paddingBottom: 12, borderBottomWidth: 1, borderColor: colors.line }}>
      <View accessibilityLabel="Learning sections" style={s.row}>
        {visibleModes.map(choice => <Button compact quiet key={choice} selected={choice === activeMode} disabled={disabled} onPress={() => onMode(choice)} href={hrefForMode(choice)}>{choice}</Button>)}
        {courseShortcut}
      </View>
      {!!selectedTopic && activeMode !== 'Lessons' && activeMode !== 'Japanese letters' && <View style={s.row}>
        <Text style={s.muted}>{selectedTopic}</Text><Button compact quiet disabled={disabled} onPress={() => onSelectTopic(null)}>All topics</Button>
      </View>}
    </View>;
  return <View style={{ gap: 16, minWidth: 0 }}>
    {showCourseCard && <>
      <CourseLaunchCard {...courseLaunch} />
      <OtherFrenchCourses courses={otherCourses} />
    </>}
    {!lessonsLead && sectionNavigation}
    {topicNavigation}
    {activeMode === 'Japanese letters' && language === 'ja-JP' ? <JapaneseAlphabet model={model} />
      : activeMode === 'Lessons' ? <TopicCatalogue key={language} language={language} lessons={lessons} topics={topics} model={model}
        onOpen={onOpen} selectedTopic={selectedTopic} onSelectTopic={onSelectTopic} search={catalogueSearch} disabled={disabled} />
      : activeMode === 'Listening & videos' ? <ListeningSection key={`${language}:${selectedTopic ?? 'all'}`}
        lessons={studyLessons} language={language} active={active} /> : <>
        <GuidedSpeaking key={`${language}:${selectedTopic ?? 'all'}`} lessons={studyLessons} />
        {!isAndroidApp() && active && conversationLessons.length > 0 && <Disclosure title="Optional AI conversation" description="Try a temporary French exchange with English feedback." keepMounted={false}>
          <FrenchPractice lessons={conversationLessons} model={model} active={active} />
        </Disclosure>}
      </>}
    {lessonsLead && sectionNavigation}
  </View>;
}

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
