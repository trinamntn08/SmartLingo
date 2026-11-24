import { frenchCourseLessonsByDay } from '@smartlingo/content';
import type { CourseDay, Lesson, TargetLanguage, Vocabulary } from '@smartlingo/domain';
import type { ListeningQuestion } from './comprehension';

interface SpokenLine {
  target: string;
  meaning: string;
  reading?: string;
}

interface ListeningDraft {
  lessonRevision?: number;
  target: string;
  meaning: string;
  prompt: string;
  answer: string;
  alternatives: readonly [string, string];
}

// Select a turn carrying the room, time, route or other detail from the study goal.
const frenchCourseListeningTurns = new Map<string, number>([
  ['fr.workshop-check-in.ask-where-to-go', 3],
  ['fr.workshop-check-in.complete-workshop-check-in', 5],
  ['fr.neighbourhood-wayfinding.find-local-service', 3],
  ['fr.neighbourhood-wayfinding.locate-with-landmark', 2],
  ['fr.appointment-changes.move-appointment', 3],
  ['fr.appointment-changes.explain-constraint', 5],
  ['fr.appointment-changes.offer-another-time', 4],
  ['fr.appointment-changes.check-confirmation', 4],
  ['fr.travel-disruptions.understand-disruption', 1],
  ['fr.travel-disruptions.check-alternative', 5],
  ['fr.travel-disruptions.compare-routes', 2],
  ['fr.travel-disruptions.notify-delay', 1],
]);

function frenchCourseListeningTurn(lesson: Lesson | undefined): Lesson['dialogue'][number] | undefined {
  if (!lesson || lesson.status !== 'draft' || lesson.revision !== 1) return undefined;
  const index = frenchCourseListeningTurns.get(lesson.id);
  return index === undefined ? undefined : lesson.dialogue[index];
}

