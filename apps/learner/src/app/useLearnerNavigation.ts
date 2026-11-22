import { useEffect, useRef, useState } from 'react';
import type { CatalogueLevel, Lesson, TargetLanguage } from '@smartlingo/domain';
import { audio } from '../audio';
import type { LearnerTab } from '../dashboard/LearnerNavigation';
import type { LearnMode } from '../learn/LearningHub';

interface NavigationOptions {
  language: TargetLanguage | null;
  blocked: boolean;
  homeRequest: number;
  onHome: () => void;
  onChooseLanguage: (language: TargetLanguage) => void;
  scrollToTop: () => void;
  getScrollOffset: () => number;
  restoreScrollAfterLesson: (offset: number) => void;
}

const openingMode = (language: TargetLanguage | null): LearnMode =>
  language === 'ja-JP' ? 'Japanese letters' : 'Vocabulary & lessons';

/** In-session destinations; learning progress and language persistence belong to their own models. */
export function useLearnerNavigation({ language, blocked, homeRequest, onHome, onChooseLanguage,
  scrollToTop, getScrollOffset, restoreScrollAfterLesson }: NavigationOptions) {
  const [choosing, setChoosing] = useState(false);
  const [tab, setTab] = useState<LearnerTab>('Today');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [learnMode, setLearnMode] = useState<LearnMode>('Vocabulary & lessons');
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<CatalogueLevel>('All');
  const catalogueOffset = useRef(0);

  function clearCatalogueSearch() {
    setQuery('');
    setLevel('All');
  }

  function navigate(next: LearnerTab) {
    if (blocked) return;
    audio.stop();
    clearCatalogueSearch();
    setLearnMode(openingMode(language));
    setLesson(null);
    setSelectedTopic(null);
    setTab(next);
    scrollToTop();
  }

  function selectTopic(name: string | null) {
    if (blocked) return;
    audio.stop();
    if (name !== selectedTopic) clearCatalogueSearch();
    setLearnMode('Vocabulary & lessons');
    setLesson(null);
    setSelectedTopic(name);
    setTab('Learn');
    scrollToTop();
  }

  function selectLearnMode(next: LearnMode) {
    if (blocked) return;
    audio.stop();
    setLearnMode(next);
    scrollToTop();
  }

  function openLearnMode(next: LearnMode) {
    if (blocked) return;
    navigate('Learn');
    setLearnMode(next);
  }

  function openLesson(next: Lesson) {
    if (blocked) return;
    audio.stop();
    const fromTopic = tab === 'Learn' && learnMode === 'Vocabulary & lessons' && selectedTopic === next.topic;
    catalogueOffset.current = fromTopic ? getScrollOffset() : 0;
    if (!fromTopic) clearCatalogueSearch();
    setTab('Learn');
    setLearnMode('Vocabulary & lessons');
    setSelectedTopic(next.topic);
    setLesson(next);
    scrollToTop();
  }

  function exitLesson() {
    if (blocked) return;
    audio.stop();
    restoreScrollAfterLesson(catalogueOffset.current);
    setLesson(null);
  }

  function changeLanguage() {
    if (blocked) return;
    audio.stop();
    setChoosing(true);
  }

  function chooseLanguage(next: TargetLanguage) {
    if (blocked) return;
    audio.stop();
    onChooseLanguage(next);
    setChoosing(false);
    navigate('Today');
    setLearnMode(openingMode(next));
  }

  function chooseHome() {
    if (blocked) return;
    setChoosing(true);
    onHome();
  }

  useEffect(() => () => audio.stop(), []);
  // A home request is a deliberate action, not a queued transition after a failed save resolves.
  useEffect(() => {
    if (homeRequest > 0 && !blocked) {
      navigate('Today');
      setChoosing(true);
    }
  }, [homeRequest]);

  return { choosing, tab, lesson, selectedTopic, learnMode, navigate, selectTopic, selectLearnMode,
    openLearnMode, openLesson, exitLesson, changeLanguage, chooseLanguage, chooseHome,
    catalogueSearch: { query, level, onQueryChange: setQuery, onLevelChange: setLevel } };
}
