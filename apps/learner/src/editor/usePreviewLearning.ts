import { useState } from 'react';
import type { LearningEvent, NotebookEntry } from '@smartlingo/domain';
import type { LearningModel } from '../ui/useLearning';

// Editor practice is deliberately temporary and never opens learner storage.
export function usePreviewLearning(): LearningModel {
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [notebook, setNotebook] = useState<NotebookEntry[]>([]);
  function saveEntry(entry: NotebookEntry, after: () => void = () => {}) {
    setNotebook(current => [...current.filter(saved => saved.id !== entry.id), entry]);
    after();
  }
  function recordMany(batch: readonly LearningEvent[], after: () => void = () => {}) {
    setEvents(current => [...current, ...batch]);
    after();
  }
  return {
    events, notebook, loading: false, loadError: '', saveError: '', busy: false, blocked: false,
    load: async () => {}, retry: () => {}, cancelWrite: () => {},
    record: (event, after) => recordMany([event], after), recordMany,
    saveEntry,
    captureEntry: (entry, after = () => {}) => {
      setNotebook(current => current.some(saved => saved.id === entry.id) ? current : [...current, entry]);
      after();
    },
  };
}