// Original SmartLingo prompts on existing draft dialogue. A short-lesson
// revision can change the scenario or speaker without changing their words.
const listeningDrafts = new Map<string, ListeningDraft>([
  ['fr.greetings.hello-goodbye', {
    lessonRevision: 1,
    target: 'Au revoir et bonne journée !', meaning: 'Goodbye and have a good day!',
    prompt: 'The neighbours are ending their chat. What does the speaker wish the other person?',
    answer: 'A good day', alternatives: ['A good evening', 'A good weekend'],
  }],
  ['fr.greetings.politeness', {
    lessonRevision: 1,
    target: 'Le numéro, s’il vous plaît.', meaning: 'The number, please.',
    prompt: 'What does the receptionist ask for?',
    answer: 'The number', alternatives: ['The first name', 'The address'],
  }],
  ['fr.essentials.repair', {
    lessonRevision: 1,
    target: 'Vous pouvez répéter plus lentement ?', meaning: 'Can you repeat that more slowly?',
    prompt: 'The learner missed a code. What do they ask the other person to do?',
    answer: 'Repeat it more slowly', alternatives: ['Write it down', 'Say it louder'],
  }],
  ['ja.greetings.hello', {
    lessonRevision: 1,
    target: 'では、また明日。', meaning: 'Well, see you tomorrow.',
    prompt: 'When does the neighbour expect to see Tanaka again?',
    answer: 'Tomorrow', alternatives: ['Later today', 'Next week'],
  }],
  ['ja.cafe.drinks', {
    lessonRevision: 1,
    target: 'コーヒーを一つください。', meaning: 'One coffee, please.',
    prompt: 'What does the customer order?',
    answer: 'One coffee', alternatives: ['Two coffees', 'One tea'],
  }],
  ['fr.open-course-pilot.day-1', {
    target: 'Au revoir, bonne journée !', meaning: 'Goodbye, have a good day!',
    prompt: 'What is your neighbour doing in this line?',
    answer: 'Saying goodbye and wishing you a good day', alternatives: ['Greeting you and asking how you are', 'Saying they’re well and thanking you'],
  }],
  ['fr.open-course-pilot.day-2', {
    target: 'Bonjour ! Je m’appelle Claire. Et vous ?', meaning: 'Hello! My name is Claire. And you?',
    prompt: 'You meet someone at a neighbourhood activity. What name does the speaker give?',
    answer: 'Claire', alternatives: ['Camille', 'Chloé'],
  }],
  ['fr.open-course-pilot.day-3', {
    target: 'Bien sûr. N, O, R, A.', meaning: 'Of course. N, O, R, A.',
    prompt: 'The visitor spells her first name at reception. Which letters do you hear?',
    answer: 'N – O – R – A', alternatives: ['N – O – R – E', 'N – O – L – A'],
  }],
  ['fr.open-course-pilot.day-4', {
    target: 'Je n’ai pas compris. Vous pouvez répéter plus lentement ?', meaning: 'I didn’t understand. Can you repeat that more slowly?',
    prompt: 'What does the visitor ask the workshop host to do?',
    answer: 'Repeat more slowly', alternatives: ['Write the name down', 'Speak louder'],
  }],
  ['fr.open-course-pilot.day-5', {
    target: 'À dix heures.', meaning: 'At ten o’clock.',
    prompt: 'What time does the receptionist say the workshop starts?',
    answer: 'Ten o’clock', alternatives: ['Nine o’clock', 'Eleven o’clock'],
  }],
  ['ja.everyday-course.day-1', {
    target: 'すみません。もう一度、ゆっくりお願いします。', meaning: 'Excuse me. One more time, slowly, please.',
    prompt: 'What does the learner ask for when they miss a name?',
    answer: 'Hear it again, more slowly', alternatives: ['See the name written down', 'Hear it again, more loudly'],
  }],
  ['ja.everyday-course.day-2', {
    target: 'フランスから来ました。今、東京に住んでいます。', meaning: 'I came from France. I live in Tokyo now.',
    prompt: 'Where does the person introducing themself live now?',
    answer: 'Tokyo', alternatives: ['France', 'Kyoto'],
  }],
  ['ja.everyday-course.day-3', {
    target: 'これを二つください。袋はいりません。', meaning: 'Two of these, please. I do not need a bag.',
    prompt: 'What does the shopper say about a bag?',
    answer: 'They don’t need one', alternatives: ['They need one bag', 'They need two bags'],
  }],
  ['ja.everyday-course.day-4', {
    target: '午前九時からです。', meaning: 'It opens at 9 a.m.',
    prompt: 'When does the station information office open?',
    answer: '9 a.m.', alternatives: ['9 p.m.', '10 a.m.'],
  }],
  ['ja.everyday-course.day-5', {
    target: '七時に起きます。家で朝ご飯を食べます。', meaning: 'I get up at seven. I eat breakfast at home.',
    prompt: 'What time does the speaker get up?',
    answer: 'Seven o’clock', alternatives: ['Six o’clock', 'Eight o’clock'],
  }],
  ['ja.everyday-course.day-6', {
    target: '公園に行きました。写真をたくさん撮りました。', meaning: 'I went to the park. I took lots of photos.',
    prompt: 'What did the speaker do at the park?',
    answer: 'Took lots of photos', alternatives: ['Showed someone photos', 'Asked someone for directions'],
  }],
  ['ja.everyday-course.day-7', {
    target: 'はい、大丈夫です。ただ、この部屋は飲食禁止です。', meaning: 'Yes, that is okay. However, eating and drinking are prohibited in this room.',
    prompt: 'The person in charge gives permission, then adds a restriction. What is the restriction?',
    answer: 'No eating or drinking', alternatives: ['No computers', 'No talking'],
  }],
  ['ja.everyday-course.day-8', {
    target: 'ありがとうございます。部屋が寒いので、毛布を一枚お願いできますか。', meaning: 'Thank you. The room is cold, so could I have one blanket?',
    prompt: 'What does the hotel guest ask for because the room is cold?',
    answer: 'One blanket', alternatives: ['An extra towel', 'A different room'],
  }],
  ['ja.everyday-course.day-9', {
    target: 'では、土曜日の十二時に駅で会いましょう。', meaning: 'Then let’s meet at the station at noon on Saturday.',
    prompt: 'When do they agree to meet at the station?',
    answer: 'Saturday at noon', alternatives: ['Sunday at noon', 'Saturday at two'],
  }],
  ['ja.everyday-course.day-10', {
    target: '近くの店で聞きました。店の人がバス停の場所を教えてくれたので、最後のバスに間に合いました。',
    meaning: 'I asked at a nearby shop. A person there told me where the bus stop was, so I made it in time for the last bus.',
    prompt: 'How did asking at the shop help the traveller?',
    answer: 'They found the stop and caught the last bus', alternatives: ['They found a taxi to their accommodation', 'They learned that the last bus had already left'],
  }],
  ['ja.everyday-course.day-11', {
    target: 'その点は私も大切だと思います。会議の日は会社に集まるのはどうですか。',
    meaning: 'I think that point is important too. How about gathering at the office on meeting days?',
    prompt: 'What compromise does the speaker suggest?',
    answer: 'Meet at the office on meeting days', alternatives: ['Hold every meeting online', 'Work in the office every day'],
  }],
  ['ja.everyday-course.day-12', {
    target: 'はい。会場が市民センターの二階に変わりました。申し込みは木曜日の午後六時までです。',
    meaning: 'Yes. The venue has changed to the second floor of the civic centre. Applications are due by 6 p.m. on Thursday.',
    prompt: 'When is the application deadline for the gathering?',
    answer: 'Thursday at 6 p.m.', alternatives: ['Saturday at 6 p.m.', 'Thursday at 6 a.m.'],
  }],
  ['ja.everyday-course.day-13', {
    target: 'いいですね。今日の六時までに全員の都合を確かめます。全員が参加できれば、A室を予約します。',
    meaning: 'Sounds good. I will check everyone’s availability by six today. If everyone can attend, I will book room A.',
    prompt: 'What needs to be confirmed before room A is booked?',
    answer: 'Everyone can attend', alternatives: ['Room B is unavailable', 'The price of room A has changed'],
  }],
]);

