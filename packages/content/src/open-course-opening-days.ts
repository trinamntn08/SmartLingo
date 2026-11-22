import type { CourseDay, Vocabulary } from '@smartlingo/domain';

function selectVocabulary(canonicalVocabulary: readonly Vocabulary[], ids: readonly string[]): Vocabulary[] {
  return ids.map(id => {
    const entry = canonicalVocabulary.find(word => word.id === id);
    if (!entry) throw new Error(`Missing open-course canonical vocabulary: ${id}`);
    return entry;
  });
}

/** Original SmartLingo teaching drafts for owner review. */
export function buildOpenCourseOpeningDays(canonicalVocabulary: readonly Vocabulary[]): CourseDay[] {
  return [spellingDay(canonicalVocabulary), repetitionDay(canonicalVocabulary), timeDay(canonicalVocabulary)];
}

function spellingDay(canonicalVocabulary: readonly Vocabulary[]): CourseDay {
  const id = 'fr.open-course-pilot.day-3';
  return {
    id, dayNumber: 3, progressRevision: 3, level: 'A1',
    title: 'Spell your name',
    outcome: 'Spell a short name at a workshop reception and confirm or correct the letters read back to you.',
    vocabulary: selectVocabulary(canonicalVocabulary, [
      'fr.bonjour', 'fr.people.s-appeler', 'fr.people.prenom', 'fr.administration.epeler',
      'fr.essentials.is-that-right', 'fr.essentials.yes', 'fr.essentials.no',
    ]),
    blocks: [
      {
        id: `${id}.study`, kind: 'study', title: 'Say a name letter by letter',
        explanation: 'At a workshop reception, give your name with je m’appelle. If someone asks Vous pouvez épeler votre prénom ?, say the letters one at a time. Un prénom is a first name, and épeler means to spell. For Nora, practise N (like the English letter N), O (a steady “oh”), R (the vowel in bed, then a French r), A (like “ah”). For Lina, add L (like the English letter L) and I (like “ee”). These are approximate sound cues. When someone reads the name back, say Oui, c’est ça if it is right. If a letter changed, say Non and repeat the correct letters.',
        examples: [
          { target: 'Vous pouvez épeler votre prénom ?', meaning: 'Can you spell your first name?' },
          { target: 'Nora, ça s’écrit N, O, R, A.', meaning: 'Nora is spelled N, O, R, A.' },
          { target: 'Lina, ça s’écrit L, I, N, A.', meaning: 'Lina is spelled L, I, N, A.' },
          { target: 'Oui, c’est ça.', meaning: 'Yes, that’s right.' },
        ],
      },
      { id: `${id}.vocabulary`, kind: 'vocabulary', title: 'Names, spelling and confirmation' },
      {
        id: `${id}.dialogue`, kind: 'dialogue', title: 'Check the spelling at reception',
        explanation: 'You have come to register for a neighbourhood workshop. Nora is a fictional first name. Use vous with the receptionist, and pause briefly between the letters.',
        lines: [
          { role: 'Visitor', target: 'Bonjour, je m’appelle Nora.', meaning: 'Hello, my name is Nora.' },
          { role: 'Receptionist', target: 'Vous pouvez épeler votre prénom ?', meaning: 'Can you spell your first name?' },
          { role: 'Visitor', target: 'Bien sûr. N, O, R, A.', meaning: 'Of course. N, O, R, A.' },
          { role: 'Receptionist', target: 'N, O, R, A. C’est bien ça ?', meaning: 'N, O, R, A. Is that right?' },
          { role: 'Visitor', target: 'Oui, c’est ça. Merci !', meaning: 'Yes, that’s right. Thank you!' },
        ],
      },
      {
        id: `${id}.spell`, kind: 'choice', title: 'Give the letters when asked',
        prompt: 'You are using the name Nora. The receptionist says « Vous pouvez épeler votre prénom ? » Which reply gives the letters?',
        choices: [
          { id: 'introduce', target: 'Je m’appelle Nora.', meaning: 'My name is Nora.' },
          { id: 'spell-nora', target: 'N, O, R, A.', meaning: 'N, O, R, A.' },
          { id: 'thanks', target: 'Merci !', meaning: 'Thank you!' },
        ],
        answerId: 'spell-nora',
        feedback: 'Épeler is a request to spell, so say N, O, R, A. You can also start with Ça s’écrit and then give the same letters.',
        hint: 'Look for épeler. It asks you to give each letter in order.',
      },
      {
        id: `${id}.confirm`, kind: 'choice', title: 'Confirm a matching spelling',
        prompt: 'Your fictional name is Lina. The receptionist reads back « L, I, N, A. C’est bien ça ? » How do you confirm the spelling?',
        choices: [
          { id: 'yes-match', target: 'Oui, c’est ça.', meaning: 'Yes, that’s right.' },
          { id: 'change-ending', target: 'Non, L, I, N, O.', meaning: 'No, L, I, N, O.' },
          { id: 'ask-to-write', target: 'Vous pouvez l’écrire ?', meaning: 'Can you write it down?' },
        ],
        answerId: 'yes-match',
        feedback: 'L, I, N, A matches Lina. Oui, c’est ça confirms it. Oui, exactement is another natural answer.',
        hint: 'Compare all four letters with Lina, then choose a short confirmation.',
      },
      {
        id: `${id}.correct`, kind: 'choice', title: 'Correct a letter',
        prompt: 'Your fictional name is Lina. The receptionist reads back « L, I, N, O ». Which reply corrects the spelling?',
        choices: [
          { id: 'agree', target: 'Oui, c’est ça.', meaning: 'Yes, that’s right.' },
          { id: 'change-start', target: 'Non, N, I, N, A.', meaning: 'No, N, I, N, A.' },
          { id: 'change-last', target: 'Non, L, I, N, A.', meaning: 'No, L, I, N, A.' },
        ],
        answerId: 'change-last',
        feedback: 'The last letter should be A. You can repeat the whole spelling, or just say Non, avec un A à la fin (No, with an A at the end).',
        hint: 'Compare the final letter in Lina with the letter the receptionist read out.',
      },
      {
        id: `${id}.reflection`, kind: 'reflection', title: 'Try one more spelling check',
        prompt: 'Use the fictional name Nina. Say or type the letters. Then imagine the receptionist reads back « N, I, N, O ». Correct the spelling politely.',
        modelTarget: 'Je m’appelle Nina. N, I, N, A. — N, I, N, O ? — Non, N, I, N, A. Merci !',
        modelMeaning: 'My name is Nina. N, I, N, A. — N, I, N, O? — No, N, I, N, A. Thank you!',
        checklist: [
          'I gave the four letters of Nina in order.',
          'I noticed that the final letter had changed and gave the correct A.',
          'I can also use Ça s’écrit N, I, N, A or Non, avec un A à la fin.',
        ],
      },
    ],
  };
}

