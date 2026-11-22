import { useCallback, useEffect, useRef, useState } from 'react';
import type { LearningEvent, LearningRepository, NotebookEntry } from '@smartlingo/domain';
import { openLearningRepository } from '../persistence';

type Write = { run: (repository: LearningRepository) => Promise<void>; apply: () => void };

export function useLearning() {
  const repository = useRef<LearningRepository | null>(null);
  const pending = useRef<Write | null>(null);
  const writing = useRef(false);
  const loadVersion = useRef(0);
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [notebook, setNotebook] = useState<NotebookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const version = ++loadVersion.current;
    setLoading(true); setLoadError('');
    try {
      const next = repository.current ?? await openLearningRepository();
      if (version !== loadVersion.current) { next.close(); return; }
      repository.current = next;
      const [savedEvents, savedNotebook] = await Promise.all([next.listEvents(), next.listNotebook()]);
      if (version !== loadVersion.current) return;
      setEvents(savedEvents); setNotebook(savedNotebook);
    } catch (failure) { if (version === loadVersion.current) setLoadError(failure instanceof Error ? failure.message : 'Local learning data could not be opened.'); }
    finally { if (version === loadVersion.current) setLoading(false); }
  }, []);
  useEffect(() => { void load(); return () => { loadVersion.current++; repository.current?.close(); repository.current = null; }; }, [load]);

  async function execute(write: Write) {
    if (writing.current || !repository.current || loadError) return;
    writing.current = true; pending.current = write; setBusy(true); setSaveError('');
    try { await write.run(repository.current); write.apply(); pending.current = null; }
    catch (failure) { setSaveError(failure instanceof Error ? failure.message : 'Could not save to this browser.'); }
    finally { writing.current = false; setBusy(false); }
  }
  function recordMany(batch: readonly LearningEvent[], after: () => void = () => {}) {
    if (!batch.length || pending.current) return;
    void execute({ run: store => store.recordEvents(batch), apply: () => {
      setEvents(current => {
        const next = new Map(current.map(event => [event.id, event]));
        for (const event of batch) if (!next.has(event.id)) next.set(event.id, event);
        return next.size === current.length ? current : [...next.values()];
      });
      after();
    } });
  }
  function record(event: LearningEvent, after?: () => void) { recordMany([event], after); }
  function saveEntry(entry: NotebookEntry, after: () => void = () => {}) {
    if (pending.current) return;
    void execute({ run: store => store.saveNotebook(entry), apply: () => {
      setNotebook(current => [...current.filter(saved => saved.id !== entry.id), entry]); after();
    } });
  }
  function captureEntry(entry: NotebookEntry, after: () => void = () => {}) {
    if (pending.current) return;
    let captured: NotebookEntry;
    void execute({ run: async store => { captured = await store.captureNotebook(entry); }, apply: () => {
      setNotebook(current => [...current.filter(saved => saved.id !== captured.id), captured]); after();
    } });
  }
  return { events, notebook, loading, loadError, saveError, busy, load, record, recordMany, saveEntry, captureEntry,
    blocked: loading || !!loadError || busy || !!saveError,
    retry: () => { if (pending.current) void execute(pending.current); },
    cancelWrite: () => { pending.current = null; setSaveError(''); },
  };
}

export type LearningModel = ReturnType<typeof useLearning>;
