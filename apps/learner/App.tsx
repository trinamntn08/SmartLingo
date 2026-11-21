import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Platform, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { groupLessonTopics, lessonProgress, languageNames, notebookLanguage, type TargetLanguage, type Lesson } from '@smartlingo/domain';
import { audio } from './src/audio';
import { AudioPreferencesPanel } from './src/audio/AudioPreferencesPanel';
import { GeneratedSpeechPanel } from './src/audio/generated/GeneratedSpeechPanel';
import { Badge, Button } from './src/ui/controls';
import { WordIllustration } from './src/ui/WordIllustration';
import { LessonScreen } from './src/ui/LessonScreen';
import { Notebook } from './src/ui/Notebook';
import { TopicCatalogue } from './src/ui/TopicCatalogue';
import { TopicSidebar } from './src/ui/TopicSidebar';
import { BrandHome } from './src/ui/BrandHome';
import { colors, styles as s } from './src/ui/theme';
import { useLearning, type LearningModel } from './src/ui/useLearning';
import { CurriculumEditor } from './src/editor/CurriculumEditor';
import { useCatalogue } from './src/content/useCatalogue';
import { BackupPanel } from './src/backup/BackupPanel';
import { OfflinePanel } from './src/offline/OfflinePanel';
import { FrenchPractice } from './src/practice/FrenchPractice';
import { ListeningResources } from './src/listening/ListeningResources';
import { openCoursePilot, japaneseCourse } from '@smartlingo/content';
import { OpenCoursePanel } from './src/course/OpenCoursePanel';

import { useTargetLanguage } from './src/language/useTargetLanguage';
import { LanguageChooser } from './src/language/LanguageChooser';

