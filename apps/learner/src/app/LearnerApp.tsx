import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { courseLessonStageForBlock, groupLessonTopics, languageNames, notebookLanguage, type CourseDay, type OpenCourse, type TargetLanguage } from '@smartlingo/domain';
import { getFrenchTopicPractice, languageCurricula } from '@smartlingo/content';
import { FrenchTransferPractice, frenchTopicPracticeMinutes } from '../ui/FrenchTransferPractice';
import { isAlphabetLessonId } from '../alphabet/progress';
import { useCatalogue } from '../content/useCatalogue';
import type { CourseLaunchProps } from '../course/CourseLaunchCard';
import { courseNavigationEvent, courseRecommendation, latestCourseStudy } from '../course/courseRecommendation';
import { CourseSelection } from '../course/CourseSelection';
import { OpenCoursePanel } from '../course/OpenCoursePanel';
import { CourseWriteStatus } from '../course/CourseWriteStatus';
import { useCourseLearning } from '../course/useCourseLearning';
import { TodayDashboard } from '../dashboard/TodayDashboard';
import { LearningReportScreen } from '../dashboard/LearningReportScreen';
import { learnerContentId, LearnerNavigation, LearnerSkipLinks } from '../dashboard/LearnerNavigation';
import { useLearningReport } from '../dashboard/useLearningReport';
import { useTargetLanguage } from '../language/useTargetLanguage';
import { LanguageChooser } from '../language/LanguageChooser';
import { LearningHub } from '../learn/LearningHub';
import { ProfileScreen } from '../profile/ProfileScreen';
import { Button } from '../ui/controls';
import { LessonScreen } from '../ui/LessonScreen';
import { Notebook } from '../ui/Notebook';
import { SlangCatalogue } from '../ui/SlangCatalogue';
import { BrandHome } from '../ui/BrandHome';
import { TopicSidebar } from '../ui/TopicSidebar';
import { colors, designTokens, styles as s } from '../ui/theme';
import { useLearning, type LearningModel } from '../ui/useLearning';
import { tabRoute, useLearnerNavigation } from './useLearnerNavigation';
import { useNavigation } from './WebNavigation';
import { routeHref } from './routes';

interface LearnerAppProps {
  active: boolean;
  onOpenEditor: () => void;
}

