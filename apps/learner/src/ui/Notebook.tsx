import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { normalizeSearch, notebookEntrySchema, type NotebookEntry } from '@smartlingo/domain';
import { Button, Speak } from './controls';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { ReviewPanel } from '../review/ReviewPanel';
import { PersonalWordForm } from './PersonalWordForm';

export function Notebook({ model, onExplore }: { model: LearningModel; onExplore: () => void }) {
  const [query, setQuery] = useState('');
  const normalized = normalizeSearch(query);
  const matches = new Set(model.notebook.filter(entry => normalizeSearch(`${entry.target} ${entry.meaning} ${entry.example}`).includes(normalized)).map(entry => entry.id));
  return <View style={{ gap: 24 }}><Text style={s.eyebrow}>Review at your pace</Text><Text accessibilityRole="header" style={s.title}>Your French, kept close.</Text><Text style={s.body}>Practise your recall, then browse your saved words and meanings below. Make the notes your own.</Text>
    <PersonalWordForm model={model} />
    <ReviewPanel notebook={model.notebook} />
    {!!model.notebook.length && <View style={s.card}>
      <Text accessibilityRole="header" style={s.heading}>Find a saved word</Text>
      <TextInput accessibilityLabel="Search notebook" placeholder="French, English or a personal note" value={query} onChangeText={setQuery} style={s.input} />
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
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  function edit() { setTarget(entry.target); setMeaning(entry.meaning); setExample(entry.example); setEditing(true); setSaved(false); }
  function save() {
    const result = notebookEntrySchema.safeParse({ ...entry, target, meaning, example, updatedAt: new Date().toISOString() });
    if (!result.success) { setError('Add a French word (up to 300 characters) and a meaning (up to 500). Examples can be up to 1,000 characters.'); return; }
    setError(''); model.saveEntry(result.data, () => { setEditing(false); setSaved(true); });
  }
  // Keep filtered cards mounted so a search never discards an unsaved edit.
  return <View style={[s.card, !visible && { display: 'none' }]}>{editing ? <>
    <Text style={s.heading}>Edit your note</Text><Text style={s.body}>French word or phrase</Text><TextInput accessibilityLabel="French word or phrase" value={target} onChangeText={setTarget} maxLength={300} style={s.input} />
    <Text style={s.body}>English meaning</Text><TextInput accessibilityLabel="English meaning" value={meaning} onChangeText={setMeaning} maxLength={500} style={s.input} />
    <Text style={s.body}>Example or personal note</Text><TextInput accessibilityLabel="Example or personal note" value={example} onChangeText={setExample} maxLength={1000} multiline style={[s.input, { minHeight: 90 }]} />
    {!!error && <Text accessibilityRole="alert" style={[s.body, { color: colors.danger }]}>{error}</Text>}<View style={s.row}><Button primary disabled={model.blocked} onPress={save}>Save changes</Button><Button disabled={model.busy || !!model.saveError} onPress={() => setEditing(false)}>Cancel</Button></View>
  </> : <><View style={s.row}><Text accessibilityRole="header" style={s.heading}>{entry.target}</Text><Speak text={entry.target} onError={setVoiceError} /></View><Text style={s.body}>{entry.meaning}</Text>{!!voiceError && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{voiceError}</Text>}{!!entry.example && <View style={{ gap: 6 }}><Text style={s.eyebrow}>Example / personal note</Text><Text style={s.body}>{entry.example}</Text></View>}<View style={s.row}><Button disabled={model.blocked} onPress={edit}>Edit note</Button>{saved && <Text accessibilityLiveRegion="polite" style={s.muted}>Changes saved in this browser.</Text>}</View></>}</View>;
}
