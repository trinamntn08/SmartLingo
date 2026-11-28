import { courseLessonStages, type TargetLanguage } from '@smartlingo/domain';

export const lessonStages = courseLessonStages;
export type LessonStage = typeof lessonStages[number];
export interface StudyDayLink { courseId: string; dayId: string; sectionId: string }

export type AppRoute =
  | { kind: 'home' | 'languages' | 'unavailable' }
  | { kind: 'today'; language: TargetLanguage; section?: 'courses' }
  | { kind: 'report' | 'profile'; language: TargetLanguage }
  | { kind: 'slang'; language: 'fr-FR' }
  | { kind: 'topics'; language: TargetLanguage; topic?: string }
  | { kind: 'lesson'; language: TargetLanguage; lessonId: string; stage?: LessonStage; studyDay?: StudyDayLink }
  | { kind: 'course'; language: TargetLanguage; courseId: string; dayId?: string; sectionId?: string }
  | { kind: 'listening'; language: TargetLanguage; topic?: string; lessonId?: string; questionId?: string; library?: boolean; chooser?: boolean }
  | { kind: 'speaking'; language: TargetLanguage; topic?: string; lessonId?: string; revision?: number; line?: number }
  | { kind: 'letters'; language: 'ja-JP'; rowId?: string; mode?: 'study' | 'recognition' | 'words'; characterId?: string }
  | { kind: 'review'; language: TargetLanguage; view?: 'notebook' | 'practice' }
  | { kind: 'editor'; lessonId?: string; revision?: number };

const unavailable: AppRoute = { kind: 'unavailable' };
const id = (value: string | undefined) => !!value && /^[a-z0-9][a-z0-9_.:-]{0,179}$/iu.test(value);
const questionKey = (value: string) => /^[a-z0-9][a-z0-9_.:-]{0,240}$/iu.test(value);
const topicName = (value: string | null | undefined) => !!value && value.length <= 180 && !/[\x00-\x1f\x7f]/u.test(value);
const positive = (value: string | undefined) => value && /^[1-9]\d{0,8}$/u.test(value) ? Number(value) : undefined;
const compactTopic = /^~[a-f0-9]{16}$/u;

export function topicRouteKey(name: string): string {
  // Long editor-authored names can exceed browser and HTTP request-line limits after encoding.
  if (topicName(name) && !compactTopic.test(name)) {
    try { if (encodeURIComponent(name).length <= 600) return name; }
    catch { /* The key also covers editor values containing lone UTF-16 surrogates. */ }
  }
  let hash = 0xcbf29ce484222325n;
  for (const character of name) hash = BigInt.asUintN(64, (hash ^ BigInt(character.codePointAt(0)!)) * 0x100000001b3n);
  return `~${hash.toString(16).padStart(16, '0')}`;
}