function repetitionDay(canonicalVocabulary: readonly Vocabulary[]): CourseDay {
  const id = 'fr.open-course-pilot.day-4';
  return {
    id, dayNumber: 4, progressRevision: 3, level: 'A1',
    title: 'Ask someone to repeat',
    outcome: 'Ask someone to repeat a detail more slowly, then say it back to check that you understood.',
    vocabulary: selectVocabulary(canonicalVocabulary, [
      'fr.people.pas-compris', 'fr.essentials.repeat-please', 'fr.essentials.more-slowly',
      'fr.essentials.again-please', 'fr.silvousplait', 'fr.essentials.understood', 'fr.essentials.is-that-right',
    ]),
    blocks: [
      {
        id: `${id}.study`, kind: 'study', title: 'Ask again and check a detail',
        explanation: 'Say Je n’ai pas compris if you missed something. Vous pouvez répéter ? is a polite way to ask someone to say it again. Add plus lentement to ask for a slower pace. You can add s’il vous plaît or ask with Pouvez-vous répéter plus lentement ? After the person repeats the detail, say it back and add c’est bien ça ? The answer Oui, c’est ça confirms you heard correctly. Use J’ai compris to say you understand now.',
        examples: [
          { target: 'Je n’ai pas compris.', meaning: 'I didn’t understand.' },
          { target: 'Vous pouvez répéter plus lentement, s’il vous plaît ?', meaning: 'Can you repeat that more slowly, please?' },
          { target: 'Encore une fois, s’il vous plaît.', meaning: 'One more time, please.' },
          { target: 'Lina, c’est bien ça ?', meaning: 'Lina, is that right?' },
          { target: 'Merci, j’ai compris.', meaning: 'Thank you, I understand now.' },
        ],
      },
      { id: `${id}.vocabulary`, kind: 'vocabulary', title: 'Phrases for asking again' },
      {
        id: `${id}.dialogue`, kind: 'dialogue', title: 'Catch a name at the workshop',
        explanation: 'The workshop host pairs you with another visitor. You miss your partner’s name. Read how the host repeats it and spells it, then notice how the visitor checks the detail.',
        lines: [
          { role: 'Host', target: 'Vous êtes avec Lina.', meaning: 'You’re with Lina.' },
          { role: 'Visitor', target: 'Je n’ai pas compris. Vous pouvez répéter plus lentement ?', meaning: 'I didn’t understand. Can you repeat that more slowly?' },
          { role: 'Host', target: 'Oui. Lina. L, I, N, A.', meaning: 'Yes. Lina. L, I, N, A.' },
          { role: 'Visitor', target: 'Lina, c’est bien ça ?', meaning: 'Lina, is that right?' },
          { role: 'Host', target: 'Oui, c’est ça.', meaning: 'Yes, that’s right.' },
          { role: 'Visitor', target: 'Merci, j’ai compris.', meaning: 'Thank you, I understand now.' },
        ],
      },
      {
        id: `${id}.ask`, kind: 'choice', title: 'Ask for a slower repetition',
        prompt: 'The host spoke quickly and you missed a name. Which question asks the host to say it again at a slower pace?',
        choices: [
          { id: 'ask-slower', target: 'Vous pouvez répéter plus lentement ?', meaning: 'Can you repeat that more slowly?' },
          { id: 'ask-to-spell', target: 'Vous pouvez épeler votre prénom ?', meaning: 'Can you spell your first name?' },
          { id: 'ask-to-help', target: 'Vous pouvez m’aider ?', meaning: 'Can you help me?' },
        ],
        answerId: 'ask-slower',
        feedback: 'Répéter asks the host to say it again. Plus lentement requests a slower pace. Pouvez-vous répéter plus lentement ? works too.',
        hint: 'Look for the words for repeat and more slowly in the same question.',
      },
      {
        id: `${id}.read-back`, kind: 'choice', title: 'Check the repeated name',
        prompt: 'The host repeats « Lina. L, I, N, A. » Which reply checks the name you just heard?',
        choices: [
          { id: 'incorrect-name', target: 'Nina, c’est bien ça ?', meaning: 'Nina, is that right?' },
          { id: 'correct-name', target: 'Lina, c’est bien ça ?', meaning: 'Lina, is that right?' },
          { id: 'greet', target: 'Bonjour, Lina !', meaning: 'Hello, Lina!' },
        ],
        answerId: 'correct-name',
        feedback: 'Repeat Lina and add c’est bien ça ? to check it. The first letter is L. Bonjour, Lina is a greeting you can use once you’re sure.',
        hint: 'Say the name starting with L, then check it with a question.',
      },
      {
        id: `${id}.acknowledge`, kind: 'choice', title: 'Say you understood',
        prompt: 'You’ve heard the name clearly and the host confirms it. Which reply thanks the host and says that you understand now?',
        choices: [
          { id: 'not-understood', target: 'Je n’ai pas compris.', meaning: 'I didn’t understand.' },
          { id: 'once-more', target: 'Encore une fois, s’il vous plaît.', meaning: 'One more time, please.' },
          { id: 'understood', target: 'Merci, j’ai compris.', meaning: 'Thank you, I understand now.' },
        ],
        answerId: 'understood',
        feedback: 'Merci thanks the host and j’ai compris says you got the detail. A short Oui, merci (Yes, thanks) can also close the exchange.',
        hint: 'Look for the reply with both merci and the affirmative phrase j’ai compris.',
      },
      {
        id: `${id}.reflection`, kind: 'reflection', title: 'Practise asking and checking',
        prompt: 'Imagine you miss a name at a workshop. Ask the host to repeat more slowly. The host then says « Nora. N, O, R, A. » Check the name, then thank the host after they confirm.',
        modelTarget: 'Vous pouvez répéter plus lentement, s’il vous plaît ? — Nora. N, O, R, A. — Nora, c’est bien ça ? — Oui. — Merci, j’ai compris.',
        modelMeaning: 'Can you repeat that more slowly, please? — Nora. N, O, R, A. — Nora, is that right? — Yes. — Thank you, I understand now.',
        checklist: [
          'I asked the host to repeat and included plus lentement.',
          'I read back Nora and checked it with a question.',
          'I thanked the host after the detail was confirmed.',
        ],
      },
    ],
  };
}