const tabs = ['Today', 'Explore', 'Practice', 'Review', 'Profile'] as const;
type Tab = typeof tabs[number];

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
  const catalogue = useCatalogue();
  const globalModel = useLearning();
  const selection = useTargetLanguage();
  const [choosing, setChoosing] = useState(false);
  const [childWriteBlocked, setChildWriteBlocked] = useState(false);
  const language = selection.language;
  const switchingBlocked = globalModel.busy || !!globalModel.saveError || childWriteBlocked;
  const model: LearningModel = { ...globalModel,
    notebook: globalModel.notebook.filter(entry => language && notebookLanguage(entry) === language),
    events: globalModel.events.filter(event => catalogue.lessons.some(lesson => lesson.id === event.lessonId && lesson.language === language)),
  };
  const [tab, setTab] = useState<Tab>('Today');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [listeningOpen, setListeningOpen] = useState(false);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const { width } = useWindowDimensions();
  const wide = width >= 1050;
  const lessons = catalogue.lessons.filter(lesson => lesson.language === language);
  const topics = groupLessonTopics(lessons);
  function navigate(next: Tab) { if (switchingBlocked) return; audio.stop(); setListeningOpen(false); setLesson(null); setSelectedTopic(null); setTab(next); scroll.current?.scrollTo({ y: 0, animated: false }); }
  function selectTopic(name: string | null) { if (switchingBlocked) return; audio.stop(); setListeningOpen(false); setLesson(null); setSelectedTopic(name); setTab('Explore'); scroll.current?.scrollTo({ y: 0, animated: false }); }
  function showListening(open: boolean) { audio.stop(); setListeningOpen(open); scroll.current?.scrollTo({ y: 0, animated: false }); }
  function openLesson(next: Lesson) { if (switchingBlocked) return; audio.stop(); setSelectedTopic(next.topic); setLesson(next); scroll.current?.scrollTo({ y: 0, animated: false }); }
  useEffect(() => () => audio.stop(), []);
  useEffect(() => { if (homeRequest > 0 && !switchingBlocked) { navigate('Today'); setChoosing(true); } }, [homeRequest]);
  useEffect(() => { if (model.saveError) scroll.current?.scrollTo({ y: 0, animated: false }); }, [model.saveError]);
  function chooseLanguage(next: TargetLanguage) {
    if (switchingBlocked) return;
    audio.stop(); selection.choose(next); setChoosing(false); navigate('Today');
  }
  function chooseHome() { if (!switchingBlocked) { setChoosing(true); onHome(); } }
  return <View style={s.app}><View style={[s.header, width < 600 && { paddingHorizontal: 16 }]}><View style={s.headerInner}>
    <View style={s.row}><BrandHome onPress={chooseHome} /><Badge>LOCAL PREVIEW</Badge></View>
    {language && !choosing && <View style={s.row}><Badge>{languageNames[language]}</Badge><Button disabled={switchingBlocked} onPress={() => { audio.stop(); setChoosing(true); }}>Change language</Button></View>}
    {language && !choosing && <View style={s.nav}>{tabs.map(name => <Button key={name} selected={tab === name} disabled={switchingBlocked} onPress={() => navigate(name)}>{name}</Button>)}</View>}
  </View></View>
    {language && !choosing && !wide && <TopicSidebar topics={topics} selected={selectedTopic} onSelect={selectTopic} compact />}
    <View style={{ flex: 1, width: '100%', maxWidth: 1440, alignSelf: 'center', flexDirection: 'row', minHeight: 0 }}>
    {language && !choosing && wide && <TopicSidebar topics={topics} selected={selectedTopic} onSelect={selectTopic} compact={false} />}
    <ScrollView testID="learner-content" ref={scroll} style={{ flex: 1, minWidth: 0 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}><View style={[s.main, width < 600 && { padding: 16, paddingTop: 24 }]}>
      {!language || choosing ? <LanguageChooser onChoose={chooseLanguage} /> : model.loading || catalogue.loading ? <View style={s.card}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.body}>Opening your local learning notebook…</Text></View> : <>
        {!!model.loadError && <View style={s.error}><Text accessibilityRole="alert" style={s.heading}>Your learning data couldn’t be opened.</Text><Text style={s.body}>{model.loadError}</Text><Text style={s.body}>You can browse the bundled lessons. Saving and lesson progress need browser storage.</Text><Button onPress={() => void model.load()}>Retry opening storage</Button></View>}
        {!!model.saveError && <View style={s.error}><Text accessibilityRole="alert" style={s.heading}>This change hasn’t been confirmed as saved.</Text><Text style={s.body}>{model.saveError}</Text><Text style={s.muted}>Retry keeps the same event, so your practice won’t be counted twice.</Text><View style={s.row}><Button primary disabled={model.busy} onPress={model.retry}>Retry save</Button><Button disabled={model.busy} onPress={model.cancelWrite}>Dismiss and continue</Button></View></View>}
        {model.busy && <Text accessibilityLiveRegion="polite" style={s.muted}>Saving in this browser…</Text>}
        {!!selection.message && <Text accessibilityLiveRegion="polite" style={s.muted}>{selection.message}</Text>}
        {switchingBlocked && <Text style={s.muted}>Finish saving or resolve the save message before leaving this screen or changing language.</Text>}
        {lesson ? <LessonScreen key={`${lesson.id}.${lesson.revision}`} lesson={lesson} model={model} onExit={() => selectTopic(lesson.topic)} />
          : tab === 'Today' ? <Today language={language} onWriteBlocked={setChildWriteBlocked} lessons={lessons} model={model} onOpen={openLesson} onExplore={() => navigate('Explore')} />
            : tab === 'Practice' && listeningOpen ? <ListeningResources onClose={() => showListening(false)} />
              : tab === 'Explore' || tab === 'Practice' ? <>{tab === 'Practice' && active && language === 'fr-FR' && <><View style={s.card}>
                <View style={s.row}><Badge>Listening · A1 / A2 / B1</Badge><Badge>External resources</Badge></View>
                <Text accessibilityRole="header" style={s.heading}>French listening library</Text>
                <Text style={s.body}>Find videos, podcasts and guided listening, with text-support notes and short practice ideas. Playback needs an internet connection and opens on the provider’s site.</Text>
                <Text style={s.muted}>Opening the library ends any temporary conversation and clears unsent messages and recordings.</Text>
                <Button primary onPress={() => showListening(true)}>Browse listening resources</Button>
              </View><FrenchPractice lessons={lessons} model={model} /></>}<TopicCatalogue key={language} lessons={lessons} model={model} onOpen={openLesson} practice={tab === 'Practice'} selectedTopic={selectedTopic} onSelectTopic={selectTopic} /></>
              : tab === 'Review' ? <Notebook key={language} language={language} onWriteBlocked={setChildWriteBlocked} model={model} onExplore={() => navigate('Explore')} /> : <Profile language={language} model={model} catalogue={catalogue} onOpenEditor={onOpenEditor} />}
      </>}
    </View></ScrollView>
    </View>
  </View>;
}

