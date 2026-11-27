import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { reviewStates, reviewIntervals, currentReviewEvents, type NotebookEntry, type ReviewEvent } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { Disclosure } from '../ui/Disclosure';
import { colors, designTokens, styles as s } from '../ui/theme';
import { useRecognitionReview } from './useRecognitionReview';
import { JapaneseWordReading } from '../ui/JapaneseWordReading';
import { toolsStyles as t } from '../ui/learnerToolsStyles';

const ratingLabels: Record<ReviewEvent['rating'], string> = { again: 'Again', helped: 'Needed help', remembered: 'Remembered' };

export function ReviewPanel({ notebook, onWriteBlocked }: { notebook: NotebookEntry[]; onWriteBlocked?: (blocked: boolean) => void }) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const model = useRecognitionReview();
  useEffect(() => { onWriteBlocked?.(model.busy || !!model.saveError); }, [model.busy, model.saveError, onWriteBlocked]);
  useEffect(() => () => onWriteBlocked?.(false), [onWriteBlocked]);
  const states = model.loading || model.loadError ? [] : reviewStates(notebook.map(entry => entry.id), currentReviewEvents(notebook, model.events), model.today);
  const dueIds = states.filter(state => state.dueDate <= model.today).map(state => state.notebookId);
  const current = notebook.find(entry => entry.id === dueIds[0]);
  const nextDue = notebook.length && !dueIds.length && !model.loading && !model.loadError
    ? states.map(state => state.dueDate).sort()[0] : null;
  return <View style={[t.panel, compact && review.compactPanel]}>
    <View style={t.panelHeader}>
      <Text accessibilityRole="header" style={t.sectionTitle}>Recall practice</Text>
      {!!current && <Text style={t.detail}>{dueIds.length} {dueIds.length === 1 ? 'card' : 'cards'} due</Text>}
    </View>
    {!notebook.length ? <Text style={s.body}>Save a word in a lesson or add one to your notebook to start practising.</Text>
      : model.loading ? <View style={s.row}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.body}>Loading review cards…</Text></View>
        : model.loadError ? <View style={s.error}><Text accessibilityRole="alert" style={s.body}>{model.loadError}</Text><Button onPress={() => void model.load()}>Retry loading review</Button></View>
          : <>
            {model.lastSaved && <View style={s.notice}><Text accessibilityLiveRegion="polite" style={s.muted}>Saved “{model.lastSaved.target}” as {ratingLabels[model.lastSaved.rating]}. Next review: {model.lastSaved.dueDate}.</Text></View>}
            {!!model.saveError && <View style={s.error}><Text accessibilityRole="alert" style={s.body}>{model.saveError}</Text><Text style={s.muted}>Retry to save this rating, or dismiss to reopen your saved review history.</Text><View style={s.row}><Button primary compact disabled={model.busy} onPress={model.retry}>Retry rating save</Button><Button compact disabled={model.busy} onPress={model.dismissSave}>Dismiss rating save</Button></View></View>}
            {model.busy && <Text accessibilityLiveRegion="polite" style={s.muted}>Saving your rating…</Text>}
            {current ? <RecognitionCard key={`${current.id}.${current.updatedAt}`} entry={current} disabled={model.busy || !!model.saveError} onRate={rating => model.rate(current, rating)} />
              : <View style={t.stack}><Text accessibilityRole="header" style={s.heading}>You’re up to date for today.</Text>{nextDue && <Text style={s.muted}>Next scheduled review: {nextDue}.</Text>}</View>}
          </>}
    <Disclosure title="How review works">
      <Text style={s.muted}>Think of the meaning before revealing it. Then choose Remembered, Needed help or Again.</Text>
      <Text style={s.muted}>Remembered words return after {reviewIntervals.join(', ')} days as you progress. Again and Needed help bring a word back tomorrow.</Text>
      <Text style={s.muted}>Editing a note resets its review schedule. Earlier ratings stay in your history and backup.</Text>
    </Disclosure>
  </View>;
}

function RecognitionCard({ entry, disabled, onRate }: {
  entry: NotebookEntry; disabled: boolean; onRate: (rating: ReviewEvent['rating']) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  return <View style={review.card}>
    <View style={[t.stage, review.prompt]}>
      <Text style={t.detail}>{entry.language === 'ja-JP' ? 'Japanese' : 'French'} → meaning</Text>
      <View style={s.row}>
        <Text accessibilityRole="header" style={[s.target, review.target]}>{entry.target}</Text>
        {revealed && entry.language === 'ja-JP' && <JapaneseWordReading target={entry.target} reading={entry.reading} />}
      </View>
    </View>
    <View style={s.row}>
      <Button compact accent={!revealed} quiet={revealed} expanded={revealed} disabled={disabled} onPress={() => setRevealed(!revealed)}>{revealed ? 'Hide meaning' : 'Reveal meaning'}</Button>
    </View>
    {revealed && <>
      <View style={t.listRow}>
        <Text style={t.label}>Your saved meaning</Text>
        <Text style={s.heading}>{entry.meaning}</Text>
        {entry.language !== 'ja-JP' && !!entry.reading && <Text style={s.body}>{entry.reading}</Text>}
        {!!entry.example && <Text style={s.body}>{entry.example}</Text>}
        {!!entry.exampleReading && <Text style={s.muted}>{entry.exampleReading}</Text>}
      </View>
      <Text style={t.detail}>Did you recall the meaning before revealing it?</Text>
      <View style={s.row}>
        <Button compact disabled={disabled} onPress={() => onRate('again')}>Again</Button>
        <Button compact disabled={disabled} onPress={() => onRate('helped')}>Needed help</Button>
        <Button compact disabled={disabled} onPress={() => onRate('remembered')}>Remembered</Button>
      </View>
    </>}
  </View>;
}

const review = StyleSheet.create({
  compactPanel: { padding: 16 },
  card: { gap: 12 },
  prompt: { padding: 16, gap: 8 },
  target: { flexShrink: 1, maxWidth: '100%', fontWeight: '500' },
});
