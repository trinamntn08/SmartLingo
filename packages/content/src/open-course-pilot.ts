import { openCourseSchema, type CourseDay, type OpenCourse, type Vocabulary } from '@smartlingo/domain';
import { withCompactCourseCopy } from './open-course-compact-copy';
import { buildOpenCourseDayTwo } from './open-course-day-two';
import { buildOpenCourseOpeningDays } from './open-course-opening-days';

const vocabularyIds = [
  'fr.bonjour', 'fr.greetings.bonsoir', 'fr.greetings.salut', 'fr.people.au-revoir',
  'fr.greetings.bonne-journee', 'fr.greetings.comment-allez-vous',
  'fr.greetings.ca-va-bien', 'fr.greetings.et-vous',
] as const;

/** First five owner-review draft days, including the original two pilot days. */
export function buildOpenCoursePilot(canonicalVocabulary: readonly Vocabulary[]): OpenCourse {
  const vocabulary = vocabularyIds.map(id => {
    const entry = canonicalVocabulary.find(word => word.id === id);
    if (!entry) throw new Error(`Missing open-course canonical vocabulary: ${id}`);
    return entry;
  });
  const firstDayId = 'fr.open-course-pilot.day-1';
  const followingDays = [buildOpenCourseDayTwo(canonicalVocabulary), ...buildOpenCourseOpeningDays(canonicalVocabulary)];
  return openCourseSchema.parse({
    id: 'fr.open-course-pilot', revision: 4, status: 'draft',
    language: 'fr-FR', explanationLanguage: 'en',
    title: 'French A1: First steps in France',
    description: 'Five draft study days for your first conversations in France.',
    provenance: {
      author: 'SmartLingo, with AI-assisted lesson drafting.',
      rights: 'Day 1 includes a small greeting-text adaptation credited below. Days 2–5 use original dialogue and practice with existing SmartLingo vocabulary support.',
      review: 'Draft for owner and French-language review.',
    },
    sources: [{
      id: 'fr.open-course-pilot.source-basic-greetings',
      title: 'Basic greetings — Le Français Interactif – An Activity Companion Site',
      creator: 'Mirabelle Tinio; BCcampus',
      sourceUrl: 'https://opentextbc.ca/francaisinteractif/chapter/00-basic-greetings/',
      license: 'CC-BY-4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      copyrightNotice: '© 2023 Mirabelle Tinio. Le Français Interactif – An Activity Companion Site, CC BY 4.0, except where otherwise noted. No author or publisher endorsement of SmartLingo is implied.',
      retrievedOn: '2026-11-17',
      changes: 'Selected and reordered visible greeting text; expanded English meanings and register guidance; omitted the name question. SmartLingo added the polite check-in, original bilingual dialogue, situational choices, feedback and reflection. CC BY 4.0 applies to the identified source material; original SmartLingo additions and existing canonical vocabulary support are separately identified, without a new licence grant over them.',
      scope: 'Only a small visible HTML greeting resource is adapted in the study block. Not the whole book, UT textbook, embedded H5P or source recordings. Eight exact existing canonical SmartLingo vocabulary payloads are reused, not attributed to this source. Full record: docs/curriculum/open-course-pilot-sources.md.',
      excludedAssets: [
        'Tyler Nix / Unsplash chapter photograph and all other source images.',
        'Audio player, recordings, pronunciation activity and microphone instructions.',
        'Embedded H5P activities, scripts, grading logic and answer keys.',
        'External UT Salutations and Présentations pages and their media.',
        'Name question, other chapters, cover, navigation and tracking scripts.',
      ],
    }],
    units: [{
      id: 'fr.open-course-pilot.unit-1', title: 'Your first conversations in France',
      outcome: 'Greet someone, introduce yourself, spell a name, ask for repetition and confirm a time.',
      dayIds: [firstDayId, ...followingDays.map(day => day.id)],
    }],
    days: ([{
      id: firstDayId, dayNumber: 1, progressRevision: 1,
      title: 'Meet a neighbour', level: 'foundation',
      outcome: 'Greet an adult neighbour in your building, ask how they are, give a short answer and leave politely.',
      vocabulary,
      blocks: [
        {
          id: 'fr.open-course-pilot.day-1.study', kind: 'study', title: 'Arrive, check in and leave',
          explanation: 'Draft study material. Adapted greeting text from Mirabelle Tinio’s Basic greetings (© 2023, CC BY 4.0); expanded English and register guidance by SmartLingo. Bonjour is a daytime arrival greeting, including the afternoon. Bonsoir is an evening arrival greeting; there is no fixed universal switch time. Salut is familiar: use it with people you already greet informally. Comment ça va ? is conversational and often familiar. For an adult neighbour you do not know well, start with comment allez-vous ? and return the question with et vous ? (and you?). Au revoir works when leaving. Bonne journée means have a good day: it is a departing wish. La journée is feminine. Learn the short formulas together; their full grammar is optional.',
          examples: [
            { target: 'Bonjour !', meaning: 'Hello! / Good morning! / Good afternoon!' },
            { target: 'Salut !', meaning: 'Hi! / Bye! (familiar)' },
            { target: 'Bonsoir !', meaning: 'Good evening! (on arrival)' },
            { target: 'Comment ça va ?', meaning: 'How are you? / How’s it going? (conversational)' },
            { target: 'Au revoir !', meaning: 'Goodbye!' },
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
