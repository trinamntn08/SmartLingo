import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { japaneseAlphabetLessons, japaneseCourse, japaneseDailyGuides, japaneseLessons } from '@smartlingo/content';
import type { JapanesePracticeTask } from '@smartlingo/domain';
import { buildCourseListeningQuestion, buildLessonListeningQuestion } from '../src/listening/lessonQuestions';
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
  assert.deepEqual(new Set(Object.keys(clips)), expected);
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
  assert.equal(names.size, expected.size);
  assert.deepEqual(new Set(readdirSync(assets)), new Set(['manifest.json', ...names]));
});
