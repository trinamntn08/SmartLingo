import { useState } from 'react';
import { Text, View } from 'react-native';
import type { Vocabulary } from '@smartlingo/domain';
import { Button, Speak } from './controls';
import { styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { WordIllustration } from './WordIllustration';

export function VocabularyCard({ entry, model }: { entry: Vocabulary; model: LearningModel }) {
  const [message, setMessage] = useState('');
  const saved = model.notebook.some(note => note.sourceEntryId === entry.id || note.id === `notebook.${entry.id}`);

  function saveWord() {
    setMessage('');
    model.captureEntry({ id: `notebook.${entry.id}`, sourceEntryId: entry.id, target: entry.target,
      meaning: entry.meaning, example: entry.example, updatedAt: new Date().toISOString() },
    () => setMessage(`Saved ${entry.target} to your notebook.`));
  }

  return <View style={[s.card, { width: '100%', minWidth: 0, flexGrow: 1, padding: 18, gap: 12 }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <WordIllustration entry={entry} size={100} />
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <Text accessibilityRole="header" style={s.heading}>{entry.target}</Text>
        <Text style={s.body}>{entry.meaning}</Text>
      </View>
    </View>
    <View style={{ gap: 4 }}>
      <Text style={s.body}>{entry.example}</Text>
      <Text style={s.muted}>{entry.exampleMeaning}</Text>
    </View>
    <Text style={s.muted}>{entry.note}</Text>
    <View style={[s.row, { marginTop: 'auto', gap: 8 }]}>
      <Speak text={entry.target} />
      <Button label={`Save ${entry.target}`} disabled={model.blocked || saved} onPress={saveWord}>
        {saved ? '✓ In notebook' : '+ Save word'}
      </Button>
    </View>
    {!!message && <Text accessibilityLiveRegion="polite" style={s.muted}>{message}</Text>}
  </View>;
}
