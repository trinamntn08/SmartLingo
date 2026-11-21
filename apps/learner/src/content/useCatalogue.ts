import { useEffect, useRef, useState } from 'react';
import { lessons as frenchLessons, japaneseLessons } from '@smartlingo/content';
import { mergeLessonCatalogue, type LearningRepository, type Lesson } from '@smartlingo/domain';
import { openLearningRepository } from '../persistence';
import { localContentApi } from './api';

export function useCatalogue() {
  const repository = useRef<LearningRepository | null>(null);
  const [published, setPublished] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const store = await openLearningRepository();
        if (!active) { store.close(); return; }
        repository.current = store;
        const cached = await store.listPublishedLessons();
        if (active) setPublished(cached);
      } catch { if (active) setError('Published content could not be opened. Bundled preview lessons remain available.'); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; repository.current?.close(); repository.current = null; };
  }, []);

  async function refreshPublished() {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(''); setMessage('');
    try {
      const incoming = await localContentApi.getPublished();
      const store = repository.current ?? await openLearningRepository();
      repository.current = store;
      const saved = await store.cachePublishedLessons(incoming);
      setPublished(saved);
      setMessage(saved.length ? `${saved.length} published lesson${saved.length === 1 ? '' : 's'} saved in this browser.` : 'No lessons have been published yet. Bundled drafts are available for preview.');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Published content could not be loaded. Your current catalogue was kept.'); }
    finally { inFlight.current = false; setBusy(false); }
  }
  return { lessons: mergeLessonCatalogue([...frenchLessons, ...japaneseLessons], published), loading, busy, error, message, refreshPublished };
}
