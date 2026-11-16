import { lessonSchema, type Lesson, type Vocabulary } from '@smartlingo/domain';
import { buildTopic, type TopicDraft } from '../build-topic';

// Original runtime drafts based on docs/audits/greeting-first-proposal.json.
// The seven existing senses below retain their complete canonical support.
const sharedIds: Readonly<Record<string, string>> = {
  'fr.greetings.bonjour': 'fr.bonjour',
  'fr.greetings.au-revoir': 'fr.people.au-revoir',
  'fr.greetings.sil-vous-plait': 'fr.silvousplait',
  'fr.greetings.merci': 'fr.merci',
  'fr.greetings.merci-beaucoup': 'fr.essentials.thank-you',
  'fr.greetings.de-rien': 'fr.essentials.welcome-response',
  'fr.greetings.excusez-moi': 'fr.essentials.excuse-me',
};

const greetings: TopicDraft = {
  slug: 'greetings', title: 'Everyday greetings and politeness', role: 'Newcomer',
  lessons: [
    {
      slug: 'hello-goodbye', title: 'Say hello and goodbye', level: 'foundation',
      outcome: 'Greet a neighbour or shop worker and choose a friendly phrase when leaving.',
      words: [
        ['bonjour', 'bonjour', 'hello / good morning / good afternoon', 'Bonjour, madame !', 'Hello, madam!', 'A neutral daytime greeting when you arrive, including in the afternoon.'],
        ['bonsoir', 'bonsoir', 'good evening', 'Bonsoir, monsieur !', 'Good evening, sir!', 'A neutral greeting on arrival in the evening. There is no single fixed switch time for everyone.'],
        ['salut', 'salut', 'hi / bye', 'Salut, Léa !', 'Hi, Léa!', 'Informal: use with friends or people you already greet familiarly. It can open or close an exchange.'],
        ['au-revoir', 'au revoir', 'goodbye', 'Au revoir, madame !', 'Goodbye, madam!', 'A neutral phrase when leaving; suitable with strangers and people you know.'],
        ['a-bientot', 'à bientôt', 'see you soon', 'Au revoir, à bientôt !', 'Goodbye, see you soon!', 'A friendly goodbye when you expect or hope to meet again soon; no exact date is specified.'],
        ['a-demain', 'à demain', 'see you tomorrow', 'À demain, Léa !', 'See you tomorrow, Léa!', 'Use when you expect to see the person the next day.'],
        ['bonne-journee', 'bonne journée', 'have a good day', 'Merci, bonne journée !', 'Thank you, have a good day!', 'A wish when leaving during the day. La journée (feminine) means the day as a period of time.'],
        ['bonne-soiree', 'bonne soirée', 'have a good evening', 'Au revoir et bonne soirée !', 'Goodbye and have a good evening!', 'A wish when leaving for the evening. La soirée (feminine) means the evening as a period of time.'],
      ],
      dialogue: [
        { role: 'Neighbour', target: 'Bonjour !', meaning: 'Hello!' },
        { role: 'Newcomer', target: 'Bonjour !', meaning: 'Hello!' },
        { role: 'Neighbour', target: 'On se voit demain ?', meaning: 'Shall we see each other tomorrow?' },
        { role: 'Newcomer', target: 'Oui, à demain !', meaning: 'Yes, see you tomorrow!' },
        { role: 'Neighbour', target: 'Au revoir et bonne journée !', meaning: 'Goodbye and have a good day!' },
        { role: 'Newcomer', target: 'Merci, bonne journée !', meaning: 'Thank you, have a good day!' },
      ],
      grammar: {
        title: 'Arriving and leaving',
        explanation: 'Bonjour is a daytime greeting, including good afternoon as well as hello and good morning. Bonsoir greets someone in the evening; the choice depends on the situation, with no rigid clock-time switch. When leaving, use au revoir, bonne journée (have a good day) or bonne soirée (have a good evening). Bonne journée and bonne soirée are wishes, not arrival greetings. Salut can mean hi or bye with people you know well. Learn these short formulas as whole phrases; you do not need their full grammar yet.',
      },
      sentence: {
        tokens: ['bonne journée', 'Au revoir', 'et'], answer: 'Au revoir et bonne journée !',
        alternatives: ['Bonne journée et au revoir !'], meaning: 'Goodbye and have a good day!',
        hint: 'Start with Au revoir, then join the good wish with et (and).',
        explanation: 'Au revoir closes the exchange; bonne journée wishes the person a good day. The reverse order is also possible. Keep the accent in journée.',
      },
    },
    {
      slug: 'politeness', title: 'Be polite in everyday exchanges', level: 'foundation',
      outcome: 'Ask politely, thank someone, respond to thanks and choose a familiar or polite form.',
      words: [
        ['sil-vous-plait', 's’il vous plaît', 'please', 'Un instant, s’il vous plaît.', 'One moment, please.', 'Use with an unfamiliar adult, service worker or more than one person.'],
        ['sil-te-plait', 's’il te plaît', 'please', 'Un instant, s’il te plaît.', 'One moment, please.', 'Use with one person you already address as tu. Un instant (masculine) means one moment.'],
        ['merci', 'merci', 'thank you', 'Merci pour votre aide.', 'Thank you for your help.', 'Neutral thanks; suitable with strangers and friends.'],
        ['merci-beaucoup', 'merci beaucoup', 'thank you very much', 'Merci beaucoup, c’est gentil !', 'Thank you very much, that’s kind!', 'Stronger thanks; suitable in polite and familiar exchanges.'],
        ['de-rien', 'de rien', 'you’re welcome', 'De rien, à bientôt !', 'You’re welcome, see you soon!', 'A common everyday response to thanks.'],
        ['pardon', 'pardon', 'sorry / pardon?', 'Pardon, je n’ai pas entendu.', 'Sorry, I didn’t hear.', 'Use for a small apology. Said as Pardon ? with a questioning voice, it can ask someone to repeat.'],
        ['excusez-moi', 'excusez-moi', 'excuse me', 'Excusez-moi, je peux passer ?', 'Excuse me, may I get past?', 'Use to get attention or apologise with vous: an unfamiliar adult or several people.'],
        ['excuse-moi', 'excuse-moi', 'excuse me / sorry', 'Excuse-moi, je suis en retard.', 'Sorry, I’m late.', 'The tu form, for one person you already address familiarly. Keep the hyphen in writing.'],
      ],
      dialogue: [
        { role: 'Receptionist', target: 'Bonjour, vous avez le numéro ?', meaning: 'Hello, do you have the number?' },
        { role: 'Newcomer', target: 'Pardon ?', meaning: 'Sorry?' },
        { role: 'Receptionist', target: 'Le numéro, s’il vous plaît.', meaning: 'The number, please.' },
        { role: 'Newcomer', target: 'Un instant, s’il vous plaît. Voilà !', meaning: 'One moment, please. Here it is!' },
        { role: 'Receptionist', target: 'Merci.', meaning: 'Thank you.' },
        { role: 'Newcomer', target: 'De rien.', meaning: 'You’re welcome.' },
      ],
      grammar: {
        title: 'Choose a polite or familiar form',
        explanation: 'Vous is a safe starting point with an adult stranger or service worker; it also addresses several people. Use s’il vous plaît and excusez-moi with vous. With one person you already address as tu, use s’il te plaît and excuse-moi. Both please phrases have the same English meaning; the relationship changes the French form. Merci and de rien work in either register. Pardon ? can request repetition; pardon without a questioning voice can be a small apology. Learn the phrases first; the verb forms can wait.',
      },
      sentence: {
        tokens: ['s’il vous plaît', 'Un instant'], answer: 'Un instant s’il vous plaît.',
        alternatives: ['S’il vous plaît un instant.'], meaning: 'One moment, please.',
        hint: 'Use Un instant for one moment and the vous form of please.',
        explanation: 'Use s’il vous plaît with a receptionist you do not know. It can go before or after un instant. S’il te plaît has the same meaning but belongs with tu. Keep the accent in plaît.',
      },
    },
    {
      slug: 'check-in', title: 'Ask how someone is', level: 'foundation',
      outcome: 'Ask how someone is, give a short answer and return the question.',
      words: [
        ['comment-allez-vous', 'comment allez-vous ?', 'how are you?', 'Bonjour, comment allez-vous ?', 'Hello, how are you?', 'Uses vous: a polite question to one person, or a question to several people. Learn the whole phrase first.'],
        ['comment-ca-va', 'comment ça va ?', 'how are you? / how’s it going?', 'Salut, comment ça va ?', 'Hi, how’s it going?', 'Conversational and often familiar; comment allez-vous ? is a useful polite starting point with strangers.'],
        ['ca-va-bien', 'ça va bien', 'I’m well / things are going well', 'Ça va bien, merci.', 'I’m well, thank you.', 'A short conversational response; learn ça va bien as a whole phrase to answer a check-in.'],
        ['tres-bien-merci', 'très bien, merci', 'very well, thank you', 'Très bien, merci. Et vous ?', 'Very well, thank you. And you?', 'A complete short response; you do not need to add je (I).'],
        ['pas-tres-bien', 'pas très bien', 'not very well', 'Pas très bien, je suis fatiguée.', 'Not very well, I’m tired.', 'An honest short response. Fatiguée is the feminine form of tired; fatigué is masculine.'],
        ['et-vous', 'et vous ?', 'and you?', 'Ça va bien, merci. Et vous ?', 'I’m well, thank you. And you?', 'Return the question with vous to an adult you address politely, or to several people.'],
        ['et-toi', 'et toi ?', 'and you?', 'Très bien, merci. Et toi ?', 'Very well, thank you. And you?', 'Return the question to one person you already address as tu. Toi is the form used after et here.'],
        ['a-tout-a-lheure', 'à tout à l’heure', 'see you later today', 'À tout à l’heure, à midi !', 'See you later, at noon!', 'Use when you expect to meet again later the same day. For tomorrow, use à demain.'],
      ],
      dialogue: [
        { role: 'Neighbour', target: 'Bonjour, comment allez-vous ?', meaning: 'Hello, how are you?' },
        { role: 'Newcomer', target: 'Très bien, merci. Et vous ?', meaning: 'Very well, thank you. And you?' },
        { role: 'Neighbour', target: 'Ça va bien, merci. On se retrouve à midi ?', meaning: 'I’m well, thank you. Shall we meet again at noon?' },
        { role: 'Newcomer', target: 'Oui, à tout à l’heure !', meaning: 'Yes, see you later!' },
      ],
      grammar: {
        title: 'A short answer, then return the question',
        explanation: 'To answer how are you?, you can say ça va bien (I’m well), très bien, merci (very well, thank you) or pas très bien (not very well). These short responses do not need je (I). Return the question with et vous ? in a vous exchange, or et toi ? with one person you address as tu. Comment ça va ? is conversational and often familiar; comment allez-vous ? is a useful polite formula. À tout à l’heure closes an exchange when you expect to meet again later today, while à demain means see you tomorrow.',
      },
      sentence: {
        tokens: ['merci', 'bien', 'Ça', 'va'], answer: 'Ça va bien merci.',
        alternatives: ['Merci ça va bien.'], meaning: 'I’m well, thank you.',
        hint: 'Start Ça va bien, then add your thanks.',
        explanation: 'Ça va bien is a whole response meaning I’m well here. Merci may come first or last. Keep the cedilla in ça.',
      },
    },
  ],
};

