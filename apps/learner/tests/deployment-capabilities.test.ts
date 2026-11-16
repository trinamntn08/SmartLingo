import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveLearnerCapabilities } from '../src/config/deployment';

test('local learner capabilities remain the default', () => {
  assert.deepEqual(resolveLearnerCapabilities(undefined), {
    mode: 'local',
    label: 'LOCAL PREVIEW',
    localContentApi: true,
    aiPractice: true,
    neuralSpeechGeneration: true,
  });
});

test('hosted learner capabilities exclude every local or paid-provider API path', () => {
  assert.deepEqual(resolveLearnerCapabilities('hosted'), {
    mode: 'hosted',
    label: 'FREE TEST PREVIEW',
    localContentApi: false,
    aiPractice: false,
    neuralSpeechGeneration: false,
  });
});
