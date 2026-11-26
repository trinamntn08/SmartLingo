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

export function VocabularyCard({ entry, model, language = 'fr-FR', showIllustration = true, study = false, phoneStudy = false, romanization = true, courseClip = false }: {
  entry: Vocabulary; model: LearningModel; language?: TargetLanguage; showIllustration?: boolean; study?: boolean; phoneStudy?: boolean; romanization?: boolean; courseClip?: boolean;
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

  const illustrationSize = phoneStudy ? 100 : study ? (compact ? 148 : 144) : compact ? 240 : 280;
  const illustration = showIllustration && <WordIllustration entry={entry} size={illustrationSize} />;
  const term = <Text {...languageProps} accessibilityRole="header"
    style={[s.target, layout.target, compact && layout.compactTarget, phoneStudy && layout.phoneTarget]}>{entry.target}</Text>;
  const japaneseReading = language === 'ja-JP' && <JapaneseWordReading target={entry.target} reading={entry.reading} romanization={romanization} />;
  const genderLabel = gender && <Text accessibilityLabel={gender.accessible} style={s.muted}>{gender.short}</Text>;
  const audio = <Speak language={language} courseClip={courseClip} text={entry.target} onError={setVoiceError} />;
  const example = <View style={study ? layout.studyExample : layout.example}>
    {!study && <Text style={s.eyebrow}>In a sentence</Text>}
    <Text {...languageProps} style={[s.body, study && layout.studySentence]}>{entry.example}</Text>
    {!!entry.exampleReading && <Text {...(language === 'ja-JP' ? languageProps : {})} style={s.muted}>{entry.exampleReading}</Text>}
    <Text style={study ? s.muted : s.body}>{entry.exampleMeaning}</Text>
  </View>;

  return <View testID={`vocabulary-${entry.id}`} style={[s.card, layout.card, compact && layout.compactCard, study && layout.studyCard]}>
    <View style={layout.definition}>
      {phoneStudy ? <>
        <View style={[s.row, layout.phonePhrase]}>
          <View style={layout.phoneTerm}>{term}{genderLabel}</View>
          <View style={[s.row, layout.phoneActions]}>
            {audio}
            <Button compact iconOnly icon={saved ? 'check' : 'bookmark'} toggle selected={saved}
              label={`Save ${entry.target}`} disabled={model.blocked || saved} onPress={saveWord} />
          </View>
        </View>
        {japaneseReading}
      </> : <View style={[s.row, layout.phrase]}>{term}{japaneseReading}{genderLabel}{audio}</View>}
      {language !== 'ja-JP' && !!entry.reading && <Text style={s.body}>{entry.reading}</Text>}
      <Text style={[s.body, layout.meaning]}>{entry.meaning}</Text>
    </View>
    {!!voiceError && <Text accessibilityRole="alert" style={[s.muted, layout.voiceError]}>{voiceError}</Text>}
    {study ? <View style={[s.row, layout.studyContent]}>{phoneStudy ? <>{example}{illustration}</> : <>{illustration}{example}</>}</View>
      : <>{illustration}{example}</>}
    {!!presentation.note && <Text style={s.muted}>{presentation.note}</Text>}
    {!phoneStudy && <View style={[s.row, layout.actions, study && layout.studyActions]}>
      <Button compact quiet label={`Save ${entry.target}`} disabled={model.blocked || saved} onPress={saveWord}>
        {saved ? '✓ In notebook' : '+ Save word'}
      </Button>
    </View>}
    {(phoneStudy || !!message) && <Text accessibilityLiveRegion="polite"
      style={[s.muted, phoneStudy && layout.saveAnnouncement]}>{message}</Text>}
  </View>;
}

const layout = StyleSheet.create({
  card: { width: '100%', minWidth: 0, flexGrow: 1, padding: 20, gap: 14, boxShadow: 'none', borderRadius: 16 },
  compactCard: { padding: 16 },
  studyCard: { gap: 12, borderBottomWidth: 3 },
  definition: { minWidth: 0, gap: 4 },
  phrase: { gap: 8 },
  phonePhrase: { gap: 8, alignItems: 'flex-start' },
  phoneTerm: { flexGrow: 1, flexShrink: 1, flexBasis: 145, minWidth: 0 },
  phoneActions: { gap: 6 },
  target: { flexShrink: 1, minWidth: 0 },
  compactTarget: { fontSize: 32, lineHeight: 42 },
  phoneTarget: { fontSize: 25, lineHeight: 32 },
  saveAnnouncement: { position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' },
  meaning: { fontWeight: '600' },
  voiceError: { color: colors.danger },
  studyContent: { minWidth: 0 },
  studyExample: { flex: 1, flexBasis: 150, minWidth: 0, backgroundColor: colors.paper, borderRadius: 10, padding: 12, gap: 4 },
  studySentence: { fontWeight: '600' },
  example: { gap: 6, paddingTop: 12, borderTopWidth: 1, borderColor: colors.line },
  actions: { marginTop: 'auto', gap: 8 },
  studyActions: { paddingTop: 4, borderTopWidth: 1, borderColor: colors.line },
});
