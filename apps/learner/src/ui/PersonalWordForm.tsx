import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { notebookEntrySchema, languageNames, type TargetLanguage } from '@smartlingo/domain';
import { Button } from './controls';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { toolsStyles as t } from './learnerToolsStyles';

export function PersonalWordForm({ model, language = 'fr-FR', embedded = false }: { model: LearningModel; language?: TargetLanguage; embedded?: boolean }) {
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

  return <View style={[embedded ? t.stack : t.panel, form.container, embedded && open && form.expanded]} testID="personal-word-form">
    {!embedded && <Text accessibilityRole="header" style={t.sectionTitle}>Personal vocabulary</Text>}
    {!open && <View style={s.row}>
      <Button compact disabled={model.blocked} onPress={() => { setSaved(''); setOpen(true); }}>Add personal word</Button>
    </View>}
    {embedded && open && <Text accessibilityRole="header" style={t.sectionTitle}>Add a personal word</Text>}
    {open && <>
      <View style={form.field}>
        <Text style={t.label}>{languageNames[language]} word or phrase</Text>
        <TextInput accessibilityLabel={`New ${languageNames[language]} word or phrase`} value={target} onChangeText={setTarget} maxLength={300} editable={!locked} style={s.input} />
      </View>
      {language === 'ja-JP' && <View style={form.field}>
        <Text style={t.label}>Kana reading (optional)</Text>
        <TextInput accessibilityLabel="New kana reading" value={reading} onChangeText={setReading} maxLength={300} editable={!locked} style={s.input} />
      </View>}
      <View style={form.field}>
        <Text style={t.label}>English meaning</Text>
        <TextInput accessibilityLabel="New English meaning" value={meaning} onChangeText={setMeaning} maxLength={500} editable={!locked} style={s.input} />
      </View>
      <View style={form.field}>
        <Text style={t.label}>Example or personal note (optional)</Text>
        <TextInput accessibilityLabel="New example or personal note" value={example} onChangeText={setExample} maxLength={1000} editable={!locked} multiline style={[s.input, form.example]} />
      </View>
      {language === 'ja-JP' && <View style={form.field}>
        <Text style={t.label}>Example kana reading (optional)</Text>
        <TextInput accessibilityLabel="New example kana reading" value={exampleReading} onChangeText={setExampleReading} maxLength={1000} editable={!locked} style={s.input} />
      </View>}
      {!!error && <Text accessibilityRole="alert" style={[s.body, { color: colors.danger }]}>{error}</Text>}
      <View style={s.row}><Button accent disabled={model.blocked} onPress={save}>Save personal word</Button><Button quiet disabled={locked} onPress={clear}>Cancel personal word</Button></View>
      {!!model.saveError && <Text style={s.muted}>Your word is still here. Use Retry save above to save it.</Text>}
    </>}
    {!!saved && <Text accessibilityLiveRegion="polite" style={s.muted}>Saved {saved} to your notebook.</Text>}
  </View>;
}

const form = StyleSheet.create({
  container: { maxWidth: '100%', flexShrink: 1 },
  expanded: { width: '100%', gap: 12 },
  field: { gap: 4 },
  example: { minHeight: 88, textAlignVertical: 'top' },
});
