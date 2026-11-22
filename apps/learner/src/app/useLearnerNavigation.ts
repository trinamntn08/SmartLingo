import { useEffect, useMemo, useRef } from 'react';
import type { CatalogueLevel, Lesson, TargetLanguage } from '@smartlingo/domain';
import type { LearnerTab } from '../dashboard/LearnerNavigation';
import type { LearnMode } from '../learn/LearningHub';
import { useNavigation, useVisitState } from './WebNavigation';
import { topicRouteKey, type AppRoute } from './routes';

export function tabRoute(tab: LearnerTab, language: TargetLanguage): AppRoute {
  switch (tab) {
    case 'Learn': return language === 'ja-JP' ? { kind: 'letters', language } : { kind: 'topics', language };
    case 'Today': return { kind: 'today', language };
    case 'Review': return { kind: 'review', language };
    case 'Report': return { kind: 'report', language };
    case 'Profile': return { kind: 'profile', language };
  }
}

export function learnRoute(mode: LearnMode, language: TargetLanguage, topic?: string): AppRoute {
  switch (mode) {
    case 'Japanese letters': return language === 'ja-JP' ? { kind: 'letters', language } : { kind: 'topics', language };
    case 'Listening & videos': return { kind: 'listening', language, topic };
    case 'Speaking': return { kind: 'speaking', language, topic };
    case 'Vocabulary & lessons': return { kind: 'topics', language, topic };
  }
}

export function useLearnerNavigation({ preferred, active, blocked, onChooseLanguage, lessons }: {
  preferred: TargetLanguage | null; active: boolean; blocked: boolean;
  onChooseLanguage: (language: TargetLanguage) => void; lessons: Lesson[];
}) {
  const { route: current, visit, navigate, backTo } = useNavigation();
  const lastLearnerRoute = useRef<AppRoute>({ kind: 'home' });
  if (current.kind !== 'editor') lastLearnerRoute.current = current;
  const route = lastLearnerRoute.current;
  const language = 'language' in route ? route.language : preferred;
  const choosing = route.kind === 'languages' || (route.kind === 'home' && !language);
  const [search, setSearch] = useVisitState<{ query: string; level: CatalogueLevel }>('topic-search', { query: '', level: 'All' });
  const lesson = route.kind === 'lesson' ? lessons.find(item => item.id === route.lessonId && item.language === route.language) : undefined;
  const topicKey = 'topic' in route ? route.topic : undefined;
  const selectedTopic = useMemo(() => {
    if (!topicKey) return lesson?.topic ?? null;
    const matches = new Set(lessons.filter(item => item.language === language && topicRouteKey(item.topic) === topicKey).map(item => item.topic));
    return matches.size === 1 ? [...matches][0]! : topicKey;
  }, [lessons, language, topicKey, lesson?.topic]);
  const tab: LearnerTab = route.kind === 'review' ? 'Review' : route.kind === 'profile' ? 'Profile' : route.kind === 'report' ? 'Report'
    : route.kind === 'today' || route.kind === 'home' || route.kind === 'course' ? 'Today' : 'Learn';
  const learnMode: LearnMode = route.kind === 'letters' ? 'Japanese letters' : route.kind === 'listening' ? 'Listening & videos'
    : route.kind === 'speaking' ? 'Speaking' : 'Vocabulary & lessons';

  useEffect(() => {
    if (active && current.kind === 'home' && !blocked) navigate(language ? { kind: 'today', language } : { kind: 'languages' }, { replace: true });
  }, [active, blocked, current.kind, language, navigate]);

  function selectTopic(topic: string | null) {
    if (language) navigate({ kind: 'topics', language, topic: topic ? topicRouteKey(topic) : undefined });
  }

  function chooseLanguage(next: TargetLanguage) {
    if (blocked) return;
    onChooseLanguage(next);
    navigate({ kind: 'today', language: next });
  }

  function exitLesson() {
    if (!language) return;
    const topic = lesson?.topic && topicRouteKey(lesson.topic);
    backTo({ kind: 'topics', language, topic }, previous => previous.kind === 'topics'
      && previous.language === language && (!previous.topic || previous.topic === topic), true);
  }

  return { route, visit, language, choosing, tab, lesson, selectedTopic, learnMode,
    navigate: (next: LearnerTab) => { if (language) navigate(tabRoute(next, language)); },
    selectTopic,
    selectLearnMode: (mode: LearnMode) => { if (language) navigate(learnRoute(mode, language, topicKey ?? (selectedTopic ? topicRouteKey(selectedTopic) : undefined))); },
    openLearnMode: (mode: LearnMode) => { if (language) navigate(learnRoute(mode, language)); },
    openLesson: (next: Lesson) => navigate({ kind: 'lesson', language: next.language === 'ja-JP' ? 'ja-JP' : 'fr-FR', lessonId: next.id }),
    exitLesson, chooseLanguage,
    changeLanguage: () => navigate({ kind: 'languages' }),
    chooseHome: () => navigate({ kind: 'languages' }),
    catalogueSearch: { ...search,
      onQueryChange: (query: string) => setSearch(current => ({ ...current, query })),
      onLevelChange: (level: CatalogueLevel) => setSearch(current => ({ ...current, level })),
    },
  };
}
