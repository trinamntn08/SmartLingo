import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { reviewStates, reviewIntervals, currentReviewEvents, type NotebookEntry, type ReviewEvent } from '@smartlingo/domain';
import { Badge, Button } from '../ui/controls';
import { Disclosure } from '../ui/Disclosure';
import { colors, styles as s } from '../ui/theme';
import { useRecognitionReview } from './useRecognitionReview';

const ratingLabels: Record<ReviewEvent['rating'], string> = { again: 'Again', helped: 'Needed help', remembered: 'Remembered' };

export function ReviewPanel({ notebook, onWriteBlocked }: { notebook: NotebookEntry[]; onWriteBlocked?: (blocked: boolean) => void }) {
  const model = useRecognitionReview();
  useEffect(() => { onWriteBlocked?.(model.busy || !!model.saveError); }, [model.busy, model.saveError, onWriteBlocked]);
  useEffect(() => () => onWriteBlocked?.(false), [onWriteBlocked]);
  const states = model.loading || model.loadError ? [] : reviewStates(notebook.map(entry => entry.id), currentReviewEvents(notebook, model.events), model.today);
  const dueIds = states.filter(state => state.dueDate <= model.today).map(state => state.notebookId);
  const current = notebook.find(entry => entry.id === dueIds[0]);
  const nextDue = notebook.length && !dueIds.length && !model.loading && !model.loadError
    ? states.map(state => state.dueDate).sort()[0] : null;
  return <View style={s.card}>
    <Text style={s.eyebrow}>A moment to remember</Text><Text accessibilityRole="header" style={s.heading}>Recognise your saved words</Text>
    <Text style={s.body}>Recall the meaning, check it, then rate how it went.</Text>
    {!notebook.length ? <View style={s.notice}><Text style={s.heading}>Your first review starts with a saved word.</Text><Text style={s.body}>Open a lesson and save a useful word or phrase. It will be ready to review here.</Text></View>
      : model.loading ? <View style={s.row}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.body}>Opening your review cards…</Text></View>
        : model.loadError ? <View style={s.error}><Text accessibilityRole="alert" style={s.body}>{model.loadError}</Text><Button onPress={() => void model.load()}>Retry loading review</Button></View>
          : <>
            {model.lastSaved && <View style={[s.notice, { backgroundColor: colors.green }]}><Text accessibilityLiveRegion="polite" style={s.body}>Saved “{model.lastSaved.target}” as {ratingLabels[model.lastSaved.rating]}. Next review: {model.lastSaved.dueDate}.</Text></View>}
            {!!model.saveError && <View style={s.error}><Text accessibilityRole="alert" style={s.body}>{model.saveError}</Text><Text style={s.muted}>This rating has not been confirmed as saved. Retry keeps the same rating and timestamp, without counting it twice. Dismiss rereads saved history and lets you continue.</Text><Button primary disabled={model.busy} onPress={model.retry}>Retry rating save</Button><Button disabled={model.busy} onPress={model.dismissSave}>Dismiss rating save</Button></View>}
            {model.busy && <Text accessibilityLiveRegion="polite" style={s.muted}>Saving your rating…</Text>}
            {current ? <RecognitionCard key={`${current.id}.${current.updatedAt}`} entry={current} remaining={dueIds.length} disabled={model.busy || !!model.saveError} onRate={rating => model.rate(current, rating)} />
              : <View style={s.notice}><Text accessibilityRole="header" style={s.heading}>You’re up to date for today.</Text><Text style={s.body}>There’s nothing else due. You can explore a lesson or revisit your notebook whenever you like.</Text>{nextDue && <Text style={s.muted}>Next scheduled review: {nextDue}.</Text>}</View>}
          </>}
    <Disclosure title="How review works">
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
  return <View style={{ gap: 20 }}>
    <View style={s.row}><Badge>{remaining} {remaining === 1 ? 'card' : 'cards'} due</Badge><Badge>{entry.language === 'ja-JP' ? 'Japanese' : 'French'} → meaning</Badge></View>
    <View style={[s.notice, { paddingVertical: 28, backgroundColor: '#E7ECD9' }]}><Text style={s.eyebrow}>What does this mean?</Text><Text accessibilityRole="header" style={s.title}>{entry.target}</Text></View>
    <Button disabled={disabled} onPress={() => setRevealed(!revealed)}>{revealed ? 'Hide meaning' : 'Reveal meaning'}</Button>
    {revealed && <><View style={s.notice}><Text style={s.eyebrow}>Your saved meaning</Text><Text style={s.heading}>{entry.meaning}</Text>{!!entry.reading && <Text style={s.body}>{entry.reading}</Text>}{!!entry.example && <Text style={s.body}>{entry.example}</Text>}{!!entry.exampleReading && <Text style={s.muted}>{entry.exampleReading}</Text>}</View>
      <Text style={s.body}>Thinking back to before you revealed the meaning, how did it go?</Text>
      <View style={s.row}><Button disabled={disabled} onPress={() => onRate('again')}>Again</Button><Button disabled={disabled} onPress={() => onRate('helped')}>Needed help</Button><Button primary disabled={disabled} onPress={() => onRate('remembered')}>Remembered</Button></View>
    </>}
  </View>;
}
