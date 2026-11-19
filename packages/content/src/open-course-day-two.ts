import type { CourseDay, Vocabulary } from '@smartlingo/domain';

const vocabularyIds = [
  'fr.bonjour', 'fr.people.s-appeler', 'fr.people.prenom', 'fr.people.nom-de-famille',
  'fr.people.enchante', 'fr.greetings.et-vous', 'fr.people.au-revoir', 'fr.greetings.bonne-journee',
] as const;

/** Original AI-assisted teaching draft; owner review is required before publication. */
export function buildOpenCourseDayTwo(canonicalVocabulary: readonly Vocabulary[]): CourseDay {
  const vocabulary = vocabularyIds.map(id => {
    const entry = canonicalVocabulary.find(word => word.id === id);
    if (!entry) throw new Error(`Missing open-course canonical vocabulary: ${id}`);
    return entry;
  });
  return {
    id: 'fr.open-course-pilot.day-2', dayNumber: 2, progressRevision: 2,
    title: 'Introduce yourself', level: 'A1',
    outcome: 'Give your name, ask another adult their name politely and close a first meeting.',
    vocabulary,
    blocks: [
      {
        id: 'fr.open-course-pilot.day-2.study', kind: 'study', title: 'Say your name and ask theirs',
        explanation: 'Original SmartLingo draft for owner review. You meet another adult at a neighbourhood activity. Start with bonjour and use vous until you agree to use tu. Je m’appelle gives your name: learn it as a useful phrase. Comment vous appelez-vous ? asks the other person’s name politely. After giving your own name, et vous ? can return that question too. Un prénom (masculine) is a first name; un nom de famille (masculine) is a family name. In a casual first meeting, a first name is usually enough; you may choose a fictional name for practice. Enchanté means pleased to meet you. In writing, use enchantée for a feminine speaker; both sound the same. Optional grammar: s’appeler is the dictionary form; je m’appelle and vous vous appelez change with the person. Keep m’ attached to appelle. You can use these formulas before learning all the verb forms.',
        examples: [
          { target: 'Bonjour, je m’appelle Sam.', meaning: 'Hello, my name is Sam.' },
          { target: 'Comment vous appelez-vous ?', meaning: 'What is your name? (polite vous)' },
          { target: 'Je m’appelle Sam. Et vous ?', meaning: 'My name is Sam. And you?' },
          { target: 'Mon prénom, c’est Sam. Mon nom de famille, c’est Bernard.', meaning: 'My first name is Sam. My family name is Bernard.' },
          { target: 'Enchantée !', meaning: 'Pleased to meet you! (feminine speaker in writing)' },
        ],
      },
      { id: 'fr.open-course-pilot.day-2.vocabulary', kind: 'vocabulary', title: 'Eight phrases and words for a first meeting' },
      {
        id: 'fr.open-course-pilot.day-2.dialogue', kind: 'dialogue', title: 'Meet someone at a neighbourhood activity',
        explanation: 'Original bilingual dialogue, draft for owner review. Sam is the newcomer and Claire is another participant. They use vous. Claire uses enchantée for herself in writing. Read either role; speaking and device speech are optional study aids, without a pronunciation score.',
        lines: [
          { role: 'Participant', target: 'Bonjour ! Je m’appelle Claire. Et vous ?', meaning: 'Hello! My name is Claire. And you?' },
          { role: 'Newcomer', target: 'Bonjour, je m’appelle Sam.', meaning: 'Hello, my name is Sam.' },
          { role: 'Participant', target: 'Enchantée, Sam !', meaning: 'Pleased to meet you, Sam!' },
          { role: 'Newcomer', target: 'Au revoir, bonne journée !', meaning: 'Goodbye, have a good day!' },
          { role: 'Participant', target: 'Bonne journée !', meaning: 'Have a good day!' },
        ],
      },
      {
        id: 'fr.open-course-pilot.day-2.give-name', kind: 'choice', title: 'Give your name',
        prompt: 'At a first meeting, someone asks Comment vous appelez-vous ? You want to say your name is Sam. Which response does that?',
        choices: [
          { id: 'my-name', target: 'Je m’appelle Sam.', meaning: 'My name is Sam.' },
          { id: 'your-name', target: 'Vous vous appelez Sam.', meaning: 'Your name is Sam.' },
          { id: 'well', target: 'Ça va bien, merci.', meaning: 'I’m well, thank you.' },
        ],
        answerId: 'my-name',
        feedback: 'Je m’appelle Sam gives your own name. Vous vous appelez Sam states the other person’s name. Ça va bien, merci answers how you are. You can also say Moi, c’est Sam (I’m Sam) in a conversational introduction; it is not one of these choices.',
        hint: 'Je means I. Choose the phrase that gives your own name.',
      },
      {
        id: 'fr.open-course-pilot.day-2.ask-name', kind: 'choice', title: 'Ask politely',
        prompt: 'You are speaking to an adult you have just met and are using vous. Which full question asks their name with that same form?',
        choices: [
          { id: 'polite-name', target: 'Comment vous appelez-vous ?', meaning: 'What is your name? (vous)' },
          { id: 'familiar-name', target: 'Comment tu t’appelles ?', meaning: 'What is your name? (familiar singular tu)' },
          { id: 'polite-check-in', target: 'Comment allez-vous ?', meaning: 'How are you? (vous)' },
        ],
        answerId: 'polite-name',
        feedback: 'Comment vous appelez-vous ? asks a name with vous. Vous vous appelez comment ? is also common in speech, and et vous ? works after you give your own name. Comment tu t’appelles ? uses tu; comment allez-vous ? asks how someone is, not their name.',
        hint: 'Keep vous and look for a form of s’appeler, to be called.',
      },
      {
        id: 'fr.open-course-pilot.day-2.first-name', kind: 'choice', title: 'Distinguish first and family names',
        prompt: 'Your practice name is Sam Bernard: Sam is your first name and Bernard is your family name. Someone asks for your prénom. Which response gives it?',
        choices: [
          { id: 'first-name', target: 'Mon prénom, c’est Sam.', meaning: 'My first name is Sam.' },
          { id: 'family-name', target: 'Mon nom de famille, c’est Bernard.', meaning: 'My family name is Bernard.' },
          { id: 'meeting', target: 'Enchanté !', meaning: 'Pleased to meet you!' },
        ],
        answerId: 'first-name',
        feedback: 'Un prénom is a first name, so give Sam here. Un nom de famille is a family name: Bernard in this example. Enchanté or enchantée acknowledges the meeting but does not supply a name. Mon prénom est Sam is another valid way to give the same first name.',
        hint: 'Prénom means first name. The example identifies Sam as the first name.',
      },
      {
        id: 'fr.open-course-pilot.day-2.reflection', kind: 'reflection', title: 'Try a first introduction',
        prompt: 'Optionally say or type a greeting, your name and a polite question asking the other person’s name, then a goodbye. You may use a fictional name and imagine both roles. Use the model or English support if helpful and review your attempt yourself. Speaking is optional; this is not automatic language or pronunciation assessment.',
        modelTarget: 'Bonjour, je m’appelle Sam. Comment vous appelez-vous ? — Je m’appelle Claire. Enchantée ! — Au revoir, bonne journée !',
        modelMeaning: 'Hello, my name is Sam. What is your name? — My name is Claire. Pleased to meet you! — Goodbye, have a good day!',
        checklist: [
          'I greeted the person and gave my name with je m’appelle; conversational moi, c’est followed by my name also works.',
          'I kept vous: comment vous appelez-vous ? or vous vous appelez comment ? Both ask the same thing; et vous ? can return the question after my own name.',
          'I can distinguish un prénom (a first name, masculine) from un nom de famille (a family name, masculine). Giving a family name in my own introduction was optional.',
          'If I wrote pleased to meet you, I chose enchanté or enchantée for the speaker. Missing the accent is a writing correction; adding feminine e does not change the pronunciation.',
          'I closed with au revoir, bonne journée, or both. Either order works.',
          'I noticed any model or English support I used. Completing this practice does not establish proficiency.',
        ],
      },
    ],
  };
}
