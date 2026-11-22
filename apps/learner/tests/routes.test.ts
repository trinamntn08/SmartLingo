import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseRoute, routeHref, topicRouteKey, type AppRoute } from '../src/app/routes';

test('web routes retain the explicit destination through a copy or refresh', () => {
  const routes: AppRoute[] = [
    { kind: 'lesson', language: 'fr-FR', lessonId: 'fr.essentials.repair', stage: 'dialogue' },
    { kind: 'lesson', language: 'fr-FR', lessonId: 'fr.greetings.hello-goodbye', stage: 'sentence',
      studyDay: { courseId: 'fr.open-course-pilot', dayId: 'fr.open-course-pilot.day-1', sectionId: 'fr.open-course-pilot.day-1.reflect' } },
    { kind: 'course', language: 'ja-JP', courseId: 'ja.everyday-course', dayId: 'ja.everyday-course.day-1', sectionId: 'study' },
    { kind: 'topics', language: 'fr-FR', topic: 'Food / À table' },
    { kind: 'listening', language: 'ja-JP', topic: 'Food & drink', lessonId: 'ja.first', questionId: 'ja.first:ja.one' },
    { kind: 'listening', language: 'fr-FR', library: true },
    { kind: 'speaking', language: 'fr-FR', lessonId: 'fr.first', revision: 3, line: 2 },
    { kind: 'letters', language: 'ja-JP', rowId: 'ja.alphabet.hiragana.a', mode: 'recognition', characterId: 'ja.kana.hiragana.i' },
    { kind: 'review', language: 'ja-JP', view: 'practice' },
    { kind: 'editor', lessonId: 'fr.first', revision: 2 },
  ];
  for (const route of routes) {
    const href = routeHref(route);
    const url = new URL(href, 'http://localhost:8082');
    const reopened = parseRoute(url.pathname, url.search);
    assert.equal(reopened.kind, route.kind);
    assert.equal(routeHref(reopened), href);
  }
  assert.equal(routeHref({ kind: 'listening', language: 'ja-JP', chooser: true }), '/learn/ja/listening');
  assert.deepEqual(parseRoute('/', '', '#editor'), { kind: 'editor' });
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
    '/learn/fr/letters', '/learn/ja/listening/library/example', '/learn/ja/speaking/ja.first/1', '/editor/fr.first/-1', '/api/lessons']) {
    assert.equal(parseRoute(path).kind, 'unavailable', path);
  }
});
