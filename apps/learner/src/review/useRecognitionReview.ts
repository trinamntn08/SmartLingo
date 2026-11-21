import { useCallback, useEffect, useRef, useState } from 'react';
import { localStudyDate, reviewState, type NotebookEntry, type ReviewEvent } from '@smartlingo/domain';
import { openLearningRepository } from '../persistence';

function studyClock() {
  const occurredAt = new Date().toISOString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  return { occurredAt, timeZone, studyDate: localStudyDate(occurredAt, timeZone) };
}

export function useRecognitionReview() {
  const [events, setEvents] = useState<ReviewEvent[]>([]);
  const [today, setToday] = useState(() => studyClock().studyDate);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [lastSaved, setLastSaved] = useState<{ target: string; rating: ReviewEvent['rating']; dueDate: string } | null>(null);
  const pending = useRef<{ event: ReviewEvent; target: string } | null>(null);
  const locked = useRef(false);
  const mounted = useRef(true);

  const load = useCallback(async (quiet = false) => {
    if (locked.current || pending.current) return;
    locked.current = true; if (!quiet) setLoading(true); setLoadError('');
    let repository;
    try {
      repository = await openLearningRepository();
      const saved = await repository.listReviewEvents();
      if (mounted.current) { setEvents(saved); setToday(studyClock().studyDate); }
    } catch (failure) {
      if (mounted.current) setLoadError(failure instanceof Error ? failure.message : 'Your review ratings could not be loaded.');
    } finally { repository?.close(); locked.current = false; if (mounted.current) setLoading(false); }
  }, []);

  useEffect(() => {
    mounted.current = true; void load();
    const refreshDate = () => { setToday(studyClock().studyDate); void load(true); };
    const timer = setInterval(refreshDate, 60_000);
    if (typeof window !== 'undefined') window.addEventListener('focus', refreshDate);
    return () => { mounted.current = false; clearInterval(timer); if (typeof window !== 'undefined') window.removeEventListener('focus', refreshDate); };
  }, [load]);

  async function savePending() {
    const attempt = pending.current;
    if (!attempt || locked.current) return;
    locked.current = true; setBusy(true); setSaveError('');
    let repository;
    try {
      repository = await openLearningRepository();
      await repository.recordReview(attempt.event);
      const saved = await repository.listReviewEvents();
      const now = studyClock().studyDate;
      const nextState = reviewState(attempt.event.notebookId, saved.filter(event => event.entryUpdatedAt === attempt.event.entryUpdatedAt), now);
      pending.current = null;
      if (!mounted.current) return;
      setToday(now);
      setEvents(saved);
      setLastSaved({ target: attempt.target, rating: attempt.event.rating, dueDate: nextState.dueDate });
    } catch (failure) {
      if (mounted.current) setSaveError(failure instanceof Error ? failure.message : 'The rating could not be saved.');
    } finally { repository?.close(); locked.current = false; if (mounted.current) setBusy(false); }
  }
  function rate(entry: NotebookEntry, rating: ReviewEvent['rating']) {
    if (locked.current || pending.current || loading || loadError) return;
    const clock = studyClock();
    pending.current = { target: entry.target, event: {
      id: crypto.randomUUID(), notebookId: entry.id, entryUpdatedAt: entry.updatedAt, skill: 'recognition', source: 'manual', algorithmVersion: 1,
      rating, ...clock,
    } };
    void savePending();
  }
  function dismissSave() {
    if (locked.current) return;
    pending.current = null; setSaveError('');
    // A transaction may have succeeded before a later read failed; reread persisted history.
    void load(true);
  }
  return { events, today, loading, busy, loadError, saveError, lastSaved, load, rate, dismissSave, retry: () => void savePending() };
}