export function buildLessonListeningQuestion(lesson: Lesson): ListeningQuestion | undefined {
  return buildQuestion(lesson.id, lesson.language, lesson.dialogue, lesson.vocabulary, lesson.revision, frenchCourseListeningTurn(lesson));
}

export function buildCourseListeningQuestion(day: CourseDay, language: TargetLanguage): ListeningQuestion | undefined {
  const dialogue = day.blocks.flatMap(block => block.kind === 'dialogue' ? block.lines : []);
  return buildQuestion(day.id, language, dialogue, day.vocabulary, undefined,
    frenchCourseListeningTurn(frenchCourseLessonsByDay.get(day.id)));
}

function normalize(text: string): string {
  return text.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]+/gu, '');
}

function speechKey(line: SpokenLine, language: string): string {
  const key = normalize(line.reading ?? line.target);
  return language === 'ja-JP' ? key.replace(/[ァ-ヶ]/g, kana => String.fromCodePoint(kana.charCodeAt(0) - 0x60)) : key;
}

function unambiguousLines(lines: readonly SpokenLine[], language: string): SpokenLine[] {
  const bySpeech = new Map<string, SpokenLine | null>();
  for (const line of lines) {
    const key = speechKey(line, language);
    if (!key || !normalize(line.meaning)) continue;
    const previous = bySpeech.get(key);
    if (previous === undefined) bySpeech.set(key, line);
    else if (previous && normalize(previous.meaning) !== normalize(line.meaning)) bySpeech.set(key, null);
  }
  return [...bySpeech.values()].filter(line => line !== null);
}

function buildQuestion(lessonId: string, language: string, dialogue: readonly SpokenLine[], vocabulary: readonly Vocabulary[],
  lessonRevision?: number, preferred?: SpokenLine): ListeningQuestion | undefined {
  const draft = listeningDrafts.get(lessonId);
  const scripted = draft && draft.lessonRevision === lessonRevision
    ? unambiguousLines(dialogue, language).find(line => line.target === draft.target && line.meaning === draft.meaning)
    : undefined;
  if (draft && scripted) return createQuestion(lessonId, language, scripted, draft.answer, draft.alternatives, draft.prompt);

  const examples = vocabulary.map(word => ({ target: word.example, meaning: word.exampleMeaning, reading: word.exampleReading }));
  const lines = unambiguousLines([...dialogue, ...examples], language);
  const dialogueLines = lines.filter(line => dialogue.includes(line));
  const meaningfulLine = dialogueLines.find(line => normalize(line.meaning).length >= 12);
  const selected = preferred && dialogueLines.find(line => line.target === preferred.target && line.meaning === preferred.meaning);
  const line = selected ?? meaningfulLine ?? dialogueLines[0] ?? lines[0];
  if (!line) return undefined;

  const alternatives = distinctAlternatives(line, lines);
  if (!alternatives.length) return undefined;
  return createQuestion(lessonId, language, line, line.meaning, alternatives);
}

function distinctAlternatives(line: SpokenLine, lines: readonly SpokenLine[]): string[] {
  const alternatives = new Map<string, string>();
  const correct = normalize(line.meaning);
  for (const other of lines) {
    const key = normalize(other.meaning);
    // Avoid overlapping options such as “Hello” and “Hello, Alex”.
    if (key.includes(correct) || correct.includes(key) || alternatives.has(key)) continue;
    alternatives.set(key, other.meaning);
    if (alternatives.size === 2) break;
  }
  return [...alternatives.values()];
}

function createQuestion(lessonId: string, language: string, line: SpokenLine, answer: string,
  alternatives: readonly string[], prompt?: string): ListeningQuestion {
  const choices = [...alternatives];
  const correctIndex = Array.from(lessonId).reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % (choices.length + 1);
  choices.splice(correctIndex, 0, answer);
  return { id: `${lessonId}:listen`, lessonId, language, sentence: line.target, meaning: line.meaning, reading: line.reading, choices, correctIndex, prompt };
}
