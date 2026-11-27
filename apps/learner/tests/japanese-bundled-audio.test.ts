import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { japaneseAlphabetLessons } from '@smartlingo/content';
import manifest from '../public/japanese-audio/manifest.json';
import { humanRecordings } from '../src/audio/japanese/bundled';

const assets = new URL('../public/japanese-audio/', import.meta.url);
const clips: Readonly<Record<string, { file: string; sha256: string; speed: number }>> = manifest;

test('bundled Japanese clips match their manifest and current kana prompts have recordings', () => {
  for (const { characters } of japaneseAlphabetLessons) {
    for (const { audioText } of characters) assert(Object.hasOwn(clips, audioText), `Missing audio for ${audioText}`);
  }
  for (const vowel of 'アイウエオ') assert(Object.hasOwn(humanRecordings, vowel), `Missing human recording for ${vowel}`);
  for (const [text, credit] of Object.entries(humanRecordings)) {
    assert(Object.hasOwn(clips, text) && credit.author && credit.license, `Missing audio or credit for ${text}`);
    assert.match(credit.source, /^https:\/\//u);
    assert.match(credit.licenseUrl, /^https:\/\//u);
  }

  const names = new Set(['manifest.json', 'human-recordings.json']);
  for (const { file, sha256, speed } of Object.values(clips)) {
    assert.match(file, /^[a-f0-9]{24}\.mp3$/u);
    assert(speed >= 0.84 && speed <= 1);
    assert.equal(createHash('sha256').update(readFileSync(new URL(file, assets))).digest('hex'), sha256, file);
    names.add(file);
  }
  assert.deepEqual(new Set(readdirSync(assets)), names);
});
