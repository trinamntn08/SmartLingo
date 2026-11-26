import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, useWindowDimensions } from 'react-native';
import { reviewStates, reviewIntervals, currentReviewEvents, type NotebookEntry, type ReviewEvent } from '@smartlingo/domain';
import { Badge, Button } from '../ui/controls';
import { Disclosure } from '../ui/Disclosure';
import { colors, designTokens, styles as s } from '../ui/theme';
import { useRecognitionReview } from './useRecognitionReview';
import { Icon } from '../ui/Icon';
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
  return <View style={[t.panel, compact && { padding: 14, gap: 12 }]}>
    {!compact && <View style={[s.row, { alignItems: 'flex-start' }]}>
      <View style={[t.icon, { backgroundColor: colors.goldTint }]}><Icon name="layers" size={24} /></View>
      <View style={[t.stack, { flex: 1, minWidth: 0 }]}><Text accessibilityRole="header" style={t.sectionTitle}>Recognise your saved words</Text>
        <Text style={t.detail}>Recall it, reveal the meaning, then rate how it went.</Text>
      </View>
    </View>}
    {!notebook.length ? <View style={s.notice}><Text style={s.heading}>Your first review starts with a saved word.</Text><Text style={s.body}>Open a lesson and save a useful word or phrase. It will be ready to review here.</Text></View>
      : model.loading ? <View style={s.row}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.body}>Opening your review cards…</Text></View>
        : model.loadError ? <View style={s.error}><Text accessibilityRole="alert" style={s.body}>{model.loadError}</Text><Button onPress={() => void model.load()}>Retry loading review</Button></View>
          : <>
            {model.lastSaved && <View style={[s.notice, { backgroundColor: colors.green }]}><Text accessibilityLiveRegion="polite" style={s.body}>Saved “{model.lastSaved.target}” as {ratingLabels[model.lastSaved.rating]}. Next review: {model.lastSaved.dueDate}.</Text></View>}
            {!!model.saveError && <View style={s.error}><Text accessibilityRole="alert" style={s.body}>{model.saveError}</Text><Text style={s.muted}>This rating has not been confirmed as saved. Retry keeps the same rating and timestamp, without counting it twice. Dismiss rereads saved history and lets you continue.</Text><Button primary disabled={model.busy} onPress={model.retry}>Retry rating save</Button><Button disabled={model.busy} onPress={model.dismissSave}>Dismiss rating save</Button></View>}
            {model.busy && <Text accessibilityLiveRegion="polite" style={s.muted}>Saving your rating…</Text>}
            {current ? <RecognitionCard key={`${current.id}.${current.updatedAt}`} entry={current} remaining={dueIds.length} disabled={model.busy || !!model.saveError} onRate={rating => model.rate(current, rating)} />
              : <View style={s.notice}><Text accessibilityRole="header" style={s.heading}>You’re up to date for today.</Text>{!compact && <Text style={s.body}>There’s nothing else due. You can explore a lesson or revisit your notebook whenever you like.</Text>}{nextDue && <Text style={s.muted}>Next scheduled review: {nextDue}.</Text>}</View>}
          </>}
    <Disclosure title="How review works" compact={compact}>
    <Text style={s.muted}>These are manual recognition ratings, not a proficiency assessment. “Remembered” means you recalled the meaning before checking; “Needed help” records supported recall; “Again” means it didn’t come back yet. Revealing a meaning doesn’t choose a rating for you.</Text>
    <Text style={s.muted}>The {reviewIntervals.join(' / ')} day schedule is a simple heuristic. Remembered items move gradually farther apart, at most once per study day. Again or Needed help brings the next review to tomorrow. There are no streaks or penalties for taking a break.</Text>
    <Text style={s.muted}>Editing a saved note starts fresh recognition practice for that revision. Earlier ratings stay in your history and backup.</Text>
    </Disclosure>
  </View>;
}

function RecognitionCard({ entry, remaining, disabled, onRate }: {
  entry: NotebookEntry; remaining: number; disabled: boolean; onRate: (rating: ReviewEvent['rating']) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const reveal = <Button primary={!revealed && !compact} accent={!revealed && compact} quiet={revealed && compact}
    compact={compact} disabled={disabled} onPress={() => setRevealed(!revealed)}>{revealed ? 'Hide meaning' : 'Reveal meaning'}</Button>;
  return <View style={{ gap: compact ? 12 : 20 }}>
    <View style={s.row}><Badge>{remaining} {remaining === 1 ? 'card' : 'cards'} due</Badge>{!compact && <Badge>{entry.language === 'ja-JP' ? 'Japanese' : 'French'} → meaning</Badge>}</View>
    <View style={[t.stage, { paddingHorizontal: compact ? 14 : 20, paddingVertical: compact ? 20 : 36,
      gap: compact ? 8 : 22, backgroundColor: colors.sageTint, alignItems: 'center' }]}>
      <Text style={compact ? t.label : s.eyebrow}>What does this mean?</Text>
      <View style={[s.row, { justifyContent: 'center' }]}>
        <Text accessibilityRole="header" style={[s.target, { fontWeight: '500', textAlign: 'center', maxWidth: '100%', flexShrink: 1 }, compact && { fontSize: 31, lineHeight: 41 }]}>{entry.target}</Text>
        {revealed && entry.language === 'ja-JP' && <JapaneseWordReading target={entry.target} reading={entry.reading} />}
      </View>
    </View>
    {reveal}
    {revealed && <><View style={[t.inset, { backgroundColor: colors.goldTint }]}><Text style={s.eyebrow}>Your saved meaning</Text><Text style={s.heading}>{entry.meaning}</Text>{entry.language !== 'ja-JP' && !!entry.reading && <Text style={s.body}>{entry.reading}</Text>}{!!entry.example && <Text style={s.body}>{entry.example}</Text>}{!!entry.exampleReading && <Text style={s.muted}>{entry.exampleReading}</Text>}</View>
      <Text style={t.detail}>{compact ? 'How well did you remember it before revealing?' : 'Thinking back to before you revealed the meaning, how did it go?'}</Text>
      <View style={[s.row, compact && { gap: 8 }]}>
        <Button disabled={disabled} compact={compact} onPress={() => onRate('again')}>Again</Button>
        <Button disabled={disabled} compact={compact} onPress={() => onRate('helped')}>Needed help</Button>
        <Button primary={!compact} disabled={disabled} compact={compact} onPress={() => onRate('remembered')}>Remembered</Button>
      </View>
    </>}
  </View>;
}
