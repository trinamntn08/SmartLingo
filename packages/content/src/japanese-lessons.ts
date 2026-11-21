import { lessonSchema, type Lesson } from '@smartlingo/domain';
import { japaneseCourse } from './japanese-course';
import { buildJapaneseExpansion } from './japanese-expansion';
import { foundationsExpansions } from './japanese-vocabulary/foundations';
import { routinesExpansions } from './japanese-vocabulary/routines';
import { discussionExpansions } from './japanese-vocabulary/discussion';

type SentenceDraft = Omit<Lesson['sentenceActivity'], 'id' | 'almostAnswers'>;

const spacingNote = ' Spaces separate teaching chunks in this activity; ordinary Japanese generally has no word spaces.';

// Explicit, original assembly activities reuse expressions already taught in each day.
// Answers preserve the shared sentence widget's tokens.join(' ') spacing.
const sentenceDrafts: Record<number, SentenceDraft> = {
  1: {
    prompt: 'Ask politely: “One more time, slowly, please.”',
    tokens: ['お願いします。', 'もう一度、', 'ゆっくり'],
    answers: ['もう一度、 ゆっくり お願いします。', 'ゆっくり もう一度、 お願いします。'],
    hint: 'もう一度 means one more time; ゆっくり means slowly. Finish with お願いします。',
    explanation: 'もう一度 and ゆっくり can come in either order before the polite request formula お願いします.' + spacingNote,
  },
  2: {
    prompt: 'Say where you came from: “I came from France.”',
    tokens: ['来ました。', 'フランス', 'から'],
    answers: ['フランス から 来ました。'],
    hint: 'Put から after the place of origin, then use the polite past 来ました。',
    explanation: 'フランスから gives the origin. 来ました is the polite past of come; the speaker can be left unstated in this introduction.' + spacingNote,
  },
  3: {
    prompt: 'Order politely: “Two pieces of bread, please.”',
    tokens: ['ください。', '二つ', 'パンを'],
    answers: ['パンを 二つ ください。', '二つ パンを ください。'],
    hint: 'パンを names the requested item and 二つ gives the quantity. Finish with ください。',
    explanation: 'パンを二つください requests two bread items. The quantity 二つ can also precede パンを; both supplied orders keep the same request.' + spacingNote,
  },
  4: {
    prompt: 'Ask: “Where is the station?”',
    tokens: ['どこ', '駅は', 'ですか。'],
    answers: ['駅は どこ ですか。'],
    hint: 'Start with the topic 駅は, then use where: どこ. End with the polite question ですか。',
    explanation: '駅は sets the station as the topic; どこですか asks where it is. は is pronounced wa as the topic particle.' + spacingNote,
  },
  5: {
    prompt: 'Describe your routine: “I eat breakfast at home.”',
    tokens: ['食べます。', '家で', '朝ご飯を'],
    answers: ['家で 朝ご飯を 食べます。', '朝ご飯を 家で 食べます。'],
    hint: '家で gives the place of the action and 朝ご飯を names what you eat. Keep 食べます last.',
    explanation: 'で marks where eating happens, and を marks breakfast as the object. The place and object chunks can change order here without changing the basic meaning.' + spacingNote,
  },
  6: {
    prompt: 'Ask to see existing photos: “Please show me the photos.”',
    tokens: ['ください。', '写真を', '見せて'],
    answers: ['写真を 見せて ください。'],
    hint: '写真を names the photos; 見せて is the te-form of show. Add ください to make the request.',
    explanation: '見せてください asks someone to show you something. It differs from 撮ってください, which asks them to take a new photo.' + spacingNote,
  },
  7: {
    prompt: 'Ask permission: “May I use a computer here?”',
    tokens: ['使ってもいいですか。', 'パソコンを', 'ここで'],
    answers: ['ここで パソコンを 使ってもいいですか。', 'パソコンを ここで 使ってもいいですか。'],
    hint: 'ここで means here as a place of action; パソコンを is the computer. End with the permission question.',
    explanation: '使ってもいいですか asks whether using it is allowed. The place and object can precede this question in either supplied order.' + spacingNote,
  },
  8: {
    prompt: 'Start with the reason: “The room is cold, so I would like one blanket.”',
    tokens: ['お願いします。', '部屋が寒いので、', '毛布を一枚'],
    answers: ['部屋が寒いので、 毛布を一枚 お願いします。'],
    hint: 'Begin with 部屋が寒いので、 (because the room is cold), then request 毛布を一枚.',
    explanation: 'ので connects the cold room to the request. 毛布を一枚 requests one blanket, using the counter 一枚 for a flat item.' + spacingNote,
  },
  9: {
    prompt: 'Compare prices: “This restaurant is cheaper than that one.”',
    tokens: ['安いです。', 'あの店より', 'この店は'],
    answers: ['この店は あの店より 安いです。', 'あの店より この店は 安いです。'],
    hint: 'この店は names this restaurant as the topic; あの店より means than that restaurant. Put 安いです last.',
    explanation: 'より marks the comparison standard: that restaurant. In either supplied order, the claim is that this restaurant is cheaper.' + spacingNote,
  },
  10: {
    prompt: 'Put the problem before the response: “I got lost. So I asked for directions at a nearby shop.”',
    tokens: ['近くの店で道を聞きました。', '道に迷いました。', 'そこで、'],
    answers: ['道に迷いました。 そこで、 近くの店で道を聞きました。'],
    hint: 'Start with getting lost. そこで introduces the action taken in response, asking at a nearby shop.',
    explanation: 'そこで links the setback to an action that addresses it. The past-tense report keeps the problem and response in a coherent sequence.' + spacingNote,
  },
  11: {
    prompt: 'Give the view, then the contrasting need: “I do not think we need to work in the same place every day, but I think time to consult each other is necessary.”',
    tokens: ['必要だと思います。', 'ないと思いますが、', '毎日同じ場所で働く必要は', '相談する時間は'],
    answers: ['毎日同じ場所で働く必要は ないと思いますが、 相談する時間は 必要だと思います。'],
    hint: 'Pair the first need with ないと思いますが、 (I do not think …, but). Follow it with the need for consultation time.',
    explanation: 'The first clause questions the need for the same workplace every day. が introduces the contrasting need; 必要だと思います uses だ before と with 必要.' + spacingNote,
  },
  12: {
    prompt: 'Pass on the written instruction: “It says to bring a drink.”',
    tokens: ['書いてあります。', '飲み物を', '持ってくるようにと'],
    answers: ['飲み物を 持ってくるようにと 書いてあります。'],
    hint: '飲み物を is what to bring; 持ってくるようにと reports the instruction. Finish with what is written.',
    explanation: 'ようにと書いてあります reports a written instruction. Preserve the notice’s instruction to bring a drink instead of inventing a different requirement.' + spacingNote,
  },
  13: {
    prompt: 'Start with the condition: “If everyone can attend, I will book room A.”',
    tokens: ['予約します。', '全員が参加できれば、', 'A室を'],
    answers: ['全員が参加できれば、 A室を 予約します。'],
    hint: 'First use 全員が参加できれば、 (if everyone can attend), then name room A and the booking action.',
    explanation: 'できれば states the remaining condition; 予約します is the planned action once it is met. This does not claim that the room has already been booked.' + spacingNote,
  },
};

