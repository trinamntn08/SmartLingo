import { useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import type { Vocabulary } from '@smartlingo/domain';
import { Button, Speak } from './controls';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { WordIllustration } from './WordIllustration';
import { genderLabels, vocabularyPresentation } from '../content/vocabularyPresentation';

export function VocabularyCard({ entry, model }: { entry: Vocabulary; model: LearningModel }) {
  const [message, setMessage] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const compact = useWindowDimensions().width < 600;
  const saved = model.notebook.some(note => note.sourceEntryId === entry.id || note.id === `notebook.${entry.id}`);
  const presentation = vocabularyPresentation(entry);
  const gender = presentation.gender ? genderLabels[presentation.gender] : undefined;

  function saveWord() {
    setMessage('');
    model.captureEntry({ id: `notebook.${entry.id}`, sourceEntryId: entry.id, target: entry.target,
      meaning: entry.meaning, example: entry.example, updatedAt: new Date().toISOString() },
    () => setMessage(`Saved ${entry.target} to your notebook.`));
  }

  return <View testID={`vocabulary-${entry.id}`} style={[s.card, { width: '100%', minWidth: 0, flexGrow: 1, padding: 18, gap: 12 }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <WordIllustration entry={entry} size={compact ? 72 : 100} />
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text accessibilityRole="header" style={[s.heading, { flexShrink: 1, minWidth: 0 }]}>{entry.target}</Text>
          {gender && <Text accessibilityLabel={gender.accessible} style={s.muted}>{gender.short}</Text>}
          <Speak text={entry.target} onError={setVoiceError} />
        </View>
        <Text style={s.body}>{entry.meaning}</Text>
      </View>
    </View>
    {!!voiceError && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{voiceError}</Text>}
    <View style={{ gap: 4 }}>
      <Text style={s.body}>{entry.example}</Text>
      <Text style={s.muted}>{entry.exampleMeaning}</Text>
    </View>
    {!!presentation.note && <Text style={s.muted}>{presentation.note}</Text>}
    <View style={[s.row, { marginTop: 'auto', gap: 8 }]}>
      <Button label={`Save ${entry.target}`} disabled={model.blocked || saved} onPress={saveWord}>
        {saved ? '✓ In notebook' : '+ Save word'}
      </Button>
    </View>
    {!!message && <Text accessibilityLiveRegion="polite" style={s.muted}>{message}</Text>}
  </View>;
}
