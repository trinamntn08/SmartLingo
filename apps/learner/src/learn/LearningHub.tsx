import { Platform, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { languageNames, type Lesson, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { Disclosure } from '../ui/Disclosure';
import { styles as s } from '../ui/theme';
import { TopicCatalogue } from '../ui/TopicCatalogue';
import type { LearningModel } from '../ui/useLearning';
import { ListeningResources } from '../listening/ListeningResources';
import { ListeningComprehension } from '../listening/ListeningComprehension';
import { GuidedSpeaking } from '../practice/GuidedSpeaking';
import { FrenchPractice } from '../practice/FrenchPractice';
import { JapaneseAlphabet } from '../alphabet/JapaneseAlphabet';

export const learnModes = ['Japanese letters', 'Vocabulary & lessons', 'Listening & videos', 'Speaking'] as const;
export type LearnMode = typeof learnModes[number];

export function LearningHub({ language, lessons, model, mode, onMode, selectedTopic, onSelectTopic, onOpen, disabled, active }: {
  language: TargetLanguage; lessons: Lesson[]; model: LearningModel; mode: LearnMode;
  onMode: (mode: LearnMode) => void; selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void; onOpen: (lesson: Lesson) => void;
  disabled: boolean; active: boolean;
}) {
  const compact = useWindowDimensions().width < 600;
  const studyLessons = selectedTopic ? lessons.filter(lesson => lesson.topic === selectedTopic) : lessons;
  const visibleModes = learnModes.filter(choice => language === 'ja-JP' || choice !== 'Japanese letters');
  const activeMode = visibleModes.includes(mode) ? mode : 'Vocabulary & lessons';
  return <View style={{ gap: 24, minWidth: 0 }}>
    <View style={{ gap: 16 }}>
      <View style={{ gap: 4 }}><Text style={s.eyebrow}>{languageNames[language]}</Text>
        <Text accessibilityRole="header" style={s.title}>Learn</Text></View>
      {compact ? <ScrollView horizontal accessibilityLabel="Learning sections" showsHorizontalScrollIndicator contentContainerStyle={{ gap: 8, paddingVertical: 4 }} style={{ maxWidth: '100%' }}>
        {visibleModes.map(choice => <View key={choice} style={{ flexShrink: 0 }}><Button selected={choice === activeMode} disabled={disabled} onPress={() => onMode(choice)}>{choice}</Button></View>)}
      </ScrollView> : <View accessibilityLabel="Learning sections" style={s.row}>
        {visibleModes.map(choice => <Button key={choice} selected={choice === activeMode} disabled={disabled} onPress={() => onMode(choice)}>{choice}</Button>)}
      </View>}
      {!!selectedTopic && activeMode !== 'Vocabulary & lessons' && activeMode !== 'Japanese letters' && <View style={s.row}>
        <Text style={s.muted}>{selectedTopic}</Text><Button disabled={disabled} onPress={() => onSelectTopic(null)}>All topics</Button>
      </View>}
    </View>
    {activeMode === 'Japanese letters' && language === 'ja-JP' ? <JapaneseAlphabet model={model} />
      : activeMode === 'Vocabulary & lessons' ? <TopicCatalogue key={language} lessons={lessons} model={model} onOpen={onOpen} practice={false} selectedTopic={selectedTopic} onSelectTopic={onSelectTopic} />
      : activeMode === 'Listening & videos' ? <>
        <View style={s.row}>
          {Platform.OS === 'web' && <Button onPress={() => globalThis.document?.getElementById('learning-listening-library')?.scrollIntoView({ block: 'start' })}>Browse videos & audio</Button>}
        </View>
        <ListeningComprehension key={`${language}:${selectedTopic ?? 'all'}`} lessons={studyLessons} />
        <View nativeID="learning-listening-library"><ListeningResources key={language} language={language} /></View>
      </> : <>
        <GuidedSpeaking key={`${language}:${selectedTopic ?? 'all'}`} lessons={studyLessons} />
        {active && language === 'fr-FR' && <Disclosure title="Optional AI conversation" description="Try a temporary French exchange with English feedback." keepMounted={false}>
          <FrenchPractice lessons={studyLessons} model={model} active={active} />
        </Disclosure>}
      </>}
  </View>;
}
