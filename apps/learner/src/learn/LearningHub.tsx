import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Platform, ScrollView, Text, useWindowDimensions, View } from 'react-native';
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

export const learnModes = ['Japanese letters', 'Vocabulary & lessons', 'Listening & videos', 'Speaking'] as const;
export type LearnMode = typeof learnModes[number];

export function LearningHub({ language, lessons, model, mode, onMode, selectedTopic, onSelectTopic, onOpen, disabled, active, catalogueSearch, topics, topicNavigation }: {
  language: TargetLanguage; lessons: Lesson[]; model: LearningModel; mode: LearnMode;
  onMode: (mode: LearnMode) => void; selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void; onOpen: (lesson: Lesson) => void;
  disabled: boolean; active: boolean;
  catalogueSearch: CatalogueSearch;
  topics: LessonTopic[];
  topicNavigation: ReactNode;
}) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const studyLessons = selectedTopic ? lessons.filter(lesson => lesson.topic === selectedTopic) : lessons;
  const visibleModes = learnModes.filter(choice => language === 'ja-JP' || choice !== 'Japanese letters');
  const activeMode = visibleModes.includes(mode) ? mode : 'Vocabulary & lessons';
  return <View style={{ gap: 16, minWidth: 0 }}>
    <View style={{ gap: 10, paddingBottom: 12, borderBottomWidth: 1, borderColor: colors.line }}>
      {compact ? <ScrollView horizontal accessibilityLabel="Learning sections" showsHorizontalScrollIndicator contentContainerStyle={{ gap: 6, paddingVertical: 3 }} style={{ maxWidth: '100%' }}>
        {visibleModes.map(choice => <View key={choice} style={{ flexShrink: 0 }}><Button compact quiet selected={choice === activeMode} disabled={disabled} onPress={() => onMode(choice)}>{choice}</Button></View>)}
      </ScrollView> : <View accessibilityLabel="Learning sections" style={s.row}>
        {visibleModes.map(choice => <Button compact quiet key={choice} selected={choice === activeMode} disabled={disabled} onPress={() => onMode(choice)}>{choice}</Button>)}
      </View>}
      {!!selectedTopic && activeMode !== 'Vocabulary & lessons' && activeMode !== 'Japanese letters' && <View style={s.row}>
        <Text style={s.muted}>{selectedTopic}</Text><Button compact quiet disabled={disabled} onPress={() => onSelectTopic(null)}>All topics</Button>
      </View>}
    </View>
    {topicNavigation}
    {activeMode === 'Japanese letters' && language === 'ja-JP' ? <JapaneseAlphabet model={model} />
      : activeMode === 'Vocabulary & lessons' ? <TopicCatalogue key={language} language={language} lessons={lessons} topics={topics} model={model}
        onOpen={onOpen} selectedTopic={selectedTopic} onSelectTopic={onSelectTopic} search={catalogueSearch} disabled={disabled} />
      : activeMode === 'Listening & videos' ? <ListeningSection key={`${language}:${selectedTopic ?? 'all'}`}
        lessons={studyLessons} language={language} active={active} /> : <>
        <GuidedSpeaking key={`${language}:${selectedTopic ?? 'all'}`} lessons={studyLessons} />
        {active && language === 'fr-FR' && <Disclosure title="Optional AI conversation" description="Try a temporary French exchange with English feedback." keepMounted={false}>
          <FrenchPractice lessons={studyLessons} model={model} active={active} />
        </Disclosure>}
      </>}
  </View>;
}

function ListeningSection({ lessons, language, active }: { lessons: Lesson[]; language: TargetLanguage; active: boolean }) {
  const [browsing, setBrowsing] = useState(false);
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

  return <>
    <View style={browsing ? { display: 'none' } : undefined}>
      <ListeningComprehension lessons={lessons} active={active && !browsing} headingId={practiceHeading} onBrowse={() => setBrowsing(true)} />
    </View>
    {browsing && <ListeningResources language={language} headingId={libraryHeading} onClose={() => setBrowsing(false)} />}
  </>;
}