export function LearnerApp({ active, onOpenEditor }: LearnerAppProps) {
  const catalogue = useCatalogue();
  const globalModel = useLearning();
  const courseLearning = useCourseLearning();
  const selection = useTargetLanguage();
  const [childWriteBlocked, setChildWriteBlocked] = useState(false);
  const switchingBlocked = globalModel.busy || !!globalModel.saveError || childWriteBlocked || courseLearning.busy || !!courseLearning.saveError;
  const navigation = useNavigation();
  const { registerBlock, read, write } = navigation;
  useLayoutEffect(() => {
    registerBlock(active && switchingBlocked, 'learner');
    return () => registerBlock(false, 'learner');
  }, [active, switchingBlocked, registerBlock]);
  const { route, visit, language, choosing, tab, lesson, selectedTopic, learnMode, navigate, selectTopic, selectLearnMode,
    openLearnMode, openLesson, exitLesson, chooseLanguage, chooseHome, changeLanguage, catalogueSearch } = useLearnerNavigation({
    preferred: selection.language, active, blocked: switchingBlocked, onChooseLanguage: selection.choose, lessons: catalogue.lessons,
  });
  // Scope reads to the active language; all write operations still use the shared learning model.
  const model: LearningModel = { ...globalModel,
    notebook: globalModel.notebook.filter(entry => language && notebookLanguage(entry) === language),
    events: globalModel.events.filter(event => (language === 'ja-JP' && isAlphabetLessonId(event.lessonId)) || catalogue.lessons.some(lesson => lesson.id === event.lessonId && lesson.language === language)),
  };
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const { width } = useWindowDimensions();
  const compact = width < designTokens.layout.compactBreakpoint;
  const compactReader = compact && (route.kind === 'course' || !!lesson);
  const mobileNav = width < designTokens.layout.fullNavBreakpoint;
  const pickerOpen = route.kind === 'courses' && !route.courseId;
  const previouslyPicking = useRef(false);
  useLayoutEffect(() => {
    if (previouslyPicking.current && !pickerOpen && route.kind !== 'courses' && typeof document !== 'undefined') {
      document.getElementById('learn-courses-trigger')?.focus({ preventScroll: true });
    }
    previouslyPicking.current = pickerOpen;
  }, [pickerOpen, route.kind]);
  useLayoutEffect(() => {
    if (active && !catalogue.loading && !model.loading) scroll.current?.scrollTo({ y: Number(read('learner.scroll') ?? 0), animated: false });
  }, [visit, active, catalogue.loading, model.loading]);
  const showLibrary = route.kind === 'topics' && !choosing;
  const lessons = useMemo(() => catalogue.lessons.filter(lesson => lesson.language === language), [catalogue.lessons, language]);
  const topics = useMemo(() => groupLessonTopics(lessons), [lessons]);
  const wideLibrary = showLibrary && width >= designTokens.layout.sidebarBreakpoint;
  const courses = languageCurricula[language ?? 'fr-FR'].courses;
  const reportState = useLearningReport({ language: language ?? 'fr-FR', lessons, courses });
  const reportVisible = !!language && !choosing && !lesson && tab === 'Report';
  useEffect(() => {
    if (reportVisible && !childWriteBlocked && !globalModel.busy && !globalModel.loading && !globalModel.loadError) void reportState.refresh();
  }, [reportVisible, tab, childWriteBlocked, globalModel.busy, globalModel.loading, globalModel.loadError, globalModel.events, globalModel.notebook, reportState.refresh]);
  useEffect(() => {
    if (model.saveError || courseLearning.saveError) scroll.current?.scrollTo({ y: 0, animated: false });
  }, [model.saveError, courseLearning.saveError]);

  const courseUnavailable = !!courseLearning.loadError;
  const recommendations = useMemo(() => courses.map(course => ({
    course, ...courseRecommendation(course, courseLearning.events, courseUnavailable),
  })), [courses, courseLearning.events, courseUnavailable]);
  const latestStudy = useMemo(() => latestCourseStudy(courses, courseLearning.events), [courses, courseLearning.events]);
  const courseLaunches: CourseLaunchProps[] = recommendations.map(recommendation => {
    const { course, day } = recommendation;
    const startRoute = { kind: 'course', language: course.language, courseId: course.id, dayId: day.id } as const;
    return { ...recommendation, loading: courseLearning.loading, href: routeHref(startRoute),
      disabled: switchingBlocked, onOpen: () => navigation.navigate(startRoute) };
  });
  const courseLaunch = courseLaunches.find(item => item.course.id === latestStudy?.courseId) ?? courseLaunches[0]!;
  const selectedCourse = route.kind === 'courses' && route.courseId
    ? courseLaunches.find(item => item.course.id === route.courseId) : undefined;
  const activeCourse = route.kind === 'course' ? recommendations.find(item => item.course.id === route.courseId) : undefined;
  const missingDestination = route.kind === 'unavailable' || (route.kind === 'lesson' && !lesson)
    || (route.kind === 'course' && !activeCourse)
    || (route.kind === 'courses' && !!route.courseId && !selectedCourse)
    || (route.kind === 'topics' && !!selectedTopic && !topics.some(topic => topic.name === selectedTopic));
  const courseVisible = route.kind === 'course' && !missingDestination && !model.loading && !catalogue.loading;

  function startChosenCourse(course: OpenCourse, day: CourseDay) {
    if (switchingBlocked || courseLearning.loading) return;
    const destination = { kind: 'course', language: course.language, courseId: course.id, dayId: day.id } as const;
    if (courseUnavailable) { navigation.navigate(destination); return; }
    const event = courseNavigationEvent(course, day, courseLearning.events);
    courseLearning.save([event], () => navigation.navigate({ ...destination, sectionId: event.blockId }, { afterSave: true }));
  }

  function unavailable() {
    return <View style={s.card}>
      <Text accessibilityRole="header" style={s.heading}>This learning link is unavailable</Text>
      <View style={s.row}><Button onPress={() => language ? selectTopic(null) : chooseHome()}>{language ? 'Browse all lessons' : 'Choose a language'}</Button></View>
    </View>;
  }

  function renderDestination(targetLanguage: TargetLanguage) {
    if (missingDestination) return unavailable();
    if (lesson) {
      const link = route.kind === 'lesson' ? route.studyDay : undefined;
      const day = link && courses.find(course => course.id === link.courseId)?.days.find(item => item.id === link.dayId);
      const studyDay = link && day && courseLessonStageForBlock(day, link.sectionId)
        ? { kind: 'course', language: targetLanguage, ...link } as const : undefined;
      const topicLessons = studyDay ? undefined : topics.find(topic => topic.name === lesson.topic)?.lessons;
      const index = topicLessons?.findIndex(item => item.id === lesson.id) ?? -1;
      const sequence = topicLessons && index >= 0 ? {
        position: index + 1, total: topicLessons.length, previous: topicLessons[index - 1], next: topicLessons[index + 1], open: openLesson,
      } : undefined;
      const transfer = getFrenchTopicPractice(lesson);
      return <LessonScreen key={`${lesson.id}.${lesson.revision}`} lesson={lesson} model={model}
        timeEstimate={transfer && frenchTopicPracticeMinutes}
        extraPractice={transfer && <FrenchTransferPractice lessonId={lesson.id} {...transfer} checks={[transfer.check]} />}
        studyDayHref={studyDay && routeHref(studyDay)} sequence={sequence} onExit={() => exitLesson(studyDay)} routed />;
    }
    if (route.kind === 'course' && activeCourse) return <OpenCoursePanel key={activeCourse.course.id} route={route} course={activeCourse.course}
      recommendedDay={activeCourse.day} learning={courseLearning} model={model} lessons={lessons} />;
    if (route.kind === 'courses') {
      const selected = selectedCourse && { ...selectedCourse, onOpen: () => startChosenCourse(selectedCourse.course, selectedCourse.day) };
      return <CourseSelection courses={courseLaunches} current={courseLaunch.course.id} selected={selected} events={courseLearning.events}
        onChoose={courseId => navigation.navigate({ kind: 'courses', language: targetLanguage, courseId }, { replace: !!courseId })}
        onClose={() => navigation.backTo(tabRoute('Learn', targetLanguage), previous => 'language' in previous && previous.language === targetLanguage
          && ['courses', 'topics', 'letters', 'listening', 'speaking'].includes(previous.kind), false, true)}
        onOpenDay={day => { if (selected) startChosenCourse(selected.course, day); }} />;
    }
    if (route.kind === 'slang') return <SlangCatalogue model={model} />;
    if (tab === 'Today') return <TodayDashboard language={targetLanguage} courseLaunch={courseLaunch} courseStudiedAt={latestStudy?.occurredAt}
      alphabetEvents={model.events} topics={topics} onTopic={selectTopic} onExplore={() => openLearnMode('Lessons')}
      onListen={() => openLearnMode('Listening & videos')} onSpeak={() => openLearnMode('Speaking')}
      onAlphabet={() => openLearnMode('Japanese letters')}
    />;
    if (tab === 'Report') return <LearningReportScreen
      language={targetLanguage} state={reportState} onTopic={selectTopic}
      onExplore={() => openLearnMode('Lessons')} onReview={() => navigate('Review')}
    />;
    if (tab === 'Learn') return <LearningHub
      language={targetLanguage} lessons={lessons} model={model} mode={learnMode} courseLaunch={courseLaunch}
      onMode={selectLearnMode} selectedTopic={selectedTopic} onSelectTopic={selectTopic}
      onOpen={openLesson} disabled={switchingBlocked} active={active} catalogueSearch={catalogueSearch}
      topics={topics} topicNavigation={showLibrary && !wideLibrary && !compact && renderTopicNavigation(true)}
    />;
    if (tab === 'Review') return <Notebook
      key={targetLanguage} language={targetLanguage} onWriteBlocked={setChildWriteBlocked}
      model={model} onExplore={() => openLearnMode('Lessons')}
    />;
    return <ProfileScreen language={targetLanguage} model={model} catalogue={catalogue} onOpenEditor={onOpenEditor}
      onChangeLanguage={changeLanguage} languageChangeDisabled={switchingBlocked} />;
  }

  function renderTopicNavigation(compact: boolean) {
    return <TopicSidebar topics={topics} selected={selectedTopic} onSelect={selectTopic} disabled={switchingBlocked} compact={compact} />;
  }

  return <View style={s.app}>
    <LearnerSkipLinks mobileNavigation={!!language && !choosing && mobileNav} />
    {!compactReader && <View style={[s.header, compact && { paddingHorizontal: 14, paddingVertical: 3 }]}>
      <View style={[s.headerInner, mobileNav && { gap: 8, flexWrap: 'nowrap' }]}>
        <BrandHome onPress={chooseHome} />
        {language && !choosing && !mobileNav && <LearnerNavigation language={language} selected={tab} disabled={switchingBlocked} onSelect={navigate} hrefFor={item => routeHref(tabRoute(item, language))} mobile={false} />}
        {language && !choosing && <View style={{ flexShrink: 1, minWidth: 0 }}>
          <Button compact quiet={compact} iconOnly={compact} icon="globe" trailingIcon={compact ? undefined : 'chevron-down'} label="Change language"
            disabled={switchingBlocked} onPress={changeLanguage}>{languageNames[language]}</Button>
        </View>}
      </View>
    </View>}
    <View style={{ flex: 1, width: '100%', maxWidth: designTokens.layout.shellMaxWidth, alignSelf: 'center', flexDirection: 'row', minHeight: 0 }}>
      {wideLibrary && !model.loading && !catalogue.loading && <View style={{ width: designTokens.layout.sidebarWidth, flexShrink: 0 }}>
        {renderTopicNavigation(false)}
      </View>}
      <ScrollView testID="learner-content" ref={scroll} style={{ flex: 1, minWidth: 0 }} keyboardShouldPersistTaps="handled"
        onScroll={event => { if (active) write('learner.scroll', event.nativeEvent.contentOffset.y); }} scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1 }}>
        <View role="main" nativeID={learnerContentId} tabIndex={-1}
          style={[s.main, showLibrary && { maxWidth: designTokens.layout.libraryMaxWidth, paddingTop: 17 },
            route.kind === 'letters' && { maxWidth: 900 },
            compact && { padding: 16, paddingTop: compactReader ? 8 : 16, paddingBottom: 24, gap: 12 }]}>
          {!courseVisible && <CourseWriteStatus learning={courseLearning} />}
          {route.kind === 'unavailable' ? unavailable() : !language || choosing ? <LanguageChooser onChoose={chooseLanguage} /> : model.loading || catalogue.loading ? <View style={s.card}>
            <ActivityIndicator color={colors.ink} />
            <Text accessibilityLiveRegion="polite" style={s.body}>Loading lessons and progress…</Text>
          </View> : <>
            {!!model.loadError && <View style={s.error}>
              <Text accessibilityRole="alert" style={s.heading}>Your learning data couldn’t be opened.</Text>
              <Text style={s.body}>{model.loadError}</Text>
              <Text style={s.body}>You can still study. Saving needs browser storage.</Text>
              <Button onPress={() => void model.load()}>Retry opening storage</Button>
            </View>}
            {!!model.saveError && <View style={s.error}>
              <Text accessibilityRole="alert" style={s.heading}>This change hasn’t been confirmed as saved.</Text>
              <Text style={s.body}>{model.saveError}</Text>
              <View style={s.row}>
                <Button primary disabled={model.busy} onPress={model.retry}>Retry save</Button>
                <Button disabled={model.busy} onPress={model.cancelWrite}>Dismiss and continue</Button>
              </View>
            </View>}
            {model.busy && !compact && <Text accessibilityLiveRegion="polite" style={s.muted}>Saving in this browser…</Text>}
            {!!selection.message && <Text accessibilityLiveRegion="polite" style={s.muted}>{selection.message}</Text>}
            {renderDestination(language)}
          </>}
        </View>
      </ScrollView>
    </View>
    {language && !choosing && mobileNav && <View nativeID="learner-bottom-bar" style={{ flexShrink: 0, backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.line,
      paddingHorizontal: 5, paddingVertical: 3 }}>
      <LearnerNavigation language={language} selected={tab} disabled={switchingBlocked} onSelect={navigate} hrefFor={item => routeHref(tabRoute(item, language))} mobile />
    </View>}
  </View>;
}
