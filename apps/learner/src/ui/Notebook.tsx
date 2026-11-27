import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { slangExpressions } from '@smartlingo/content';
import { normalizeSearch, notebookEntrySchema, languageNames, notebookLanguage, type TargetLanguage, type NotebookEntry } from '@smartlingo/domain';
import { useNavigation, useVisitState } from '../app/WebNavigation';
import { Button } from './controls';
import { Speak } from '../audio/Speak';
import { JapaneseWordReading } from './JapaneseWordReading';
import { colors, designTokens, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { ReviewPanel } from '../review/ReviewPanel';
import { PersonalWordForm } from './PersonalWordForm';
import { ScreenHeader } from './ScreenHeader';
import { toolsStyles as t } from './learnerToolsStyles';

const textAbbreviations = new Map(slangExpressions.filter(expression => expression.textAbbreviation)
  .map(expression => [expression.sourceEntryId, normalizeSearch(expression.target)]));

export function Notebook({ model, onExplore, language = 'fr-FR', onWriteBlocked }: { model: LearningModel; onExplore: () => void; language?: TargetLanguage; onWriteBlocked?: (blocked: boolean) => void }) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const { route, navigate, backTo } = useNavigation();
  const [query, setQuery] = useVisitState(`notebook:${language}:query`, '');
  const focusRecall = route.kind === 'review' && route.view === 'practice';
  const name = languageNames[language];
  const normalized = normalizeSearch(query);
  const matches = new Set(model.notebook.filter(entry => normalizeSearch(`${entry.target} ${entry.reading ?? ''} ${entry.meaning} ${entry.example} ${entry.exampleReading ?? ''}`).includes(normalized)).map(entry => entry.id));
  function toggleFocus() {
    if (focusRecall) backTo({ kind: 'review', language, view: 'notebook' }, previous => previous.kind === 'review' && previous.language === language && previous.view !== 'practice');
    else navigate({ kind: 'review', language, view: 'practice' });
  }
  return <View style={t.page}>
    <ScreenHeader eyebrow={name} title={focusRecall ? 'Review saved words' : 'Notebook'}
      action={focusRecall || model.notebook.length ? <Button compact icon={focusRecall ? 'arrow-left' : 'layers'} quiet={focusRecall}
        onPress={toggleFocus}>{focusRecall ? 'Show notebook' : 'Focus review'}</Button> : null} />
    <View style={t.board}>
      <View style={[t.main, focusRecall && { display: 'none' }]}>
        <View style={[t.panel, compact && notebookStyles.compactPanel]}>
          <View style={t.panelHeader}>
            <Text accessibilityRole="header" style={t.sectionTitle}>{model.notebook.length ? 'Saved words' : 'No saved words yet'}</Text>
            <PersonalWordForm embedded model={model} language={language} />
          </View>
          {model.notebook.length ? <>
            <View style={t.stack}>
              <TextInput accessibilityLabel="Search notebook" placeholder="Search words or notes"
                value={query} onChangeText={setQuery} style={s.input} />
              <View style={t.panelHeader}>
                <Text accessibilityLiveRegion="polite" style={t.detail}>{matches.size} of {model.notebook.length} saved {model.notebook.length === 1 ? 'entry' : 'entries'}</Text>
                {!!query && <Button quiet compact label="Clear notebook search" onPress={() => setQuery('')}>Clear</Button>}
              </View>
              {!matches.size && <Text style={s.body}>No saved words match. Try a different word or clear the search.</Text>}
            </View>
            <View testID="notebook-entries">{model.notebook.map(entry => <NotebookCard key={entry.id} entry={entry} model={model} visible={matches.has(entry.id)} />)}</View>
          </> : <View style={[t.stack, notebookStyles.prompt]}>
            <Text style={s.body}>Save a word from a lesson or add your own.</Text>
            <Button compact accent trailingIcon="arrow-right" onPress={onExplore}>Find a lesson</Button>
          </View>}
        </View>
      </View>
      {(focusRecall || model.notebook.length > 0) && <View style={[t.side, notebookStyles.review, focusRecall && notebookStyles.focusedReview]}>
        <ReviewPanel notebook={model.notebook} onWriteBlocked={onWriteBlocked} />
      </View>}
    </View>
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
  const isTextAbbreviation = !japanese && textAbbreviations.get(entry.sourceEntryId) === normalizeSearch(entry.target);
  function edit() { setTarget(entry.target); setMeaning(entry.meaning); setExample(entry.example); setReading(entry.reading ?? ''); setExampleReading(entry.exampleReading ?? ''); setEditing(true); setSaved(false); }
  function save() {
    const result = notebookEntrySchema.safeParse({ ...entry, target, meaning, example,
      ...(japanese ? { reading: reading.trim() || undefined, exampleReading: exampleReading.trim() || undefined } : {}), updatedAt: new Date().toISOString() });
    if (!result.success) { setError('Add a word (up to 300 characters) and a meaning (up to 500). Examples can be up to 1,000 characters; readings use the same limits.'); return; }
    setError(''); model.saveEntry(result.data, () => { setEditing(false); setSaved(true); });
  }
  // Keep filtered cards mounted so a search never discards an unsaved edit.
  return <View style={[t.listRow, !visible && { display: 'none' }]}>{editing ? <>
    <Text style={s.heading}>Edit your note</Text><Text style={s.body}>{japanese ? 'Japanese word or phrase' : 'French word or phrase'}</Text><TextInput accessibilityLabel={japanese ? 'Japanese word or phrase' : 'French word or phrase'} value={target} onChangeText={setTarget} maxLength={300} editable={!model.busy && !model.saveError} style={s.input} />
    {japanese && <><Text style={s.body}>Kana reading (optional)</Text><TextInput accessibilityLabel="Kana reading" value={reading} onChangeText={setReading} maxLength={300} editable={!model.busy && !model.saveError} style={s.input} /></>}
    <Text style={s.body}>English meaning</Text><TextInput accessibilityLabel="English meaning" value={meaning} onChangeText={setMeaning} maxLength={500} editable={!model.busy && !model.saveError} style={s.input} />
    <Text style={s.body}>Example or personal note</Text><TextInput accessibilityLabel="Example or personal note" value={example} onChangeText={setExample} maxLength={1000} editable={!model.busy && !model.saveError} multiline style={[s.input, { minHeight: 90 }]} />
    {japanese && <><Text style={s.body}>Example kana reading (optional)</Text><TextInput accessibilityLabel="Example kana reading" value={exampleReading} onChangeText={setExampleReading} maxLength={1000} editable={!model.busy && !model.saveError} multiline style={s.input} /></>}
    {!!error && <Text accessibilityRole="alert" style={[s.body, { color: colors.danger }]}>{error}</Text>}<View style={s.row}><Button primary disabled={model.blocked} onPress={save}>Save changes</Button><Button disabled={model.busy || !!model.saveError} onPress={() => setEditing(false)}>Cancel</Button></View>
  </> : <>
    <View style={[t.panelHeader, notebookStyles.entryHeader]}>
      <View style={[t.stack, notebookStyles.entryCopy]}>
        <View style={s.row}>
          {isTextAbbreviation
            ? <Text accessibilityRole="header" style={[s.heading, { fontWeight: '500', flexShrink: 1 }]}>{entry.target}</Text>
            : <Speak language={notebookLanguage(entry)} text={entry.target} onError={setVoiceError}
              headingLevel={2} wordStyle={[s.heading, { fontWeight: '500' }]} />}
          {japanese && <JapaneseWordReading target={entry.target} reading={entry.reading} />}
          {isTextAbbreviation && <Text style={t.detail}>Text shorthand</Text>}
        </View>
        {!japanese && !!entry.reading && <Text style={t.detail}>{entry.reading}</Text>}
        <Text style={s.body}>{entry.meaning}</Text>
      </View>
      <Button quiet compact icon="edit" disabled={model.blocked} onPress={edit}>Edit note</Button>
    </View>
    {!isTextAbbreviation && !!voiceError && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{voiceError}</Text>}
    {!!entry.example && <View style={t.stack}>
      <Text style={t.label}>Example or note</Text><Text style={s.muted}>{entry.example}</Text>
      {!!entry.exampleReading && <Text style={s.muted}>{entry.exampleReading}</Text>}
    </View>}
    {saved && <Text accessibilityLiveRegion="polite" style={s.muted}>Changes saved in this browser.</Text>}
  </>}</View>;
}

const notebookStyles = StyleSheet.create({
  compactPanel: { padding: 16 },
  prompt: { alignItems: 'flex-start' },
  review: { flexBasis: 340 },
  focusedReview: { flexBasis: '100%', maxWidth: 700 },
  entryHeader: { flexWrap: 'nowrap', alignItems: 'flex-start' },
  entryCopy: { flex: 1 },
});
