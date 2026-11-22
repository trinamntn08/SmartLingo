import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { languageNames, notebookLanguage, type TargetLanguage } from '@smartlingo/domain';
import { openCoursePilot, japaneseCourse } from '@smartlingo/content';
import { isAlphabetLessonId } from '../alphabet/progress';
import { useCatalogue } from '../content/useCatalogue';
import { TodayDashboard } from '../dashboard/TodayDashboard';
import { LearningReportScreen } from '../dashboard/LearningReportScreen';
import { LearnerNavigation } from '../dashboard/LearnerNavigation';
import { useLearningReport } from '../dashboard/useLearningReport';
import { useTargetLanguage } from '../language/useTargetLanguage';
import { LanguageChooser } from '../language/LanguageChooser';
import { LearningHub } from '../learn/LearningHub';
import { ProfileScreen } from '../profile/ProfileScreen';
import { Button } from '../ui/controls';
import { LessonScreen } from '../ui/LessonScreen';
import { Notebook } from '../ui/Notebook';
import { BrandHome } from '../ui/BrandHome';
import { colors, designTokens, styles as s } from '../ui/theme';
import { useLearning, type LearningModel } from '../ui/useLearning';
import { useLearnerNavigation } from './useLearnerNavigation';

const frenchCourses = [openCoursePilot];
const japaneseCourses = [japaneseCourse];

interface LearnerAppProps {
  active: boolean;
  onOpenEditor: () => void;
  homeRequest: number;
  onHome: () => void;
}

