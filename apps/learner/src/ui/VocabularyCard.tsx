import { useState } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { Vocabulary, TargetLanguage } from '@smartlingo/domain';
import { Button } from './controls';
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
  const saved = model.notebook.some(note => note.sourceEntryId === entry.id || note.id === `notebook.${entry.id}`);
  const presentation = vocabularyPresentation(entry);
  const gender = presentation.gender ? genderLabels[presentation.gender] : undefined;
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };

  function saveWord() {
    setMessage('');
    model.captureEntry({ id: `notebook.${entry.id}`, sourceEntryId: entry.id, language, reading: entry.reading, exampleReading: entry.exampleReading, target: entry.target,
      meaning: entry.meaning, example: entry.example, updatedAt: new Date().toISOString() },
    () => setMessage(`Saved ${entry.target} to your notebook.`));
  }

  const illustration = showIllustration && <WordIllustration entry={entry} size={study ? (compact ? 88 : 144) : compact ? 240 : 280} />;
  const example = <View style={study ? layout.studyExample : layout.example}>
    {!study && <Text style={s.eyebrow}>In a sentence</Text>}
    <Text {...languageProps} style={[s.body, study && layout.studySentence]}>{entry.example}</Text>
    {!!entry.exampleReading && <Text {...(language === 'ja-JP' ? languageProps : {})} style={s.muted}>{entry.exampleReading}</Text>}
    <Text style={study ? s.muted : s.body}>{entry.exampleMeaning}</Text>
  </View>;

  const definition = <View style={layout.definition}>
    <View style={[s.row, layout.phrase]}>
      <Text {...languageProps} accessibilityRole="header" aria-level={3} style={[s.target, layout.target, compact && layout.compactTarget, study && layout.studyTarget]}>{entry.target}</Text>
      {language === 'ja-JP' && <JapaneseWordReading target={entry.target} reading={entry.reading} />}
      {gender && <Text accessibilityLabel={gender.accessible} style={s.muted}>{gender.short}</Text>}
      <Speak language={language} text={entry.target} onError={setVoiceError} />
    </View>
    {language !== 'ja-JP' && !!entry.reading && <Text style={s.body}>{entry.reading}</Text>}
    <Text style={[s.body, layout.meaning]}>{entry.meaning}</Text>
  </View>;
  const actions = <View style={[s.row, layout.actions, study && layout.studyActions]}>
    <Button compact quiet icon={saved ? 'check' : 'bookmark'} label={`Save ${entry.target}`} disabled={model.blocked || saved} onPress={saveWord}>
      {saved ? 'In notebook' : 'Save word'}
    </Button>
  </View>;

  return <View testID={`vocabulary-${entry.id}`} style={study ? [layout.studyCard, compact && layout.compactCard] : [s.card, layout.card, compact && layout.compactCard]}>
    {definition}
    {!!voiceError && <Text accessibilityRole="alert" style={[s.muted, layout.voiceError]}>{voiceError}</Text>}
    {study ? <View style={[s.row, layout.studyContent]}>{illustration}{example}</View> : <>{illustration}{example}</>}
    {!!presentation.note && <Text style={s.muted}>{presentation.note}</Text>}
    {actions}
    {!!message && <Text accessibilityLiveRegion="polite" style={s.muted}>{message}</Text>}
  </View>;
}

const layout = StyleSheet.create({
  card: { width: '100%', minWidth: 0, flexGrow: 1, padding: 20, gap: 12, boxShadow: 'none', borderRadius: 16 },
  compactCard: { padding: 16 },
  studyCard: { minWidth: 0, padding: 24, gap: 12 },
  definition: { minWidth: 0, gap: 4 },
  phrase: { gap: 8 },
  target: { flexShrink: 1, minWidth: 0 },
  compactTarget: { fontSize: 32, lineHeight: 42 },
  studyTarget: { fontSize: 28, lineHeight: 36, fontWeight: '500' },
  meaning: { fontWeight: '600' },
  voiceError: { color: colors.danger },
  studyContent: { minWidth: 0, alignItems: 'flex-start' },
  studyExample: { flexGrow: 1, flexShrink: 1, flexBasis: 144, minWidth: 0, borderLeftWidth: 1, borderColor: colors.line, paddingLeft: 12, gap: 4 },
  studySentence: { fontWeight: '500' },
  example: { gap: 4, paddingTop: 12, borderTopWidth: 1, borderColor: colors.line },
  actions: { marginTop: 'auto', gap: 8 },
  studyActions: { marginTop: 0 },
});
