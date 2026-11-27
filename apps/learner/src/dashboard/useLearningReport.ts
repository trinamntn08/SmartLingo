import { useCallback, useEffect, useRef, useState } from 'react';
import { japaneseDailyGuides } from '@smartlingo/content';
import { buildLearningReport, type LearningReport, type Lesson, type OpenCourse, type TargetLanguage } from '@smartlingo/domain';
import { openLearningRepository } from '../persistence';

type Parameters = { language: TargetLanguage; lessons: readonly Lesson[]; courses: readonly OpenCourse[] };
type State = { key: string; report: LearningReport | null; loading: boolean; error: string };
const guidedPracticeByDay = new Map(japaneseDailyGuides.map(guide => [guide.dayId, [...guide.tasks, ...guide.checkpoint]]));

/** Loads existing history only; report visits never record learning or change progress. */
export function useLearningReport(parameters: Parameters) {
  const key = JSON.stringify([parameters.language, parameters.lessons.map(lesson => [lesson.id, lesson.revision, lesson.language]),
    parameters.courses.map(course => [course.id, course.revision, course.language])]);
  const latest = useRef({ parameters, key }); latest.current = { parameters, key };
  const generation = useRef(0);
  const [state, setState] = useState<State>({ key, report: null, loading: true, error: '' });
  const refresh = useCallback(async () => {
    const version = ++generation.current;
    const request = latest.current;
    setState({ key: request.key, report: null, loading: true, error: '' });
    let repository;
    try {
      repository = await openLearningRepository();
      const [events, notebook, reviewEvents, courseEvents] = await Promise.all([
        repository.listEvents(), repository.listNotebook(), repository.listReviewEvents(), repository.listCourseEvents(),
      ]);
      const report = buildLearningReport({ ...request.parameters, events, notebook, reviewEvents, courseEvents, guidedPracticeByDay,
        now: new Date().toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' });
      if (version === generation.current && latest.current.key === request.key) setState({ key: request.key, report, loading: false, error: '' });
    } catch (failure) {
      if (version === generation.current && latest.current.key === request.key) setState({ key: request.key, report: null, loading: false,
        error: failure instanceof Error ? failure.message : 'Saved learning activity could not be opened.' });
    } finally { repository?.close(); }
  }, []);
  useEffect(() => {
    void refresh();
    const update = () => { void refresh(); };
    const timer = setInterval(update, 60_000);
    if (typeof window !== 'undefined') window.addEventListener('focus', update);
    return () => { generation.current++; clearInterval(timer); if (typeof window !== 'undefined') window.removeEventListener('focus', update); };
  }, [key, refresh]);
  return { report: state.key === key ? state.report : null, loading: state.key !== key || state.loading,
    error: state.key === key ? state.error : '', refresh };
}
