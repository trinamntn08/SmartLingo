import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { lessonProgress, type Lesson } from '@smartlingo/domain';
import { audio } from './src/audio';
import { Badge, Button } from './src/ui/controls';
import { Illustration } from './src/ui/Illustration';
import { LessonScreen } from './src/ui/LessonScreen';
import { Notebook } from './src/ui/Notebook';
import { colors, styles as s } from './src/ui/theme';
import { useLearning, type LearningModel } from './src/ui/useLearning';
import { CurriculumEditor } from './src/editor/CurriculumEditor';
import { useCatalogue } from './src/content/useCatalogue';

const tabs = ['Today', 'Explore', 'Practice', 'Review', 'Profile'] as const;
type Tab = typeof tabs[number];

export default function App() {
  const [editorOpen, setEditorOpen] = useState(() => typeof window !== 'undefined' && window.location.hash === '#editor');
  const [editorVisited, setEditorVisited] = useState(editorOpen);
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
  return <View style={s.app}>
    <View style={{ flex: 1, display: editorOpen ? 'none' : 'flex' }}><LearnerApp onOpenEditor={() => showEditor(true)} /></View>
    {editorVisited && <View style={{ flex: 1, display: editorOpen ? 'flex' : 'none' }}><CurriculumEditor onExit={() => showEditor(false)} /></View>}
  </View>;
}

function LearnerApp({ onOpenEditor }: { onOpenEditor: () => void }) {
  const model = useLearning();
  const catalogue = useCatalogue();
  const [tab, setTab] = useState<Tab>('Today');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const { width } = useWindowDimensions();
  function navigate(next: Tab) { audio.stop(); setLesson(null); setTab(next); scroll.current?.scrollTo({ y: 0, animated: false }); }
  function openLesson(next: Lesson) { audio.stop(); setLesson(next); scroll.current?.scrollTo({ y: 0, animated: false }); }
  useEffect(() => () => audio.stop(), []);
  useEffect(() => { if (model.saveError) scroll.current?.scrollTo({ y: 0, animated: false }); }, [model.saveError]);
  return <View style={s.app}><View style={[s.header, width < 600 && { paddingHorizontal: 16 }]}><View style={s.headerInner}>
    <View style={s.row}><Text style={{ fontSize: 26 }}>✳</Text><Text style={s.brand}>SmartLingo</Text><Badge>LOCAL PREVIEW</Badge></View>
    <View style={s.nav}>{tabs.map(name => <Button key={name} selected={tab === name} onPress={() => navigate(name)}>{name}</Button>)}</View>
  </View></View>
    <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}><View style={[s.main, width < 600 && { padding: 16, paddingTop: 24 }]}>
      {model.loading || catalogue.loading ? <View style={s.card}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.body}>Opening your local learning notebook…</Text></View> : <>
        {!!model.loadError && <View style={s.error}><Text accessibilityRole="alert" style={s.heading}>Your learning data couldn’t be opened.</Text><Text style={s.body}>{model.loadError}</Text><Text style={s.body}>You can browse the bundled lessons. Saving and lesson progress need browser storage.</Text><Button onPress={() => void model.load()}>Retry opening storage</Button></View>}
        {!!model.saveError && <View style={s.error}><Text accessibilityRole="alert" style={s.heading}>This change hasn’t been confirmed as saved.</Text><Text style={s.body}>{model.saveError}</Text><Text style={s.muted}>Retry keeps the same event, so your practice won’t be counted twice.</Text><View style={s.row}><Button primary disabled={model.busy} onPress={model.retry}>Retry save</Button><Button disabled={model.busy} onPress={model.cancelWrite}>Dismiss and continue</Button></View></View>}
        {model.busy && <Text accessibilityLiveRegion="polite" style={s.muted}>Saving in this browser…</Text>}
        {lesson ? <LessonScreen key={`${lesson.id}.${lesson.revision}`} lesson={lesson} model={model} onExit={() => navigate('Today')} />
          : tab === 'Today' ? <Today lessons={catalogue.lessons} model={model} onOpen={openLesson} onExplore={() => navigate('Explore')} />
            : tab === 'Explore' || tab === 'Practice' ? <Catalogue lessons={catalogue.lessons} model={model} onOpen={openLesson} practice={tab === 'Practice'} />
              : tab === 'Review' ? <Notebook model={model} onExplore={() => navigate('Explore')} /> : <Profile model={model} catalogue={catalogue} onOpenEditor={onOpenEditor} />}
      </>}
      <View style={s.divider} /><Text style={s.muted}>Made for everyday life in France. Bundled drafts await owner review; published local revisions are labelled separately.</Text>
    </View></ScrollView>
  </View>;
}

