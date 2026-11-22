import { useEffect, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { notebookEntrySchema, languageNames, type TargetLanguage } from '@smartlingo/domain';
import { Button } from './controls';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';

export function PersonalWordForm({ model, language = 'fr-FR' }: { model: LearningModel; language?: TargetLanguage }) {
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState('');
  const [exampleReading, setExampleReading] = useState('');
  const [target, setTarget] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const writing = useRef(false);
  const locked = model.busy || !!model.saveError;
  useEffect(() => { if (!model.busy) writing.current = false; }, [model.busy]);

  function clear() { setReading(''); setExampleReading(''); setTarget(''); setMeaning(''); setExample(''); setError(''); setOpen(false); }
  function save() {
    if (writing.current || model.blocked) return;
    const id = `personal.${globalThis.crypto.randomUUID()}`;
    const parsed = notebookEntrySchema.safeParse({ id, sourceEntryId: id, language, target, meaning, example, ...(language === 'ja-JP' ? { reading: reading.trim() || undefined, exampleReading: exampleReading.trim() || undefined } : {}), updatedAt: new Date().toISOString() });
    if (!parsed.success) { setError(`Add a ${languageNames[language]} word or phrase and an English meaning. The example is optional.`); return; }
    writing.current = true; setError('');
    model.saveEntry(parsed.data, () => { writing.current = false; setSaved(parsed.data.target); clear(); });
  }

  return <View style={s.card} testID="personal-word-form">
    <Text accessibilityRole="header" style={s.heading}>Your own vocabulary</Text>
    {open && <Text style={s.body}>Add a word with its English meaning and an optional example.</Text>}
    {!open ? <Button disabled={model.blocked} onPress={() => { setSaved(''); setOpen(true); }}>Add personal word</Button> : <>
      <Text style={s.body}>{languageNames[language]} word or phrase</Text>
      <TextInput accessibilityLabel={`New ${languageNames[language]} word or phrase`} value={target} onChangeText={setTarget} maxLength={300} editable={!locked} style={s.input} />
      {language === 'ja-JP' && <><Text style={s.body}>Kana reading (optional)</Text><TextInput accessibilityLabel="New kana reading" value={reading} onChangeText={setReading} maxLength={300} editable={!locked} style={s.input} /></>}
      <Text style={s.body}>English meaning</Text>
      <TextInput accessibilityLabel="New English meaning" value={meaning} onChangeText={setMeaning} maxLength={500} editable={!locked} style={s.input} />
      <Text style={s.body}>Example or personal note (optional)</Text>
      <TextInput accessibilityLabel="New example or personal note" value={example} onChangeText={setExample} maxLength={1000} editable={!locked} multiline style={[s.input, { minHeight: 90 }]} />
      {language === 'ja-JP' && <><Text style={s.body}>Example kana reading (optional)</Text><TextInput accessibilityLabel="New example kana reading" value={exampleReading} onChangeText={setExampleReading} maxLength={1000} editable={!locked} style={s.input} /></>}
      {!!error && <Text accessibilityRole="alert" style={[s.body, { color: colors.danger }]}>{error}</Text>}
      <View style={s.row}><Button primary disabled={model.blocked} onPress={save}>Save personal word</Button><Button disabled={locked} onPress={clear}>Cancel personal word</Button></View>
      {!!model.saveError && <Text style={s.muted}>Your form is kept. Use Retry save above to retry this same entry, or Dismiss and continue before editing it.</Text>}
    </>}
    {!!saved && <Text accessibilityLiveRegion="polite" style={s.muted}>Saved {saved} to your notebook.</Text>}
    {open && <Text style={s.muted}>Saved privately in this browser and included in learning backups.</Text>}
  </View>;
}
