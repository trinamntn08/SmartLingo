import { Platform } from 'react-native';
import type { TargetLanguage } from '@smartlingo/domain';
import type { LearnerTab } from '../dashboard/LearnerNavigation';
import type { LearnMode } from '../learn/LearningHub';

export interface LearnerDestination {
  language: TargetLanguage | null;
  choosing: boolean;
  tab: LearnerTab;
  lessonId: string | null;
  selectedTopic: string | null;
  learnMode: LearnMode;
}

export interface LearnerHistoryEntry {
  group: number;
  index: number;
  destination: LearnerDestination;
}

const stateKey = 'smartlingoLearnerV1';

export function browserHistory() {
  return Platform.OS === 'web' && typeof window !== 'undefined' ? window.history : null;
}

export function readLearnerHistory(): LearnerHistoryEntry | null {
  return browserHistory()?.state?.[stateKey] ?? null;
}

export function writeLearnerHistory(destination: LearnerDestination, mode: 'push' | 'replace') {
  const history = browserHistory();
  if (!history) return null;
  const current = readLearnerHistory();
  const entry: LearnerHistoryEntry = {
    group: current?.group ?? Math.random(),
    index: (current?.index ?? 0) + (mode === 'push' ? 1 : 0),
    destination,
  };
  const state = { ...history.state, [stateKey]: entry };
  if (mode === 'push') history.pushState(state, '');
  else history.replaceState(state, '');
  return entry;
}

export function setEditorHash(open: boolean) {
  const history = browserHistory();
  if (!history) return;
  const current = readLearnerHistory();
  const previousUrl = window.location.href;
  // Keep actual hash changes so the editor can reset its preview on exit.
  window.location.hash = open ? 'editor' : '';
  if (current && window.location.href !== previousUrl) {
    history.replaceState({ ...history.state, [stateKey]: { ...current, index: current.index + 1 } }, '');
  }
}