function Today({ lessons, model, onOpen, onExplore, language, onWriteBlocked }: { language: TargetLanguage; onWriteBlocked: (blocked: boolean) => void; lessons: Lesson[]; model: LearningModel; onOpen: (lesson: Lesson) => void; onExplore: () => void }) {
  const latest = [...model.events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).find(event => lessons.some(lesson => lesson.id === event.lessonId));
  const suggested = lessons.find(lesson => lesson.id === latest?.lessonId) ?? lessons[0];
  if (!suggested) return <View style={s.card}><Text style={s.heading}>Your lessons are on their way.</Text><Text style={s.body}>No lessons are available for this language yet.</Text><Button onPress={onExplore}>Explore topics</Button></View>;
  const progress = lessonProgress(suggested, model.events);
  const started = model.events.some(event => event.lessonId === suggested.id && event.revision === suggested.revision);
  return <View style={{ gap: 32 }}><View style={s.split}>
    <View style={[s.column, { justifyContent: 'center', paddingVertical: 18 }]}><Text style={s.eyebrow}>Small steps. Real conversations.</Text>
      <Text accessibilityRole="header" style={[s.hero, { fontSize: 44, lineHeight: 51 }]}>A little {languageNames[language]}.{ '\n' }A little more{ '\n' }at home.</Text>
      <Text style={[s.body, { maxWidth: 430 }]}>Explore {groupLessonTopics(lessons).length} everyday topics, with short lessons and useful vocabulary.</Text>
      <View style={s.row}><Button primary onPress={() => onOpen(suggested)}>{progress.completed ? 'Revisit your lesson →' : started ? 'Continue your lesson →' : suggested.id.startsWith('fr.greetings.') ? 'Start greetings practice →' : suggested.id === 'fr.restaurant.customer' ? 'Start restaurant practice →' : 'Start lesson →'}</Button><Button onPress={onExplore}>Explore lessons</Button></View>
    </View>
    <View style={[s.card, s.column, { backgroundColor: '#E8ECD9', padding: 28 }]}><View style={s.row}><Badge>YOUR NEXT EVERYDAY MOMENT</Badge><Badge>{suggested.level}</Badge></View>
      <WordIllustration entry={suggested.vocabulary[1] ?? suggested.vocabulary[0]} size={290} />
      <Text style={s.heading}>{suggested.subtitle}</Text><Text style={s.body}>{suggested.outcome}</Text><View style={s.row}><Badge>{suggested.role}</Badge><Text style={s.muted}>{suggested.durationMinutes} min · {suggested.vocabulary.length} useful words</Text></View>
      <View style={s.divider} /><Text style={s.muted}>{progress.completed ? '✓ Session completed and saved' : `${progress.viewedIds.size} of ${suggested.vocabulary.length} words explored`} · {suggested.status === 'published' ? `Published revision ${suggested.revision}` : 'Draft preview'}</Text>
    </View>
  </View>
  <OpenCoursePanel key={language} course={language === 'ja-JP' ? japaneseCourse : openCoursePilot} model={model} onWriteBlocked={onWriteBlocked} />
  </View>;
}

function Profile({ model, catalogue, onOpenEditor, language }: { language: TargetLanguage; model: LearningModel; catalogue: ReturnType<typeof useCatalogue>; onOpenEditor: () => void }) {
  const completed = model.events.filter(event => event.activity === 'completion' && event.result === 'completed').length;
  return <View style={{ gap: 24 }}><Text style={s.eyebrow}>Your learning space</Text><Text accessibilityRole="header" style={s.title}>At your own pace.</Text><View style={s.card}><Text style={s.heading}>A local learner profile</Text><Text style={s.body}>Learning {languageNames[language]} · English explanations · Draft lessons</Text><View style={s.row}><Badge>{completed} sessions completed</Badge><Badge>{model.notebook.length} notebook entries</Badge></View><Text style={s.muted}>Session completion records practice, not a language level or proficiency score.</Text></View>
    {language === 'fr-FR' && <><View style={s.card}><Text style={s.heading}>Local curriculum workshop</Text><Text style={s.body}>Edit a draft, preview its saved revision, and review it before explicitly publishing to the local catalogue.</Text><Button onPress={onOpenEditor}>Open curriculum editor</Button></View>
    <View style={s.card}><Text style={s.heading}>Published lessons</Text><Text style={s.body}>Load owner-published local revisions into this browser. Draft edits stay in the workshop. Earlier practice and personal notes stay recorded when a new revision arrives.</Text><Button disabled={catalogue.busy} onPress={() => void catalogue.refreshPublished()}>{catalogue.busy ? 'Loading published lessons…' : 'Load published lessons'}</Button>{!!catalogue.error && <Text accessibilityRole="alert" style={s.body}>{catalogue.error}</Text>}{!!catalogue.message && <Text accessibilityLiveRegion="polite" style={s.body}>{catalogue.message}</Text>}</View>
    </>}
    {language === 'ja-JP' && <View style={s.card}><Text style={s.heading}>Japanese study support</Text><Text style={s.body}>Vocabulary, kana readings, dialogues, sentence building and your personal notebook work without AI. Optional AI conversation, the listening library, neural audio and the curriculum workshop currently support French only.</Text></View>}
    <OfflinePanel />
    <AudioPreferencesPanel key={language} language={language} />
    {language === 'fr-FR' && <GeneratedSpeechPanel />}
    <Text style={s.muted}>Offline app downloads and private learning backups include both French and Japanese.</Text>
    <BackupPanel />
    <View style={s.card}><Text style={s.heading}>About this preview</Text><Text style={s.body}>Your progress and notebook stay in this browser on this device. There is no account or sync. Clearing browser data removes these notes.</Text><Text style={s.body}>Bundled lessons don’t need the local API or an AI key. Listening uses a synthetic device voice when a {languageNames[language]} voice is available. You can always read and practise from the text.</Text><Text style={s.muted}>Draft lessons, photographs and illustrations still need owner review. Keep private learning backups separately; browser storage may be cleared or evicted.</Text>{Platform.OS === 'web' && <a href="/vocabulary-photos/credits.html" target="_blank" rel="noopener noreferrer" style={{ color: colors.ink, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>Photo credits and licences</a>}</View>
  </View>;
}
