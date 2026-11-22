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
    tip: 'Passing a neighbour? Bonjour is enough. If you stop to chat, ask Comment allez-vous ? Say Bonne journée as you leave.',
    practice: [
      {
        blockId: `${neighbour}.arrival`,
        prompt: 'How do you greet a neighbour during the day?',
        feedback: 'Bonjour is a daytime greeting. Au revoir and bonne journée are for leaving.',
        hint: 'Choose the daytime “hello”.',
      },
      {
        blockId: `${neighbour}.check-in`,
        prompt: 'How do you say “And you?” using vous?',
        feedback: 'Et vous ? keeps the same polite form. Et toi ? is familiar.',
        hint: 'Keep vous, the form your neighbour used.',
      },
      {
        blockId: `${neighbour}.departure`,
        prompt: 'Say goodbye and wish your neighbour a good day.',
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
        prompt: '« Comment vous appelez-vous ? » Answer as Sam.',
        feedback: 'Je m’appelle Sam gives your own name. Moi, c’est Sam also works in conversation.',
        hint: 'Je means “I”.',
      },
      {
        blockId: `${introduction}.ask-name`,
        prompt: 'Ask someone’s name using vous.',
        feedback: 'Comment vous appelez-vous ? asks their name politely. Vous vous appelez comment ? also works.',
        hint: 'Look for vous and a form of s’appeler, “to be called”.',
      },
      {
        blockId: `${introduction}.first-name`,
        prompt: 'You’re Sam Bernard. What’s your prénom?',
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
        prompt: 'Spell Nora for the receptionist.',
        feedback: 'Give N, O, R, A. You can also start with ça s’écrit (“it’s spelled”).',
        hint: 'Épeler means “to spell”.',
      },
      {
        blockId: `${spelling}.confirm`,
        prompt: 'Confirm that Lina is spelled L, I, N, A.',
        feedback: 'L, I, N, A matches Lina. Oui, c’est ça means “yes, that’s right”.',
        hint: 'Check all four letters, then confirm.',
      },
      {
        blockId: `${spelling}.correct`,
        prompt: 'Your name is Lina. Correct “L, I, N, O”.',
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
        prompt: 'Ask the host to repeat the name more slowly.',
        feedback: 'Répéter means “to repeat”. Plus lentement means “more slowly”.',
        hint: 'Choose the question that asks for both repetition and a slower pace.',
      },
      {
        blockId: `${repetition}.read-back`,
        prompt: 'The host says « Lina. L, I, N, A. » Check the name.',
        feedback: 'Say Lina back and add c’est bien ça ? to check that you heard it correctly.',
        hint: 'Say the name starting with L, then ask if it’s right.',
      },
      {
        blockId: `${repetition}.acknowledge`,
        prompt: 'Thank the host and say you understood.',
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
        prompt: 'Ask what time tomorrow’s workshop starts.',
        feedback: 'À quelle heure ? asks for a clock time. You can also ask « L’atelier commence à quelle heure ? »',
        hint: 'Look for the question beginning with à quelle heure.',
      },
      {
        blockId: `${time}.read-time`,
        prompt: 'The schedule says « 11 h ». Say “at eleven o’clock”.',
        feedback: 'Onze means eleven. Say à onze heures for “at eleven o’clock”.',
        hint: 'Match 11 with onze and use à before the time.',
      },
      {
        blockId: `${time}.confirm`,
        prompt: 'The receptionist says « Demain à midi. » Confirm the day and time.',
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
