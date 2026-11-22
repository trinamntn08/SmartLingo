import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CatalogueLevel, Lesson, TargetLanguage } from '@smartlingo/domain';
import { audio } from '../audio';
import type { LearnerTab } from '../dashboard/LearnerNavigation';
import type { LearnMode } from '../learn/LearningHub';
import { browserHistory, readLearnerHistory, writeLearnerHistory, type LearnerDestination, type LearnerHistoryEntry } from './learnerHistory';

interface NavigationOptions {
  active: boolean;
  language: TargetLanguage | null;
  blocked: boolean;
  homeRequest: number;
  onChooseLanguage: (language: TargetLanguage) => void;
  getScrollOffset: () => number;
  restoreScroll: (offset: number) => void;
}

interface ViewContext {
  query: string;
  level: CatalogueLevel;
  scroll: number;
  lessonReturnOffset: number;
}

const initialContext: ViewContext = { query: '', level: 'All', scroll: 0, lessonReturnOffset: 0 };
const openingMode = (language: TargetLanguage | null): LearnMode =>
  language === 'ja-JP' ? 'Japanese letters' : 'Vocabulary & lessons';

function topLevel(language: TargetLanguage | null, tab: LearnerTab, choosing = !language): LearnerDestination {
  return { language, choosing, tab, lessonId: null, selectedTopic: null, learnMode: openingMode(language) };
}

function sameDestination(first: LearnerDestination, second: LearnerDestination) {
  return first.language === second.language && first.choosing === second.choosing && first.tab === second.tab
    && first.lessonId === second.lessonId && first.selectedTopic === second.selectedTopic && first.learnMode === second.learnMode;
}

/** In-session destinations; learning progress and language preferences belong to their own models. */
export function useLearnerNavigation({ active, language: preferredLanguage, blocked, homeRequest, onChooseLanguage,
  getScrollOffset, restoreScroll }: NavigationOptions) {
  const [destination, setDestination] = useState(() => topLevel(preferredLanguage, 'Today'));
  const [context, setContext] = useState(initialContext);
  const cursor = useRef<LearnerHistoryEntry | null>(null);
  const initialized = useRef(false);
  // Keep search input and scroll positions in memory only.
  const contexts = useRef(new Map<number, Map<number, ViewContext>>());
  const handlePop = useRef(() => {});
  const previousHomeRequest = useRef(homeRequest);
  const { language, tab, learnMode, selectedTopic } = destination;

  function capture(entry: LearnerHistoryEntry | null) {
    if (!entry) return;
    const group = contexts.current.get(entry.group) ?? new Map<number, ViewContext>();
    group.set(entry.index, { ...context, scroll: getScrollOffset() });
    contexts.current.set(entry.group, group);
  }

  function display(next: LearnerDestination, view: ViewContext) {
    audio.stop();
    setDestination(next);
    setContext(view);
    restoreScroll(view.scroll);
  }

  function move(next: LearnerDestination, view = initialContext, mode: 'push' | 'replace' = 'push') {
    if (blocked) return;
    if (mode === 'replace' || !sameDestination(destination, next)) {
      const current = readLearnerHistory() ?? writeLearnerHistory(destination, 'replace');
      capture(current);
      cursor.current = writeLearnerHistory(next, mode);
      if (cursor.current) contexts.current.get(cursor.current.group)?.delete(cursor.current.index);
    }
    display(next, view);
  }

  useLayoutEffect(() => {
    if (!active || !browserHistory()) return;
    if (!initialized.current || !readLearnerHistory()) writeLearnerHistory(destination, 'replace');
    cursor.current = readLearnerHistory();
    initialized.current = true;
  }, [active]);

  useLayoutEffect(() => {
    handlePop.current = () => {
      const next = readLearnerHistory();
      const previous = cursor.current;
      if (!next || window.location.hash === '#editor') return;
      if (next.group === previous?.group && next.index === previous.index) return;
      if (active && blocked && next.group === previous?.group) {
        // popstate is delivered after traversal. Return to the original entry without inserting another one.
        browserHistory()?.go(previous.index - next.index);
        return;
      }
      capture(previous);
      cursor.current = next;
      if (sameDestination(destination, next.destination)) return;
      display(next.destination, contexts.current.get(next.group)?.get(next.index) ?? initialContext);
    };
  });

  useEffect(() => {
    if (!browserHistory()) return;
    const onPop = () => handlePop.current();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => () => audio.stop(), []);
  // The editor's home button has already created a hash-free entry.
  useEffect(() => {
    if (homeRequest === previousHomeRequest.current) return;
    previousHomeRequest.current = homeRequest;
    move(topLevel(language, 'Today', true), initialContext, 'replace');
  }, [homeRequest]);

  function navigate(next: LearnerTab) {
    move(topLevel(language, next));
  }

  function selectTopic(name: string | null) {
    const view = name === selectedTopic ? { ...context, scroll: 0 } : initialContext;
    move({ ...topLevel(language, 'Learn'), selectedTopic: name, learnMode: 'Vocabulary & lessons' }, view);
  }

  function selectLearnMode(next: LearnMode) {
    move({ ...destination, learnMode: next }, { ...context, scroll: 0 });
  }

  function openLearnMode(next: LearnMode) {
    move({ ...topLevel(language, 'Learn'), learnMode: next });
  }

  function openLesson(next: Lesson) {
    const fromTopic = tab === 'Learn' && learnMode === 'Vocabulary & lessons' && selectedTopic === next.topic;
    const view = fromTopic ? { ...context, scroll: 0, lessonReturnOffset: getScrollOffset() } : initialContext;
    move({ ...topLevel(language, 'Learn'), learnMode: 'Vocabulary & lessons', selectedTopic: next.topic, lessonId: next.id }, view);
  }

  function exitLesson() {
    move({ ...destination, lessonId: null }, { ...context, scroll: context.lessonReturnOffset, lessonReturnOffset: 0 });
  }

  function changeLanguage() {
    move({ ...destination, choosing: true }, { ...context, scroll: 0 });
  }

  function chooseLanguage(next: TargetLanguage) {
    if (blocked) return;
    onChooseLanguage(next);
    move(topLevel(next, 'Today'));
  }

  function chooseHome() {
    move(topLevel(language, 'Today', true));
  }

  return { ...destination, navigate, selectTopic, selectLearnMode,
    openLearnMode, openLesson, exitLesson, changeLanguage, chooseLanguage, chooseHome,
    catalogueSearch: { query: context.query, level: context.level,
      onQueryChange: (query: string) => setContext(current => ({ ...current, query })),
      onLevelChange: (level: CatalogueLevel) => setContext(current => ({ ...current, level })) },
  };
}
