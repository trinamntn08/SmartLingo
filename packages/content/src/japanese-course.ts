import { openCourseSchema } from '@smartlingo/domain';

// Original AI-assisted draft. Level labels describe selected tasks, not complete coverage.
const bilingual = (target: string, reading: string, meaning: string) => ({ target, reading, meaning });
const line = (role: string, target: string, reading: string, meaning: string) => ({ role, ...bilingual(target, reading, meaning) });
function word(slug: string, target: string, reading: string, meaning: string,
  example: string, exampleReading: string, exampleMeaning: string, note: string) {
  return { id: `ja.${slug}`, target, reading, meaning, example, exampleReading, exampleMeaning, note,
    picture: 'context' as const, pictureAlt: 'Text-supported Japanese expression; no literal picture is supplied.' };
}
type Bilingual = ReturnType<typeof bilingual>;
type ChoiceInput = { title: string; prompt: string; choices: Bilingual[]; answer: number; feedback: string; hint: string };
type DayInput = {
  number: number; title: string; level: 'foundation' | 'A1' | 'A2' | 'B1'; outcome: string;
  vocabulary: ReturnType<typeof word>[];
  study: { title: string; explanation: string; examples: Bilingual[] };
  dialogue: { title: string; explanation: string; lines: ReturnType<typeof line>[] };
  choices: [ChoiceInput, ChoiceInput];
  reflection: { prompt: string; modelTarget: string; modelMeaning: string; checklist: string[] };
};
function day(input: DayInput) {
  const id = `ja.everyday-course.day-${input.number}`;
  return { id, dayNumber: input.number, title: input.title, level: input.level, outcome: input.outcome,
    vocabulary: input.vocabulary,
    blocks: [
      { id: `${id}.study`, kind: 'study' as const, ...input.study },
      { id: `${id}.vocabulary`, kind: 'vocabulary' as const, title: 'Six useful words and phrases' },
      { id: `${id}.dialogue`, kind: 'dialogue' as const, ...input.dialogue },
      ...input.choices.map((choice, index) => ({ id: `${id}.choice-${index + 1}`, kind: 'choice' as const,
        title: choice.title, prompt: choice.prompt,
        choices: choice.choices.map((option, optionIndex) => ({ id: `${id}.choice-${index + 1}.option-${optionIndex + 1}`, ...option })),
        answerId: `${id}.choice-${index + 1}.option-${choice.answer + 1}`, feedback: choice.feedback, hint: choice.hint })),
      { id: `${id}.reflection`, kind: 'reflection' as const, title: 'Use it yourself — manual review', ...input.reflection },
    ],
  };
}