function timeDay(canonicalVocabulary: readonly Vocabulary[]): CourseDay {
  const id = 'fr.open-course-pilot.day-5';
  return {
    id, dayNumber: 5, progressRevision: 3, level: 'A1',
    title: 'Confirm a time',
    outcome: 'Ask what time a workshop starts and read back the day and time to confirm.',
    vocabulary: selectVocabulary(canonicalVocabulary, [
      'fr.social.what-time', 'fr.bakery.tomorrow', 'fr.routine.dix', 'fr.numbers.eleven',
      'fr.routine.midi', 'fr.essentials.is-that-right', 'fr.greetings.a-demain',
    ]),
    blocks: [
      {
        id: `${id}.study`, kind: 'study', title: 'Ask when a session starts',
        explanation: 'Ask À quelle heure ? to find out at what time something happens. A workshop is un atelier. You can ask À quelle heure commence l’atelier ? Use à before the time: à dix heures (10:00), à onze heures (11:00), à midi (12:00, noon). Demain means tomorrow. Repeat both details and add c’est bien ça ? to check them. À demain ! is a friendly goodbye when you will see someone tomorrow.',
        examples: [
          { target: 'À quelle heure commence l’atelier ?', meaning: 'What time does the workshop start?' },
          { target: 'Demain à dix heures.', meaning: 'Tomorrow at ten o’clock (10:00).' },
          { target: 'À onze heures.', meaning: 'At eleven o’clock (11:00).' },
          { target: 'À midi.', meaning: 'At noon (12:00).' },
        ],
      },
      { id: `${id}.vocabulary`, kind: 'vocabulary', title: 'Times and useful phrases' },
      {
        id: `${id}.dialogue`, kind: 'dialogue', title: 'Confirm a workshop start time',
        explanation: 'You are at a community centre and will come back for the next workshop. Ask when it starts and read back the answer before you leave.',
        lines: [
          { role: 'Visitor', target: 'Bonjour ! À quelle heure commence l’atelier demain ?', meaning: 'Hello! What time does the workshop start tomorrow?' },
          { role: 'Receptionist', target: 'À dix heures.', meaning: 'At ten o’clock.' },
          { role: 'Visitor', target: 'Demain à dix heures, c’est bien ça ?', meaning: 'Tomorrow at ten, is that right?' },
          { role: 'Receptionist', target: 'Oui, c’est ça.', meaning: 'Yes, that’s right.' },
          { role: 'Visitor', target: 'Merci, à demain !', meaning: 'Thank you, see you tomorrow!' },
        ],
      },
      {
        id: `${id}.ask`, kind: 'choice', title: 'Ask for the start time',
        prompt: 'You already know the workshop is tomorrow. Which question asks what time it starts?',
        choices: [
          { id: 'where', target: 'Où est l’atelier ?', meaning: 'Where is the workshop?' },
          { id: 'ask-time', target: 'À quelle heure commence l’atelier ?', meaning: 'What time does the workshop start?' },
          { id: 'ask-to-repeat', target: 'Vous pouvez répéter ?', meaning: 'Can you repeat that?' },
        ],
        answerId: 'ask-time',
        feedback: 'À quelle heure asks for a clock time. L’atelier commence à quelle heure ? is another natural way to ask the same question.',
        hint: 'Look for the question beginning with À quelle heure.',
      },
      {
        id: `${id}.read-time`, kind: 'choice', title: 'Use a time from a schedule',
        prompt: 'The schedule says « Atelier : 11 h ». Which phrase means “at eleven o’clock”?',
        choices: [
          { id: 'ten', target: 'À dix heures.', meaning: 'At ten o’clock (10:00).' },
          { id: 'noon', target: 'À midi.', meaning: 'At noon (12:00).' },
          { id: 'eleven', target: 'À onze heures.', meaning: 'At eleven o’clock (11:00).' },
        ],
        answerId: 'eleven',
        feedback: 'Onze is eleven, so 11 h is onze heures. Use à when you say when the workshop starts.',
        hint: 'Match 11 with onze, then choose the phrase that puts à before the time.',
      },
      {
        id: `${id}.confirm`, kind: 'choice', title: 'Read back the day and time',
        prompt: 'The receptionist says « Demain à midi. » Which reply checks both the day and the time?',
        choices: [
          { id: 'check-both', target: 'Demain à midi, c’est bien ça ?', meaning: 'Tomorrow at noon, is that right?' },
          { id: 'day-only', target: 'À demain !', meaning: 'See you tomorrow!' },
          { id: 'wrong-time', target: 'Demain à dix heures, c’est bien ça ?', meaning: 'Tomorrow at ten, is that right?' },
        ],
        answerId: 'check-both',
        feedback: 'Demain à midi reads back both details. C’est bien ça ? asks the receptionist to confirm them. À demain is useful when you say goodbye.',
        hint: 'Keep demain for the day and midi for noon, then ask if the details are right.',
      },
      {
        id: `${id}.reflection`, kind: 'reflection', title: 'Confirm another session',
        prompt: 'Ask what time the next workshop starts. Imagine the receptionist answers « Demain à onze heures. » Say or type a question that checks the day and time, then close the exchange.',
        modelTarget: 'À quelle heure commence l’atelier ? — Demain à onze heures. — Demain à onze heures, c’est bien ça ? — Oui. — Merci, à demain !',
        modelMeaning: 'What time does the workshop start? — Tomorrow at eleven. — Tomorrow at eleven, is that right? — Yes. — Thank you, see you tomorrow!',
        checklist: [
          'I asked what time the workshop starts.',
          'I read back demain and à onze heures, then asked for confirmation.',
          'I closed with merci, à demain or another polite goodbye.',
          'If I wrote the time, I used the accent in à and the plural heures.',
        ],
      },
    ],
  };
}
