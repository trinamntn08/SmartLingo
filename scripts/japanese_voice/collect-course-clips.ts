import { japaneseAlphabetLessons, japaneseCourse, japaneseDailyGuides, japaneseLessons } from '@smartlingo/content';
import type { JapanesePracticeTask, Lesson } from '@smartlingo/domain';
import { buildCourseListeningQuestion, buildLessonListeningQuestion } from '../../apps/learner/src/listening/lessonQuestions';

const rates: Record<Lesson['level'], number> = { foundation: 0.84, A1: 0.9, A2: 0.95, B1: 1 };
const scripts = new Map<string, number>();
function add(text: string | undefined, rate: number) {
  if (text) scripts.set(text, Math.min(rate, scripts.get(text) ?? rate));
}
function addPractice(tasks: readonly JapanesePracticeTask[], rate: number) {
  for (const task of tasks) {
    if (task.skill === 'listening') add(task.source?.text, rate);
    if (task.mode === 'self' && (task.skill === 'speaking' || task.response === 'speak')) add(task.model, rate);
  }
}

for (const row of japaneseAlphabetLessons) {
  for (const character of row.characters) add(character.audioText, rates.foundation);
  for (const example of row.examples ?? []) add(example.text, rates.foundation);
  addPractice(row.practice ?? [], rates.foundation);
}
for (const lesson of japaneseLessons) {
  const rate = rates[lesson.level];
  add(buildLessonListeningQuestion(lesson)?.sentence, rate);
  addPractice(lesson.japanesePractice?.tasks ?? [], rate);
}
for (const day of japaneseCourse.days) {
  const rate = rates[day.level];
  add(buildCourseListeningQuestion(day, 'ja-JP')?.sentence, rate);
  for (const entry of day.vocabulary) add(entry.target, rate);
  for (const block of day.blocks) {
    if (block.kind === 'dialogue') for (const line of block.lines) add(line.target, rate);
  }
  const guide = japaneseDailyGuides.find(guide => guide.dayId === day.id);
  if (guide) addPractice([...guide.tasks, ...guide.checkpoint], rate);
}
process.stdout.write(JSON.stringify(Object.fromEntries([...scripts].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0))));
