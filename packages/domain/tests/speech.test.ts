import { test } from 'node:test';
import assert from 'node:assert/strict';
import { speechInputSchema, speechKey, type SpeechInput } from '../src/index';

test('speech cache identity shares Unicode-equivalent text but separates spoken text, voice and pace', async () => {
  const input: SpeechInput = { text: ' café ', voice: 'fr-FR-DeniseNeural', pace: 'gentle' };
  const original = await speechKey(input);
  assert.equal(original, await speechKey({ ...input, text: 'cafe\u0301' }));
  assert.notEqual(original, await speechKey({ ...input, text: 'thé' }));
  assert.notEqual(original, await speechKey({ ...input, voice: 'fr-FR-HenriNeural' }));
  assert.notEqual(original, await speechKey({ ...input, pace: 'normal' }));
});

test('speech rejects unsupported voices, oversized or XML-invalid text before a provider can be reserved', () => {
  const input: SpeechInput = { text: 'Bonjour & bienvenue <ami> !', voice: 'fr-FR-HenriNeural', pace: 'gentle' };
  assert.ok(speechInputSchema.safeParse(input).success);
  for (const text of ['', ' ', 'x'.repeat(501), 'Bonjour\u0000', '\uD800', '\uFFFE']) {
    assert.equal(speechInputSchema.safeParse({ ...input, text }).success, false);
  }
  assert.ok(speechInputSchema.safeParse({ ...input, text: 'Bonjour 😀' }).success);
  assert.equal(speechInputSchema.safeParse({ ...input, voice: 'unknown' }).success, false);
  assert.equal(speechInputSchema.safeParse({ ...input, pace: 'calm' }).success, false);
});
