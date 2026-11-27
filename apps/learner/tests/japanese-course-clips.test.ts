import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { japaneseAlphabetLessons, japaneseCourse, japaneseDailyGuides, japaneseLessons } from '@smartlingo/content';
import type { JapanesePracticeTask } from '@smartlingo/domain';
import { buildCourseListeningQuestion, buildLessonListeningQuestion } from '../src/listening/lessonQuestions';
import { hasHumanRecording, humanRecordings } from '../src/audio/japanese/course-clips';
import manifest from '../public/japanese-audio/manifest.json';

const assets = new URL('../public/japanese-audio/', import.meta.url);
const clips: Readonly<Record<string, { file: string; sha256: string; speed: number }>> = manifest;

function audioTexts(tasks: readonly JapanesePracticeTask[]): string[] {
  return tasks.flatMap(task => task.skill === 'listening' ? [task.source!.text]
    : task.mode === 'self' && task.response === 'speak' ? [task.model] : []);
}

test('Japanese study audio covers exact lesson, guided, kana and checkpoint scripts', () => {
  const expected = new Set([
    ...japaneseLessons.flatMap(lesson => [buildLessonListeningQuestion(lesson)!.sentence, ...audioTexts(lesson.japanesePractice!.tasks)]),
    ...japaneseCourse.days.flatMap(day => [buildCourseListeningQuestion(day, 'ja-JP')!.sentence,
      ...day.vocabulary.map(entry => entry.target),
      ...day.blocks.flatMap(block => block.kind === 'dialogue' ? block.lines.map(line => line.target) : [])]),
    ...japaneseDailyGuides.flatMap(guide => audioTexts([...guide.tasks, ...guide.checkpoint])),
    ...japaneseAlphabetLessons.flatMap(lesson => [...lesson.characters.map(character => character.audioText),
      ...lesson.examples!.map(example => example.text), ...audioTexts(lesson.practice!)]),
  ]);
  for (const text of expected) assert(text in clips, `Missing course audio for ${text}`);
  const vocabulary = new Set(japaneseLessons.flatMap(lesson => lesson.vocabulary.map(entry => entry.target)));
  for (const text of Object.keys(clips)) {
    assert(expected.has(text) || (vocabulary.has(text) && hasHumanRecording(text)), `Unexpected clip for ${text}`);
  }
  for (const vowel of 'アイウエオ') assert(hasHumanRecording(vowel), `Missing speaker recording for ${vowel}`);
  for (const [text, credit] of Object.entries(humanRecordings)) {
    assert(text in clips && credit.author && credit.license, `Missing recording or credit for ${text}`);
    assert.match(credit.source, /^https:\/\//u);
    assert.match(credit.licenseUrl, /^https:\/\//u);
  }
  const names = new Set<string>();
  for (const [text, clip] of Object.entries(clips)) {
    assert.match(text, /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u);
    assert.match(text, /^[^\r\n]+$/u, 'Audio uses a single Japanese transcript without an English gloss.');
    assert.match(clip.file, /^[a-f0-9]{24}\.mp3$/u);
    assert(clip.speed >= 0.84 && clip.speed <= 1);
    const bytes = readFileSync(new URL(clip.file, assets));
    assert(bytes.length > 1000, clip.file);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), clip.sha256, clip.file);
    names.add(clip.file);
  }

  assert.deepEqual(new Set(readdirSync(assets)), new Set(['manifest.json', 'human-recordings.json', ...names]));
});