function Today({ lessons, model, onOpen, onExplore }: { lessons: Lesson[]; model: LearningModel; onOpen: (lesson: Lesson) => void; onExplore: () => void }) {
  const latest = [...model.events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).find(event => lessons.some(lesson => lesson.id === event.lessonId));
  const suggested = lessons.find(lesson => lesson.id === latest?.lessonId) ?? lessons[0];
  const progress = lessonProgress(suggested, model.events);
  const started = model.events.some(event => event.lessonId === suggested.id && event.revision === suggested.revision);
  return <View style={{ gap: 32 }}><View style={s.split}>
    <View style={[s.column, { justifyContent: 'center', paddingVertical: 18 }]}><Text style={s.eyebrow}>Small steps. Real conversations.</Text>
      <Text accessibilityRole="header" style={[s.hero, { fontSize: 52, lineHeight: 57 }]}>A little French.{ '\n' }A little more{ '\n' }at home.</Text>
      <Text style={[s.body, { maxWidth: 430 }]}>From your first café order to a friendly bonjour. Practise the words you can use today.</Text>
      <View style={s.row}><Button primary onPress={() => onOpen(suggested)}>{progress.completed ? 'Revisit your lesson →' : started ? 'Continue your lesson →' : 'Start restaurant practice →'}</Button><Button onPress={onExplore}>Explore lessons</Button></View>
      <Text style={s.muted}>No streaks. No rush. Pick up where you left off.</Text>
    </View>
    <View style={[s.card, s.column, { backgroundColor: '#E8ECD9', padding: 28 }]}><View style={s.row}><Badge>YOUR NEXT EVERYDAY MOMENT</Badge><Badge>{suggested.level}</Badge></View>
      <Illustration picture={suggested.vocabulary[1].picture} alt={suggested.vocabulary[1].pictureAlt} size={290} />
      <Text style={s.heading}>{suggested.subtitle}</Text><Text style={s.body}>{suggested.outcome}</Text><View style={s.row}><Badge>{suggested.role}</Badge><Text style={s.muted}>{suggested.durationMinutes} min · {suggested.vocabulary.length} useful words</Text></View>
      <View style={s.divider} /><Text style={s.muted}>{progress.completed ? '✓ Session completed and saved' : `${progress.viewedIds.size} of ${suggested.vocabulary.length} words explored`} · {suggested.status === 'published' ? `Published revision ${suggested.revision}` : 'Draft preview'}</Text>
    </View>
  </View>
    <View style={[s.notice, { backgroundColor: colors.yellow, padding: 25, flexDirection: 'row', flexWrap: 'wrap', gap: 30 }]}>
      <View style={{ flex: 1, minWidth: 160 }}><Text style={s.heading}>Look, then try.</Text><Text style={s.body}>Pictures first. Useful words next.</Text></View><View style={{ flex: 1, minWidth: 160 }}><Text style={s.heading}>Help on your terms.</Text><Text style={s.body}>English and grammar, on tap.</Text></View><View style={{ flex: 1, minWidth: 160 }}><Text style={s.heading}>Keep what matters.</Text><Text style={s.body}>A notebook that’s yours to edit.</Text></View>
    </View>
  </View>;
}

