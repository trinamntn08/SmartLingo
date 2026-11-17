import { useCallback, useEffect, useRef, useState } from 'react';
import type { CourseEvent, LearningRepository } from '@smartlingo/domain';
import { openLearningRepository } from '../persistence';

type PendingSave = { events: CourseEvent[]; after: () => void };
const message = (failure: unknown) => failure instanceof Error ? failure.message : 'Local course progress could not be saved.';
const ordered = (events: CourseEvent[]) => [...events].sort((left, right) => Date.parse(left.occurredAt) - Date.parse(right.occurredAt) || left.id.localeCompare(right.id));

/** Course activity has its own lifecycle and never writes legacy lesson events. */
export function useCourseLearning() {
  const [events, setEvents] = useState<CourseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const generation = useRef(0);
  const locked = useRef(false);
  const pending = useRef<PendingSave | null>(null);
  const connection = useRef<LearningRepository | null>(null);

  const load = useCallback(async () => {
    if (locked.current || pending.current) return;
    const version = generation.current;
    locked.current = true; setLoading(true); setLoadError('');
    let store: LearningRepository | undefined;
    try {
      store = await openLearningRepository();
      if (version !== generation.current) return;
      connection.current = store;
      const saved = await store.listCourseEvents();
      if (version === generation.current) setEvents(ordered(saved));
    } catch (failure) {
      if (version === generation.current) setLoadError(message(failure));
    } finally {
      store?.close();
      if (connection.current === store) connection.current = null;
      if (version === generation.current) { locked.current = false; setLoading(false); }
    }
  }, []);

  useEffect(() => {
    // A new mount reads restored data; stale opens/writes cannot update this screen.
    locked.current = false; void load();
    const refresh = () => { void load(); };
    if (typeof window !== 'undefined') window.addEventListener('focus', refresh);
    return () => {
      generation.current++; connection.current?.close(); connection.current = null; locked.current = false;
      if (typeof window !== 'undefined') window.removeEventListener('focus', refresh);
    };
  }, [load]);

  async function execute() {
    const attempt = pending.current;
    if (!attempt || locked.current) return;
    const version = generation.current;
    locked.current = true; setBusy(true); setSaveError('');
    let store: LearningRepository | undefined;
    try {
      store = await openLearningRepository();
      if (version !== generation.current) return;
      connection.current = store;
      // A step and its next cursor are ordered. Retrying reuses these exact IDs.
      for (const event of attempt.events) {
        await store.recordCourseEvent(event);
        if (version !== generation.current) return;
        setEvents(current => current.some(saved => saved.id === event.id) ? current : ordered([...current, event]));
      }
      pending.current = null; attempt.after();
    } catch (failure) {
      if (version === generation.current) setSaveError(message(failure));
    } finally {
      store?.close();
      if (connection.current === store) connection.current = null;
      if (version === generation.current) { locked.current = false; setBusy(false); }
    }
  }

  function save(batch: CourseEvent[], after: () => void = () => {}) {
    if (locked.current || pending.current || loading || loadError) return;
    pending.current = { events: batch, after }; void execute();
  }
  function discard() { if (!locked.current) { pending.current = null; setSaveError(''); } }
  return { events, loading, busy, loadError, saveError, load, save, retry: () => void execute(), discard,
    blocked: loading || busy || !!loadError || !!saveError };
}

export type CourseLearningModel = ReturnType<typeof useCourseLearning>;
