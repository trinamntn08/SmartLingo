import { useState } from 'react';
import { Text, View } from 'react-native';
import type { CourseDay } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';

/** Japanese study support has no dependency on French audio, pictures or morphology. */
export function JapaneseVocabularyCard({ entry, model }: { entry: CourseDay['vocabulary'][number]; model: LearningModel }) {
  const [message, setMessage] = useState('');
  const saved = model.notebook.some(note => note.sourceEntryId === entry.id || note.id === `notebook.${entry.id}`);
  function saveWord() {
    setMessage('');
    model.captureEntry({ id: `notebook.${entry.id}`, sourceEntryId: entry.id, language: 'ja-JP', target: entry.target,
      reading: entry.reading, meaning: entry.meaning, example: entry.example, exampleReading: entry.exampleReading,
      updatedAt: new Date().toISOString() }, () => setMessage(`Saved ${entry.target} to your notebook.`));
  }
  return <View testID={`vocabulary-${entry.id}`} style={[s.card, { width: '100%', minWidth: 0, padding: 18, gap: 12 }]}>
    <View style={{ gap: 4 }}>
      <Text accessibilityRole="header" style={s.heading}>{entry.target}</Text>
      {!!entry.reading && <Text style={s.body}>Reading: {entry.reading}</Text>}
      <Text style={s.body}>{entry.meaning}</Text>
    </View>
    <View style={[s.notice, { gap: 4 }]}>
      <Text style={s.body}>{entry.example}</Text>
      {!!entry.exampleReading && <Text style={s.muted}>Reading: {entry.exampleReading}</Text>}
      <Text style={s.body}>{entry.exampleMeaning}</Text>
    </View>
    {!!entry.note && <Text style={s.muted}>{entry.note}</Text>}
    <View style={s.row}><Button label={`Save ${entry.target}`} disabled={model.blocked || saved} onPress={saveWord}>
      {saved ? '✓ In notebook' : '+ Save word'}
    </Button></View>
    {!!message && <Text accessibilityLiveRegion="polite" style={s.muted}>{message}</Text>}
  </View>;
}