function Catalogue({ lessons, model, onOpen, practice }: { lessons: Lesson[]; model: LearningModel; onOpen: (lesson: Lesson) => void; practice: boolean }) {
  const [search, setSearch] = useState('');
  const visible = lessons.filter(lesson => `${lesson.title} ${lesson.topic} ${lesson.role}`.toLowerCase().includes(search.toLowerCase().trim()));
  return <View style={{ gap: 24 }}><Text style={s.eyebrow}>{practice ? 'A safe place to try' : 'Everyday life in France'}</Text><Text accessibilityRole="header" style={s.title}>{practice ? 'Put your French together.' : 'What would you like to do?'}</Text><Text style={s.body}>{practice ? 'Choose a situation to practise with pictures, a short dialogue, and sentence pieces.' : 'Two small, practical lessons. Choose a situation and learn from the customer’s side.'}</Text>
    <TextInput accessibilityLabel="Search lessons" placeholder="Find a topic, like restaurant or bakery" value={search} onChangeText={setSearch} style={s.input} clearButtonMode="while-editing" />
    {!visible.length && <View style={s.card}><Text style={s.heading}>No matching lessons yet.</Text><Text style={s.body}>Try “restaurant” or “bakery”, or clear your search to see both drafts.</Text><Button onPress={() => setSearch('')}>Clear search</Button></View>}
    <View style={s.split}>{visible.map(lesson => { const progress = lessonProgress(lesson, model.events); return <View key={lesson.id} style={[s.card, s.column]}>
      <View style={s.row}><Badge>{lesson.level}</Badge><Badge>{lesson.role}</Badge><Badge>{lesson.status === 'published' ? `Published · revision ${lesson.revision}` : 'Draft'}</Badge></View><Illustration picture={lesson.vocabulary[1].picture} alt={lesson.vocabulary[1].pictureAlt} size={200} /><Text style={s.heading}>{lesson.subtitle}</Text><Text style={s.body}>{lesson.outcome}</Text><Text style={s.muted}>{lesson.durationMinutes} min · {lesson.vocabulary.length} words · {progress.completed ? 'Session saved' : `${progress.viewedIds.size} words explored`}</Text><Button primary onPress={() => onOpen(lesson)}>{progress.completed ? 'Revisit lesson →' : progress.viewedIds.size ? 'Continue lesson →' : 'Choose this lesson →'}</Button>
    </View>; })}</View>
  </View>;
}

function Profile({ model, catalogue, onOpenEditor }: { model: LearningModel; catalogue: ReturnType<typeof useCatalogue>; onOpenEditor: () => void }) {
  const completed = model.events.filter(event => event.activity === 'completion' && event.result === 'completed').length;
  return <View style={{ gap: 24 }}><Text style={s.eyebrow}>Your learning space</Text><Text accessibilityRole="header" style={s.title}>At your own pace.</Text><View style={s.card}><Text style={s.heading}>A local learner profile</Text><Text style={s.body}>Learning French · English explanations · Beginner foundations</Text><View style={s.row}><Badge>{completed} sessions completed</Badge><Badge>{model.notebook.length} notebook entries</Badge></View><Text style={s.muted}>Session completion records practice, not a language level or proficiency score.</Text></View>
    <View style={s.card}><Text style={s.heading}>Local curriculum workshop</Text><Text style={s.body}>Edit a draft, preview its saved revision, and review it before explicitly publishing to the local catalogue.</Text><Button onPress={onOpenEditor}>Open curriculum editor</Button></View>
    <View style={s.card}><Text style={s.heading}>Published lessons</Text><Text style={s.body}>Load owner-published local revisions into this browser. Draft edits stay in the workshop. Earlier practice and personal notes stay recorded when a new revision arrives.</Text><Button disabled={catalogue.busy} onPress={() => void catalogue.refreshPublished()}>{catalogue.busy ? 'Loading published lessons…' : 'Load published lessons'}</Button>{!!catalogue.error && <Text accessibilityRole="alert" style={s.body}>{catalogue.error}</Text>}{!!catalogue.message && <Text accessibilityLiveRegion="polite" style={s.body}>{catalogue.message}</Text>}</View>
    <View style={s.card}><Text style={s.heading}>About this preview</Text><Text style={s.body}>Your progress and notebook stay in this browser on this device. There is no account or sync. Clearing browser data removes these notes.</Text><Text style={s.body}>Bundled lessons don’t need the local API or an AI key. Listening uses a synthetic device voice when a French voice is available. You can always read and practise from the text.</Text><Text style={s.muted}>Draft lessons and original illustrations still need owner review. Offline installation and downloadable lesson packs are planned.</Text></View>
  </View>;
}
