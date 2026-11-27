import assert from 'node:assert/strict';
import { test } from 'node:test';
import { frenchCourses, frenchCourseLessonsByDay, getLearnerGrammar, japaneseCourse, japaneseLessons, lessons } from '@smartlingo/content';
import { checkAnswer, courseDayProgressRevision, lessonSchema } from '@smartlingo/domain';
import { buildCourseLesson } from '../src/course/courseLessonContent';

test('every bundled course day has a draft lesson view under its existing progress scope', () => {
  const libraryIds = new Set([...lessons, ...japaneseLessons].map(lesson => lesson.id));
  for (const course of [...frenchCourses, japaneseCourse]) {
    for (const day of course.days) {
      const lesson = buildCourseLesson(course, day);
      const dialogue = day.blocks.find(block => block.kind === 'dialogue');
      const study = day.blocks.find(block => block.kind === 'study');
      assert.ok(dialogue && study, day.id);
      assert.ok(lessonSchema.safeParse(lesson).success, day.id);
      assert.equal(lesson.id, day.id);
      assert.equal(lesson.revision, courseDayProgressRevision(course, day));
      assert.equal(lesson.status, 'draft');
      assert.equal(lesson.subtitle, `Lesson ${day.dayNumber}: ${day.title}`);
      assert.equal(lesson.language, course.language);
      assert.equal(lesson.outcome, day.outcome);
      assert.equal(lesson.level, day.level);
      assert.deepEqual(lesson.vocabulary, day.vocabulary);
      assert.deepEqual(lesson.dialogue, dialogue.lines);
      assert.ok(lesson.grammar.explanation.length < study.explanation.length, day.id);
      assert.ok(!libraryIds.has(lesson.id), day.id);
    }
  }
});

test('all bundled learner grammar briefs are shorter and custom copy takes precedence', () => {
  for (const lesson of [...lessons, ...japaneseLessons]) {
    const brief = getLearnerGrammar(lesson);
    assert.ok(lessonSchema.shape.grammar.safeParse(brief).success, lesson.id);
    assert.ok(brief.explanation.length < lesson.grammar.explanation.length, lesson.id);
  }
  const lesson = lessons[0];
  const custom = { title: lesson.grammar.title, explanation: 'A custom grammar explanation.' };
  assert.equal(getLearnerGrammar({ ...lesson, grammar: custom }), custom);
  assert.equal(getLearnerGrammar({ ...lesson, revision: lesson.revision + 1 }), lesson.grammar);
  assert.equal(getLearnerGrammar({ ...lesson, status: 'published' }), lesson.grammar);
});

test('French practice uses nearby meanings and every accepted sentence can be assembled', () => {
  for (const course of frenchCourses) for (const day of course.days) {
    const lesson = buildCourseLesson(course, day);
    const matching = lesson.pictureActivity;
    const meanings = lesson.vocabulary.filter(word => matching.choices.includes(word.id)).map(word => word.meaning);
    assert.equal(matching.mode, 'meaning');
    assert.equal(new Set(meanings).size, 3, day.id);
    assert.ok(matching.choices.includes(matching.entryId), day.id);
    assert.ok(lesson.dialogue.some(turn => turn.role === lesson.role), day.id);

    const exercise = lesson.sentenceActivity;
    assert.ok(exercise.tokens.length >= 2, day.id);
    const authored = frenchCourseLessonsByDay.get(day.id);
    if (authored) {
      assert.deepEqual(exercise.answers, authored.sentenceActivity.answers);
      assert.deepEqual(lesson.pictureActivity, authored.pictureActivity);
    }
    assert.equal(checkAnswer(exercise.tokens.join(' '), exercise), 'incorrect', day.id);
    for (const answer of exercise.answers) {
      assert.ok(canAssemble(exercise.tokens, answer), `${day.id}: ${answer}`);
      assert.equal(checkAnswer(answer, exercise), 'correct', day.id);
    }
  }
});

test('Japanese course views reuse the original matching and sentence-building material', () => {
  for (const day of japaneseCourse.days) {
    const authored = japaneseLessons.find(lesson => lesson.id === `ja.lesson.day-${day.dayNumber}`);
    assert.ok(authored, day.id);
    const lesson = buildCourseLesson(japaneseCourse, day);
    assert.deepEqual(lesson.pictureActivity, authored.pictureActivity);
    assert.deepEqual(lesson.sentenceActivity, authored.sentenceActivity);
    assert.ok(lesson.dialogue.every(turn => turn.reading), day.id);
  }
});

function canAssemble(tokens: readonly string[], answer: string): boolean {
  if (!tokens.length) return answer === '';
  return tokens.some((token, index) => {
    if (tokens.length === 1) return token === answer;
    return answer.startsWith(token + ' ')
      && canAssemble([...tokens.slice(0, index), ...tokens.slice(index + 1)], answer.slice(token.length + 1));
  });
}