const meaningActivities: Readonly<Record<string, Lesson['pictureActivity']>> = {
  'fr.greetings.hello-goodbye': {
    mode: 'meaning', prompt: 'Choose the French greeting for “good evening” when you arrive.',
    entryId: 'fr.greetings.bonsoir', choices: ['fr.bonjour', 'fr.greetings.bonsoir', 'fr.greetings.bonne-soiree'],
  },
  'fr.greetings.politeness': {
    mode: 'meaning', prompt: 'Choose the French for “please” when speaking to an adult stranger.',
    entryId: 'fr.silvousplait', choices: ['fr.essentials.welcome-response', 'fr.silvousplait', 'fr.essentials.thank-you'],
  },
  'fr.greetings.check-in': {
    mode: 'meaning', prompt: 'Choose the polite question “how are you?” with vous.',
    entryId: 'fr.greetings.comment-allez-vous', choices: ['fr.greetings.ca-va-bien', 'fr.greetings.comment-allez-vous', 'fr.greetings.pas-tres-bien'],
  },
};

const accentFeedback: Readonly<Record<string, string[]>> = {
  'fr.greetings.hello-goodbye': ['Au revoir et bonne journee', 'Bonne journee et au revoir'],
  'fr.greetings.politeness': ['Un instant s’il vous plait', 'S’il vous plait un instant'],
  'fr.greetings.check-in': ['Ca va bien merci', 'Merci ca va bien'],
};

