import { useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import type { Vocabulary, TargetLanguage } from '@smartlingo/domain';
import { Button } from './controls';
import { Speak } from '../audio/Speak';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { WordIllustration } from './WordIllustration';
import { JapaneseWordReading } from './JapaneseWordReading';
import { genderLabels, vocabularyPresentation } from '../content/vocabularyPresentation';

export function VocabularyCard({ entry, model, language = 'fr-FR', showIllustration = true, study = false }: {
  entry: Vocabulary; model: LearningModel; language?: TargetLanguage; showIllustration?: boolean; study?: boolean;
}) {
  const [message, setMessage] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const compact = useWindowDimensions().width < 600;
  const saved = model.notebook.some(note => note.sourceEntryId === entry.id || note.id === `notebook.${entry.id}`);
  const presentation = vocabularyPresentation(entry);
  const gender = presentation.gender ? genderLabels[presentation.gender] : undefined;

  function saveWord() {
    setMessage('');
    model.captureEntry({ id: `notebook.${entry.id}`, sourceEntryId: entry.id, language, reading: entry.reading, exampleReading: entry.exampleReading, target: entry.target,
      meaning: entry.meaning, example: entry.example, updatedAt: new Date().toISOString() },
    () => setMessage(`Saved ${entry.target} to your notebook.`));
  }

  const illustration = showIllustration && <WordIllustration entry={entry} size={study ? (compact ? 148 : 144) : compact ? 240 : 280} />;
  const example = <View style={study ? { flex: 1, flexBasis: 150, minWidth: 0, borderLeftWidth: 3, borderColor: colors.green, paddingLeft: 12, gap: 4 }
    : { gap: 6, paddingTop: 12, borderTopWidth: 1, borderColor: colors.line }}>
    {!study && <Text style={s.eyebrow}>In a sentence</Text>}
    <Text style={[s.body, study && { fontWeight: '600' }]}>{entry.example}</Text>{!!entry.exampleReading && <Text style={s.muted}>{entry.exampleReading}</Text>}
    <Text style={study ? s.muted : s.body}>{entry.exampleMeaning}</Text>
  </View>;

  return <View testID={`vocabulary-${entry.id}`} style={[s.card, { width: '100%', minWidth: 0, flexGrow: 1, padding: compact ? 16 : 20, gap: study ? 12 : 14, boxShadow: 'none', borderRadius: 16 },
    study && { borderTopWidth: 3, borderTopColor: colors.green }]}>
    <View style={{ minWidth: 0, gap: study ? 0 : 6 }}>
        <View style={[s.row, { gap: 8 }]}>
          <Text accessibilityRole="header" style={[s.target, { flexShrink: 1, minWidth: 0 }, compact && { fontSize: 32, lineHeight: 42 }]}>{entry.target}</Text>
          {language === 'ja-JP' && <JapaneseWordReading target={entry.target} reading={entry.reading} />}
          {gender && <Text accessibilityLabel={gender.accessible} style={s.muted}>{gender.short}</Text>}
          <Speak language={language} text={entry.target} onError={setVoiceError} />
        </View>
        {language !== 'ja-JP' && !!entry.reading && <Text style={s.body}>{entry.reading}</Text>}
        <Text style={[s.body, { fontWeight: '600' }]}>{entry.meaning}</Text>
    </View>
    {!!voiceError && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{voiceError}</Text>}
    {study ? <View style={[s.row, { alignItems: 'center', gap: 12, minWidth: 0 }]}>{illustration}{example}</View> : <>{illustration}{example}</>}
    {!!presentation.note && <Text style={s.muted}>{presentation.note}</Text>}
    <View style={[s.row, { marginTop: 'auto', gap: 8 }]}>
      <Button compact quiet label={`Save ${entry.target}`} disabled={model.blocked || saved} onPress={saveWord}>
        {saved ? '✓ In notebook' : '+ Save word'}
      </Button>
    </View>
    {!!message && <Text accessibilityLiveRegion="polite" style={s.muted}>{message}</Text>}
  </View>;
}
