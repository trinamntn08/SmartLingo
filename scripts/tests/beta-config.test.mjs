import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBetaConfig, betaConfigScript } from '../beta-config.mjs';

test('blank API creates a usable learner-only beta without credentials', () => {
  assert.deepEqual(parseBetaConfig({ apiUrl: '', beta: true }), { apiUrl: '', beta: true });
  assert.match(betaConfigScript({ apiUrl: '', beta: true }), /window\.__SMARTLINGO_CONFIG__/);
});
test('public config refuses secrets and unsafe backend URLs', () => {
  for (const apiUrl of ['http://example.com', 'https://owner:secret@example.com', 'https://example.com/api', 'https://example.com/?key=secret', 'https://example.com/#token']) {
    assert.throws(() => parseBetaConfig({ apiUrl, beta: true }));
  }
  assert.throws(() => parseBetaConfig({ apiUrl: '', beta: true, OPENAI_API_KEY: 'not-a-real-key' }));
  assert.deepEqual(parseBetaConfig({ apiUrl: 'https://api.example.com/', beta: true }), { apiUrl: 'https://api.example.com', beta: true });
});
