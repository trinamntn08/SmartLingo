import { frenchCourseLessonsByDay, frenchPilotBriefGrammar, getJapaneseDailyGuide, getLearnerGrammar, japaneseLessons } from '@smartlingo/content';
import { courseDayProgressRevision, lessonSchema, type CourseDay, type Lesson, type OpenCourse } from '@smartlingo/domain';

interface FrenchPractice {
  role: string;
  matching: Omit<Lesson['pictureActivity'], 'mode'>;
  sentence: Omit<Lesson['sentenceActivity'], 'id' | 'almostAnswers'>;
}

// Original SmartLingo activities for the five bundled French drafts.
const frenchPractice: Partial<Record<string, FrenchPractice>> = {
  'fr.open-course-pilot.day-1': {
    role: 'Newcomer',
    matching: {
      prompt: 'You are leaving your neighbour after a daytime chat. Choose the wish for the rest of the day.',
      entryId: 'fr.greetings.bonne-journee',
      choices: ['fr.bonjour', 'fr.greetings.bonne-journee', 'fr.people.au-revoir'],
    },
    sentence: {
      prompt: 'Greet your neighbour, then ask how they are. “Hello! How are you?”',
      tokens: ['allez-vous ?', 'Bonjour !', 'Comment'],
      answers: ['Bonjour ! Comment allez-vous ?'],
      hint: 'Start with the greeting. Put Comment before allez-vous to ask how your neighbour is.',
      explanation: 'Bonjour opens the exchange. Comment allez-vous ? uses vous to ask an adult you do not know well how they are.',
    },
  },
  'fr.open-course-pilot.day-2': {
    role: 'Newcomer',
    matching: {
      prompt: 'You are introducing yourself at a neighbourhood activity. Choose the word for the name a friend would call you.',
      entryId: 'fr.people.prenom',
      choices: ['fr.people.nom-de-famille', 'fr.people.prenom', 'fr.people.enchante'],
    },
    sentence: {
      prompt: 'Introduce yourself as Sam. “Hello, my name is Sam.”',
      tokens: ['Sam.', 'je m’appelle', 'Bonjour,'],
      answers: ['Bonjour, je m’appelle Sam.'],
      hint: 'Greet the person first. Put your name immediately after je m’appelle.',
      explanation: 'Je m’appelle gives your own name. Keep m’ attached to appelle before the vowel.',
    },
  },
  'fr.open-course-pilot.day-3': {
    role: 'Visitor',
    matching: {
      prompt: 'You are at reception. Choose the verb for saying the letters of your first name one by one.',
      entryId: 'fr.administration.epeler',
      choices: ['fr.people.s-appeler', 'fr.essentials.is-that-right', 'fr.administration.epeler'],
    },
    sentence: {
      prompt: 'Tell the receptionist how to spell Nora. “Nora is spelled N, O, R, A.”',
      tokens: ['R, A.', 'ça s’écrit', 'N, O,', 'Nora,'],
      answers: ['Nora, ça s’écrit N, O, R, A.'],
      hint: 'Say the name first, followed by ça s’écrit. Then give the letters in order.',
      explanation: 'Ça s’écrit introduces the written form. N, O, R, A is the spelling the receptionist needs to check.',
    },
  },
  'fr.open-course-pilot.day-4': {
    role: 'Visitor',
    matching: {
      prompt: 'You need the workshop host to say a name at a slower pace. Choose the phrase that asks for that pace.',
      entryId: 'fr.essentials.more-slowly',
      choices: ['fr.essentials.more-slowly', 'fr.essentials.again-please', 'fr.essentials.understood'],
    },
    sentence: {
      prompt: 'Ask the host to repeat what they said more slowly. “Can you repeat that more slowly?”',
      tokens: ['plus lentement ?', 'répéter', 'Vous pouvez'],
      answers: ['Vous pouvez répéter plus lentement ?'],
      hint: 'Put répéter after vous pouvez. Use plus lentement to say how you want them to repeat it.',
      explanation: 'Vous pouvez + a verb makes a polite request. Plus lentement asks for slower speech.',
    },
  },
  'fr.open-course-pilot.day-5': {
    role: 'Visitor',
    matching: {
      prompt: 'You are checking a workshop schedule. Choose the question that asks for a clock time.',
      entryId: 'fr.social.what-time',
      choices: ['fr.bakery.tomorrow', 'fr.social.what-time', 'fr.greetings.a-demain'],
    },
    sentence: {
      prompt: 'Check the workshop’s day and time. “Tomorrow at ten o’clock, is that right?”',
      tokens: ['c’est bien ça ?', 'à dix heures,', 'Demain'],
      answers: ['Demain à dix heures, c’est bien ça ?'],
      hint: 'Say the day, then the time. Put the confirmation question at the end.',
      explanation: 'Demain gives the day and à dix heures gives the time. C’est bien ça ? asks the receptionist to confirm both.',
    },
  },
};

/** Present a course day as a lesson without adding it to the public lesson catalogue. */
export function buildCourseLesson(course: OpenCourse, day: CourseDay): Lesson {
  const identity = {
    id: day.id,
    revision: courseDayProgressRevision(course, day),
    status: 'draft' as const,
    language: course.language,
    explanationLanguage: course.explanationLanguage,
    title: day.title,
    subtitle: `Lesson ${day.dayNumber}: ${day.title}`,
    topic: course.title,
    outcome: day.outcome,
    level: day.level,
  };

  if (course.language === 'ja-JP') {
    const authored = japaneseLessons.find(lesson => lesson.id === `ja.lesson.day-${day.dayNumber}`);
    if (!authored) throw new Error(`Missing shared Japanese lesson material for ${day.id}`);
    const guide = getJapaneseDailyGuide(day.id);
    return lessonSchema.parse({
      ...authored, ...identity, grammar: getLearnerGrammar(authored),
      japanesePractice: guide ? {
        tasks: [...guide.tasks, ...guide.checkpoint],
        checkpoint: guide.checkpoint.length > 0,
        prerequisites: guide.preparation,
        revisit: guide.review,
      } : authored.japanesePractice,
    });
  }

  const authored = frenchCourseLessonsByDay.get(day.id);
  if (authored) return lessonSchema.parse({
    ...authored, ...identity, durationMinutes: 12,
    grammar: getLearnerGrammar(authored),
    sentenceActivity: { ...authored.sentenceActivity, id: `${day.id}.sentence` },
  });

  const study = day.blocks.find(block => block.kind === 'study');
  const dialogue = day.blocks.find(block => block.kind === 'dialogue');
  const practice = frenchPractice[day.id];
  if (!study || !dialogue || !practice) throw new Error(`Missing shared French lesson material for ${day.id}`);

  return lessonSchema.parse({
    ...identity,
    durationMinutes: 10,
    role: practice.role,
    vocabulary: day.vocabulary,
    dialogue: dialogue.lines,
    grammar: frenchPilotBriefGrammar[`${day.id}@${identity.revision}`] ?? { title: study.title, explanation: study.explanation },
    pictureActivity: { mode: 'meaning', ...practice.matching },
    sentenceActivity: { id: `${day.id}.sentence`, ...practice.sentence, almostAnswers: [] },
    provenance: course.provenance,
  });
}
