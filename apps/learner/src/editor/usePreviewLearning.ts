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
  return {
    events, notebook, loading: false, loadError: '', saveError: '', busy: false, blocked: false,
    load: async () => {}, retry: () => {}, cancelWrite: () => {},
    record: (event, after = () => {}) => { setEvents(current => [...current, event]); after(); },
    saveEntry,
    captureEntry: (entry, after = () => {}) => {
      setNotebook(current => current.some(saved => saved.id === entry.id) ? current : [...current, entry]);
      after();
    },
  };
}
