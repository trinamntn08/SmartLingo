import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Vocabulary } from '@smartlingo/domain';
import { Button, Speak } from './controls';
import { colors, frenchTextProps, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { WordIllustration } from './WordIllustration';
import { genderLabels, vocabularyPresentation } from '../content/vocabularyPresentation';

export function VocabularyCard({ entry, model }: { entry: Vocabulary; model: LearningModel }) {
  const [message, setMessage] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const saved = model.notebook.some(note => note.sourceEntryId === entry.id || note.id === `notebook.${entry.id}`);
  const presentation = vocabularyPresentation(entry);
  const gender = presentation.gender ? genderLabels[presentation.gender] : undefined;

  function saveWord() {
    setMessage('');
    model.captureEntry({ id: `notebook.${entry.id}`, sourceEntryId: entry.id, target: entry.target,
      meaning: entry.meaning, example: entry.example, updatedAt: new Date().toISOString() },
    () => setMessage(`Saved ${entry.target} to your notebook.`));
  }

  return (
    <View testID={`vocabulary-${entry.id}`} style={[s.card, vocabulary.card]}>
      <View style={vocabulary.identity}>
        <WordIllustration entry={entry} size={76} />
        <View style={vocabulary.definition}>
          <View style={vocabulary.phrase}>
            <Text accessibilityRole="header" {...frenchTextProps} style={[s.heading, vocabulary.target]}>
              {entry.target}
            </Text>
            {gender && <Text accessibilityLabel={gender.accessible} style={[s.muted, vocabulary.gender]}>{gender.short}</Text>}
          </View>
          <Text style={s.body}>{entry.meaning}</Text>
        </View>
      </View>
      <View style={vocabulary.example}>
        <Text style={s.eyebrow}>Example</Text>
        <Text {...frenchTextProps} style={s.body}>{entry.example}</Text>
        <Text style={s.muted}>{entry.exampleMeaning}</Text>
      </View>
      {!!presentation.note && <Text style={s.muted}>{presentation.note}</Text>}
      <View style={[s.row, vocabulary.actions]}>
        <Speak text={entry.target} onError={setVoiceError} />
        <Button label={`Save ${entry.target}`} disabled={model.blocked || saved} onPress={saveWord}>
          {saved ? '✓ In notebook' : '+ Save word'}
        </Button>
      </View>
      {!!voiceError && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{voiceError}</Text>}
      {!!message && <Text accessibilityLiveRegion="polite" style={s.muted}>{message}</Text>}
    </View>
  );
}

const vocabulary = StyleSheet.create({
  card: { width: '100%', minWidth: 0, flexGrow: 1, padding: 16, gap: 14 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  definition: { flex: 1, minWidth: 0, gap: 3 },
  phrase: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 8, rowGap: 2 },
  target: { flexShrink: 1, minWidth: 0, fontSize: 22, lineHeight: 27 },
  gender: { fontSize: 13, fontWeight: '700' },
  example: { backgroundColor: colors.paper, borderRadius: 12, padding: 12, gap: 3 },
  actions: { marginTop: 'auto', paddingTop: 10, borderTopWidth: 1, borderColor: colors.line, justifyContent: 'space-between', gap: 8 },
});
