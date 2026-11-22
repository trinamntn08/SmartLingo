import { openCourseSchema, type CourseDay, type OpenCourse, type Vocabulary } from '@smartlingo/domain';
import { withCompactCourseCopy } from './open-course-compact-copy';
import { buildOpenCourseDayTwo } from './open-course-day-two';
import { buildOpenCourseOpeningDays } from './open-course-opening-days';

const vocabularyIds = [
  'fr.bonjour', 'fr.greetings.bonsoir', 'fr.greetings.salut', 'fr.people.au-revoir',
  'fr.greetings.bonne-journee', 'fr.greetings.comment-allez-vous',
  'fr.greetings.ca-va-bien', 'fr.greetings.et-vous',
] as const;

/** First five French guided lessons, drafted for owner review. */
export function buildOpenCoursePilot(canonicalVocabulary: readonly Vocabulary[]): OpenCourse {
  const vocabulary = vocabularyIds.map(id => {
    const entry = canonicalVocabulary.find(word => word.id === id);
    if (!entry) throw new Error(`Missing open-course canonical vocabulary: ${id}`);
    return entry;
  });
  const firstDayId = 'fr.open-course-pilot.day-1';
  const followingDays = [buildOpenCourseDayTwo(canonicalVocabulary), ...buildOpenCourseOpeningDays(canonicalVocabulary)];
  return openCourseSchema.parse({
    id: 'fr.open-course-pilot', revision: 5, status: 'draft',
    language: 'fr-FR', explanationLanguage: 'en',
    title: 'French A1: First steps in France',
    description: 'Five draft lessons for your first conversations in France.',
    provenance: {
      author: 'SmartLingo, with AI-assisted lesson drafting.',
      rights: 'Original SmartLingo lesson text, dialogues and practice, with existing SmartLingo vocabulary support.',
      review: 'Draft for owner and French-language review.',
    },
    sources: [],
    units: [{
      id: 'fr.open-course-pilot.unit-1', title: 'Your first conversations in France',
      outcome: 'Greet someone, introduce yourself, spell a name, ask for repetition and confirm a time.',
      dayIds: [firstDayId, ...followingDays.map(day => day.id)],
    }],
    days: ([{
      id: firstDayId, dayNumber: 1, progressRevision: 5,
      title: 'Meet a neighbour', level: 'foundation',
      outcome: 'Greet an adult neighbour in your building, ask how they are, give a short answer and leave politely.',
      vocabulary,
      blocks: [
        {
          id: 'fr.open-course-pilot.day-1.study', kind: 'study', title: 'A few words in the hallway',
          explanation: 'You meet a neighbour by the mailboxes. Open with bonjour. If you have time to stop, add comment allez-vous ? A short reply is enough: ça va bien, merci. Add et vous ? to ask the same question back. When you head upstairs, close with au revoir or wish your neighbour a good day with bonne journée.',
          examples: [
            { target: 'Bonjour, madame. Comment allez-vous ?', meaning: 'Hello, ma’am. How are you?' },
            { target: 'Très bien, merci. Et vous ?', meaning: 'Very well, thank you. And you?' },
            { target: 'Merci, bonne journée à vous aussi !', meaning: 'Thanks, have a good day too!' },
          ],
        },
        { id: 'fr.open-course-pilot.day-1.vocabulary', kind: 'vocabulary', title: 'Eight useful phrases' },
        {
          id: 'fr.open-course-pilot.day-1.dialogue', kind: 'dialogue', title: 'A short exchange in your building',
          explanation: 'Original SmartLingo dialogue, draft for owner review. It is daytime and you do not know this adult neighbour well. Use vous. Read both roles with the English support. Optional device speech is a study aid; there is no source recording or listening assessment.',
          lines: [
            { role: 'Newcomer', target: 'Bonjour ! Comment allez-vous ?', meaning: 'Hello! How are you?' },
            { role: 'Neighbour', target: 'Ça va bien, merci. Et vous ?', meaning: 'I’m well, thank you. And you?' },
            { role: 'Newcomer', target: 'Ça va bien, merci.', meaning: 'I’m well, thank you.' },
            { role: 'Neighbour', target: 'Au revoir, bonne journée !', meaning: 'Goodbye, have a good day!' },
            { role: 'Newcomer', target: 'Bonne journée ! Au revoir !', meaning: 'Have a good day! Goodbye!' },
          ],
        },
        {
          id: 'fr.open-course-pilot.day-1.arrival', kind: 'choice', title: 'Choose an arrival greeting',
          prompt: 'It is daytime. You meet an adult neighbour you do not know well. Which phrase greets them on arrival?',
          choices: [
            { id: 'bonjour', target: 'Bonjour !', meaning: 'Hello!' },
            { id: 'au-revoir', target: 'Au revoir !', meaning: 'Goodbye!' },
            { id: 'bonne-journee', target: 'Bonne journée !', meaning: 'Have a good day!' },
          ],
          answerId: 'bonjour',
          feedback: 'Bonjour greets someone during the day. Au revoir and bonne journée close an exchange; bonne journée is a wish for the rest of the day.',
          hint: 'You are arriving. Choose hello, rather than a goodbye or a departing wish.',
        },
        {
          id: 'fr.open-course-pilot.day-1.check-in', kind: 'choice', title: 'Keep a polite exchange',
          prompt: 'Your neighbour asks how you are and uses vous. You have answered. Which short phrase returns the question with the same polite form?',
          choices: [
            { id: 'et-vous', target: 'Et vous ?', meaning: 'And you? (vous)' },
            { id: 'et-toi', target: 'Et toi ?', meaning: 'And you? (familiar singular)' },
            { id: 'ca-va-bien', target: 'Ça va bien.', meaning: 'I’m well.' },
          ],
          answerId: 'et-vous',
          feedback: 'Et vous ? returns the question with vous. Et toi ? is correct French with someone you address as tu, but changes the form here. Ça va bien answers the question without returning it.',
          hint: 'Keep the vous form your neighbour used. Et means and.',
        },
        {
          id: 'fr.open-course-pilot.day-1.departure', kind: 'choice', title: 'Leave politely',
          prompt: 'You finish the daytime conversation and leave. Which response says goodbye and wishes your neighbour a good day?',
          choices: [
            { id: 'goodbye-wish', target: 'Au revoir, bonne journée !', meaning: 'Goodbye, have a good day!' },
            { id: 'evening-arrival', target: 'Bonsoir !', meaning: 'Good evening!' },
            { id: 'question', target: 'Comment allez-vous ?', meaning: 'How are you?' },
          ],
          answerId: 'goodbye-wish',
          feedback: 'Au revoir, bonne journée ! closes the conversation with a daytime wish. Bonne journée, au revoir ! is also natural. Bonsoir greets someone in the evening; comment allez-vous ? asks how they are.',
          hint: 'Combine goodbye with have a good day. La journée is feminine, so use bonne.',
        },
        {
          id: 'fr.open-course-pilot.day-1.reflection', kind: 'reflection', title: 'Try your own short exchange',
          prompt: 'Say or type a daytime greeting, a polite how-are-you question, a short answer and a goodbye. You may imagine both roles. Use the model if helpful, then review your attempt. Speaking is optional; this is self-review, not an automatic language or pronunciation score.',
          modelTarget: 'Bonjour ! Comment allez-vous ? — Ça va bien, merci. Et vous ? — Ça va bien, merci. — Au revoir, bonne journée !',
          modelMeaning: 'Hello! How are you? — I’m well, thank you. And you? — I’m well, thank you. — Goodbye, have a good day!',
          checklist: [
            'I used bonjour for a daytime arrival.',
            'I used comment allez-vous ? and et vous ? for this polite exchange.',
            'I gave a short answer: ça va bien, merci. Très bien, merci (very well, thank you) is also possible.',
            'I closed with au revoir, bonne journée, or both; either order works.',
            'I checked the cedilla in ça and the accent in journée if writing. Missing accents are useful corrections, not a pronunciation score.',
            'I noticed whether I used the model or English support. Completing this day records practice, not proficiency.',
          ],
        },
      ],
    }, ...followingDays] satisfies CourseDay[]).map(withCompactCourseCopy),
  });
}
