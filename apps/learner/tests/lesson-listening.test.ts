import assert from 'node:assert/strict';
import { test } from 'node:test';
import { japaneseCourse, japaneseLessons, lessons, openCoursePilot } from '@smartlingo/content';
import { buildCourseListeningQuestion, buildLessonListeningQuestion } from '../src/listening/lessonQuestions';

test('every bundled short lesson has a deterministic, contextual listening item', () => {
  for (const lesson of [...lessons, ...japaneseLessons]) {
    const question = buildLessonListeningQuestion(lesson);
    assert.ok(question, lesson.id);
    assert.deepEqual(question, buildLessonListeningQuestion(lesson), lesson.id);
    assert.equal(question.lessonId, lesson.id);
    assert.equal(question.language, lesson.language);
    assert.equal(new Set(question.choices).size, 3, lesson.id);
    assert.ok(lesson.dialogue.some(line => line.target === question.sentence && line.meaning === question.meaning), lesson.id);
    if (lesson.language === 'ja-JP') assert.ok(question.reading, lesson.id);
    if (!question.prompt) {
      assert.equal(question.choices[question.correctIndex], question.meaning);
      const localMeanings = new Set([...lesson.dialogue.map(line => line.meaning), ...lesson.vocabulary.map(word => word.exampleMeaning)]);
      assert.ok(question.choices.every(choice => localMeanings.has(choice)), lesson.id);
    }
  }
});

test('every French and Japanese guided day has a tailored intent or detail check', () => {
  const frenchAnswers = ['Saying goodbye and wishing you a good day', 'Claire', 'N – O – R – A', 'Repeat more slowly', 'Ten o’clock'];
  const japaneseAnswers = ['Hear it again, more slowly', 'Tokyo', 'They don’t need one', '9 a.m.', 'Seven o’clock', 'Took lots of photos',
    'No eating or drinking', 'One blanket', 'Saturday at noon', 'They found the stop and caught the last bus',
    'Meet at the office on meeting days', 'Thursday at 6 p.m.', 'Everyone can attend'];

  for (const [course, answers] of [[openCoursePilot, frenchAnswers], [japaneseCourse, japaneseAnswers]] as const) {
    assert.deepEqual(course.days.map(day => {
      const question = buildCourseListeningQuestion(day, course.language);
      assert.ok(question?.prompt, day.id);
      assert.equal(question.language, course.language);
      assert.equal(new Set(question.choices).size, 3, day.id);
      assert.ok(day.blocks.some(block => block.kind === 'dialogue'
        && block.lines.some(line => line.target === question.sentence && line.meaning === question.meaning)), day.id);
      if (course.language === 'ja-JP') assert.ok(question.reading, day.id);
      return question.choices[question.correctIndex];
    }), answers);
  }
});

test('a revised dialogue regenerates the question instead of serving a stale tailored answer', () => {
  const opening = lessons.find(lesson => lesson.id === 'fr.greetings.hello-goodbye')!;
  const question = buildLessonListeningQuestion(opening)!;
  assert.equal(question.choices[question.correctIndex], 'A good day');

  const revised = { ...opening, revision: opening.revision + 1, dialogue: opening.dialogue.map(line => line.target === question.sentence
    ? { ...line, target: 'Au revoir et bonne soirée !', meaning: 'Goodbye and have a good evening!' } : line) };
  const updated = buildLessonListeningQuestion(revised)!;
  assert.ok(updated);
  assert.equal(updated.prompt, undefined);
  assert.equal(updated.choices[updated.correctIndex], updated.meaning);
  assert.notEqual(updated.sentence, question.sentence);
});

test('a changed speaker role invalidates a tailored prompt even when their words stay the same', () => {
  const lesson = lessons.find(item => item.id === 'fr.greetings.politeness')!;
  const original = buildLessonListeningQuestion(lesson)!;
  assert.match(original.prompt!, /receptionist/);
  const dialogue = lesson.dialogue.map(line => line.target === original.sentence ? { ...line, role: 'Learner' } : line);
  const updated = buildLessonListeningQuestion({ ...lesson, dialogue, revision: lesson.revision + 1 });
  assert.ok(updated);
  assert.equal(updated.prompt, undefined);
  assert.equal(updated.choices[updated.correctIndex], updated.meaning);
});

test('duplicate readings with conflicting meanings cannot become a question or an alternative', () => {
  const lesson = japaneseLessons[0]!;
  const dialogue = [
    { role: 'Speaker', target: '今日です。', reading: 'きょうです。', meaning: 'Today.' },
    { role: 'Speaker', target: 'キョウです。', reading: 'キョウです。', meaning: 'This is Kyo.' },
    { role: 'Speaker', target: '八時に帰ります。', reading: 'はちじにかえります。', meaning: 'I will go home at eight.' },
    { role: 'Speaker', target: '明日にします。', reading: 'あしたにします。', meaning: 'I will do it tomorrow.' },
  ];
  const question = buildLessonListeningQuestion({ ...lesson, dialogue, vocabulary: [] });
  assert.equal(question?.sentence, dialogue[2]!.target);
  assert.deepEqual(new Set(question.choices), new Set(['I will go home at eight.', 'I will do it tomorrow.']));
  assert.equal(buildLessonListeningQuestion({ ...lesson, dialogue: dialogue.slice(0, 2), vocabulary: [] }), undefined);
});