/** Shared Lesson views; the source daily course and its progress scopes stay unchanged. */
const originalJapaneseLessons: Lesson[] = japaneseCourse.days.map(day => {
  const study = day.blocks.find(block => block.kind === 'study');
  const dialogue = day.blocks.find(block => block.kind === 'dialogue');
  const sentence = sentenceDrafts[day.dayNumber];
  if (!study || !dialogue || !sentence) throw new Error(`Missing shared Japanese lesson material for ${day.id}`);
  const entry = day.vocabulary[0];
  if (!entry) throw new Error(`Missing Japanese vocabulary for ${day.id}`);

  return lessonSchema.parse({
    id: `ja.lesson.day-${day.dayNumber}`, revision: 1, status: 'draft',
    language: 'ja-JP', explanationLanguage: 'en',
    title: day.title, subtitle: day.title, topic: day.title,
    outcome: day.outcome, level: day.level, durationMinutes: 10,
    role: [...new Set(dialogue.lines.map(line => line.role))].join(' / '),
    vocabulary: day.vocabulary,
    dialogue: dialogue.lines,
    grammar: { title: study.title, explanation: study.explanation },
    pictureActivity: {
      mode: 'meaning', prompt: `Choose the Japanese expression meaning: ${entry.meaning}`,
      entryId: entry.id, choices: day.vocabulary.slice(0, 3).map(word => word.id),
    },
    sentenceActivity: { id: `ja.lesson.day-${day.dayNumber}.sentence`, ...sentence, almostAnswers: [] },
    provenance: {
      author: 'SmartLingo — original AI-assisted shared Japanese lesson adaptation and sentence activities, 2026-11-21; teaching material from the original 2026-11-19 Japanese draft.',
      rights: 'Reuses SmartLingo’s original Japanese course vocabulary, kana readings, dialogue and study explanations unchanged. Sentence assembly activities and adapter are original project work. No third-party text or media imported.',
      review: 'Draft requiring owner and qualified Japanese/native-speaker review of naturalness, readings, translations, register, sentence alternatives and level estimates before publication. Completion records activity only; no complete CEFR coverage, proficiency or JLPT equivalence is claimed.',
    },
  });
});

const expansions = [...foundationsExpansions, ...routinesExpansions, ...discussionExpansions];
const byDay = new Map(expansions.map(topic => [topic.dayNumber, topic]));
if (expansions.length !== japaneseCourse.days.length || byDay.size !== expansions.length) {
  throw new Error('Each Japanese topic needs one complete vocabulary expansion.');
}

export const japaneseLessons: Lesson[] = originalJapaneseLessons.flatMap((lesson, index) => {
  const day = japaneseCourse.days[index];
  const expansion = byDay.get(day.dayNumber);
  if (!expansion) throw new Error(`Missing Japanese vocabulary expansion for day ${day.dayNumber}`);
  return [lesson, ...buildJapaneseExpansion(day, expansion)];
});
