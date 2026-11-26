import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { parseAndroidRoute, parseRoute, routeHref, topicRouteKey, type AppRoute } from '../src/app/routes';

const { isLearnerDocumentPath } = createRequire(import.meta.url)('../public/learner-document.js') as {
  isLearnerDocumentPath: (pathname: string) => boolean;
};

test('web routes retain the explicit destination through a copy or refresh', () => {
  const routes: AppRoute[] = [
    { kind: 'lesson', language: 'fr-FR', lessonId: 'fr.essentials.repair', stage: 'dialogue' },
    { kind: 'lesson', language: 'ja-JP', lessonId: 'ja.greetings.hello', stage: 'listening' },
    { kind: 'lesson', language: 'fr-FR', lessonId: 'fr.greetings.hello-goodbye', stage: 'sentence',
      studyDay: { courseId: 'fr.open-course-pilot', dayId: 'fr.open-course-pilot.day-1', sectionId: 'fr.open-course-pilot.day-1.reflect' } },
    { kind: 'course', language: 'ja-JP', courseId: 'ja.everyday-course', dayId: 'ja.everyday-course.day-1', sectionId: 'study' },
    { kind: 'courses', language: 'fr-FR' },
    { kind: 'courses', language: 'fr-FR', courseId: 'fr.course-b1' },
    { kind: 'topics', language: 'fr-FR', topic: 'Food / À table' },
    { kind: 'listening', language: 'ja-JP', topic: 'Food & drink', lessonId: 'ja.first', questionId: 'ja.first:ja.one' },
    { kind: 'listening', language: 'fr-FR', library: true },
    { kind: 'speaking', language: 'fr-FR', lessonId: 'fr.first', revision: 3, line: 2 },
    { kind: 'letters', language: 'ja-JP', rowId: 'ja.alphabet.hiragana.a', mode: 'recognition', characterId: 'ja.kana.hiragana.i' },
    { kind: 'letters', language: 'ja-JP', rowId: 'ja.alphabet.hiragana.a', mode: 'words' },
    { kind: 'slang', language: 'fr-FR' },
    { kind: 'review', language: 'ja-JP', view: 'practice' },
    { kind: 'editor', lessonId: 'fr.first', revision: 2 },
  ];
  for (const route of routes) {
    const href = routeHref(route);
    const url = new URL(href, 'http://localhost:8082');
    assert(isLearnerDocumentPath(url.pathname), href);
    const reopened = parseRoute(url.pathname, url.search);
    assert.equal(reopened.kind, route.kind);
    assert.equal(routeHref(reopened), href);
  }
  assert.equal(routeHref({ kind: 'listening', language: 'ja-JP', chooser: true }), '/learn/ja/listening');
  assert.equal(routeHref({ kind: 'slang', language: 'fr-FR' }), '/slang/fr');
  assert.deepEqual(parseRoute('/', '', '#editor'), { kind: 'editor' });
});

test('Android reopens dotted course IDs and preserves query filters in the bundled root document', () => {
  const course: AppRoute = { kind: 'course', language: 'fr-FR', courseId: 'fr.open-course-pilot', dayId: 'fr.open-course-pilot.day-2', sectionId: 'fr.open-course-pilot.day-2.vocabulary' };
  const listening: AppRoute = { kind: 'listening', language: 'ja-JP', topic: 'Food & drink', lessonId: 'ja.first', questionId: 'ja.first:ja.one' };
  for (const route of [course, { ...course, outline: true as const }, listening,
    { kind: 'courses', language: 'fr-FR', courseId: 'fr.course-b1' } as const]) {
    const url = new URL('/#' + routeHref(route), 'https://localhost');
    assert.equal(url.pathname, '/');
    assert.equal(url.search, '');
    assert.deepEqual(parseAndroidRoute(url.pathname, url.search, url.hash), route);
  }
  assert.deepEqual(parseAndroidRoute('/', '', '#editor'), { kind: 'home' });
  assert.deepEqual(parseAndroidRoute('/', '', '#/editor/fr.first/2'), { kind: 'home' });
  assert.deepEqual(parseAndroidRoute('/editor/fr.first/2'), { kind: 'home' });
});

test('long editor topic names and maximum-length listening IDs produce reopenable links', () => {
  const name = '漢'.repeat(2000);
  const topic = topicRouteKey(name);
  assert.match(topic, /^~[a-f0-9]{16}$/);
  assert.equal(topicRouteKey(name), topic);
  const lessonId = 'f'.repeat(120);
  const questionId = lessonId + ':' + 't'.repeat(120);
  const url = new URL(routeHref({ kind: 'listening', language: 'fr-FR', topic, lessonId, questionId }), 'http://localhost:8082');
  const route = parseRoute(url.pathname, url.search);
  assert.equal(route.kind, 'listening');
  if (route.kind === 'listening') assert.equal(route.questionId, questionId);
});

test('route parsing rejects malformed identifiers and invalid feature paths', () => {
  for (const path of ['/lesson/xx/fr.first/dialogue', '/lesson/fr/%2Fbad/dialogue', '/lesson/fr/%', '/lesson/fr/fr.first/bad',
    '/learn/fr/letters', '/learn/ja/letters/ja.alphabet.hiragana.a/words/ja.kana.hiragana.i', '/learn/ja/listening/library/example', '/learn/ja/speaking/ja.first/1', '/slang/ja', '/slang/fr/extra',
    '/learn/fr/courses/%2Finvalid', '/learn/ja/courses/example/extra', '/editor/fr.first/-1', '/api/lessons']) {
    assert.equal(parseRoute(path).kind, 'unavailable', path);
    assert(!isLearnerDocumentPath(path), path);
  }
});
