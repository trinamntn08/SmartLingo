import assert from 'node:assert/strict';
import { test } from 'node:test';
import { courseOutlineUnits, frenchCourses, frenchCourseLessonsByDay, currentJapaneseStudyExplanation, getJapaneseDailyGuide, japaneseCourse, japaneseLessons, languageCurricula } from '@smartlingo/content';
import { checkAnswer, courseDayProgressRevision, lessonSchema, targetLanguages, type CourseEvent } from '@smartlingo/domain';
import { buildCourseLesson } from '../src/course/courseLessonContent';
import { courseRecommendation, latestCourseStudy } from '../src/course/courseRecommendation';

test('every bundled course day has a draft lesson view under its existing progress scope', () => {
  const libraryIds = new Set(Object.values(languageCurricula).flatMap(curriculum => curriculum.topicLessons.map(lesson => lesson.id)));
  const courses = targetLanguages.flatMap(language => {
    const curriculum = languageCurricula[language];
    assert.ok(curriculum.topicLessons.length && curriculum.topicLessons.every(lesson => lesson.language === language));
    assert.ok(curriculum.courses.every(course => course.language === language));
    return curriculum.courses;
  });
  for (const course of courses) {
    const units = courseOutlineUnits(course);
    assert.deepEqual(units?.flatMap(unit => unit.dayIds), course.days.map(day => day.id));
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
      assert.deepEqual(lesson.grammar, { title: study.title, explanation: course.language === 'ja-JP' ? currentJapaneseStudyExplanation(study.explanation) : study.explanation });
      assert.ok(!libraryIds.has(lesson.id), day.id);
    }
  }
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


test('daily Japanese lesson projection selects daily Can-dos rather than topic practice without changing legacy exercises', () => {
  for (const day of japaneseCourse.days) {
    const lesson = buildCourseLesson(japaneseCourse, day);
    const guide = getJapaneseDailyGuide(day.id)!;
    assert.deepEqual(lesson.japanesePractice?.tasks, [...guide.tasks, ...guide.checkpoint]);
    assert.equal(lesson.japanesePractice?.checkpoint, true);
    assert.equal(lesson.japanesePractice?.prerequisites, guide.preparation);
    assert.equal(lesson.japanesePractice?.revisit, guide.review);
    assert.ok(lesson.japanesePractice?.tasks.every(task => task.id.startsWith(`${day.id}.`)));
  }
});


test('Japanese guided views do not repeat the archived claim that Japanese audio is unavailable', () => {
  const day = japaneseCourse.days[0];
  const archived = day.blocks.find(block => block.kind === 'study')!;
  assert.match(archived.explanation, /Japanese audio is not available/);
  const lesson = buildCourseLesson(japaneseCourse, day);
  assert.doesNotMatch(lesson.grammar.explanation, /Japanese audio is not available/);
  assert.match(lesson.grammar.explanation, /speaker buttons for Japanese audio/);
  assert.equal(currentJapaneseStudyExplanation('Unrelated explanation.'), 'Unrelated explanation.');
});


test('supplementary task history does not activate a course or replace the last intentional lesson visit', () => {
  const first = japaneseCourse.days[0];
  const second = japaneseCourse.days[1];
  const navigation: CourseEvent = { id: '11111111-1111-4111-8111-111111111111', courseId: japaneseCourse.id,
    courseRevision: courseDayProgressRevision(japaneseCourse, first), dayId: first.id, blockId: 'lesson-vocabulary',
    occurredAt: '2026-11-26T09:00:00Z', kind: 'navigation' };
  const practice: CourseEvent = { ...navigation, id: '22222222-2222-4222-8222-222222222222', dayId: second.id,
    occurredAt: '2026-11-26T10:00:00Z', kind: 'practice', blockId: 'lesson-sentence',
    taskId: getJapaneseDailyGuide(second.id)!.tasks[0].id, result: 'correct', supported: false };
  assert.equal(latestCourseStudy([japaneseCourse], [navigation, practice]), navigation);
  assert.equal(latestCourseStudy([japaneseCourse], [practice]), undefined);
  assert.equal(courseRecommendation(japaneseCourse, [practice], false).status, 'start');
  assert.equal(courseRecommendation(japaneseCourse, [navigation, practice], false).day.id, first.id);
});