/** Owner-review material: original language examples, no imported course text or media. */
export const japaneseCourse = openCourseSchema.parse({
  id: 'ja.everyday-course', revision: 1, status: 'draft', language: 'ja-JP', explanationLanguage: 'en',
  title: 'Everyday Japanese: foundations to B1 tasks',
  description: 'Thirteen original draft days for English-speaking adults. Start with kana and repair phrases, then practise everyday exchanges and connected B1 tasks. Readings and English support stay visible. Level estimates are for owner review; this short route does not establish complete CEFR coverage, certification, native-speaker review or JLPT equivalence.',
  sources: [],
  provenance: {
    author: 'SmartLingo — original AI-assisted Japanese and English draft, 2026-11-19.',
    rights: 'All lesson text and activities were written for this project. No third-party course passages, translations, pictures or recordings are reproduced. No external media is included; context entries use honest text support.',
    review: 'Draft for owner review. Japanese naturalness, kana, translations, register and level estimates require human review. Not reviewed by a native speaker; not certified CEFR coverage or a JLPT mapping. Japan Foundation public descriptions informed broad planning only, not lesson wording.',
  },
  days: [
    day({
      number: 1, title: 'Read a little and ask for help', level: 'foundation',
      outcome: 'Recognise the three scripts, greet someone politely, and ask them to repeat more slowly.',
      vocabulary: [
        word('greetings.konnichiwa', 'こんにちは', 'こんにちは', 'Hello; good afternoon.', 'こんにちは。', 'こんにちは。', 'Hello.', 'Daytime greeting. The final は is pronounced wa; learn this greeting as a unit.'),
        word('repair.sumimasen', 'すみません', 'すみません', 'Excuse me; sorry.', 'すみません。もう一度お願いします。', 'すみません。もういちどおねがいします。', 'Excuse me. Please say that again.', 'Polite attention-getter and apology; context decides the meaning.'),
        word('repair.mou-ichido', 'もう一度', 'もういちど', 'One more time; again.', 'もう一度お願いします。', 'もういちどおねがいします。', 'Please say that again.', 'Useful repair chunk. 一度 means one time here.'),
        word('repair.yukkuri', 'ゆっくり', 'ゆっくり', 'Slowly; at an unhurried pace.', 'ゆっくりお願いします。', 'ゆっくりおねがいします。', 'Slowly, please.', 'Small っ adds a brief hold before k. It is not a full tsu syllable.'),
        word('politeness.onegaishimasu', 'お願いします', 'おねがいします', 'Please; I would appreciate it.', 'もう一度、ゆっくりお願いします。', 'もういちど、ゆっくりおねがいします。', 'One more time, slowly, please.', 'A polite request formula. It does not replace every English use of please.'),
        word('thanks.arigatou-gozaimasu', 'ありがとうございます', 'ありがとうございます', 'Thank you. (polite)', 'ありがとうございます。分かりました。', 'ありがとうございます。わかりました。', 'Thank you. I understand now.', 'Long vowels matter: とう has a long o sound. The polite formula works with strangers.'),
      ],
      study: { title: 'Scripts, sound and a repair toolkit',
        explanation: 'Japanese uses hiragana (あ), katakana (ア, often in loanwords) and kanji (日) together. Readings below show kana, not Roman letters: あ・い・う・え・お are a, i, u, e, o. Start by tracing and recognising a few shapes; one day cannot teach the full scripts. か is ka; が is ga. Small っ marks a short hold, as in ゆっくり; こう has a long o, different from こ. Spaces are added in some teaching examples only. Ordinary Japanese generally has no word spaces. Written は as a topic particle is pronounced wa, へ as a direction particle e, and を as an object particle o; the kana support preserves these spellings. こんにちは also ends with written は pronounced wa. Use the repair phrases as whole polite chunks before studying their grammar. This route uses text and kana support; Japanese audio is not available.',
        examples: [bilingual('あ・い・う・え・お', 'あ・い・う・え・お', 'The five vowel kana: a, i, u, e, o.'),
          bilingual('コーヒー', 'コーヒー', 'Coffee. Katakana; ー lengthens the preceding vowel.'),
          bilingual('すみません。もう一度、ゆっくりお願いします。', 'すみません。もういちど、ゆっくりおねがいします。', 'Excuse me. One more time, slowly, please.')], },
      dialogue: { title: 'A name you did not catch', explanation: 'An adult visitor asks a receptionist to repeat a name. Both use polite speech. はい means yes here; 分かりました means I understand now.', lines: [
        line('Receptionist', 'こんにちは。田中です。', 'こんにちは。たなかです。', 'Hello. I am Tanaka.'),
        line('Visitor', 'すみません。もう一度、ゆっくりお願いします。', 'すみません。もういちど、ゆっくりおねがいします。', 'Excuse me. One more time, slowly, please.'),
        line('Receptionist', 'はい。た・な・か、です。', 'はい。た・な・か、です。', 'Of course. Ta-na-ka.'),
        line('Visitor', 'ありがとうございます。分かりました。', 'ありがとうございます。わかりました。', 'Thank you. I understand now.'),
      ] },
      choices: [
        { title: 'Repair a fast exchange', prompt: 'A receptionist speaks too quickly. Which request directly asks for a slower repetition?',
          choices: [bilingual('ありがとうございます。', 'ありがとうございます。', 'Thank you.'), bilingual('もう一度、ゆっくりお願いします。', 'もういちど、ゆっくりおねがいします。', 'One more time, slowly, please.'), bilingual('こんにちは。', 'こんにちは。', 'Hello.')], answer: 1,
          feedback: 'もう一度 asks for repetition and ゆっくり asks for a slower pace. ありがとうございます thanks someone; it does not request repetition. こんにちは is an arrival greeting.', hint: 'Combine again with slowly and the polite request formula.' },
        { title: 'Notice the written greeting', prompt: 'You want to copy the standard daytime greeting onto your study card. Which spelling is standard?',
          choices: [bilingual('こんにちわ', 'こんにちわ', 'Nonstandard spelling of the greeting.'), bilingual('ありがとう', 'ありがとう', 'Thanks. (less formal)'), bilingual('こんにちは', 'こんにちは', 'Hello. (standard spelling)')], answer: 2,
          feedback: 'こんにちは ends in written は even though the last sound is wa. こんにちわ reflects the sound but is not the standard spelling. ありがとう expresses thanks and is less formal than ありがとうございます.', hint: 'The greeting has a special final は.' },
      ],
      reflection: { prompt: 'Write or say a polite greeting, ask for one slower repetition, then thank the person. Trace あいうえお and circle one hiragana and one katakana example in this day. Use the model or kana as needed; this is manual review.',
        modelTarget: 'こんにちは。すみません。もう一度、ゆっくりお願いします。ありがとうございます。', modelMeaning: 'Hello. Excuse me. One more time, slowly, please. Thank you.',
        checklist: ['I recognised that hiragana, katakana and kanji can appear together.', 'I used もう一度 for again and ゆっくり for slowly; either order works in this short request.', 'I wrote こんにちは with final は and noticed small っ in ゆっくり.', 'I noted whether I copied, read from support or produced the phrases independently.'] },
    }),
    day({
      number: 2, title: 'Introduce yourself at a class', level: 'A1',
      outcome: 'Give your name, home country and current place of residence in a polite introduction.',
      vocabulary: [
        word('introductions.hajimemashite', 'はじめまして', 'はじめまして', 'Nice to meet you. (first meeting)', 'はじめまして。アレックスです。', 'はじめまして。アレックスです。', 'Nice to meet you. I am Alex.', 'Use at a first introduction, not every time you meet.'),
        word('introductions.watashi', '私', 'わたし', 'I; me.', '私はアレックスです。', 'わたしはアレックスです。', 'I am Alex.', 'Neutral polite first-person form. Often omitted when the speaker is clear.'),
        word('places.furansu', 'フランス', 'フランス', 'France.', 'フランスから来ました。', 'フランスからきました。', 'I came from France.', 'Katakana country name. から marks the starting point or origin.'),
        word('introductions.kimashita', '来ました', 'きました', 'Came. (polite past)', 'イギリスから来ました。', 'イギリスからきました。', 'I came from the UK.', '来る has irregular forms. Learn this introduction chunk before the full past-tense pattern.'),
        word('introductions.sundeimasu', '住んでいます', 'すんでいます', 'Live; am living.', '東京に住んでいます。', 'とうきょうにすんでいます。', 'I live in Tokyo.', 'に marks the place of residence. This form describes an ongoing state.'),
        word('introductions.yoroshiku', 'よろしくお願いします', 'よろしくおねがいします', 'Pleased to meet you; I look forward to getting along with you.', 'はじめまして。よろしくお願いします。', 'はじめまして。よろしくおねがいします。', 'Nice to meet you. I look forward to getting to know you.', 'A relationship-building formula, not literally the same as English nice to meet you. Used beyond first meetings too.'),
      ],
      study: { title: 'Name, origin, now', explanation: 'Build on the polite formulas from day 1. Xです politely identifies X: アレックスです means I am Alex when you introduce yourself. 私は sets the topic I; omit 私は once the speaker is clear. は is pronounced wa as a particle. から means from; に marks where you live with 住んでいます. 来ました is past (came), but the full phrase is a conventional introduction about origin. Japanese does not mark grammatical gender on these nouns. Names are generally followed by さん when addressing another adult; do not attach さん to your own name. Use です／ます with new classmates until a more casual relationship is established.', examples: [
        bilingual('私はアレックスです。フランスから来ました。', 'わたしはアレックスです。フランスからきました。', 'I am Alex. I came from France.'),
        bilingual('今、東京に住んでいます。', 'いま、とうきょうにすんでいます。', 'I live in Tokyo now.'),
      ] },
      dialogue: { title: 'Meet another adult learner', explanation: 'The two classmates give reciprocal introductions. どちら means where in this polite question; 今 means now. You may replace names and locations with your own.', lines: [
        line('Alex', 'はじめまして。アレックスです。', 'はじめまして。アレックスです。', 'Nice to meet you. I am Alex.'),
        line('Mori', '森です。どちらから来ましたか。', 'もりです。どちらからきましたか。', 'I am Mori. Where did you come from?'),
        line('Alex', 'フランスから来ました。今、東京に住んでいます。', 'フランスからきました。いま、とうきょうにすんでいます。', 'I came from France. I live in Tokyo now.'),
        line('Mori', '私も東京に住んでいます。よろしくお願いします。', 'わたしもとうきょうにすんでいます。よろしくおねがいします。', 'I live in Tokyo too. I look forward to getting to know you.'),
        line('Alex', 'よろしくお願いします。', 'よろしくおねがいします。', 'I look forward to getting to know you too.'),
      ] },
      choices: [
        { title: 'Give your origin', prompt: 'You are from France and live in Tokyo. A classmate asks どちらから来ましたか。Which reply answers the origin question?', choices: [bilingual('フランスから来ました。', 'フランスからきました。', 'I came from France.'), bilingual('東京に住んでいます。', 'とうきょうにすんでいます。', 'I live in Tokyo.'), bilingual('森さんです。', 'もりさんです。', 'That is Mr/Ms Mori.')], answer: 0, feedback: 'フランスから来ました answers where you came from. 東京に住んでいます answers where you live now. 森さんです identifies someone called Mori and does not give your origin.', hint: 'Look for from: から.' },
        { title: 'Introduce your own name', prompt: 'Your name is Alex. Which first-meeting introduction is appropriate when speaking about yourself?', choices: [bilingual('はじめまして。アレックスさんです。', 'はじめまして。アレックスさんです。', 'Nice to meet you. [Self-name with さん.]'), bilingual('はじめまして。アレックスです。', 'はじめまして。アレックスです。', 'Nice to meet you. I am Alex.'), bilingual('もう一度お願いします。', 'もういちどおねがいします。', 'Please say that again.')], answer: 1, feedback: 'Use アレックスです for your own name. さん is respectful address for another person and is normally omitted from your own name. もう一度お願いします asks for repetition; it is useful repair but not a self-introduction.', hint: 'Keep the polite です, but leave さん off your own name.' },
      ],
      reflection: { prompt: 'Prepare a four-part introduction: first-meeting greeting, name, origin, and current home. Add a closing formula. You may use imaginary information. Read it aloud if useful.', modelTarget: 'はじめまして。アレックスです。フランスから来ました。今、東京に住んでいます。よろしくお願いします。', modelMeaning: 'Nice to meet you. I am Alex. I came from France. I live in Tokyo now. I look forward to getting to know you.', checklist: ['I used です after my name and did not give myself さん.', 'I distinguished origin with から from current residence with に.', '私 or 私は may be omitted when the speaker is obvious; this is a valid alternative.', 'I used the support I needed and recorded that honestly.'] },
    }),
    day({
      number: 3, title: 'Buy a few things', level: 'A1', outcome: 'Ask a price, request a small quantity and make a bag preference clear.',
      vocabulary: [
        word('shopping.ikura', 'いくら', 'いくら', 'How much? (price)', 'これはいくらですか。', 'これはいくらですか。', 'How much is this?', 'Ask about price with いくらですか; これ means this thing near the speaker.'),
        word('quantity.hitotsu', '一つ', 'ひとつ', 'One thing. (general counter)', 'これを一つください。', 'これをひとつください。', 'One of these, please.', 'General counter; actual products can use more specific counters.'),
        word('quantity.futatsu', '二つ', 'ふたつ', 'Two things. (general counter)', 'パンを二つください。', 'パンをふたつください。', 'Two pieces of bread, please.', 'This is not the ordinary number reading に. Learn the quantity chunk.'),
        word('shopping.kudasai', 'ください', 'ください', 'Please give me; I would like.', '水をください。', 'みずをください。', 'Water, please.', 'Noun + をください requests a thing. Verb requests will use the te-form later.'),
        word('shopping.fukuro', '袋', 'ふくろ', 'Bag.', '袋を一つください。', 'ふくろをひとつください。', 'One bag, please.', 'Neutral noun; a checkout bag may cost extra. No grammatical gender or article.'),
        word('shopping.irimasen', 'いりません', 'いりません', 'Do not need. (polite)', '袋はいりません。', 'ふくろはいりません。', 'I do not need a bag.', 'Negative of いります (need). は makes the bag the topic, often contrasting it with what you do want.'),
      ],
      study: { title: 'A thing, a quantity, a request', explanation: 'Noun + を + quantity + ください is a useful purchase pattern. を is pronounced o. 一つ／二つ are general quantities; some items require counters such as 本 for long objects or 枚 for flat objects, so this day makes no claim to teach all counting. 円 is yen: 三百円 is さんびゃくえん (300 yen), with a sound change. これはいくらですか asks the price of this. はい in a shop often acknowledges a request. Keep polite です／ます and ください with staff; adding すみません gets attention.', examples: [
        bilingual('これはいくらですか。三百円です。', 'これはいくらですか。さんびゃくえんです。', 'How much is this? It is 300 yen.'),
        bilingual('これを二つください。袋はいりません。', 'これをふたつください。ふくろはいりません。', 'Two of these, please. I do not need a bag.'),
      ] },
      dialogue: { title: 'At a small bakery', explanation: 'The customer points to one type of bread. パン is bread; the specific product is clear from pointing. Here 300 yen is the price of one piece and 600 yen is the total for two.', lines: [
        line('Customer', 'すみません。これはいくらですか。', 'すみません。これはいくらですか。', 'Excuse me. How much is this?'),
        line('Staff', '一つ三百円です。', 'ひとつさんびゃくえんです。', 'It is 300 yen for one.'),
        line('Customer', 'これを二つください。袋はいりません。', 'これをふたつください。ふくろはいりません。', 'Two of these, please. I do not need a bag.'),
        line('Staff', 'はい。六百円です。', 'はい。ろっぴゃくえんです。', 'Certainly. That is 600 yen.'),
        line('Customer', 'ありがとうございます。', 'ありがとうございます。', 'Thank you.'),
      ] },
      choices: [
        { title: 'Request two', prompt: 'You point to some bread and want two pieces. Which request gives that quantity?', choices: [bilingual('パンを一つください。', 'パンをひとつください。', 'One piece of bread, please.'), bilingual('パンはいりません。', 'パンはいりません。', 'I do not need bread.'), bilingual('パンを二つください。', 'パンをふたつください。', 'Two pieces of bread, please.')], answer: 2, feedback: '二つ is two items. 一つ requests one; it is grammatical but changes the quantity. いりません declines the bread rather than requesting it.', hint: 'The general counter for two is ふたつ.' },
        { title: 'Decline the bag', prompt: 'You have your own bag. Which response clearly declines a checkout bag?', choices: [bilingual('袋はいりません。', 'ふくろはいりません。', 'I do not need a bag.'), bilingual('袋を一つください。', 'ふくろをひとつください。', 'One bag, please.'), bilingual('袋はいくらですか。', 'ふくろはいくらですか。', 'How much is a bag?')], answer: 0, feedback: '袋はいりません states you do not need a bag. 袋を一つください requests one. 袋はいくらですか asks its price and does not state your preference.', hint: 'Choose the negative need form: いりません.' },
      ],
      reflection: { prompt: 'Imagine buying one or two items. Ask the price, request a quantity and say whether you need a bag. Write both customer and staff lines if useful.', modelTarget: 'これはいくらですか。— 一つ三百円です。— これを二つください。袋はいりません。', modelMeaning: 'How much is this? — It is 300 yen for one. — Two of these, please. I do not need a bag.', checklist: ['I used 一つ or 二つ for the quantity I intended.', 'I used を before the object of ください.', '袋をください is a valid alternative when I want a bag; 袋はいりません declines one.', 'I checked price and quantity separately instead of assuming a number means the total.'] },
    }),
    day({
      number: 4, title: 'Find the station and check the time', level: 'A1', outcome: 'Ask where a place is, follow a short direction and check an opening or meeting time.',
      vocabulary: [
        word('places.eki', '駅', 'えき', 'Train station.', '駅はどこですか。', 'えきはどこですか。', 'Where is the station?', 'は marks the place being asked about; どこ means where.'),
        word('directions.migi', '右', 'みぎ', 'Right. (direction)', '右に曲がってください。', 'みぎにまがってください。', 'Please turn right.', 'Learn the direction phrase as a chunk; te-form requests return on day 6.'),
        word('directions.hidari', '左', 'ひだり', 'Left. (direction)', '駅は左です。', 'えきはひだりです。', 'The station is on the left.', 'Direction, not the verb leave.'),
        word('directions.massugu', 'まっすぐ', 'まっすぐ', 'Straight ahead; straight.', 'まっすぐ行ってください。', 'まっすぐいってください。', 'Please go straight ahead.', 'Notice the small っ. The direction is about the current route.'),
        word('time.nanji', '何時', 'なんじ', 'What time? (clock time)', '何時からですか。', 'なんじからですか。', 'What time does it start?', 'Clock time, not duration. 何時間 asks how many hours.'),
        word('time.kuji', '九時', 'くじ', 'Nine o’clock.', '九時からです。', 'くじからです。', 'It starts at nine.', '九時 is くじ. から marks the starting time.'),
      ],
      study: { title: 'Place first, then a useful question', explanation: 'Xはどこですか asks where X is. ここ is here, そこ is there near the listener, and あそこ is over there away from both people. Ask one direction at a time and use day 1 repair phrases. に marks a direction in 右に曲がってください. から marks a starting point in both space and time: 九時から means from nine. まで marks the end: 九時から五時まで (from nine until five). 五時 is ごじ. Context may leave morning/evening unstated; confirm 午前 (ごぜん, a.m.) or 午後 (ごご, p.m.) when it matters.', examples: [
        bilingual('駅はどこですか。まっすぐ行って、右に曲がってください。', 'えきはどこですか。まっすぐいって、みぎにまがってください。', 'Where is the station? Go straight ahead, then turn right, please.'),
        bilingual('案内所は何時からですか。午前九時からです。', 'あんないじょはなんじからですか。ごぜんくじからです。', 'What time does the information office open? It opens at 9 a.m.'),
      ] },
      dialogue: { title: 'Ask near the station', explanation: 'The visitor needs the station information office: 案内所. The passer-by gives one short route and an opening time. 曲がって is turn; 行って is go, both taught as supported chunks here.', lines: [
        line('Visitor', 'すみません。駅はどこですか。', 'すみません。えきはどこですか。', 'Excuse me. Where is the station?'),
        line('Passer-by', 'まっすぐ行って、右に曲がってください。駅は左です。', 'まっすぐいって、みぎにまがってください。えきはひだりです。', 'Go straight ahead and turn right, please. The station is on the left.'),
        line('Visitor', 'ありがとうございます。駅の案内所は何時からですか。', 'ありがとうございます。えきのあんないじょはなんじからですか。', 'Thank you. What time does the station information office open?'),
        line('Passer-by', '午前九時からです。', 'ごぜんくじからです。', 'It opens at 9 a.m.'),
      ] },
      choices: [
        { title: 'Follow the turn', prompt: 'Someone says まっすぐ行って、右に曲がってください。Which confirmation matches the direction?', choices: [bilingual('まっすぐ行って、左ですね。', 'まっすぐいって、ひだりですね。', 'Straight ahead, then left, right?'), bilingual('まっすぐ行って、右ですね。', 'まっすぐいって、みぎですね。', 'Straight ahead, then right, right?'), bilingual('午前九時ですね。', 'ごぜんくじですね。', 'Nine a.m., right?')], answer: 1, feedback: 'The route says straight, then right: 右. 左 changes the turn to left. 午前九時 confirms a time, not a route. ですね here checks shared understanding.', hint: 'Match 右, read みぎ.' },
        { title: 'Check an opening time', prompt: 'You know where the information office is. Now ask what time it opens.', choices: [bilingual('案内所はどこですか。', 'あんないじょはどこですか。', 'Where is the information office?'), bilingual('案内所はいくらですか。', 'あんないじょはいくらですか。', 'How much is the information office?'), bilingual('案内所は何時からですか。', 'あんないじょはなんじからですか。', 'What time does the information office open?')], answer: 2, feedback: '何時から asks for a starting time, which means opening time in this context. どこ asks location, already known. いくら asks price and does not ask a time.', hint: 'Use what time plus from.' },
      ],
      reflection: { prompt: 'Write a three-step route using straight, right and left. Then ask a place’s opening time and give a time with a.m. or p.m. You may draw arrows on paper; this is self-review.', modelTarget: 'まっすぐ行って、右に曲がってください。駅は左です。案内所は何時からですか。— 午前九時からです。', modelMeaning: 'Go straight ahead and turn right, please. The station is on the left. What time does the information office open? — It opens at 9 a.m.', checklist: ['I distinguished 右 and 左.', 'I asked a location with どこ and a clock time with 何時.', 'I used 午前 or 午後 when a morning/evening ambiguity mattered.', 'Alternative routes are valid if my arrows and words agree; no automatic route grading occurs.'] },
    }),
    day({
      number: 5, title: 'Describe an ordinary day', level: 'A1', outcome: 'Describe a simple routine and contrast what you do with what you do not do.',
      vocabulary: [
        word('routine.maiasa', '毎朝', 'まいあさ', 'Every morning.', '毎朝、七時に起きます。', 'まいあさ、しちじにおきます。', 'I get up at seven every morning.', 'A repeated-time expression; it usually takes no に itself.'),
        word('routine.okimasu', '起きます', 'おきます', 'Get up; wake up. (polite)', '六時に起きます。', 'ろくじにおきます。', 'I get up at six.', 'Here it describes a routine. ます can also describe a future action in context.'),
        word('routine.asagohan', '朝ご飯', 'あさごはん', 'Breakfast.', '朝ご飯を食べます。', 'あさごはんをたべます。', 'I eat breakfast.', 'ご飯 can mean cooked rice or a meal; 朝ご飯 is breakfast.'),
        word('routine.tabemasu', '食べます', 'たべます', 'Eat. (polite)', '家でパンを食べます。', 'いえでパンをたべます。', 'I eat bread at home.', 'で marks where an action happens; compare residence に on day 2.'),
        word('routine.hatarakimasu', '働きます', 'はたらきます', 'Work. (polite)', '月曜日から金曜日まで働きます。', 'げつようびからきんようびまではたらきます。', 'I work from Monday to Friday.', 'A routine can be stated without a first-person subject when clear.'),
        word('frequency.yoku', 'よく', 'よく', 'Often. (frequency)', '週末はよく料理をします。', 'しゅうまつはよくりょうりをします。', 'I often cook at weekends.', 'This sense is often, not the well sense in よくできました.'),
      ],
      study: { title: 'Time, place and polite verbs', explanation: 'Use ます for a polite routine and ません for its negative: 食べます／食べません. Specific clock times usually take に: 七時に (しちじに, at seven). 毎朝 and 今日 (きょう, today) generally do not need に. Place + で marks where an action happens; place + に with 住んでいます marks residence. よく means often. あまり with a negative means not very often/much: あまり食べません. To join nouns use と (and); do not use it to join whole sentences. First establish simple sentences, then compare your weekday and weekend routines.', examples: [
        bilingual('毎朝、七時に起きます。家で朝ご飯を食べます。', 'まいあさ、しちじにおきます。いえであさごはんをたべます。', 'I get up at seven every morning. I eat breakfast at home.'),
        bilingual('コーヒーはよく飲みます。お茶はあまり飲みません。', 'コーヒーはよくのみます。おちゃはあまりのみません。', 'I often drink coffee. I do not drink tea very often.'),
      ] },
      dialogue: { title: 'Compare weekday routines', explanation: 'Two adult classmates speak politely. 週末 is weekend, 料理をします is cook, and そうですか acknowledges new information. An omitted subject is understood from the turn.', lines: [
        line('Mori', '毎朝、何時に起きますか。', 'まいあさ、なんじにおきますか。', 'What time do you get up every morning?'),
        line('Alex', '七時に起きます。家で朝ご飯を食べます。', 'しちじにおきます。いえであさごはんをたべます。', 'I get up at seven. I eat breakfast at home.'),
        line('Mori', '週末も働きますか。', 'しゅうまつもはたらきますか。', 'Do you work at weekends too?'),
        line('Alex', 'いいえ、週末は働きません。よく料理をします。', 'いいえ、しゅうまつははたらきません。よくりょうりをします。', 'No, I do not work at weekends. I often cook.'),
        line('Mori', 'そうですか。私は週末も働きます。', 'そうですか。わたしはしゅうまつもはたらきます。', 'I see. I work at weekends too.'),
      ] },
      choices: [
        { title: 'State your weekend contrast', prompt: 'You work on weekdays but do not work at weekends. Which line states the weekend part?', choices: [bilingual('週末は働きません。', 'しゅうまつははたらきません。', 'I do not work at weekends.'), bilingual('週末も働きます。', 'しゅうまつもはたらきます。', 'I work at weekends too.'), bilingual('毎朝、起きます。', 'まいあさ、おきます。', 'I get up every morning.')], answer: 0, feedback: '働きません is the polite negative. 働きます is positive and も adds too, reversing the intended message. 毎朝、起きます describes getting up, not your work schedule.', hint: 'Look for the negative ending ません.' },
        { title: 'Read a frequency answer', prompt: 'A classmate asks whether you drink tea. You want to say not very often. Which reply fits?', choices: [bilingual('お茶はよく飲みます。', 'おちゃはよくのみます。', 'I often drink tea.'), bilingual('お茶はあまり飲みません。', 'おちゃはあまりのみません。', 'I do not drink tea very often.'), bilingual('お茶を二つください。', 'おちゃをふたつください。', 'Two teas, please.')], answer: 1, feedback: 'あまり with 飲みません expresses not very often/much. よく飲みます means often, which changes the frequency. 二つください is an order, not a description of your routine.', hint: 'あまり pairs with a negative verb.' },
      ],
      reflection: { prompt: 'Write four short sentences about a weekday and a weekend: getting-up time, breakfast place, work, and something you often do. Include one negative. Use invented details if preferred.', modelTarget: '毎朝、七時に起きます。家で朝ご飯を食べます。週末は働きません。よく料理をします。', modelMeaning: 'I get up at seven every morning. I eat breakfast at home. I do not work at weekends. I often cook.', checklist: ['I used に for a clock time and で for the place of eating.', 'I used ます and ません to make my intended positive/negative contrast.', 'I did not need to repeat 私は in every sentence.', '食べません or 飲みません with あまり is a valid way to add a frequency contrast.'] },
    }),
    day({
      number: 6, title: 'Tell what happened and ask for help', level: 'A2', outcome: 'Report a short past experience and make a supported te-form request.',
      vocabulary: [
        word('time.kinou', '昨日', 'きのう', 'Yesterday.', '昨日、公園に行きました。', 'きのう、こうえんにいきました。', 'I went to the park yesterday.', 'An absolute past-time word, usually without に.'),
        word('past.ikimashita', '行きました', 'いきました', 'Went. (polite past)', '昨日、京都に行きました。', 'きのう、きょうとにいきました。', 'I went to Kyoto yesterday.', 'Past of 行きます. Its te-form is the irregular 行って, not 行いて.'),
        word('past.mimashita', '見ました', 'みました', 'Saw; watched. (polite past)', '写真を見ました。', 'しゃしんをみました。', 'I looked at the photos.', '見ます → 見ました (past); 見て (te-form).'),
        word('travel.shashin', '写真', 'しゃしん', 'Photograph; photo.', '公園で写真を撮りました。', 'こうえんでしゃしんをとりました。', 'I took photos in the park.', '撮ります (とります) means take a photo, not the general take verb.'),
        word('requests.totte-kudasai', '撮ってください', 'とってください', 'Please take a photo.', '写真を撮ってください。', 'しゃしんをとってください。', 'Please take a photo.', '撮る → 撮って. A te-form + ください requests an action.'),
        word('requests.misete-kudasai', '見せてください', 'みせてください', 'Please show me.', '写真を見せてください。', 'しゃしんをみせてください。', 'Please show me the photos.', '見せる (show) is different from 見る (see); 見せてください asks the other person to show something.'),
      ],
      study: { title: 'Past reports and action requests', explanation: 'From polite ます forms, past positive is ました and past negative is ませんでした: 行きました／行きませんでした. Noun and na-adjective past commonly use でした (静かでした, it was quiet). I-adjectives change い to かったです: 楽しい → 楽しかったです (it was enjoyable). Te-forms depend on the dictionary form: 見る→見て, 見せる→見せて, 撮る→撮って, 行く→行って. Do not assume every verb uses the same ending. A te-form + ください asks for an action; a te-form can also link actions in order. それから means after that. These short requests suit an ordinary cooperative situation; with a stranger, start with すみません and use an optional softer question such as 撮ってもらえますか (could you take it for me?).', examples: [
        bilingual('昨日、公園に行きました。写真を撮って、それから帰りました。', 'きのう、こうえんにいきました。しゃしんをとって、それからかえりました。', 'Yesterday I went to the park. I took photos and then went home.'),
        bilingual('すみません。写真を撮ってください。', 'すみません。しゃしんをとってください。', 'Excuse me. Please take a photo.'),
        bilingual('楽しかったです。でも、博物館には行きませんでした。', 'たのしかったです。でも、はくぶつかんにはいきませんでした。', 'It was enjoyable. But I did not go to the museum.'),
      ] },
      dialogue: { title: 'Photos from yesterday', explanation: 'Adult classmates share a weekend experience. どうでしたか asks how it was; 撮りました reports taking photos and 見せてください asks to see them.', lines: [
        line('Mori', '昨日、どこに行きましたか。', 'きのう、どこにいきましたか。', 'Where did you go yesterday?'),
        line('Alex', '公園に行きました。写真をたくさん撮りました。', 'こうえんにいきました。しゃしんをたくさんとりました。', 'I went to the park. I took lots of photos.'),
        line('Mori', 'どうでしたか。', 'どうでしたか。', 'How was it?'),
        line('Alex', '楽しかったです。', 'たのしかったです。', 'It was enjoyable.'),
        line('Mori', '写真を見せてください。', 'しゃしんをみせてください。', 'Please show me the photos.'),
        line('Alex', 'はい、どうぞ。', 'はい、どうぞ。', 'Of course. Here you are.'),
      ] },
      choices: [
        { title: 'Ask to see the photo', prompt: 'Your classmate has already taken a photo. You want them to show it to you. Which request fits?', choices: [bilingual('写真を撮ってください。', 'しゃしんをとってください。', 'Please take a photo.'), bilingual('写真を見ました。', 'しゃしんをみました。', 'I looked at the photo.'), bilingual('写真を見せてください。', 'しゃしんをみせてください。', 'Please show me the photo.')], answer: 2, feedback: '見せてください asks someone to show you something. 撮ってください requests taking a new photo. 見ました reports that you saw a photo and makes no request.', hint: '見せる means show; 見る means see.' },
        { title: 'Report a past negative', prompt: 'You went to the park yesterday, but you did not go to the museum. Which line states the museum part?', choices: [bilingual('博物館には行きませんでした。', 'はくぶつかんにはいきませんでした。', 'I did not go to the museum.'), bilingual('博物館に行きます。', 'はくぶつかんにいきます。', 'I go / will go to the museum.'), bilingual('博物館に行ってください。', 'はくぶつかんにいってください。', 'Please go to the museum.')], answer: 0, feedback: '行きませんでした is polite past negative. 行きます is non-past and positive. 行ってください requests an action from the listener; it is not a report of your visit.', hint: 'The past negative ends in ませんでした.' },
      ],
      reflection: { prompt: 'Write three or four linked sentences about yesterday: where you went, one action, your reaction, and something you did not do. Then ask someone to show you a photo. Imaginary experiences are welcome.', modelTarget: '昨日、公園に行きました。写真を撮って、それから帰りました。楽しかったです。博物館には行きませんでした。写真を見せてください。', modelMeaning: 'Yesterday I went to the park. I took photos and then went home. It was enjoyable. I did not go to the museum. Please show me the photos.', checklist: ['My past report uses ました or ませんでした.', 'I linked actions with a supported te-form or with separate sentences and それから; both work.', 'I used 見せて for show or 撮って for take a photo, according to my intention.', 'I checked 楽しかったです rather than adding でした directly to 楽しい.'] },
    }),
    day({
      number: 7, title: 'Make a plan and ask permission', level: 'A2', outcome: 'Explain a plan, ask permission and understand a clearly stated restriction.',
      vocabulary: [
        word('plans.yotei', '予定', 'よてい', 'Plan; scheduled arrangement.', '土曜日に図書館へ行く予定です。', 'どようびにとしょかんへいくよていです。', 'I plan to go to the library on Saturday.', 'Dictionary-form verb + 予定です expresses a planned action.'),
        word('places.toshokan', '図書館', 'としょかん', 'Library.', '図書館で勉強します。', 'としょかんでべんきょうします。', 'I study at the library.', 'で marks the place of studying; へ or に can mark the destination of going.'),
        word('permission.tsukattemo-iidesuka', '使ってもいいですか', 'つかってもいいですか', 'May I use it?', 'ここでパソコンを使ってもいいですか。', 'ここでパソコンをつかってもいいですか。', 'May I use a computer here?', '使う→使って. Te-form + もいいですか asks permission for your own action.'),
        word('permission.daijoubu', '大丈夫', 'だいじょうぶ', 'All right; okay.', 'ここで使っても大丈夫です。', 'ここでつかってもだいじょうぶです。', 'It is okay to use it here.', 'Context-dependent. 大丈夫です can accept or decline an offer; ask explicitly when the meaning is unclear.'),
        word('rules.kinshi', '禁止', 'きんし', 'Prohibition; prohibited.', 'ここは飲食禁止です。', 'ここはいんしょくきんしです。', 'Eating and drinking are prohibited here.', 'Common on signs. 飲食 means eating and drinking; follow the actual facility rules.'),
        word('plans.yoyaku', '予約', 'よやく', 'Reservation; booking.', '席の予約が必要です。', 'せきのよやくがひつようです。', 'A seat reservation is necessary.', '予約する means make a reservation; 必要 is necessary.'),
      ],
      study: { title: 'A plan is different from permission', explanation: 'Day 6 introduced te-forms. Te-form + もいいですか asks may I…?: 使ってもいいですか. Do not confuse it with 使ってください (please use it), which asks the listener to act. A dictionary-form verb before 予定です describes a plan: 行く予定です. Dictionary forms differ from polite forms; here 行きます→行く and 使います→使う. A restriction may be expressed with noun + 禁止 or te-form + はいけません. ここでは飲んではいけません means you must not drink here. These examples teach language, not a universal library policy: different libraries have different rules.', examples: [
        bilingual('土曜日に図書館へ行く予定です。', 'どようびにとしょかんへいくよていです。', 'I plan to go to the library on Saturday.'),
        bilingual('ここでパソコンを使ってもいいですか。はい、大丈夫です。', 'ここでパソコンをつかってもいいですか。はい、だいじょうぶです。', 'May I use a computer here? Yes, that is okay.'),
        bilingual('この部屋は飲食禁止です。', 'このへやはいんしょくきんしです。', 'Eating and drinking are prohibited in this room.'),
      ] },
      dialogue: { title: 'Ask about a study room', explanation: 'In this fictional library a room needs a reservation, permits computers and prohibits eating/drinking. 必要です means necessary; 席 means seat.', lines: [
        line('Visitor', '土曜日にこの部屋を使う予定です。予約が必要ですか。', 'どようびにこのへやをつかうよていです。よやくがひつようですか。', 'I plan to use this room on Saturday. Is a reservation necessary?'),
        line('Staff', 'はい、席の予約が必要です。', 'はい、せきのよやくがひつようです。', 'Yes, a seat reservation is necessary.'),
        line('Visitor', 'パソコンを使ってもいいですか。', 'パソコンをつかってもいいですか。', 'May I use a computer?'),
        line('Staff', 'はい、大丈夫です。ただ、この部屋は飲食禁止です。', 'はい、だいじょうぶです。ただ、このへやはいんしょくきんしです。', 'Yes, that is okay. However, eating and drinking are prohibited in this room.'),
        line('Visitor', '分かりました。ありがとうございます。', 'わかりました。ありがとうございます。', 'Understood. Thank you.'),
      ] },
      choices: [
        { title: 'Ask about your own action', prompt: 'You want permission to use your computer. Which question asks for that permission?', choices: [bilingual('パソコンを使ってください。', 'パソコンをつかってください。', 'Please use the computer.'), bilingual('パソコンを使ってもいいですか。', 'パソコンをつかってもいいですか。', 'May I use a computer?'), bilingual('パソコンを使いました。', 'パソコンをつかいました。', 'I used a computer.')], answer: 1, feedback: '使ってもいいですか asks permission for your action. 使ってください asks the listener to use it. 使いました reports a past action without asking permission.', hint: 'Look for てもいいですか.' },
        { title: 'Act on the room rules', prompt: 'The staff say computer use is allowed, a seat reservation is necessary, and eating/drinking are prohibited. Which plan follows all three points?', choices: [bilingual('予約なしで、ここで食べます。', 'よやくなしで、ここでたべます。', 'I will eat here without a reservation.'), bilingual('予約して、ここで飲みます。', 'よやくして、ここでのみます。', 'I will reserve a place and drink here.'), bilingual('予約して、パソコンを使います。ここでは食べません。', 'よやくして、パソコンをつかいます。ここではたべません。', 'I will reserve a place and use my computer. I will not eat here.')], answer: 2, feedback: 'The third plan reserves the seat, uses an allowed computer and avoids eating. The first misses the reservation and breaks the food rule. The second reserves but breaks the drinking rule. The example does not establish rules for other libraries.', hint: 'Keep the reservation and distinguish computer permission from the food/drink restriction.' },
      ],
      reflection: { prompt: 'Plan a visit to a shared space. State the day, ask permission for one action and ask whether a reservation is needed. Add a rule using 禁止 or a simple negative. Invent the space and rules.', modelTarget: '土曜日に図書館へ行く予定です。パソコンを使ってもいいですか。予約が必要ですか。この部屋は飲食禁止なので、ここでは食べません。', modelMeaning: 'I plan to go to the library on Saturday. May I use a computer? Is a reservation necessary? Eating and drinking are prohibited in this room, so I will not eat here.', checklist: ['I used dictionary form before 予定です.', 'I asked permission with te-form + もいいですか, not a command to the listener.', 'I distinguished allowed actions from prohibited actions.', 'ので in the model means because/so; two separate sentences are also valid if I have not learned that connector.'] },
    }),
    day({
      number: 8, title: 'Explain a service problem', level: 'A2', outcome: 'State what is wrong, give a reason and request a practical service action politely.',
      vocabulary: [
        word('problems.ugokimasen', '動きません', 'うごきません', 'Does not work; does not move.', 'エアコンが動きません。', 'エアコンがうごきません。', 'The air conditioner does not work.', 'For equipment failing to operate. が marks the equipment whose condition you report.'),
        word('problems.kowareteimasu', '壊れています', 'こわれています', 'Is broken.', '部屋の時計が壊れています。', 'へやのとけいがこわれています。', 'The room’s clock is broken.', 'A resulting state: something has broken and remains broken. Avoid claiming the cause if you only know it will not operate.'),
        word('problems.samui', '寒い', 'さむい', 'Cold. (air/weather; feeling cold)', '部屋が寒いです。', 'へやがさむいです。', 'The room is cold.', 'For air temperature or feeling cold. 冷たい describes something cold to the touch or a cold drink.'),
        word('reasons.node', 'ので', 'ので', 'Because; so. (reason connector)', '部屋が寒いので、毛布をお願いします。', 'へやがさむいので、もうふをおねがいします。', 'The room is cold, so I would like a blanket.', 'Attach to plain verb/i-adjective; nouns and na-adjectives take なので. Often useful for explaining circumstances politely.'),
        word('service.kakunin', '確認', 'かくにん', 'Check; confirmation.', '予約の確認をお願いします。', 'よやくのかくにんをおねがいします。', 'Please check the reservation.', '確認する means check/confirm; specify what needs checking.'),
        word('service.moufu', '毛布', 'もうふ', 'Blanket.', '毛布を一枚お願いします。', 'もうふをいちまいおねがいします。', 'One blanket, please.', '枚 (まい) counts flat objects; 一枚 is いちまい. A practical specific counter after the general counters.'),
      ],
      study: { title: 'Observation, consequence, request', explanation: 'Start with what you can observe: 動きません (does not operate). 壊れています is a stronger claim that it is broken. Add a reason with ので: 寒いので (because it is cold); noun/na-adjective + なので: 静かなので (because it is quiet). から also gives a reason and is common; do not treat it as inherently rude, though tone and context matter. Te-form + もらえますか asks could you do…for me?: 確認してもらえますか. It is softer than a direct ください request. Learn the supported form here without needing every giving/receiving verb. Explain a problem calmly and ask for a concrete action, rather than assigning blame.', examples: [
        bilingual('エアコンが動きません。確認してもらえますか。', 'エアコンがうごきません。かくにんしてもらえますか。', 'The air conditioner does not work. Could you check it for me?'),
        bilingual('部屋が寒いので、毛布を一枚お願いします。', 'へやがさむいので、もうふをいちまいおねがいします。', 'The room is cold, so I would like one blanket.'),
      ] },
      dialogue: { title: 'Call the hotel desk', explanation: 'The guest reports the air conditioner and requests a blanket. すぐ means right away; お持ちします is the staff’s polite humble form of bring. Recognise the staff formula without needing to produce honorific language yet.', lines: [
        line('Guest', 'すみません。部屋のエアコンが動きません。', 'すみません。へやのエアコンがうごきません。', 'Excuse me. The air conditioner in my room does not work.'),
        line('Staff', '申し訳ありません。すぐ確認します。', 'もうしわけありません。すぐかくにんします。', 'I am very sorry. We will check it right away.'),
        line('Guest', 'ありがとうございます。部屋が寒いので、毛布を一枚お願いできますか。', 'ありがとうございます。へやがさむいので、もうふをいちまいおねがいできますか。', 'Thank you. The room is cold, so could I have one blanket?'),
        line('Staff', 'はい、すぐお持ちします。', 'はい、すぐおもちします。', 'Certainly. We will bring one right away.'),
      ] },
      choices: [
        { title: 'Make the practical request', prompt: 'Your room is cold and you want a blanket. Which line gives the reason and requests that item?', choices: [bilingual('部屋が寒いので、毛布を一枚お願いします。', 'へやがさむいので、もうふをいちまいおねがいします。', 'The room is cold, so I would like one blanket.'), bilingual('毛布はいりません。', 'もうふはいりません。', 'I do not need a blanket.'), bilingual('昨日、写真を撮りました。', 'きのう、しゃしんをとりました。', 'I took photos yesterday.')], answer: 0, feedback: '寒いので links the cold room to the blanket request. 毛布はいりません declines the blanket. 写真を撮りました reports an unrelated past event and gives the staff no useful service request.', hint: 'Connect cold with blanket using ので.' },
        { title: 'Describe only what you know', prompt: 'A machine does not start. You do not know whether it is broken. Which report states the observation and asks staff to check?', choices: [bilingual('この機械は絶対に壊れています。', 'このきかいはぜったいにこわれています。', 'This machine is definitely broken.'), bilingual('この機械が動きません。確認してもらえますか。', 'このきかいがうごきません。かくにんしてもらえますか。', 'This machine does not work. Could you check it for me?'), bilingual('この機械を使ってもいいですか。', 'このきかいをつかってもいいですか。', 'May I use this machine?')], answer: 1, feedback: '動きません reports the operating problem without diagnosing it; 確認してもらえますか requests help. 絶対に壊れています asserts it is definitely broken without evidence. 使ってもいいですか asks permission and does not report the failure.', hint: 'Separate what you observed from a cause you cannot yet confirm.' },
      ],
      reflection: { prompt: 'Write a short message to a service desk: identify one problem, explain one consequence with ので or から, and request a specific action. Then write an imagined staff reply. Keep the tone polite.', modelTarget: '部屋のエアコンが動きません。確認してもらえますか。部屋が寒いので、毛布を一枚お願いできますか。— はい、すぐお持ちします。', modelMeaning: 'The air conditioner in my room does not work. Could you check it for me? The room is cold, so could I have one blanket? — Certainly. We will bring one right away.', checklist: ['I reported an observable problem rather than assuming a cause.', 'I gave a clear reason with ので or から; both can work in a polite sentence.', 'I used もらえますか or お願いできますか for a polite concrete request; ください is also possible in a suitable tone.', 'My imagined reply addresses the requested action; production is manually reviewed.'] },
    }),
    day({
      number: 9, title: 'Invite someone and compare options', level: 'A2', outcome: 'Compare two venues, make an invitation and agree a workable alternative.',
      vocabulary: [
        word('invitations.isshoni', '一緒に', 'いっしょに', 'Together; with someone.', '一緒に昼ご飯を食べませんか。', 'いっしょにひるごはんをたべませんか。', 'Would you like to have lunch together?', 'The invitation 食べませんか uses a negative question to suggest an action together.'),
        word('comparison.yori', 'より', 'より', 'Than. (comparison)', 'この店はあの店より安いです。', 'このみせはあのみせよりやすいです。', 'This restaurant is cheaper than that one.', 'The item before より is the comparison baseline.'),
        word('comparison.houga', 'ほうが', 'ほうが', 'The … option is more …; rather …', '駅の近くの店のほうが便利です。', 'えきのちかくのみせのほうがべんりです。', 'The restaurant near the station is more convenient.', 'Noun + のほうが highlights one side of a comparison.'),
        word('comparison.yasui', '安い', 'やすい', 'Cheap; inexpensive.', 'この店は安いです。', 'このみせはやすいです。', 'This restaurant is inexpensive.', 'Here price, not ease of doing something as in verb + やすい.'),
        word('comparison.benri', '便利', 'べんり', 'Convenient.', '駅の近くは便利です。', 'えきのちかくはべんりです。', 'The area near the station is convenient.', 'Na-adjective: 便利な店 (a convenient shop/restaurant); 便利です at sentence end.'),
        word('invitations.tsugou', '都合', 'つごう', 'Availability; circumstances. (schedule)', '日曜日は都合が悪いです。', 'にちようびはつごうがわるいです。', 'Sunday does not work for me.', '都合がいい／悪い means a time works/does not work. It is not criticism of the inviter.'),
      ],
      study: { title: 'Compare without losing the invitation', explanation: 'AはBより安いです means A is cheaper than B. Aのほうが便利です highlights A as the more convenient choice. With どちら (which of two), ask AとBと、どちらがいいですか. An invitation can use verb ませんか: 食べませんか (would you like to eat?). A considerate refusal often adds an alternative: 日曜日は都合が悪いです。土曜日はどうですか (Sunday does not work; how about Saturday?). ちょっと… can soften a refusal, but by itself is indirect; these beginner tasks use an explicit scheduling statement. ましょう proposes or confirms doing something together.', examples: [
        bilingual('この店はあの店より安いですが、駅の近くの店のほうが便利です。', 'このみせはあのみせよりやすいですが、えきのちかくのみせのほうがべんりです。', 'This restaurant is cheaper than that one, but the restaurant near the station is more convenient.'),
        bilingual('日曜日に一緒に食べませんか。日曜日は都合が悪いです。土曜日はどうですか。', 'にちようびにいっしょにたべませんか。にちようびはつごうがわるいです。どようびはどうですか。', 'Would you like to eat together on Sunday? Sunday does not work for me. How about Saturday?'),
      ] },
      dialogue: { title: 'Choose lunch near the station', explanation: 'Two classmates compare price and convenience, then change the day. が joins a polite contrast (but). では means then in the final arrangement.', lines: [
        line('Alex', '日曜日に一緒に昼ご飯を食べませんか。', 'にちようびにいっしょにひるごはんをたべませんか。', 'Would you like to have lunch together on Sunday?'),
        line('Mori', '日曜日は都合が悪いです。土曜日はどうですか。', 'にちようびはつごうがわるいです。どようびはどうですか。', 'Sunday does not work for me. How about Saturday?'),
        line('Alex', 'いいですね。この店は安いですが、駅から遠いです。', 'いいですね。このみせはやすいですが、えきからとおいです。', 'Sounds good. This restaurant is inexpensive, but it is far from the station.'),
        line('Mori', '駅の近くの店のほうが便利ですね。', 'えきのちかくのみせのほうがべんりですね。', 'The restaurant near the station is more convenient, isn’t it?'),
        line('Alex', 'では、土曜日の十二時に駅で会いましょう。', 'では、どようびのじゅうにじにえきであいましょう。', 'Then let’s meet at the station at noon on Saturday.'),
      ] },
      choices: [
        { title: 'Offer an alternative', prompt: 'You cannot meet on Sunday but can meet on Saturday. Which reply keeps the invitation moving with accurate availability?', choices: [bilingual('日曜日に会いましょう。', 'にちようびにあいましょう。', 'Let’s meet on Sunday.'), bilingual('土曜日も都合が悪いです。', 'どようびもつごうがわるいです。', 'Saturday does not work either.'), bilingual('日曜日は都合が悪いです。土曜日はどうですか。', 'にちようびはつごうがわるいです。どようびはどうですか。', 'Sunday does not work for me. How about Saturday?')], answer: 2, feedback: 'The third reply declines Sunday and proposes the available day. 日曜日に会いましょう accepts the unavailable day. 土曜日も都合が悪いです says Saturday also does not work, contrary to your situation.', hint: 'State the unavailable day and ask about the available one.' },
        { title: 'Interpret the comparison', prompt: 'Restaurant A costs 800 yen; B costs 1,200 yen. Which sentence correctly compares the prices?', choices: [bilingual('A店はB店より安いです。', 'エーてんはビーてんよりやすいです。', 'Restaurant A is cheaper than restaurant B.'), bilingual('B店はA店より安いです。', 'ビーてんはエーてんよりやすいです。', 'Restaurant B is cheaper than restaurant A.'), bilingual('A店とB店は同じ値段です。', 'エーてんとビーてんはおなじねだんです。', 'Restaurant A and B have the same price.')], answer: 0, feedback: 'A is less expensive, so AはBより安いです matches 800 versus 1,200 yen. Reversing A and B reverses the comparison. 同じ値段 means the same price, which the figures do not support.', hint: 'The item before より is the baseline; the sentence topic is the cheaper restaurant.' },
      ],
      reflection: { prompt: 'Write a six-turn invitation: suggest lunch, decline one day with an alternative, compare two venues, choose one and confirm a time/place. Explain one trade-off using が (but).', modelTarget: '日曜日に一緒に食べませんか。— 日曜日は都合が悪いです。土曜日はどうですか。— いいですね。A店は安いですが、遠いです。— B店のほうが便利です。— では、B店にしましょう。— 土曜日の十二時ですね。', modelMeaning: 'Would you like to eat together on Sunday? — Sunday does not work. How about Saturday? — Sounds good. A is inexpensive, but far away. — B is more convenient. — Then let’s choose B. — Saturday at noon, right?', checklist: ['I used an invitation such as ませんか or a suggestion such as ましょう.', 'I gave an alternative if I declined a day.', 'My comparison baseline and intended meaning agree.', 'I confirmed the actual chosen day and time; other workable arrangements are valid in manual review.'] },
    }),
    day({
      number: 10, title: 'Tell a connected experience', level: 'B1', outcome: 'Tell a short connected account with a setback, response and result, then answer a follow-up question.',
      vocabulary: [
        word('narrative.saisho', '最初', 'さいしょ', 'Beginning; at first.', '最初は道が分かりませんでした。', 'さいしょはみちがわかりませんでした。', 'At first I did not know the way.', '最初は can introduce an initial state that later changes.'),
        word('narrative.tochuu', '途中', 'とちゅう', 'On the way; partway through.', '駅へ行く途中で、雨が降り始めました。', 'えきへいくとちゅうで、あめがふりはじめました。', 'On the way to the station, it started to rain.', 'Dictionary verb + 途中で describes an event during the route/action.'),
        word('narrative.michinimayou', '道に迷う', 'みちにまよう', 'Get lost. (on a route)', '途中で道に迷いました。', 'とちゅうでみちにまよいました。', 'I got lost on the way.', 'Dictionary form; polite past is 道に迷いました. Not necessarily losing a physical object.'),
        word('narrative.sokode', 'そこで', 'そこで', 'So; at that point. (responsive action)', '道に迷いました。そこで、近くの人に聞きました。', 'みちにまよいました。そこで、ちかくのひとにききました。', 'I got lost. So I asked someone nearby.', 'Connects a situation to an action taken in response. It is not interchangeable with every English so.'),
        word('narrative.okagede', 'おかげで', 'おかげで', 'Thanks to; owing to. (usually beneficial)', '親切な人のおかげで、間に合いました。', 'しんせつなひとのおかげで、まにあいました。', 'Thanks to a kind person, I made it in time.', 'Noun + のおかげで; normally credits a helpful cause. Irony exists but is not taught here.'),
        word('narrative.maniau', '間に合う', 'まにあう', 'Make it in time.', 'バスに間に合いました。', 'バスにまにあいました。', 'I made it in time for the bus.', 'に marks what you are in time for; polite past is 間に合いました.'),
      ],
      study: { title: 'Read an experience as a connected whole', explanation: 'This B1-labelled task asks for a connected account, beyond recalling isolated phrases. Reuse past forms, te-forms and reasons from days 6–9. 〜たことがあります expresses experience at some unspecified earlier time; a dated event instead uses ordinary past. 〜てくれました describes a helpful action someone did for the speaker: 教えてくれました (kindly told/showed me). Connect initial state → setback → response → result using 最初、途中で、そこで、おかげで. Do not add connectors mechanically: the response must logically address the setback. Read the whole account with its full English translation, then retell it with one detail changed.', examples: [
        bilingual('先月、初めて一人で小さな町を旅行しました。最初は駅から宿まで歩く予定でしたが、途中で道に迷いました。そこで、近くの店で道を聞きました。店の人が地図を見せて、バス停の場所を教えてくれました。その人のおかげで、最後のバスに間に合いました。旅行の前に、宿への行き方を調べておけばよかったと思いました。', 'せんげつ、はじめてひとりでちいさなまちをりょこうしました。さいしょはえきからやどまであるくよていでしたが、とちゅうでみちにまよいました。そこで、ちかくのみせでみちをききました。みせのひとがちずをみせて、バスていのばしょをおしえてくれました。そのひとのおかげで、さいごのバスにまにあいました。りょこうのまえに、やどへのいきかたをしらべておけばよかったとおもいました。', 'Last month I travelled alone to a small town for the first time. At first I planned to walk from the station to my accommodation, but I got lost on the way. So I asked for directions at a nearby shop. A person at the shop showed me a map and told me where the bus stop was. Thanks to that person, I made it in time for the last bus. I thought I should have checked how to get to my accommodation before the trip.'),
        bilingual('道に迷ったことがあります。次は、出発する前に地図を確認します。', 'みちにまよったことがあります。つぎは、しゅっぱつするまえにちずをかくにんします。', 'I have got lost before. Next time I will check the map before leaving.'),
      ] },
      dialogue: { title: 'Answer a follow-up, not just repeat the story', explanation: 'The listener asks for cause and response. 〜ばよかった expresses retrospective should have; it is supported in the reading, not a prerequisite for telling a valid story. 宿 is accommodation, and 調べる means investigate/check information.', lines: [
        line('Listener', '一人で旅行したことがありますか。', 'ひとりでりょこうしたことがありますか。', 'Have you travelled alone before?'),
        line('Traveller', 'はい。先月、小さな町へ行きましたが、途中で道に迷いました。', 'はい。せんげつ、ちいさなまちへいきましたが、とちゅうでみちにまよいました。', 'Yes. Last month I went to a small town, but I got lost on the way.'),
        line('Listener', 'そのとき、どうしましたか。', 'そのとき、どうしましたか。', 'What did you do then?'),
        line('Traveller', '近くの店で聞きました。店の人がバス停の場所を教えてくれたので、最後のバスに間に合いました。', 'ちかくのみせでききました。みせのひとがバスていのばしょをおしえてくれたので、さいごのバスにまにあいました。', 'I asked at a nearby shop. A person there told me where the bus stop was, so I made it in time for the last bus.'),
        line('Listener', '次の旅行では、何を変えたいですか。', 'つぎのりょこうでは、なにをかえたいですか。', 'What would you like to change on your next trip?'),
        line('Traveller', '出発する前に、宿への行き方を調べたいです。', 'しゅっぱつするまえに、やどへのいきかたをしらべたいです。', 'I would like to check how to get to my accommodation before leaving.'),
      ] },
      choices: [
        { title: 'Keep cause and result faithful', prompt: 'In the reading, why did the traveller make the last bus?', choices: [bilingual('宿の人が車で迎えに来たからです。', 'やどのひとがくるまでむかえにきたからです。', 'Because someone from the accommodation came to collect them by car.'), bilingual('店の人がバス停の場所を教えてくれたからです。', 'みせのひとがバスていのばしょをおしえてくれたからです。', 'Because a person at the shop told them where the bus stop was.'), bilingual('旅行の前に行き方を全部調べていたからです。', 'りょこうのまえにいきかたをぜんぶしらべていたからです。', 'Because they had checked the entire route before the trip.')], answer: 1, feedback: 'The helpful shopkeeper provided the bus-stop location, enabling the traveller to catch the bus. No collection by car is mentioned. Checking the route before travelling is the later lesson learned, not something the traveller had already done.', hint: 'Identify the helpful action before the sentence containing おかげで.' },
        { title: 'Respond to the follow-up', prompt: 'A listener asks そのとき、どうしましたか (what did you do then?) after hearing that you got lost. Which answer describes your response to that setback?', choices: [bilingual('最初は歩く予定でした。', 'さいしょはあるくよていでした。', 'At first I planned to walk.'), bilingual('小さな町は静かです。', 'ちいさなまちはしずかです。', 'The small town is quiet.'), bilingual('近くの店で道を聞きました。', 'ちかくのみせでみちをききました。', 'I asked for directions at a nearby shop.')], answer: 2, feedback: 'Asking directions is the action taken after becoming lost. The initial walking plan belongs before the setback. Describing the town as quiet gives background but does not answer what you did then.', hint: 'Answer with a past action that solves or addresses the problem.' },
      ],
      reflection: { prompt: 'Write a connected account of 6–8 sentences about a real or imagined trip: setting, initial plan, unexpected problem, your response, help received, result and one lesson for next time. Then answer two follow-ups: Why did the problem happen? What would you change? Use simpler grammar where needed; review content and connections manually.', modelTarget: '先月、一人で町を旅行しました。駅から宿まで歩く予定でしたが、途中で道に迷いました。そこで、店の人に聞きました。地図を見せてくれたので、道が分かりました。その人のおかげで、夕食の時間に間に合いました。次は、出発する前に行き方を調べたいです。', modelMeaning: 'Last month I travelled alone to a town. I planned to walk from the station to my accommodation, but I got lost on the way. So I asked someone at a shop. They showed me a map, so I understood the route. Thanks to that person, I made it in time for dinner. Next time I would like to check the route before leaving.', checklist: ['My account has a clear sequence and a response that addresses the actual problem.', 'I distinguished dated past events from general experience with たことがあります.', 'I credited helpful action with くれました or a simpler explicit description; both can work.', 'I answered the follow-up questions with new relevant information instead of repeating the opening.', 'I may use それから, でも or separate sentences where a more complex connector is not yet secure.'] },
    }),
    day({
      number: 11, title: 'Explain a view and acknowledge a trade-off', level: 'B1', outcome: 'Give a practical opinion supported by reasons, acknowledge a contrasting need and propose a balanced choice.',
      vocabulary: [
        word('opinions.ikento', '意見', 'いけん', 'Opinion; view.', '私の意見は少し違います。', 'わたしのいけんはすこしちがいます。', 'My opinion is a little different.', 'Neutral noun; disagreement can remain polite without pretending to agree.'),
        word('opinions.riyuu', '理由', 'りゆう', 'Reason.', '理由は二つあります。', 'りゆうはふたつあります。', 'There are two reasons.', 'Give the actual reasons after this signpost.'),
        word('contrast.ippoude', '一方で', 'いっぽうで', 'On the other hand; at the same time.', '家では集中できます。一方で、人と話す機会が減ります。', 'いえではしゅうちゅうできます。いっぽうで、ひととはなすきかいがへります。', 'I can concentrate at home. On the other hand, opportunities to talk to people decrease.', 'Connects contrasting aspects; it need not imply one is wholly wrong.'),
        word('opinions.tashikani', '確かに', 'たしかに', 'Certainly; admittedly.', '確かに、直接話すことも大切です。', 'たしかに、ちょくせつはなすこともたいせつです。', 'Certainly, talking in person is important too.', 'Acknowledges a point. Follow it with an honest concession, not an unrelated stock phrase.'),
        word('opinions.shuuchuu', '集中', 'しゅうちゅう', 'Concentration; focus.', '静かな場所で集中したいです。', 'しずかなばしょでしゅうちゅうしたいです。', 'I want to concentrate in a quiet place.', '集中する is concentrate; 集中できる means be able to concentrate.'),
        word('opinions.teian', '提案', 'ていあん', 'Proposal; suggestion.', '一つ提案があります。', 'ひとつていあんがあります。', 'I have one suggestion.', '提案する means propose. Make the proposal concrete enough for a listener to respond.'),
      ],
      study: { title: 'A view needs reasons and a listener', explanation: 'Use plain-form clause + と思います for I think…: いいと思います. With nouns and na-adjectives use だ before と: 必要だと思います (I think it is necessary). A polite outer sentence can contain plain grammar internally; いいですと思います is not the pattern. Explain reasons with から or ので; し can list supporting reasons (静かですし、移動もありません, it is quiet and there is no travel either). Acknowledge a relevant counterpoint with 確かに, then weigh it with 一方で／ただ. This is a substantive opinion task, not a scored debate or proof of B1 proficiency. The work arrangement below is fictional and says nothing about employment rights.', examples: [
        bilingual('私は、週に二日は家で働けるといいと思います。理由は二つあります。通勤の時間が減るので、朝に余裕ができます。また、静かな部屋で集中できます。一方で、家では同僚にすぐ相談できないこともあります。確かに、直接話す時間も大切です。そこで、会議のある日は会社に集まり、一人で進める仕事の日は家で働く方法を提案したいです。', 'わたしは、しゅうにふつかはいえではたらけるといいとおもいます。りゆうはふたつあります。つうきんのじかんがへるので、あさによゆうができます。また、しずかなへやでしゅうちゅうできます。いっぽうで、いえではどうりょうにすぐそうだんできないこともあります。たしかに、ちょくせつはなすじかんもたいせつです。そこで、かいぎのあるひはかいしゃにあつまり、ひとりですすめるしごとのひはいえではたらくほうほうをていあんしたいです。', 'I think it would be good to be able to work from home two days a week. There are two reasons. Less commuting gives me more time in the morning. Also, I can concentrate in a quiet room. On the other hand, at home there are times when I cannot immediately consult colleagues. Certainly, time to talk in person is important too. So I would like to propose gathering at the office on meeting days and working at home on days with work we can do individually.'),
        bilingual('毎日同じ場所で働く必要はないと思いますが、相談する時間は必要だと思います。', 'まいにちおなじばしょではたらくひつようはないとおもいますが、そうだんするじかんはひつようだとおもいます。', 'I do not think we need to work in the same place every day, but I think time to consult each other is necessary.'),
      ] },
      dialogue: { title: 'Discuss a workable arrangement', explanation: 'Colleagues use polite speech. 相談する means consult/discuss with someone; 試してみる means try something to see how it goes. The goal is to engage with the other person’s concern.', lines: [
        line('Alex', '週に二日は家で働けるといいと思います。静かですし、通勤の時間も減ります。', 'しゅうにふつかはいえではたらけるといいとおもいます。しずかですし、つうきんのじかんもへります。', 'I think it would be good to be able to work from home two days a week. It is quiet, and commuting time decreases too.'),
        line('Colleague', '確かに便利ですが、すぐ相談できる時間も必要だと思います。', 'たしかにべんりですが、すぐそうだんできるじかんもひつようだとおもいます。', 'It is certainly convenient, but I think we also need time when we can consult one another immediately.'),
        line('Alex', 'その点は私も大切だと思います。会議の日は会社に集まるのはどうですか。', 'そのてんはわたしもたいせつだとおもいます。かいぎのひはかいしゃにあつまるのはどうですか。', 'I think that point is important too. How about gathering at the office on meeting days?'),
        line('Colleague', 'いいですね。まず一か月試して、その後で話し合いましょう。', 'いいですね。まずいっかげつためして、そのあとではなしあいましょう。', 'Sounds good. Let’s try it for a month first and discuss it afterwards.'),
      ] },
      choices: [
        { title: 'Identify the balanced proposal', prompt: 'Which summary preserves both the writer’s preference and the need for consultation in the reading?', choices: [bilingual('会議の日は会社に集まり、一人で進める日は家で働くという提案です。', 'かいぎのひはかいしゃにあつまり、ひとりですすめるひはいえではたらくというていあんです。', 'The proposal is to gather at the office on meeting days and work at home on days for individual work.'), bilingual('直接話す必要はないので、毎日家で働くという提案です。', 'ちょくせつはなすひつようはないので、まいにちいえではたらくというていあんです。', 'The proposal is to work from home every day because talking in person is unnecessary.'), bilingual('家では仕事ができないので、毎日会社に行くという提案です。', 'いえではしごとができないので、まいにちかいしゃにいくというていあんです。', 'The proposal is to go to the office every day because working at home is impossible.')], answer: 0, feedback: 'The first preserves a mixed arrangement and the reason for meeting in person. The second contradicts the acknowledged value of direct discussion and changes two days to every day. The third falsely turns a consultation limitation into an inability to work at home.', hint: 'Look for a proposal that responds to both concentration and consultation.' },
        { title: 'Engage with a concern', prompt: 'Your colleague says they need time to consult people immediately. Which reply acknowledges that point and suggests a concrete accommodation?', choices: [bilingual('理由は二つあります。静かな部屋が好きです。', 'りゆうはふたつあります。しずかなへやがすきです。', 'There are two reasons. I like a quiet room.'), bilingual('その点は大切ですね。会議の日は会社に集まるのはどうですか。', 'そのてんはたいせつですね。かいぎのひはかいしゃにあつまるのはどうですか。', 'That point is important. How about gathering at the office on meeting days?'), bilingual('直接話す必要は全くありません。', 'ちょくせつはなすひつようはまったくありません。', 'There is absolutely no need to talk in person.')], answer: 1, feedback: 'The second reply acknowledges the concern and offers a related arrangement. The first announces two reasons but gives only one preference and does not address consultation. The third rejects the concern outright instead of accommodating it.', hint: 'A useful concession connects to the other person’s actual need.' },
      ],
      reflection: { prompt: 'Write 7–9 sentences recommending how an adult study group should meet: in person, online or a mixture. State your view, give two distinct reasons, acknowledge one drawback, and propose a concrete arrangement. Then write a partner’s objection and a respectful response that changes or clarifies your proposal.', modelTarget: '私は、対面とオンラインを組み合わせるといいと思います。オンラインなら移動の時間が減ります。また、遠くに住む人も参加できます。一方で、画面では話すタイミングが難しいこともあります。確かに、直接話す練習も大切です。そこで、月に一回は集まって、ほかの週はオンラインで話す方法を提案します。まず一か月試してから、意見を聞きたいです。', modelMeaning: 'I think it would be good to combine in-person and online meetings. Online meetings reduce travel time. Also, people who live far away can join. On the other hand, it can be difficult to judge when to speak on a screen. Certainly, practising conversation in person is important too. So I propose meeting in person once a month and talking online in the other weeks. I would like to try it for one month first, then ask for people’s opinions.', checklist: ['I gave two distinct supporting reasons rather than repeating one preference.', 'I acknowledged a real drawback and made a proposal that responds to it.', 'I used plain form inside と + 思います; noun/na-adjective clauses can need だ.', 'My response addresses the imagined objection; several balanced proposals are valid.', 'I checked the whole message for coherence manually; connector counts alone do not measure this skill.'] },
    }),
    day({
      number: 12, title: 'Pass on an announcement accurately', level: 'B1', outcome: 'Summarise a practical written announcement, distinguish certainty from conditions and ask about missing information.',
      vocabulary: [
        word('messages.oshirase', 'お知らせ', 'おしらせ', 'Announcement; notice.', '教室の変更のお知らせを読みました。', 'きょうしつのへんこうのおしらせをよみました。', 'I read the announcement about the classroom change.', 'A notice or announcement; お is part of this common polite noun.'),
        word('messages.henkou', '変更', 'へんこう', 'Change; alteration.', '集合場所が変更になりました。', 'しゅうごうばしょがへんこうになりました。', 'The meeting place has changed.', '変更する means change something; 変更になる reports that an arrangement changes.'),
        word('messages.shimekiri', '締め切り', 'しめきり', 'Deadline.', '申し込みの締め切りは木曜日です。', 'もうしこみのしめきりはもくようびです。', 'The application deadline is Thursday.', 'Also written 締切. These are spelling alternatives for the same noun, not different deadlines.'),
        word('messages.baaai', '場合', 'ばあい', 'Case; in the event that.', '雨の場合は、室内で行います。', 'あめのばあいは、しつないでおこないます。', 'In case of rain, we will hold it indoors.', 'Noun + の場合; plain verb + 場合. It introduces a condition, not an assertion that it will happen.'),
        word('messages.youten', '要点', 'ようてん', 'Main point; key point.', '要点を三つにまとめます。', 'ようてんをみっつにまとめます。', 'I will summarise the key points in three points.', 'Select practical essentials rather than copying the entire notice.'),
        word('messages.tsutaeru', '伝える', 'つたえる', 'Convey; pass on; tell someone.', '変更を友達に伝えます。', 'へんこうをともだちにつたえます。', 'I will tell my friend about the change.', 'Person + に, information + を. Polite form is 伝えます.'),
      ],
      study: { title: 'Read, select, then pass on', explanation: 'A practical summary preserves what a reader must do: date/time, place, cost, deadline and conditions. Noun + の場合は means in the case of: 雨の場合は. Do not change this into a certainty. Clause + と書いてあります means it is written that…; clause + そうです reports information you heard/read (not the looks… use of そう). 〜かどうか means whether or not. Avoid filling information gaps with guesses: ask 〜かどうか、確認してもらえますか. This notice and organisation are invented for the exercise. Read the full bilingual notice before summarising it for someone who has not seen it.', examples: [
        bilingual('【交流会のお知らせ】土曜日の交流会は、午後二時から四時までです。参加者が増えたため、会場を図書館の会議室から市民センターの二階に変更します。参加費は五百円で、飲み物は各自で持ってきてください。申し込みの締め切りは木曜日の午後六時です。雨の場合も室内で予定どおり行います。欠席する場合は、金曜日までにメールで連絡してください。', '【こうりゅうかいのおしらせ】どようびのこうりゅうかいは、ごごにじからよじまでです。さんかしゃがふえたため、かいじょうをとしょかんのかいぎしつからしみんセンターのにかいにへんこうします。さんかひはごひゃくえんで、のみものはかくじでもってきてください。もうしこみのしめきりはもくようびのごごろくじです。あめのばあいもしつないでよていどおりおこないます。けっせきするばあいは、きんようびまでにメールでれんらくしてください。', '[Social gathering announcement] Saturday’s gathering runs from 2 to 4 p.m. Because more people are attending, we are changing the venue from the library meeting room to the second floor of the civic centre. The participation fee is 500 yen; please each bring your own drink. The application deadline is Thursday at 6 p.m. Even if it rains, the event will take place indoors as planned. If you will be absent, please contact us by email by Friday.'),
        bilingual('会場は市民センターの二階に変わったそうです。飲み物を持ってくるようにと書いてあります。', 'かいじょうはしみんセンターのにかいにかわったそうです。のみものをもってくるようにとかいてあります。', 'I understand the venue has changed to the second floor of the civic centre. It says to bring a drink.'),
      ] },
      dialogue: { title: 'A friend has not read the notice', explanation: 'The friend already knows the date. The summary highlights a venue change and deadline, then distinguishes the announcement from an unanswered accessibility question. A question about a lift does not establish that one exists.', lines: [
        line('Friend', '土曜日の交流会のお知らせ、何か変更がありましたか。', 'どようびのこうりゅうかいのおしらせ、なにかへんこうがありましたか。', 'Were there any changes in the announcement for Saturday’s gathering?'),
        line('Alex', 'はい。会場が市民センターの二階に変わりました。申し込みは木曜日の午後六時までです。', 'はい。かいじょうがしみんセンターのにかいにかわりました。もうしこみはもくようびのごごろくじまでです。', 'Yes. The venue has changed to the second floor of the civic centre. Applications are due by 6 p.m. on Thursday.'),
        line('Friend', '雨が降ったら、中止ですか。', 'あめがふったら、ちゅうしですか。', 'Will it be cancelled if it rains?'),
        line('Alex', 'いいえ。雨の場合も室内で行うそうです。飲み物は持ってきてください。', 'いいえ。あめのばあいもしつないでおこなうそうです。のみものはもってきてください。', 'No. According to the notice, it will be held indoors even if it rains. Please bring a drink.'),
        line('Friend', '二階までのエレベーターはありますか。', 'にかいまでのエレベーターはありますか。', 'Is there a lift to the second floor?'),
        line('Alex', 'お知らせには書いてありません。あるかどうか、確認します。', 'おしらせにはかいてありません。あるかどうか、かくにんします。', 'It is not written in the announcement. I will check whether there is one.'),
      ] },
      choices: [
        { title: 'Keep the deadline distinct', prompt: 'Your friend has not applied yet. Which message accurately conveys the application deadline rather than the absence-contact deadline?', choices: [bilingual('申し込みは金曜日までです。', 'もうしこみはきんようびまでです。', 'Applications are due by Friday.'), bilingual('申し込みは土曜日の午後二時までです。', 'もうしこみはどようびのごごにじまでです。', 'Applications are due by 2 p.m. on Saturday.'), bilingual('申し込みは木曜日の午後六時までです。', 'もうしこみはもくようびのごごろくじまでです。', 'Applications are due by 6 p.m. on Thursday.')], answer: 2, feedback: 'The application deadline is Thursday at 6 p.m. Friday is the separate deadline for notifying absence. Saturday at 2 p.m. is the event start, not an application deadline.', hint: 'Read the sentence with 申し込みの締め切り.' },
        { title: 'Separate fact from an information gap', prompt: 'You need step-free access to the second floor. The notice does not mention a lift. Which message preserves what is known and asks for confirmation?', choices: [bilingual('会場は二階です。エレベーターがあるかどうか、確認してもらえますか。', 'かいじょうはにかいです。エレベーターがあるかどうか、かくにんしてもらえますか。', 'The venue is on the second floor. Could you check whether there is a lift?'), bilingual('市民センターなので、必ずエレベーターがあります。', 'しみんセンターなので、かならずエレベーターがあります。', 'Because it is a civic centre, there is definitely a lift.'), bilingual('エレベーターがないので、交流会は中止です。', 'エレベーターがないので、こうりゅうかいはちゅうしです。', 'There is no lift, so the gathering is cancelled.')], answer: 0, feedback: 'The first states the known floor and requests the missing information with かどうか. The second assumes a lift without evidence. The third invents both the lack of a lift and a cancellation.', hint: 'An omitted detail is a question to check, not proof that the feature exists or is absent.' },
      ],
      reflection: { prompt: 'Write a 4–6-sentence message to a friend summarising the announcement without copying it in full. Include the changed venue, event time, fee, what to bring and application deadline; explain what happens in rain. Add one question about information the notice does not supply. Check every number against the original.', modelTarget: '土曜日の交流会は午後二時から四時までで、会場は市民センターの二階に変わりました。参加費は五百円です。飲み物を持ってきてください。申し込みは木曜日の午後六時までです。雨でも室内で行うそうです。エレベーターがあるかどうか、確認してもらえますか。', modelMeaning: 'Saturday’s gathering is from 2 to 4 p.m., and the venue has changed to the second floor of the civic centre. The fee is 500 yen. Please bring a drink. Applications are due by 6 p.m. on Thursday. According to the notice, it will be held indoors even if it rains. Could you check whether there is a lift?', checklist: ['I preserved the changed venue, times, fee, drink requirement and correct deadline.', 'I did not confuse the application deadline with the absence-contact deadline.', 'I preserved the rain condition rather than predicting the weather or inventing cancellation.', 'I clearly marked an unanswered question; different useful questions are valid.', 'I may report with そうです, と書いてあります or a clearly attributed direct summary; all can work.'] },
    }),
    day({
      number: 13, title: 'Negotiate a solution and confirm it', level: 'B1', outcome: 'Explain constraints, compare realistic alternatives, negotiate a compromise and confirm the agreed next action.',
      vocabulary: [
        word('negotiation.jouken', '条件', 'じょうけん', 'Condition; requirement.', '必要な条件を確認しましょう。', 'ひつようなじょうけんをかくにんしましょう。', 'Let’s confirm the necessary requirements.', 'Use to make constraints explicit, not only to state a personal preference.'),
        word('negotiation.daiann', '代案', 'だいあん', 'Alternative proposal.', 'その部屋が使えなければ、代案があります。', 'そのへやがつかえなければ、だいあんがあります。', 'If we cannot use that room, I have an alternative proposal.', 'An alternative plan, not just a criticism of the first plan.'),
        word('negotiation.okuraseru', '遅らせる', 'おくらせる', 'Delay; move something to a later time.', '開始時間を三十分遅らせることはできますか。', 'かいしじかんをさんじゅっぷんおくらせることはできますか。', 'Can we move the start time back by thirty minutes?', 'Transitive: state what becomes later. Here the start time changes; the session does not become longer.'),
        word('negotiation.yosan', '予算', 'よさん', 'Budget.', '予算は六千円までです。', 'よさんはろくせんえんまでです。', 'The budget is up to 6,000 yen.', 'A spending constraint; distinguish a total room fee from a per-person fee.'),
        word('negotiation.goui', '合意', 'ごうい', 'Agreement. (between parties)', '時間の変更について合意しました。', 'じかんのへんこうについてごういしました。', 'We agreed on the time change.', '合意する means reach agreement. A proposal is not yet an agreement.'),
        word('negotiation.tashikameru', '確かめる', 'たしかめる', 'Make sure; verify.', '予約する前に、全員の都合を確かめます。', 'よやくするまえに、ぜんいんのつごうをたしかめます。', 'Before booking, I will check everyone’s availability.', 'Polite form 確かめます. Close to 確認する; focus on verifying the specific uncertain detail.'),
      ],
      study: { title: 'From a problem to an agreed action', explanation: 'Recombine the earlier skills: report a change, give reasons, compare options and check uncertain information. Conditional 〜なら (if that is the case/if it is…) supports a proposal based on a situation: 三時からなら参加できます (I can attend if it starts at three). Potential 使える means can use; negative conditional 使えなければ means if we cannot use it. 〜ことにしましょう means let’s decide to…; confirm agreement before treating it as settled. A useful closing records who will do what by when. This invented room-booking task has explicit prices and availability; do not assume other facilities share them.', examples: [
        bilingual('勉強会は土曜日の午後二時から四時まで、八人で行う予定でした。しかし、予約した部屋が使えなくなりました。予算は部屋代の合計で六千円までです。代わりのA室は三時から五時まで使えて、五千円です。B室は二時から四時まで使えますが、八千円かかります。全員が五時まで参加できるかは、まだ確認していません。予算内で開くために、A室への変更を提案します。ただし、予約する前に、全員の都合を確かめる必要があります。', 'べんきょうかいはどようびのごごにじからよじまで、はちにんでおこなうよていでした。しかし、よやくしたへやがつかえなくなりました。よさんはへやだいのごうけいでろくせんえんまでです。かわりのエーしつはさんじからごじまでつかえて、ごせんえんです。ビーしつはにじからよじまでつかえますが、はっせんえんかかります。ぜんいんがごじまでさんかできるかは、まだかくにんしていません。よさんないでひらくために、エーしつへのへんこうをていあんします。ただし、よやくするまえに、ぜんいんのつごうをたしかめるひつようがあります。', 'The study session was planned for eight people on Saturday from 2 to 4 p.m. However, the reserved room has become unavailable. The budget for the total room fee is up to 6,000 yen. Alternative room A is available from 3 to 5 p.m. and costs 5,000 yen. Room B is available from 2 to 4 p.m., but costs 8,000 yen. We have not yet checked whether everyone can attend until five. To hold the session within budget, I propose changing to room A. However, before booking, we need to check everyone’s availability.'),
        bilingual('三時からなら参加できますが、五時には帰る必要があります。四時半に終わることにしませんか。', 'さんじからならさんかできますが、ごじにはかえるひつようがあります。よじはんにおわることにしませんか。', 'I can attend if it starts at three, but I need to leave by five. Shall we decide to finish at 4:30?'),
      ] },
      dialogue: { title: 'Negotiate before booking', explanation: 'The organiser proposes A without pretending everyone has agreed. The partner offers a shorter session. The final booking remains conditional on checking all eight people; this is deliberately not an unconditional confirmed reservation.', lines: [
        line('Organiser', '予約した部屋が使えなくなりました。A室は五千円ですが、三時からです。', 'よやくしたへやがつかえなくなりました。エーしつはごせんえんですが、さんじからです。', 'The room we booked has become unavailable. Room A is 5,000 yen, but starts at three.'),
        line('Partner', 'B室なら二時から使えますね。', 'ビーしつならにじからつかえますね。', 'If we choose room B, we can use it from two, right?'),
        line('Organiser', 'はい。ただ、八千円なので予算を超えます。A室にして、開始時間を遅らせるのはどうですか。', 'はい。ただ、はっせんえんなのでよさんをこえます。エーしつにして、かいしじかんをおくらせるのはどうですか。', 'Yes. However, it is 8,000 yen, so it exceeds our budget. How about choosing A and moving the start time later?'),
        line('Partner', '三時からなら参加できます。でも、五時には帰りたいので、四時半に終わりませんか。', 'さんじからならさんかできます。でも、ごじにはかえりたいので、よじはんにおわりませんか。', 'I can attend from three. But I would like to leave by five, so shall we finish at 4:30?'),
        line('Organiser', 'いいですね。今日の六時までに全員の都合を確かめます。全員が参加できれば、A室を予約します。', 'いいですね。きょうのろくじまでにぜんいんのつごうをたしかめます。ぜんいんがさんかできれば、エーしつをよやくします。', 'Sounds good. I will check everyone’s availability by six today. If everyone can attend, I will book room A.'),
        line('Partner', 'では、三時から四時半という案ですね。確認できたら、連絡してください。', 'では、さんじからよじはんというあんですね。かくにんできたら、れんらくしてください。', 'Then the proposal is from three to 4:30, right? Please contact me once you have confirmed.'),
      ] },
      choices: [
        { title: 'Respect the budget and the unknown', prompt: 'Based on the reading, which next step respects the 6,000-yen total budget and the unconfirmed availability?', choices: [bilingual('B室を八千円で予約してから、予算を考えます。', 'ビーしつをはっせんえんでよやくしてから、よさんをかんがえます。', 'Book B for 8,000 yen and think about the budget afterwards.'), bilingual('全員の都合を確かめて、参加できればA室を予約します。', 'ぜんいんのつごうをたしかめて、さんかできればエーしつをよやくします。', 'Check everyone’s availability and book A if everyone can attend.'), bilingual('全員が五時まで参加できると決まっているので、すぐA室を予約します。', 'ぜんいんがごじまでさんかできるときまっているので、すぐエーしつをよやくします。', 'Book A immediately because everyone’s availability until five has already been settled.')], answer: 1, feedback: 'Checking first preserves the unresolved availability and A is within the budget at 5,000 yen. B exceeds the stated budget. The third option invents agreement: the reading explicitly says everyone’s availability is not yet checked.', hint: 'A meets the price limit, but a price-compatible room is not enough until the people can attend.' },
        { title: 'Confirm only what was agreed', prompt: 'After the dialogue, which recap accurately distinguishes the proposal from the organiser’s promised action?', choices: [bilingual('A室の予約は完了しました。全員が五時まで参加します。', 'エーしつのよやくはかんりょうしました。ぜんいんがごじまでさんかします。', 'Room A is already booked. Everyone will attend until five.'), bilingual('B室で二時から四時まで行うことで合意しました。', 'ビーしつでにじからよじまでおこなうことでごういしました。', 'We agreed to hold it in B from two to four.'), bilingual('三時から四時半が案です。主催者が今日六時までに都合を確かめ、全員が参加できればA室を予約します。', 'さんじからよじはんがあんです。しゅさいしゃがきょうろくじまでにつごうをたしかめ、ぜんいんがさんかできればエーしつをよやくします。', 'The proposal is three to 4:30. The organiser will check availability by six today and book A if everyone can attend.')], answer: 2, feedback: 'The third keeps the shortened proposed time, the responsible person, deadline and booking condition. The first incorrectly claims a completed reservation and unanimous availability until five. The second incorrectly selects the over-budget B room and original time.', hint: 'A faithful recap includes who, by when, and the remaining if.' },
      ],
      reflection: { prompt: 'Write an 8–10-turn negotiation for a study group or shared outing. Give two concrete constraints (such as budget and time), compare at least two feasible options, respond to a partner’s objection and modify one detail. Finish with a 3–4-sentence recap: chosen or proposed option, any condition still unresolved, responsible person and deadline. Check that the numbers and promises agree across the whole exchange.', modelTarget: 'A室は五千円で、三時から使えます。— 私は五時までに帰りたいです。— では、三時から四時半にしませんか。— それなら参加できます。ほかの人も大丈夫ですか。— まだ確認していません。今日六時までに私が確かめます。全員が参加できれば、A室を予約して連絡します。', modelMeaning: 'Room A costs 5,000 yen and is available from three. — I would like to leave by five. — Then shall we make it three to 4:30? — In that case I can attend. Does that work for the others too? — I have not checked yet. I will check by six today. If everyone can attend, I will book A and let you know.', checklist: ['I stated two constraints and kept the prices/times consistent.', 'I compared alternatives and changed a detail in response to an actual objection.', 'I did not call a proposal an agreement or a conditional plan a completed booking.', 'My recap names a responsible person and a deadline, plus any unresolved condition.', 'Other solutions are valid if they satisfy the stated constraints; this open task needs human self/owner review.', 'Finishing this route records practice with selected tasks; it does not establish B1 proficiency.'] },
    }),
  ],
});
