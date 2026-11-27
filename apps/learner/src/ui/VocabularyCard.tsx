import { useState } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { Vocabulary, TargetLanguage } from '@smartlingo/domain';
import { NotebookStar } from './NotebookStar';
import { Speak } from '../audio/Speak';
import { colors, designTokens as tokens, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { WordIllustration } from './WordIllustration';
import { JapaneseWordReading } from './JapaneseWordReading';
import { genderLabels, vocabularyPresentation } from '../content/vocabularyPresentation';

export function VocabularyCard({ entry, model, language = 'fr-FR', showIllustration = true, study = false }: {
  entry: Vocabulary; model: LearningModel; language?: TargetLanguage; showIllustration?: boolean; study?: boolean;
}) {
  const [message, setMessage] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const compact = useWindowDimensions().width < tokens.layout.compactBreakpoint;
  const presentation = vocabularyPresentation(entry);
  const gender = presentation.gender ? genderLabels[presentation.gender] : undefined;
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };

  const illustration = showIllustration && <WordIllustration entry={entry} size={study ? (compact ? 88 : 144) : compact ? 240 : 280} />;
  const example = <View style={study ? layout.studyExample : layout.example}>
    {!study && <Text style={s.eyebrow}>In a sentence</Text>}
    <Text {...languageProps} style={[s.body, study && layout.studySentence]}>{entry.example}</Text>
    {!!entry.exampleReading && <Text {...(language === 'ja-JP' ? languageProps : {})} style={s.muted}>{entry.exampleReading}</Text>}
    <Text style={study ? s.muted : s.body}>{entry.exampleMeaning}</Text>
  </View>;

  const definition = <View style={layout.definition}>
    <View style={[s.row, layout.phrase]}>
      <Speak language={language} text={entry.target} onError={setVoiceError} headingLevel={3}
        wordStyle={[s.target, layout.target, compact && layout.compactTarget, study && layout.studyTarget]} />
      {language === 'ja-JP' && <JapaneseWordReading target={entry.target} reading={entry.reading} />}
      {gender && <Text accessibilityLabel={gender.accessible} style={s.muted}>{gender.short}</Text>}
      <View style={layout.termActions}>
        <NotebookStar model={model} entry={{ id: `notebook.${entry.id}`, sourceEntryId: entry.id, language, reading: entry.reading,
          exampleReading: entry.exampleReading, target: entry.target, meaning: entry.meaning, example: entry.example }}
          onChange={saved => setMessage(saved ? `Saved ${entry.target} to your notebook.` : `Removed ${entry.target} from your notebook.`)} />
      </View>
    </View>
    {language !== 'ja-JP' && !!entry.reading && <Text style={s.body}>{entry.reading}</Text>}
    <Text style={[s.body, layout.meaning]}>{entry.meaning}</Text>
  </View>;
  return <View testID={`vocabulary-${entry.id}`} style={study ? [layout.studyCard, compact && layout.compactCard] : [s.card, layout.card, compact && layout.compactCard]}>
    {definition}
    {!!voiceError && <Text accessibilityRole="alert" style={[s.muted, layout.voiceError]}>{voiceError}</Text>}
    {study ? <View style={[s.row, layout.studyContent]}>{illustration}{example}</View> : <>{illustration}{example}</>}
    {!!presentation.note && <Text style={s.muted}>{presentation.note}</Text>}
    {!!message && <Text accessibilityLiveRegion="polite" style={s.muted}>{message}</Text>}
  </View>;
}

const layout = StyleSheet.create({
  card: { width: '100%', minWidth: 0, flexGrow: 1, padding: 20, gap: 12, boxShadow: 'none', borderRadius: 16 },
  compactCard: { padding: 16 },
  studyCard: { minWidth: 0, padding: 24, gap: 12 },
  definition: { minWidth: 0, gap: 4 },
  phrase: { gap: 8 },
  termActions: { ...s.row, gap: 4, maxWidth: '100%' },
  target: { flexShrink: 1, minWidth: 0 },
  compactTarget: { fontSize: 32, lineHeight: 42 },
  studyTarget: { fontSize: 28, lineHeight: 36, fontWeight: '500' },
  meaning: { fontWeight: '600' },
  voiceError: { color: colors.danger },
  studyContent: { minWidth: 0, alignItems: 'flex-start' },
  studyExample: { flexGrow: 1, flexShrink: 1, flexBasis: 144, minWidth: 0, borderLeftWidth: 1, borderColor: colors.line, paddingLeft: 12, gap: 4 },
  studySentence: { fontWeight: '500' },
  example: { gap: 4, paddingTop: 12, borderTopWidth: 1, borderColor: colors.line },
});
