import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { normalizeSearch, notebookEntrySchema, languageNames, notebookLanguage, type TargetLanguage, type NotebookEntry } from '@smartlingo/domain';
import { Button, Speak } from './controls';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { ReviewPanel } from '../review/ReviewPanel';
import { PersonalWordForm } from './PersonalWordForm';

export function Notebook({ model, onExplore, language = 'fr-FR', onWriteBlocked }: { model: LearningModel; onExplore: () => void; language?: TargetLanguage; onWriteBlocked?: (blocked: boolean) => void }) {
  const [query, setQuery] = useState('');
  const name = languageNames[language];
  const normalized = normalizeSearch(query);
  const matches = new Set(model.notebook.filter(entry => normalizeSearch(`${entry.target} ${entry.reading ?? ''} ${entry.meaning} ${entry.example} ${entry.exampleReading ?? ''}`).includes(normalized)).map(entry => entry.id));
  return <View style={{ gap: 24 }}><Text style={s.eyebrow}>Review at your pace</Text><Text accessibilityRole="header" style={s.title}>{`Your ${name}, kept close.`}</Text><Text style={s.body}>Practise your recall, then browse your saved words and meanings below. Make the notes your own.</Text>
    <PersonalWordForm model={model} language={language} />
    <ReviewPanel notebook={model.notebook} onWriteBlocked={onWriteBlocked} />
    {!!model.notebook.length && <View style={s.card}>
      <Text accessibilityRole="header" style={s.heading}>Find a saved word</Text>
      <TextInput accessibilityLabel="Search notebook" placeholder={`${name}, reading, English or a personal note`} value={query} onChangeText={setQuery} style={s.input} />
      <Text accessibilityLiveRegion="polite" style={s.muted}>{matches.size} of {model.notebook.length} saved entries</Text>
      {!!query && <Button onPress={() => setQuery('')}>Clear notebook search</Button>}
      {!matches.size && <Text style={s.body}>No saved words match. Try a different word or clear the search.</Text>}
    </View>}
    {!model.notebook.length ? <View style={s.card}><Text style={s.heading}>A fresh page.</Text><Text style={s.body}>Your saved words will appear here. Add a personal word above, or save something useful from a lesson.</Text><Button primary onPress={onExplore}>Find a lesson →</Button></View>
      : <View testID="notebook-entries" style={{ gap: 24 }}>{model.notebook.map(entry => <NotebookCard key={entry.id} entry={entry} model={model} visible={matches.has(entry.id)} />)}</View>}
  </View>;
}

function NotebookCard({ entry, model, visible }: { entry: NotebookEntry; model: LearningModel; visible: boolean }) {
  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState(entry.target);
  const [meaning, setMeaning] = useState(entry.meaning);
  const [example, setExample] = useState(entry.example);
  const japanese = entry.language === 'ja-JP';
  const [reading, setReading] = useState(entry.reading ?? '');
  const [exampleReading, setExampleReading] = useState(entry.exampleReading ?? '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  function edit() { setTarget(entry.target); setMeaning(entry.meaning); setExample(entry.example); setReading(entry.reading ?? ''); setExampleReading(entry.exampleReading ?? ''); setEditing(true); setSaved(false); }
  function save() {
    const result = notebookEntrySchema.safeParse({ ...entry, target, meaning, example,
      ...(japanese ? { reading: reading.trim() || undefined, exampleReading: exampleReading.trim() || undefined } : {}), updatedAt: new Date().toISOString() });
    if (!result.success) { setError('Add a word (up to 300 characters) and a meaning (up to 500). Examples can be up to 1,000 characters; readings use the same limits.'); return; }
    setError(''); model.saveEntry(result.data, () => { setEditing(false); setSaved(true); });
  }
  // Keep filtered cards mounted so a search never discards an unsaved edit.
  return <View style={[s.card, !visible && { display: 'none' }]}>{editing ? <>
    <Text style={s.heading}>Edit your note</Text><Text style={s.body}>{japanese ? 'Japanese word or phrase' : 'French word or phrase'}</Text><TextInput accessibilityLabel={japanese ? 'Japanese word or phrase' : 'French word or phrase'} value={target} onChangeText={setTarget} maxLength={300} editable={!model.busy && !model.saveError} style={s.input} />
    {japanese && <><Text style={s.body}>Kana reading (optional)</Text><TextInput accessibilityLabel="Kana reading" value={reading} onChangeText={setReading} maxLength={300} editable={!model.busy && !model.saveError} style={s.input} /></>}
    <Text style={s.body}>English meaning</Text><TextInput accessibilityLabel="English meaning" value={meaning} onChangeText={setMeaning} maxLength={500} editable={!model.busy && !model.saveError} style={s.input} />
    <Text style={s.body}>Example or personal note</Text><TextInput accessibilityLabel="Example or personal note" value={example} onChangeText={setExample} maxLength={1000} editable={!model.busy && !model.saveError} multiline style={[s.input, { minHeight: 90 }]} />
    {japanese && <><Text style={s.body}>Example kana reading (optional)</Text><TextInput accessibilityLabel="Example kana reading" value={exampleReading} onChangeText={setExampleReading} maxLength={1000} editable={!model.busy && !model.saveError} multiline style={s.input} /></>}
    {!!error && <Text accessibilityRole="alert" style={[s.body, { color: colors.danger }]}>{error}</Text>}<View style={s.row}><Button primary disabled={model.blocked} onPress={save}>Save changes</Button><Button disabled={model.busy || !!model.saveError} onPress={() => setEditing(false)}>Cancel</Button></View>
  </> : <><View style={s.row}><Text accessibilityRole="header" style={s.heading}>{entry.target}</Text><Speak language={notebookLanguage(entry)} text={entry.target} onError={setVoiceError} /></View>{japanese && <Text style={s.eyebrow}>Japanese</Text>}{!!entry.reading && <Text style={s.body}>{entry.reading}</Text>}<Text style={s.body}>{entry.meaning}</Text>{!!voiceError && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{voiceError}</Text>}{!!entry.example && <View style={{ gap: 6 }}><Text style={s.eyebrow}>Example / personal note</Text><Text style={s.body}>{entry.example}</Text>{!!entry.exampleReading && <Text style={s.muted}>{entry.exampleReading}</Text>}</View>}<View style={s.row}><Button disabled={model.blocked} onPress={edit}>Edit note</Button>{saved && <Text accessibilityLiveRegion="polite" style={s.muted}>Changes saved in this browser.</Text>}</View></>}</View>;
}
