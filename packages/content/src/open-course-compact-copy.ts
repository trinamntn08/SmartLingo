import type { CourseDay } from '@smartlingo/domain';

type CompactCopy = NonNullable<CourseDay['compact']>;

const neighbour = 'fr.open-course-pilot.day-1';
const introduction = 'fr.open-course-pilot.day-2';
const spelling = 'fr.open-course-pilot.day-3';
const repetition = 'fr.open-course-pilot.day-4';
const time = 'fr.open-course-pilot.day-5';

/** Original draft copy for owner review. The underlying lessons keep their dialogue and answer IDs. */
const compactCopyByDayId: Partial<Record<string, CompactCopy>> = {
  [neighbour]: {
    tip: 'Start with bonjour during the day. Use vous with a neighbour you’ve just met, and say bonne journée as you leave.',
    practice: [
      {
        blockId: `${neighbour}.arrival`,
        prompt: 'You meet a neighbour during the day. How do you greet them?',
        feedback: 'Bonjour is a daytime greeting. Au revoir and bonne journée are for leaving.',
        hint: 'Choose the daytime “hello”.',
      },
      {
        blockId: `${neighbour}.check-in`,
        prompt: 'Your neighbour uses vous. How do you ask “And you?” back?',
        feedback: 'Et vous ? keeps the same polite form. Et toi ? is familiar.',
        hint: 'Keep vous, the form your neighbour used.',
      },
      {
        blockId: `${neighbour}.departure`,
        prompt: 'You’re leaving. How do you say goodbye and wish your neighbour a good day?',
        feedback: 'Au revoir means “goodbye”. Bonne journée means “have a good day”. Either order works.',
        hint: 'Choose the reply that includes both a goodbye and a good wish.',
      },
    ],
    reflectionPrompt: 'Greet a neighbour and ask how they are. Try both roles, then say goodbye.',
  },
  [introduction]: {
    tip: 'Give your name with je m’appelle. Add et vous ? to ask for the other person’s name after giving yours.',
    practice: [
      {
        blockId: `${introduction}.give-name`,
        prompt: 'Someone asks « Comment vous appelez-vous ? » How do you say your name is Sam?',
        feedback: 'Je m’appelle Sam gives your own name. Moi, c’est Sam also works in conversation.',
        hint: 'Je means “I”.',
      },
      {
        blockId: `${introduction}.ask-name`,
        prompt: 'You’ve just met someone. Which question asks their name using vous?',
        feedback: 'Comment vous appelez-vous ? asks their name politely. Vous vous appelez comment ? also works.',
        hint: 'Look for vous and a form of s’appeler, “to be called”.',
      },
      {
        blockId: `${introduction}.first-name`,
        prompt: 'Your name is Sam Bernard. Someone asks for your prénom. What do you say?',
        feedback: 'Un prénom is a first name. Here it’s Sam. Bernard is the nom de famille.',
        hint: 'Prénom means “first name”.',
      },
    ],
    reflectionPrompt: 'Say hello, give a name, ask the other person’s name using vous, then say goodbye.',
  },
  [spelling]: {
    tip: 'Épeler means “to spell”. Say one letter at a time. For the French letter R, start with the vowel in bed, then add a French r.',
    practice: [
      {
        blockId: `${spelling}.spell`,
        prompt: 'You’re Nora. The receptionist asks « Vous pouvez épeler votre prénom ? » Which reply gives the letters?',
        feedback: 'Give N, O, R, A. You can also start with ça s’écrit (“it’s spelled”).',
        hint: 'Épeler means “to spell”.',
      },
      {
        blockId: `${spelling}.confirm`,
        prompt: 'You’re Lina. The receptionist reads back L, I, N, A. How do you confirm it?',
        feedback: 'L, I, N, A matches Lina. Oui, c’est ça means “yes, that’s right”.',
        hint: 'Check all four letters, then confirm.',
      },
      {
        blockId: `${spelling}.correct`,
        prompt: 'You’re Lina. The receptionist reads back L, I, N, O. How do you correct it?',
        feedback: 'Lina ends in A. Repeat the letters or say non, avec un A à la fin (“no, with an A at the end”).',
        hint: 'Check the last letter.',
      },
    ],
    reflectionPrompt: 'Spell Nina. The receptionist reads back N, I, N, O. Correct the spelling.',
  },
  [repetition]: {
    tip: 'Add plus lentement to ask someone to speak more slowly. Repeat the detail and ask c’est bien ça ? to check it.',
    practice: [
      {
        blockId: `${repetition}.ask`,
        prompt: 'You missed a name. How do you ask the host to repeat it more slowly?',
        feedback: 'Répéter means “to repeat”. Plus lentement means “more slowly”.',
        hint: 'Choose the question that asks for both repetition and a slower pace.',
      },
      {
        blockId: `${repetition}.read-back`,
        prompt: 'The host says « Lina. L, I, N, A. » How do you check the name?',
        feedback: 'Say Lina back and add c’est bien ça ? to check that you heard it correctly.',
        hint: 'Say the name starting with L, then ask if it’s right.',
      },
      {
        blockId: `${repetition}.acknowledge`,
        prompt: 'You heard the name the second time. How do you thank the host and say you understood?',
        feedback: 'Merci means “thank you”. J’ai compris means “I understood”.',
        hint: 'Look for merci and j’ai compris together.',
      },
    ],
    reflectionPrompt: 'Ask the host to repeat a name more slowly. They say Nora. Check the name and thank them.',
  },
  [time]: {
    tip: 'À quelle heure ? asks “At what time?” Say à dix heures for 10:00 and à midi for noon.',
    practice: [
      {
        blockId: `${time}.ask`,
        prompt: 'The workshop is tomorrow. How do you ask what time it starts?',
        feedback: 'À quelle heure ? asks for a clock time. You can also ask « L’atelier commence à quelle heure ? »',
        hint: 'Look for the question beginning with à quelle heure.',
      },
      {
        blockId: `${time}.read-time`,
        prompt: 'The schedule says « Atelier : 11 h ». How do you say “at eleven o’clock”?',
        feedback: 'Onze means eleven. Say à onze heures for “at eleven o’clock”.',
        hint: 'Match 11 with onze and use à before the time.',
      },
      {
        blockId: `${time}.confirm`,
        prompt: 'The receptionist says « Demain à midi. » How do you check both the day and the time?',
        feedback: 'Demain à midi means “tomorrow at noon”. Add c’est bien ça ? to confirm both details.',
        hint: 'Keep demain for the day and midi for noon.',
      },
    ],
    reflectionPrompt: 'Ask when the workshop starts. The receptionist says « Demain à onze heures. » Check the day and time, then say goodbye.',
  },
};

export function withCompactCourseCopy(day: CourseDay): CourseDay {
  const compact = compactCopyByDayId[day.id];
  return compact ? { ...day, compact } : day;
}
