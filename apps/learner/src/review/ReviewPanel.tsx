import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, useWindowDimensions } from 'react-native';
import { reviewStates, reviewIntervals, currentReviewEvents, type NotebookEntry, type ReviewEvent } from '@smartlingo/domain';
import { Badge, Button } from '../ui/controls';
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
  return <View style={{ gap: 16, minWidth: 0 }}>
    {!notebook.length ? <Text style={s.body}>No saved words yet.</Text>
      : model.loading ? <View style={s.row}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.body}>Loading review…</Text></View>
        : model.loadError ? <View style={s.error}><Text accessibilityRole="alert" style={s.body}>{model.loadError}</Text><Button onPress={() => void model.load()}>Retry loading review</Button></View>
          : <>
            {model.lastSaved && <View style={[s.notice, { backgroundColor: colors.green }]}><Text accessibilityLiveRegion="polite" style={s.body}>Saved “{model.lastSaved.target}” as {ratingLabels[model.lastSaved.rating]}. Next review: {model.lastSaved.dueDate}.</Text></View>}
            {!!model.saveError && <View style={s.error}><Text accessibilityRole="alert" style={s.body}>{model.saveError}</Text><Text style={s.muted}>Retry to save this rating.</Text><Button primary disabled={model.busy} onPress={model.retry}>Retry rating save</Button><Button disabled={model.busy} onPress={model.dismissSave}>Dismiss rating save</Button></View>}
            {model.busy && <Text accessibilityLiveRegion="polite" style={s.muted}>Saving your rating…</Text>}
            {current ? <RecognitionCard key={`${current.id}.${current.updatedAt}`} entry={current} remaining={dueIds.length} disabled={model.busy || !!model.saveError} onRate={rating => model.rate(current, rating)} />
              : <View style={s.notice}><Text accessibilityRole="header" style={s.heading}>You’re up to date for today.</Text>{nextDue && <Text style={s.muted}>Next scheduled review: {nextDue}.</Text>}</View>}
          </>}
    <Disclosure title="How review works" compact={compact}>
    <Text style={s.muted}>Choose Remembered if you recalled the meaning before revealing it.</Text>
    <Text style={s.muted}>Remembered words return after {reviewIntervals.join(', ')} days as you progress. Again and Needed help bring a word back tomorrow.</Text>
    <Text style={s.muted}>Editing a word resets its schedule. Earlier ratings stay in your history.</Text>
    </Disclosure>
  </View>;
}

function RecognitionCard({ entry, remaining, disabled, onRate }: {
  entry: NotebookEntry; remaining: number; disabled: boolean; onRate: (rating: ReviewEvent['rating']) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const reveal = <Button primary={!revealed} quiet={revealed}
    compact={compact} disabled={disabled} onPress={() => setRevealed(!revealed)}>{revealed ? 'Hide meaning' : 'Reveal meaning'}</Button>;
  return <View style={{ gap: compact ? 12 : 20 }}>
    <View style={s.row}><Badge>{remaining} {remaining === 1 ? 'card' : 'cards'} due</Badge></View>
    <View style={[t.stage, { paddingHorizontal: compact ? 14 : 20, paddingVertical: compact ? 20 : 36,
      gap: compact ? 8 : 22, backgroundColor: colors.sageTint, alignItems: 'center' }]}>
      <Text style={compact ? t.label : s.eyebrow}>What does this mean?</Text>
      <View style={[s.row, { justifyContent: 'center' }]}>
        <Text accessibilityRole="header" style={[s.target, { fontWeight: '500', textAlign: 'center', maxWidth: '100%', flexShrink: 1 }, compact && { fontSize: 31, lineHeight: 41 }]}>{entry.target}</Text>
        {revealed && entry.language === 'ja-JP' && <JapaneseWordReading target={entry.target} reading={entry.reading} />}
      </View>
    </View>
    {reveal}
    {revealed && <><View style={[t.inset, { backgroundColor: colors.goldTint }]}><Text style={s.heading}>{entry.meaning}</Text>{entry.language !== 'ja-JP' && !!entry.reading && <Text style={s.body}>{entry.reading}</Text>}{!!entry.example && <Text style={s.body}>{entry.example}</Text>}{!!entry.exampleReading && <Text style={s.muted}>{entry.exampleReading}</Text>}</View>
      <Text style={t.detail}>Did you recall the meaning?</Text>
      <View style={[s.row, compact && { gap: 8 }]}>
        <Button disabled={disabled} compact={compact} onPress={() => onRate('again')}>Again</Button>
        <Button disabled={disabled} compact={compact} onPress={() => onRate('helped')}>Needed help</Button>
        <Button disabled={disabled} compact={compact} onPress={() => onRate('remembered')}>Remembered</Button>
      </View>
    </>}
  </View>;
}
