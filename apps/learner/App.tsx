import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Platform, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { groupLessonTopics, type Lesson } from '@smartlingo/domain';
import { audio } from './src/audio';
import { AudioPreferencesPanel } from './src/audio/AudioPreferencesPanel';
import { GeneratedSpeechPanel } from './src/audio/generated/GeneratedSpeechPanel';
import { Badge, Button } from './src/ui/controls';
import { LearnerHeader, learnerNavigationId, PrimaryNavigation, type LearnerTab } from './src/ui/AppNavigation';
import { Today } from './src/ui/Today';
import { LessonScreen } from './src/ui/LessonScreen';
import { Notebook } from './src/ui/Notebook';
import { TopicCatalogue } from './src/ui/TopicCatalogue';
import { TopicSidebar } from './src/ui/TopicSidebar';
import { colors, styles as s } from './src/ui/theme';
import { useLearning, type LearningModel } from './src/ui/useLearning';
import { CurriculumEditor } from './src/editor/CurriculumEditor';
import { useCatalogue } from './src/content/useCatalogue';
import { BackupPanel } from './src/backup/BackupPanel';
import { OfflinePanel } from './src/offline/OfflinePanel';
import { FrenchPractice } from './src/practice/FrenchPractice';

const mainId = 'learner-main';

export default function App() {
  const [editorOpen, setEditorOpen] = useState(() => typeof window !== 'undefined' && window.location.hash === '#editor');
  const [editorVisited, setEditorVisited] = useState(editorOpen);
  const [homeRequest, setHomeRequest] = useState(0);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateRoute = () => {
      const open = window.location.hash === '#editor';
      setEditorOpen(open);
      if (open) setEditorVisited(true);
    };
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);
  function showEditor(open: boolean) {
    audio.stop();
    if (open) setEditorVisited(true);
    setEditorOpen(open);
    if (typeof window !== 'undefined') window.location.hash = open ? 'editor' : '';
  }
  function goHome() { showEditor(false); setHomeRequest(current => current + 1); }
  return <View style={s.app}>
    <View style={{ flex: 1, display: editorOpen ? 'none' : 'flex' }}><LearnerApp active={!editorOpen} onOpenEditor={() => showEditor(true)} homeRequest={homeRequest} onHome={goHome} /></View>
    {editorVisited && <View style={{ flex: 1, display: editorOpen ? 'flex' : 'none' }}><CurriculumEditor onExit={() => showEditor(false)} onHome={goHome} /></View>}
  </View>;
}

