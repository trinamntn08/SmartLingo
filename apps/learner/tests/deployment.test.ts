import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { resolveDeployment } from '../src/deployment/config';
import { accessHeaders, accessState, clearAccessTokens, setAccessToken } from '../src/deployment/access';
import { localContentApi } from '../src/content/api';
import { practiceApi } from '../src/practice/api';
import { createSpeechClient } from '../src/audio/generated/client';

function mockWindow(context: TestContext, value: unknown) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', { configurable: true, value });
  context.after(() => { if (previous) Object.defineProperty(globalThis, 'window', previous); else Reflect.deleteProperty(globalThis, 'window'); clearAccessTokens(); });
}

const beta = 'beta-test-token-that-is-at-least-32-characters';
const owner = 'owner-test-token-that-is-at-least-32-characters';

test('public deployment disables API by default and never points a hosted visitor to localhost', () => {
  assert.deepEqual(resolveDeployment(undefined, 'https://smartlingo.pages.dev'), { apiUrl: null, hosted: true, beta: true });
  assert.equal(resolveDeployment(undefined, 'http://localhost:8081').apiUrl, 'http://127.0.0.1:3001');
  assert.equal(resolveDeployment({ beta: true, apiUrl: '' }, 'http://localhost:8082').apiUrl, null);
  for (const apiUrl of ['http://api.example.com', 'https://user:password@api.example.com', 'https://api.example.com/path', 'https://api.example.com?secret=x', 'https://api.example.com#x', 'http://127.0.0.1:3001', 'https://localhost:3001', 'not a url']) {
    assert.equal(resolveDeployment({ apiUrl }, 'https://smartlingo.pages.dev').apiUrl, null, apiUrl);
  }
  assert.equal(resolveDeployment({ apiUrl: 'https://api.example.com/' }, 'https://smartlingo.pages.dev').apiUrl, 'https://api.example.com');
  assert.equal(resolveDeployment({ apiUrl: 'https://api.example.com' }, 'http://localhost:8081').hosted, true);
});

test('unconfigured hosted clients make no requests, preserve text fallback and never probe visitor localhost', async context => {
  mockWindow(context, { location: { origin: 'https://smartlingo.pages.dev' }, __SMARTLINGO_CONFIG__: { apiUrl: '', beta: true } });
  const fetcher = context.mock.method(globalThis, 'fetch', async () => { throw new Error('Must not fetch'); });
  await assert.rejects(localContentApi.getPublished(), /Online services are not configured/);
  await assert.rejects(practiceApi.status(), /Lessons, notebook, review and backups remain available/);
  await assert.rejects(createSpeechClient().status(), /Online services are not configured/);
  assert.equal(fetcher.mock.callCount(), 0);
});

test('owner credentials stay off public reads and beta operations use separate memory-only access', async context => {
  mockWindow(context, { location: { origin: 'https://smartlingo.pages.dev' }, __SMARTLINGO_CONFIG__: { apiUrl: 'https://api.example.com', beta: true } });
  clearAccessTokens();
  setAccessToken('beta', beta);
  assert.deepEqual(accessState(), { beta: true, owner: false });
  assert.deepEqual(accessHeaders('owner'), {});
  assert.deepEqual(accessHeaders('beta'), { Authorization: `Bearer ${beta}` });
  setAccessToken('owner', owner);
  const requests: { url: string; options: RequestInit }[] = [];
  context.mock.method(globalThis, 'fetch', async (url: string, options: RequestInit) => { requests.push({ url, options }); return Response.json({ lessons: [] }); });
  await localContentApi.listLessons();
  await localContentApi.getPublished();
  assert.equal(requests[0].url, 'https://api.example.com/lessons');
  assert.equal((requests[0].options.headers as Record<string, string>).Authorization, `Bearer ${owner}`);
  assert.equal(requests[1].url, 'https://api.example.com/published-lessons');
  assert.equal((requests[1].options.headers as Record<string, string>).Authorization, undefined);
  assert.equal(requests[0].options.credentials, 'omit');
  assert.equal(requests[0].options.redirect, 'error');
  let speechOptions: RequestInit | undefined;
  await assert.rejects(createSpeechClient(async (_input, options) => { speechOptions = options; return Response.json({}, { status: 401 }); }).status(), /Apply your beta access token/);
  assert.equal((speechOptions?.headers as Record<string, string>).Authorization, `Bearer ${beta}`);
  clearAccessTokens();
  assert.deepEqual(accessState(), { beta: false, owner: false });
  assert.deepEqual(accessHeaders('beta'), {});
  assert.deepEqual(accessHeaders('owner'), {});
  assert.throws(() => setAccessToken('owner', 'short'), /32–512/);
  assert.throws(() => setAccessToken('owner', `${owner}\nheader`), /32–512/);
});