export function LearnerApp({ active, onOpenEditor, homeRequest, onHome }: LearnerAppProps) {
  const catalogue = useCatalogue();
  const globalModel = useLearning();
  const selection = useTargetLanguage();
  const [childWriteBlocked, setChildWriteBlocked] = useState(false);
  const language = selection.language;
  const switchingBlocked = globalModel.busy || !!globalModel.saveError || childWriteBlocked;
  // Scope reads to the active language; all write operations still use the shared learning model.
  const model: LearningModel = { ...globalModel,
    notebook: globalModel.notebook.filter(entry => language && notebookLanguage(entry) === language),
    events: globalModel.events.filter(event => (language === 'ja-JP' && isAlphabetLessonId(event.lessonId)) || catalogue.lessons.some(lesson => lesson.id === event.lessonId && lesson.language === language)),
  };
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const { width } = useWindowDimensions();
  const compact = width < designTokens.layout.compactBreakpoint;
  const { choosing, tab, lesson, selectedTopic, learnMode, navigate, selectTopic, selectLearnMode,
    openLearnMode, openLesson, chooseLanguage, chooseHome, changeLanguage } = useLearnerNavigation({
    language, blocked: switchingBlocked, homeRequest, onHome, onChooseLanguage: selection.choose,
    scrollToTop: () => scroll.current?.scrollTo({ y: 0, animated: false }),
  });
  const lessons = useMemo(() => catalogue.lessons.filter(lesson => lesson.language === language), [catalogue.lessons, language]);
  const reportState = useLearningReport({ language: language ?? 'fr-FR', lessons, courses: language === 'ja-JP' ? japaneseCourses : frenchCourses });
  const reportVisible = !!language && !choosing && !lesson && tab === 'Report';
  useEffect(() => {
    if (reportVisible && !childWriteBlocked && !globalModel.busy && !globalModel.loading && !globalModel.loadError) void reportState.refresh();
  }, [reportVisible, tab, childWriteBlocked, globalModel.busy, globalModel.loading, globalModel.loadError, globalModel.events, globalModel.notebook, reportState.refresh]);
  useEffect(() => { if (model.saveError) scroll.current?.scrollTo({ y: 0, animated: false }); }, [model.saveError]);

  function renderDestination(targetLanguage: TargetLanguage) {
    if (lesson) return <LessonScreen key={`${lesson.id}.${lesson.revision}`} lesson={lesson} model={model} onExit={() => selectTopic(lesson.topic)} />;
    if (tab === 'Today') return <TodayDashboard
      language={targetLanguage} course={targetLanguage === 'ja-JP' ? japaneseCourse : openCoursePilot}
      onWriteBlocked={setChildWriteBlocked} lessons={lessons} model={model}
      onOpen={openLesson} onExplore={() => openLearnMode('Vocabulary & lessons')}
      onReview={() => navigate('Review')}
      onListen={() => openLearnMode('Listening & videos')} onSpeak={() => openLearnMode('Speaking')}
      onAlphabet={() => openLearnMode('Japanese letters')}
    />;
    if (tab === 'Report') return <LearningReportScreen
      language={targetLanguage} state={reportState} onTopic={selectTopic}
      onExplore={() => openLearnMode('Vocabulary & lessons')} onReview={() => navigate('Review')}
    />;
    if (tab === 'Learn') return <LearningHub
      language={targetLanguage} lessons={lessons} model={model} mode={learnMode}
      onMode={selectLearnMode} selectedTopic={selectedTopic} onSelectTopic={selectTopic}
      onOpen={openLesson} disabled={switchingBlocked} active={active}
    />;
    if (tab === 'Review') return <Notebook
      key={targetLanguage} language={targetLanguage} onWriteBlocked={setChildWriteBlocked}
      model={model} onExplore={() => openLearnMode('Vocabulary & lessons')}
    />;
    return <ProfileScreen language={targetLanguage} model={model} catalogue={catalogue} onOpenEditor={onOpenEditor} />;
  }

  return <View style={s.app}>
    <View style={[s.header, width < designTokens.layout.compactBreakpoint && { paddingHorizontal: 16 }]}>
      <View style={[s.headerInner, compact && { gap: 8, flexWrap: 'nowrap' }]}>
        <BrandHome onPress={chooseHome} />
        {language && !choosing && !compact && <LearnerNavigation selected={tab} disabled={switchingBlocked} onSelect={navigate} compact />}
        {language && !choosing && <View style={s.row}>
          <Button label="Change language" disabled={switchingBlocked} onPress={changeLanguage}>{languageNames[language]} ⌄</Button>
        </View>}
      </View>
    </View>
    <View style={{ flex: 1, width: '100%', maxWidth: designTokens.layout.shellMaxWidth, alignSelf: 'center', flexDirection: 'row', minHeight: 0 }}>
      <ScrollView testID="learner-content" ref={scroll} style={{ flex: 1, minWidth: 0 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[s.main, width < designTokens.layout.compactBreakpoint && { padding: 16, paddingTop: 24 }]}>
          {!language || choosing ? <LanguageChooser onChoose={chooseLanguage} /> : model.loading || catalogue.loading ? <View style={s.card}>
            <ActivityIndicator color={colors.ink} />
            <Text accessibilityLiveRegion="polite" style={s.body}>Opening your local learning notebook…</Text>
          </View> : <>
            {!!model.loadError && <View style={s.error}>
              <Text accessibilityRole="alert" style={s.heading}>Your learning data couldn’t be opened.</Text>
              <Text style={s.body}>{model.loadError}</Text>
              <Text style={s.body}>You can browse the bundled lessons. Saving and lesson progress need browser storage.</Text>
              <Button onPress={() => void model.load()}>Retry opening storage</Button>
            </View>}
            {!!model.saveError && <View style={s.error}>
              <Text accessibilityRole="alert" style={s.heading}>This change hasn’t been confirmed as saved.</Text>
              <Text style={s.body}>{model.saveError}</Text>
              <Text style={s.muted}>Retry keeps the same event, so your practice won’t be counted twice.</Text>
              <View style={s.row}>
                <Button primary disabled={model.busy} onPress={model.retry}>Retry save</Button>
                <Button disabled={model.busy} onPress={model.cancelWrite}>Dismiss and continue</Button>
              </View>
            </View>}
            {model.busy && <Text accessibilityLiveRegion="polite" style={s.muted}>Saving in this browser…</Text>}
            {!!selection.message && <Text accessibilityLiveRegion="polite" style={s.muted}>{selection.message}</Text>}
            {switchingBlocked && <Text style={s.muted}>Finish saving or resolve the save message before leaving this screen or changing language.</Text>}
            {renderDestination(language)}
          </>}
        </View>
      </ScrollView>
    </View>
    {language && !choosing && compact && <View style={{ backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.line, padding: 6, paddingBottom: 10 }}>
      <LearnerNavigation selected={tab} disabled={switchingBlocked} onSelect={navigate} compact />
    </View>}
  </View>;
}