export function parseRoute(pathname: string, search = '', hash = ''): AppRoute {
  if (hash === '#editor') return { kind: 'editor' };
  if (pathname === '/' || pathname === '/index.html') return { kind: 'home' };
  if (pathname === '/languages' || pathname === '/languages/') return { kind: 'languages' };
  if (!pathname.startsWith('/') || pathname.length > 1400) return unavailable;

  let parts: string[];
  try { parts = pathname.slice(1).replace(/\/$/u, '').split('/').map(decodeURIComponent); }
  catch { return unavailable; }
  const [area, locale, section, item, extra, final] = parts;
  if (area === 'editor') {
    if (parts.length === 1) return { kind: 'editor' };
    if (!id(locale) || parts.length > 3 || (section !== undefined && !positive(section))) return unavailable;
    return { kind: 'editor', lessonId: locale, revision: positive(section) };
  }
  const language = locale === 'fr' ? 'fr-FR' : locale === 'ja' ? 'ja-JP' : null;
  if (!language) return unavailable;

  if (area === 'today' && parts.length === 2) {
    const showCourses = new URLSearchParams(search).get('section') === 'courses';
    return { kind: 'today', language, ...(showCourses && { section: 'courses' }) };
  }
  if (area === 'report' || area === 'profile') return parts.length === 2 ? { kind: area, language } : unavailable;
  if (area === 'slang') return language === 'fr-FR' && parts.length === 2 ? { kind: 'slang', language } : unavailable;
  if (area === 'review' && parts.length <= 3) {
    if (section === undefined || section === 'notebook' || section === 'practice') return { kind: 'review', language, view: section };
    return unavailable;
  }
  if (area === 'lesson' && parts.length <= 4 && section && id(section)) {
    const stage = item === 'finish' ? 'sentence' : lessonStages.find(value => value === item);
    if (item !== undefined && !stage) return unavailable;
    const query = new URLSearchParams(search);
    const courseId = query.get('course') ?? undefined;
    const dayId = query.get('day') ?? undefined;
    const sectionId = query.get('section') ?? undefined;
    const studyDay = courseId && dayId && sectionId && id(courseId) && id(dayId) && id(sectionId)
      ? { courseId, dayId, sectionId } : undefined;
    return { kind: 'lesson', language, lessonId: section, stage, ...(studyDay && { studyDay }) };
  }
  if (area === 'course' && parts.length <= 5 && section && id(section) && (item === undefined || id(item)) && (extra === undefined || id(extra))) {
    return { kind: 'course', language, courseId: section, dayId: item, sectionId: extra };
  }
  if (area !== 'learn') return unavailable;
  if (section === undefined || (section === 'topics' && parts.length <= 4 && (item === undefined || topicName(item)))) {
    return { kind: 'topics', language, topic: item };
  }
  const filter = new URLSearchParams(search).get('topic');
  const topic = topicName(filter) ? filter! : undefined;
  if (section === 'listening' && parts.length <= 5) {
    if (item === 'library') return extra === undefined ? { kind: 'listening', language, topic, library: true } : unavailable;
    if ((item === undefined || id(item)) && (extra === undefined || questionKey(extra))) return { kind: 'listening', language, topic, lessonId: item, questionId: extra };
  }
  if (section === 'speaking' && parts.length <= 6 && (item === undefined || id(item))) {
    const revision = positive(extra);
    const line = positive(final);
    if (extra === undefined || (revision && line)) return { kind: 'speaking', language, topic, lessonId: item, revision, line };
  }
  if (section === 'letters' && language === 'ja-JP' && parts.length <= 6 && (item === undefined || id(item))) {
    if ((extra === undefined || extra === 'study' || extra === 'recognition' || extra === 'words') && (final === undefined || (extra === 'recognition' && id(final)))) {
      return { kind: 'letters', language, rowId: item, mode: extra, characterId: final };
    }
  }
  return unavailable;
}

export function routeHref(route: AppRoute): string {
  const path = (...segments: (string | number | undefined)[]) => `/${segments.filter(value => value !== undefined).map(value => encodeURIComponent(String(value))).join('/')}`;
  if (route.kind === 'editor') return path('editor', route.lessonId, route.revision);
  if (route.kind === 'languages') return '/languages';
  if (!('language' in route)) return '/';
  const lang = route.language === 'ja-JP' ? 'ja' : 'fr';
  switch (route.kind) {
    case 'today': return path('today', lang) + (route.section === 'courses' ? '?section=courses' : '');
    case 'report': case 'profile': case 'slang': return path(route.kind, lang);
    case 'review': return path('review', lang, route.view);
    case 'topics': return route.topic ? path('learn', lang, 'topics', route.topic) : path('learn', lang);
    case 'lesson': {
      const destination = path('lesson', lang, route.lessonId, route.stage);
      const day = route.studyDay;
      return day ? destination + '?' + new URLSearchParams({ course: day.courseId, day: day.dayId, section: day.sectionId }) : destination;
    }
    case 'course': return path('course', lang, route.courseId, route.dayId, route.sectionId);
    case 'letters': return path('learn', lang, 'letters', route.rowId, route.mode, route.characterId);
    case 'listening': return path('learn', lang, 'listening', route.library ? 'library' : route.lessonId, route.library ? undefined : route.questionId)
      + (route.topic ? `?topic=${encodeURIComponent(route.topic)}` : '');
    case 'speaking': return path('learn', lang, 'speaking', route.lessonId, route.revision, route.line)
      + (route.topic ? `?topic=${encodeURIComponent(route.topic)}` : '');
  }
}