function normalizedTarget(target: string): string {
  return target.normalize('NFC').replace(/[’‘]/g, "'");
}

/** Reuse existing senses exactly, without changing the lessons that teach them. */
export function buildGreetingsLessons(existingVocabulary: readonly Vocabulary[]): Lesson[] {
  const canonical = new Map(existingVocabulary.map(entry => [entry.id, entry]));
  return buildTopic(greetings).map(lesson => {
    const vocabulary = lesson.vocabulary.map(entry => {
      const sharedId = sharedIds[entry.id];
      if (!sharedId) return entry;
      const existing = canonical.get(sharedId);
      if (!existing) throw new Error(`Missing greetings shared vocabulary: ${sharedId}`);
      if (normalizedTarget(existing.target) !== normalizedTarget(entry.target)) {
        throw new Error(`Greetings shared vocabulary target changed: ${sharedId}`);
      }
      return existing;
    });
    const result = lessonSchema.parse({
      ...lesson, vocabulary, pictureActivity: meaningActivities[lesson.id],
      sentenceActivity: { ...lesson.sentenceActivity, almostAnswers: accentFeedback[lesson.id] },
      provenance: {
        author: 'Original SmartLingo AI-assisted greetings drafts, 2026-11-16',
        rights: 'Original French/English examples, dialogue and activities; exact existing SmartLingo shared vocabulary reused. Selection and research context: docs/audits/greeting-first-proposal.json and docs/CURRICULUM_TOPIC_AUDIT.md. No third-party course text, photographs or audio added. Existing bundled illustration rights: docs/MEDIA_SOURCES.md.',
        review: 'Draft for owner review: French, English, register, estimated foundation level, accepted answers and media suitability. No native-speaker review, certified CEFR coverage or audio review claimed.',
      },
    });
    // Preserve the canonical input payloads themselves after schema validation.
    return { ...result, vocabulary };
  });
}