function LearnerApp({ active, onOpenEditor, homeRequest, onHome }: { active: boolean; onOpenEditor: () => void; homeRequest: number; onHome: () => void }) {
  const model = useLearning();
  const catalogue = useCatalogue();
  const [tab, setTab] = useState<LearnerTab>('Today');
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const { width } = useWindowDimensions();
  const wide = width >= 1050;
  const topics = groupLessonTopics(catalogue.lessons);
  const exploring = tab === 'Explore' || !!lesson;
  function focusContent() {
    if (Platform.OS === 'web') document.getElementById(mainId)?.focus({ preventScroll: true });
  }
  function focusNavigation() {
    if (Platform.OS === 'web') document.querySelector<HTMLElement>(`#${learnerNavigationId} [aria-current="page"]`)?.focus();
  }
  function resetContent() {
    scroll.current?.scrollTo({ y: 0, animated: false });
    focusContent();
  }
  function navigate(next: LearnerTab) {
    audio.stop(); setLesson(null); setSelectedTopic(null); setTopicsOpen(false); setTab(next); resetContent();
  }
  function selectTopic(name: string | null) {
    audio.stop(); setLesson(null); setSelectedTopic(name); setTopicsOpen(false); setTab('Explore'); resetContent();
  }
  function openLesson(next: Lesson) {
    audio.stop(); setSelectedTopic(next.topic); setLesson(next); resetContent();
  }
  function showLessonStage() {
    scroll.current?.scrollTo({ y: 0, animated: false });
    if (Platform.OS === 'web') {
      const heading = document.querySelector<HTMLElement>(`#${mainId} [data-testid="lesson-stage-heading"]`);
      heading?.focus();
    }
  }
  useEffect(() => () => audio.stop(), []);
  useEffect(() => { if (homeRequest > 0) navigate('Today'); }, [homeRequest]);
  useEffect(() => { if (model.saveError) scroll.current?.scrollTo({ y: 0, animated: false }); }, [model.saveError]);
  useEffect(() => {
    if (wide || !topicsOpen || Platform.OS !== 'web') return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setTopicsOpen(false);
      document.querySelector<HTMLElement>('[aria-label="Browse course topics"]')?.focus();
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [topicsOpen, wide]);
  function focusLessonPractice() {
    if (Platform.OS === 'web') document.getElementById('practice-lessons')?.focus();
  }
  const topicSidebar = (compact: boolean) => <TopicSidebar topics={topics} selected={selectedTopic} onSelect={selectTopic} compact={compact} exploring={exploring} />;
  return <View style={s.app}>
    <LearnerHeader compact={!wide} tab={tab} topicsOpen={topicsOpen} onTopics={() => setTopicsOpen(current => !current)}
      onHome={onHome} onNavigate={navigate} onSkip={focusContent} onSkipNavigation={focusNavigation} />
    {!wide && topicsOpen && topicSidebar(true)}
    <View style={{ flex: 1, width: '100%', maxWidth: 1440, alignSelf: 'center', flexDirection: 'row', minHeight: 0 }}>
    {wide && topicSidebar(false)}
    <ScrollView testID="learner-content" ref={scroll} style={{ flex: 1, minWidth: 0 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
      <View role="main" nativeID={mainId} tabIndex={-1} style={[s.main, width < 700 && { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 }]}>
      {model.loading || catalogue.loading ? <View style={s.card}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.body}>Opening your local learning notebook…</Text></View> : <>
        {!!model.loadError && <View style={s.error}><Text accessibilityRole="alert" style={s.heading}>Your learning data couldn’t be opened.</Text><Text style={s.body}>{model.loadError}</Text><Text style={s.body}>You can browse the bundled lessons. Saving and lesson progress need browser storage.</Text><Button onPress={() => void model.load()}>Retry opening storage</Button></View>}
        {!!model.saveError && <View style={s.error}><Text accessibilityRole="alert" style={s.heading}>This change hasn’t been confirmed as saved.</Text><Text style={s.body}>{model.saveError}</Text><Text style={s.muted}>Retry keeps the same event, so your practice won’t be counted twice.</Text><View style={s.row}><Button primary disabled={model.busy} onPress={model.retry}>Retry save</Button><Button disabled={model.busy} onPress={model.cancelWrite}>Dismiss and continue</Button></View></View>}
        {model.busy && <Text accessibilityLiveRegion="polite" style={s.muted}>Saving in this browser…</Text>}
        {lesson ? <LessonScreen key={`${lesson.id}.${lesson.revision}`} lesson={lesson} model={model} onExit={() => selectTopic(lesson.topic)} onStageChange={showLessonStage} />
          : tab === 'Today' ? <Today lessons={catalogue.lessons} topics={topics} model={model} compact={width < 700} narrowTitle={width < 1260}
                onOpen={openLesson} onExplore={() => navigate('Explore')} onSelectTopic={selectTopic} />
            : tab === 'Explore' || tab === 'Practice' ? <>
              {tab === 'Practice' && <>
                <View style={{ gap: 8 }}><Text accessibilityRole="header" style={s.title}>Practice</Text>
                  <Text style={s.muted}>Build sentences in short lessons or try an everyday conversation.</Text>
                  {Platform.OS === 'web' && <View style={s.row}><Button onPress={focusLessonPractice}>Browse lesson practice ↓</Button></View>}
                </View>
                {active && <FrenchPractice lessons={catalogue.lessons} model={model} />}
              </>}
              <View nativeID={tab === 'Practice' ? 'practice-lessons' : undefined} tabIndex={tab === 'Practice' ? -1 : undefined}>
                <TopicCatalogue lessons={catalogue.lessons} model={model} onOpen={openLesson} practice={tab === 'Practice'} selectedTopic={selectedTopic} onSelectTopic={selectTopic} />
              </View>
            </>
              : tab === 'Review' ? <Notebook model={model} onExplore={() => navigate('Explore')} /> : <Profile model={model} catalogue={catalogue} onOpenEditor={onOpenEditor} />}
      </>}
      </View>
    </ScrollView>
    </View>
    {!wide && <PrimaryNavigation tab={tab} onNavigate={navigate} compact />}
  </View>;
}

function Profile({ model, catalogue, onOpenEditor }: { model: LearningModel; catalogue: ReturnType<typeof useCatalogue>; onOpenEditor: () => void }) {
  const completed = model.events.filter(event => event.activity === 'completion' && event.result === 'completed').length;
  return <View style={{ gap: 24 }}>
    <View style={{ gap: 6 }}><Text accessibilityRole="header" style={s.title}>Profile</Text>
      <Text style={s.muted}>Manage your audio, downloaded lessons and learning data.</Text></View>
    <View style={[s.card, { backgroundColor: colors.greenSoft }]}>
      <Text accessibilityRole="header" style={s.heading}>Your learning activity</Text>
      <Text style={s.body}>French with English explanations</Text>
      <View style={s.row}><Badge>{completed} sessions completed</Badge><Badge>{model.notebook.length} notebook entries</Badge></View>
    </View>
    <View style={{ gap: 12 }}>
      <Text accessibilityRole="header" style={s.heading}>Audio and offline study</Text>
      <AudioPreferencesPanel />
      <GeneratedSpeechPanel />
      <OfflinePanel />
    </View>
    <View style={{ gap: 12 }}>
      <Text accessibilityRole="header" style={s.heading}>Learning data</Text>
      <BackupPanel />
      <View style={s.card}><Text accessibilityRole="header" style={s.heading}>Published lessons</Text><Text style={s.body}>Load owner-published local revisions into this browser. Earlier practice and personal notes stay recorded when a new revision arrives.</Text>
        <View style={s.row}><Button disabled={catalogue.busy} onPress={() => void catalogue.refreshPublished()}>{catalogue.busy ? 'Loading published lessons…' : 'Load published lessons'}</Button></View>
        {!!catalogue.error && <Text accessibilityRole="alert" style={s.body}>{catalogue.error}</Text>}{!!catalogue.message && <Text accessibilityLiveRegion="polite" style={s.body}>{catalogue.message}</Text>}
      </View>
      <View style={s.card}><Text accessibilityRole="header" style={s.heading}>Curriculum workshop</Text><Text style={s.body}>Edit a draft and preview its saved revision before publishing it to the local catalogue.</Text><View style={s.row}><Button onPress={onOpenEditor}>Open curriculum editor</Button></View></View>
    </View>
    <View style={s.notice}><Text accessibilityRole="header" style={s.heading}>About this preview</Text>
      <Text style={s.body}>Progress and notebook entries are stored in this browser. Clearing browser data removes them. Bundled lessons are available without the local API or an AI key.</Text>
      {Platform.OS === 'web' && <a href="/vocabulary-photos/credits.html" target="_blank" rel="noopener noreferrer" style={{ color: colors.forest, minHeight: 44, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center' }}>Photo credits and licences</a>}
    </View>
  </View>;
}
