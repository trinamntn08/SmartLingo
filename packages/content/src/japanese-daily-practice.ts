import { japanesePracticeTaskSchema, type JapanesePracticeTask } from '@smartlingo/domain';

/** Original AI-assisted SmartLingo draft, 2026-11-26; no third-party text or media reproduced.
 * Japan Foundation Can-do principles inform task scope, not certification or complete level coverage.
 * Requires owner and qualified Japanese review. Legacy payloads and progress scopes remain immutable. */
export type JapaneseDailyGuide = {
  dayId: string;
  canDos: readonly string[];
  preparation: string;
  script: string;
  register: string;
  review: string;
  tasks: readonly JapanesePracticeTask[];
  checkpoint: readonly JapanesePracticeTask[];
};

const contextualReadings = {
  午前: 'ごぜん', 午後: 'ごご', 九時: 'くじ', 五時: 'ごじ', 三時: 'さんじ', 三百円: 'さんびゃくえん',
  五百円: 'ごひゃくえん', 八百円: 'はっぴゃくえん', 千二百円: 'せんにひゃくえん',
  大阪: 'おおさか', 東京: 'とうきょう', 森: 'もり', 写真: 'しゃしん', 飲食禁止: 'いんしょくきんし',
  飲み物: 'のみもの', 毛布: 'もうふ', 駅前: 'えきまえ', 駅: 'えき', 確認: 'かくにん', 予約: 'よやく',
  最初: 'さいしょ', 相談: 'そうだん', 図書館: 'としょかん', 公民館: 'こうみんかん',
  集合: 'しゅうごう', 参加費: 'さんかひ', 無料: 'むりょう', 正午: 'しょうご', 全員: 'ぜんいん',
};
const readingSpans = new RegExp(Object.keys(contextualReadings).sort((left, right) => right.length - left.length).join('|'), 'gu');
type Source = NonNullable<JapanesePracticeTask['source']>;
function source(text: string, reading: string, meaning: string): Source {
  const ruby = [...text.matchAll(readingSpans)].map(([base]) => ({
    base, reading: contextualReadings[base as keyof typeof contextualReadings],
  }));
  return { text, reading, meaning, ...(ruby.length ? { ruby } : {}) };
}
const retry = 'Listen or read again, compare the key detail with the feedback, then retry. A supported attempt is useful practice.';
function choose(id: string, skill: 'listening' | 'reading', prompt: string, input: Source, choices: string[], answer: string, feedback: string): JapanesePracticeTask {
  return { id, mode: 'choice', skill, prompt, source: input, choices, answer, feedback, retry };
}
function produce(id: string, response: 'speak' | 'write', prompt: string, model: string, criteria: string[], feedback: string): JapanesePracticeTask {
  const meaningBreak = model.lastIndexOf('\n');
  const modelTarget = meaningBreak < 0 ? model : model.slice(0, meaningBreak);
  const modelMeaning = meaningBreak < 0 ? undefined : model.slice(meaningBreak + 1);
  return { id, mode: 'self', skill: response === 'speak' ? 'speaking' : 'writing', response, prompt, model: modelTarget, modelMeaning, criteria, feedback,
    retry: 'Compare your response with the criteria. Change one detail, then try again before opening the model. Other natural answers can meet the same goal.' };
}
function script(id: string, prompt: string, answers: string[], focus: 'hiragana' | 'katakana' | 'kanji' | 'meaning', feedback: string): JapanesePracticeTask {
  return { id, mode: 'text', skill: 'script', prompt, answers, focus, feedback,
    retry: 'Use the reading or a kana keyboard if needed. Compare small kana, long vowels and voiced marks, then retype the word.' };
}
function guide(number: number, input: Omit<JapaneseDailyGuide, 'dayId' | 'tasks' | 'checkpoint'> & {
  tasks: (id: string) => JapanesePracticeTask[]; checkpoint: (id: string) => JapanesePracticeTask[];
}): JapaneseDailyGuide {
  const dayId = `ja.everyday-course.day-${number}`;
  const tasks = input.tasks(`${dayId}.practice`).map(task => japanesePracticeTaskSchema.parse(task));
  const checkpoint = input.checkpoint(`${dayId}.checkpoint`).map(task => japanesePracticeTaskSchema.parse(task));
  if (new Set([...tasks, ...checkpoint].map(task => task.id)).size !== tasks.length + checkpoint.length) {
    throw new Error(`Duplicate daily practice task in ${dayId}`);
  }
  return { ...input, dayId, tasks, checkpoint };
}

export const japaneseDailyGuides: readonly JapaneseDailyGuide[] = [
  guide(1, {
    canDos: ['I can recognise a greeting and ask someone to repeat slowly.', 'I can distinguish hiragana, katakana and kanji in a short supported phrase.'],
    preparation: 'Start the hiragana route if kana are new. You can still take this day using the readings and English meanings. Practise for 15–20 minutes. Repeat before moving on if repair phrases are not yet usable.',
    script: 'Begin with あいうえお, then the basic hiragana rows. Kanji carry meaning. Kana readings support them. Katakana commonly writes names and loanwords. Do not try to memorise all three scripts in one day.',
    register: 'Use こんにちは with an adult you meet during the day. すみません politely gets attention. お願いします makes the repair request usable with a new acquaintance.',
    review: 'After a break, cover the examples and recall one greeting and one repair phrase. Tomorrow, ask for repetition before introducing yourself.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'Listen to a request from a new classmate. What should you do?', source('もう一度、ゆっくりお願いします。', 'もういちど、ゆっくりおねがいします。', 'One more time, slowly, please.'), ['Repeat more slowly', 'Say goodbye', 'State a price'], 'Repeat more slowly', 'もう一度 asks for another repetition. ゆっくり specifies slowly. It is a request, not a greeting.'),
      choose(`${id}.read`, 'reading', 'You meet a neighbour in the afternoon. Which phrase on this help card fits?', source('こんにちは。／ありがとうございます。／さようなら。', 'こんにちは。／ありがとうございます。／さようなら。', 'Hello. / Thank you. / Goodbye.'), ['こんにちは。', 'ありがとうございます。', 'さようなら。'], 'こんにちは。', 'こんにちは is a daytime greeting. Thanks and goodbye serve different moments in the exchange.'),
      script(`${id}.script`, 'Type the hiragana greeting “hello”: konnichiwa. The final particle is written は.', ['こんにちは', 'こんにちは。'], 'hiragana', 'こんにちは ends in は, pronounced wa in this fixed greeting. こんにちわ is not the standard spelling.'),
      produce(`${id}.write`, 'write', 'Write a two-line note for your study partner: greet them, then ask them to repeat slowly.', 'こんにちは。\nもう一度、ゆっくりお願いします。\nHello. One more time, slowly, please.', ['I included a daytime greeting.', 'I requested repetition and a slower pace.'], 'A short complete request is enough. You do not need to explain why you did not understand.'),
      produce(`${id}.speak`, 'speak', 'A neighbour says something too quickly. Get their attention and request a slower repetition. Then thank them.', 'すみません。もう一度、ゆっくりお願いします。ありがとうございます。\nExcuse me. One more time, slowly, please. Thank you.', ['I used すみません to get attention.', 'I asked for repetition slowly, then thanked the person.'], 'Use a calm pause between phrases. Playback and repetition are practice. This activity does not score pronunciation.'),
    ],
    checkpoint: id => [
      choose(`${id}.repair`, 'listening', 'Without opening the transcript first, identify what the speaker needs.', source('すみません。もう一度お願いします。', 'すみません。もういちどおねがいします。', 'Excuse me. One more time, please.'), ['Another repetition', 'A cheaper item', 'A person’s name'], 'Another repetition', 'もう一度 is the key repair phrase. Add ゆっくり when speed is the problem.'),
      produce(`${id}.transfer`, 'speak', 'You did not understand an announcement at a class. Make a polite repair request from memory, then check the model.', 'すみません。もう一度、ゆっくりお願いします。\nExcuse me. One more time, slowly, please.', ['I made a usable polite request without needing a full introduction.', 'I can say which part I needed support for and repeat that part once.'], 'If recall is difficult, revisit the study and listening tasks, then retry after a short break.'),
    ],
  }),
  guide(2, {
    canDos: ['I can introduce my name, origin and current home to a new classmate.', 'I can identify where another person lives from a short introduction.'],
    preparation: 'Review day 1 repair phrases and basic hiragana. Use an invented name or home if you prefer. Origin and present residence are different details.',
    script: 'Continue hiragana. Read the particles は (wa) and に (ni) in whole phrases. Start katakana with アレックス and フランス. Your own name may use another spelling.',
    register: 'Use です／ます with a new adult classmate. Add さん to another person’s name when appropriate, never to your own name.',
    review: 'Tomorrow, recall your introduction before looking. Revisit the repair request after three days. Use it if you miss a name.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'Listen to the introduction. Where does Alex live now?', source('アレックスです。フランスから来ました。今、東京に住んでいます。', 'あれっくすです。ふらんすからきました。いま、とうきょうにすんでいます。', 'I am Alex. I came from France. I live in Tokyo now.'), ['Tokyo', 'France', 'The place is not stated'], 'Tokyo', '今 and 住んでいます identify the current home. フランスから is the origin.'),
      choose(`${id}.read`, 'reading', 'Read a classmate’s profile. Which detail is their origin?', source('森です。大阪から来ました。今、東京に住んでいます。', 'もりです。おおさかからきました。いま、とうきょうにすんでいます。', 'I am Mori. I came from Osaka. I live in Tokyo now.'), ['Osaka', 'Tokyo', 'Mori'], 'Osaka', 'から marks the origin. に住んでいます gives the current place of residence.'),
      script(`${id}.script`, 'Type France in katakana: furansu.', ['フランス'], 'katakana', 'フランス is a conventional katakana country name. Do not lengthen the vowel after フ.'),
      produce(`${id}.write`, 'write', 'Fill a class profile in three short sentences: your name, origin and current home. Fictional details are welcome.', 'アレックスです。フランスから来ました。今、東京に住んでいます。\nI am Alex. I came from France. I live in Tokyo now.', ['I gave three distinct details.', 'I used から for origin and に住んでいます for home.', 'I did not add さん to my own name.'], 'You can omit 私は when the profile clearly describes you. You may copy a supported place name.'),
      produce(`${id}.speak`, 'speak', 'Meet a new adult classmate. Greet them, introduce yourself, then ask them to repeat their name if you missed it.', 'こんにちは。アレックスです。フランスから来ました。すみません。もう一度お願いします。\nHello. I am Alex. I came from France. Excuse me. One more time, please.', ['I used a polite introduction.', 'I reused a day 1 repair phrase when needed.'], 'A successful exchange includes managing a misunderstanding, not just reciting a profile.'),
    ],
    checkpoint: id => [
      choose(`${id}.origin`, 'listening', 'Choose the accurate summary of this introduction.', source('森です。東京から来ました。今、大阪に住んでいます。', 'もりです。とうきょうからきました。いま、おおさかにすんでいます。', 'I am Mori. I came from Tokyo. I live in Osaka now.'), ['From Tokyo. Lives in Osaka', 'From Osaka. Lives in Tokyo', 'No present home is given'], 'From Tokyo. Lives in Osaka', 'Keep the roles of the two place names separate. から is from. に住んでいます is lives in.'),
      produce(`${id}.transfer`, 'write', 'Write a short first message to a classmate: greeting, name, home and a request to speak slowly.', 'こんにちは。アレックスです。東京に住んでいます。ゆっくりお願いします。\nHello. I am Alex. I live in Tokyo. Slowly, please.', ['My message introduces me and helps the conversation continue.', 'I combined an introduction with a day 1 repair phrase.'], 'If home and origin are confused, repeat the listening task before moving to shopping.'),
    ],
  }),
  guide(3, {
    canDos: ['I can request two items, understand a stated total and decline a bag.', 'I can read a short shop note with a price and a quantity.'],
    preparation: 'Recall day 2’s polite introduction ending です. Review numbers 1–10 and the supported 300-yen sound change. This is a small purchase task, not the whole Japanese counter system.',
    script: 'Practise katakana パン and コーヒー, noticing the long-vowel mark ー. Recognise 円 with its reading えん. Kana or supported kanji are both useful in writing.',
    register: 'A customer can use すみません to get attention and ください for an item request. 袋はいりません politely declines a bag. It does not mean there are no bags in the shop.',
    review: 'Tomorrow, recall the request without the model. After three days, change two items to one and listen for the new quantity.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'Listen to the shop total. How much should you pay?', source('パンを二つですね。全部で三百円です。', 'ぱんをふたつですね。ぜんぶでさんびゃくえんです。', 'Two pieces of bread, right? The total is 300 yen.'), ['300 yen', '200 yen', 'Two yen'], '300 yen', '三百円 is さんびゃくえん. 二つ tells the quantity, not the total price.'),
      choose(`${id}.read`, 'reading', 'Read your shopping note. What must the purchase include?', source('パンを二つ。袋はいりません。', 'ぱんをふたつ。ふくろはいりません。', 'Two pieces of bread. I do not need a bag.'), ['Two bread items. No bag', 'One bread item and a bag', 'No bread. Two bags'], 'Two bread items. No bag', '二つ is two. いりません declines the bag. Keep the two details together.'),
      script(`${id}.script`, 'Type coffee in katakana: kōhī. Include both long-vowel marks.', ['コーヒー'], 'katakana', 'コーヒー has two ー marks. コヒ changes the vowel lengths and is not the target spelling.'),
      produce(`${id}.write`, 'write', 'Write a short shopping note asking for two bread items and declining a bag.', 'パンを二つください。袋はいりません。\nTwo pieces of bread, please. I do not need a bag.', ['I named the item and the quantity.', 'I made the bag preference clear.'], '一つ and 二つ are useful supported quantities. Other items can need different counters.'),
      produce(`${id}.speak`, 'speak', 'At a bakery, get attention, order two bread items, ask the price and thank the staff member.', 'すみません。パンを二つください。いくらですか。ありがとうございます。\nExcuse me. Two pieces of bread, please. How much is it? Thank you.', ['I requested an item and quantity politely.', 'I asked the price and closed with thanks.'], 'Keep the item, quantity and request together. If you miss the total, reuse もう一度お願いします.'),
    ],
    checkpoint: id => [
      choose(`${id}.quantity`, 'listening', 'Which shopping note matches the customer’s request?', source('パンを一つください。袋はいりません。', 'ぱんをひとつください。ふくろはいりません。', 'One piece of bread, please. I do not need a bag.'), ['One bread item, no bag', 'Two bread items, no bag', 'One bread item and a bag'], 'One bread item, no bag', '一つ is one. Do not reuse the earlier quantity of two without listening.'),
      produce(`${id}.transfer`, 'speak', 'Order one bread item. You miss the price: request a slower repetition and then decline a bag.', 'パンを一つください。すみません。もう一度、ゆっくりお願いします。袋はいりません。\nOne piece of bread, please. Excuse me. One more time, slowly, please. I do not need a bag.', ['I changed the quantity rather than copying two.', 'I used a day 1 repair phrase and stated my bag preference.'], 'Review quantity and listening if either detail was missed. Supported performance is still useful practice.'),
    ],
  }),
  guide(4, {
    canDos: ['I can ask where a station is and follow one short direction.', 'I can check an opening time, including a.m. or p.m. when needed.'],
    preparation: 'Review shop quantities and the repair toolkit. Practise one direction at a time. No map-reading ability is assumed.',
    script: 'Recognise 駅 (えき), 右 (みぎ), 左 (ひだり) and 時 (じ) as useful signs. Keep kana readings available. Number + 時 has special readings such as 四時 (よじ).',
    register: 'Get a stranger’s attention with すみません. Ask with ですか. Thank them after they help. Confirm an ambiguous time rather than guessing morning or evening.',
    review: 'Later today, say the station question from memory. In three days, revisit the opening time and change the starting hour.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'Listen to a direction. Which first action should you take?', source('まっすぐ行って、右に曲がってください。駅はそこです。', 'まっすぐいって、みぎにまがってください。えきはそこです。', 'Go straight and turn right. The station is there.'), ['Go straight, then turn right', 'Turn left immediately', 'Wait at the station'], 'Go straight, then turn right', 'まっすぐ is straight. 右 is right. Preserve the sequence.'),
      choose(`${id}.read`, 'reading', 'Read the opening-hours sign. When does it close?', source('午前九時から午後五時まで', 'ごぜんくじからごごごじまで', 'From 9 a.m. until 5 p.m.'), ['5 p.m.', '9 a.m.', '5 a.m.'], '5 p.m.', 'まで marks the endpoint. 午後 specifies p.m. から marks the opening time.'),
      script(`${id}.script`, 'Type the hiragana reading of 駅, “station”.', ['えき'], 'hiragana', '駅 is read えき here. Learning a useful whole word helps connect a kanji sign to its sound.'),
      produce(`${id}.write`, 'write', 'Write a message to a friend: the place opens at nine in the morning and closes at five in the afternoon.', '午前九時から午後五時までです。\nIt is from 9 a.m. until 5 p.m.', ['I preserved the starting and ending times.', 'I included morning and afternoon.'], 'Kana writing such as ごぜんくじ is acceptable for this communication goal. Compare it with the supported kanji.'),
      produce(`${id}.speak`, 'speak', 'Ask a stranger where the station is. If you miss the direction, ask for a slower repetition and thank them.', 'すみません。駅はどこですか。もう一度、ゆっくりお願いします。ありがとうございます。\nExcuse me. Where is the station? One more time, slowly, please. Thank you.', ['I asked a clear location question.', 'I repaired a misunderstanding and thanked the person.'], 'You can ask for one direction again instead of pretending to understand a full route.'),
    ],
    checkpoint: id => [
      choose(`${id}.time`, 'listening', 'A friend confirms the meeting time. Which time belongs in your note?', source('午後三時です。駅で会いましょう。', 'ごごさんじです。えきであいましょう。', 'It is 3 p.m. Let’s meet at the station.'), ['3 p.m. at the station', '3 a.m. at the station', '9 a.m. at a shop'], '3 p.m. at the station', '午後 is p.m. Both the hour and the meeting place matter.'),
      produce(`${id}.transfer`, 'speak', 'Foundation/A1 checkpoint: introduce your name to a classmate, ask where the station is, and check whether the meeting is at 3 p.m.', 'アレックスです。駅はどこですか。午後三時ですか。\nI am Alex. Where is the station? Is it 3 p.m.?', ['I reused my name introduction from day 2.', 'I asked about location and confirmed the time instead of guessing.'], 'Revisit day 2 for an introduction, day 1 for repair, or this day for time/location before continuing.'),
    ],
  }),
  guide(5, {
    canDos: ['I can describe when and where I do a daily activity.', 'I can say what I do not often do and compare two routines.'],
    preparation: 'Review times from day 4 and the katakana words from shopping. This A1 consolidation brings time, place and a polite verb together.',
    script: 'Read 七時 (しちじ), 家 (いえ), 朝ご飯 (あさごはん). Contrast the particles に for a clock time and で for the place of an action. Copying supported kanji is optional.',
    register: 'Use ます／ません in a polite conversation. Omit 私は when it is clear whose routine you describe. Avoid adding a subject to every sentence mechanically.',
    review: 'Tomorrow, give a routine without reading. After three days compare it with yesterday. After seven days revisit day 3 shopping and day 4 times.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'Listen to a routine. Where does the speaker eat breakfast?', source('毎朝、七時に起きます。家で朝ご飯を食べます。', 'まいあさ、しちじにおきます。いえであさごはんをたべます。', 'Every morning I get up at seven. I eat breakfast at home.'), ['At home', 'At the station', 'At seven'], 'At home', '家で gives the action’s location. 七時に is a time, not a place.'),
      choose(`${id}.read`, 'reading', 'Read a routine note. How often does this person drink coffee?', source('朝ご飯を食べます。コーヒーはあまり飲みません。', 'あさごはんをたべます。こーひーはあまりのみません。', 'I eat breakfast. I do not drink coffee very often.'), ['Not very often', 'Every morning', 'Never, with absolute certainty'], 'Not very often', 'あまり + negative means not very often/much. It does not always mean never.'),
      script(`${id}.script`, 'Type the reading of 七時, “seven o’clock”, using the reading taught here.', ['しちじ'], 'hiragana', '七時 is commonly しちじ. しち is the supported seven used with 時 in this day.'),
      produce(`${id}.write`, 'write', 'Write a two- or three-sentence routine for a class profile. Include a time, an action place and one negative habit.', '七時に起きます。家で朝ご飯を食べます。コーヒーはあまり飲みません。\nI get up at seven. I eat breakfast at home. I do not drink coffee very often.', ['I used に for a clock time and で for an action place.', 'My negative habit uses ません.'], '毎朝 does not usually take に. Keep a specific time and a habitual time expression distinct.'),
      produce(`${id}.speak`, 'speak', 'Tell a classmate two things you do on an ordinary morning and one thing you do not do often.', '毎朝、七時に起きます。家で朝ご飯を食べます。コーヒーはあまり飲みません。\nEvery morning I get up at seven. I eat breakfast at home. I do not drink coffee very often.', ['I communicated a usable routine in short complete sentences.', 'I included a negative rather than only listing nouns.'], 'Separate sentences are sufficient at A1. You will practise linking events next.'),
    ],
    checkpoint: id => [
      choose(`${id}.details`, 'listening', 'A classmate gives two details. Choose the accurate note.', source('七時に起きます。八時に駅に行きます。', 'しちじにおきます。はちじにえきにいきます。', 'I get up at seven. I go to the station at eight.'), ['Up at seven. Station at eight', 'Up at eight. Station at seven', 'At home until nine'], 'Up at seven. Station at eight', 'Attach each time to its own action. Reversing the times changes the routine.'),
      produce(`${id}.transfer`, 'speak', 'A1 unit checkpoint: introduce yourself, describe your morning and confirm a 3 p.m. meeting at the station. Ask for repetition if needed.', 'アレックスです。毎朝、七時に起きます。家で朝ご飯を食べます。午後三時に駅ですね。\nI am Alex. Every morning I get up at seven. I eat breakfast at home. Three p.m. at the station, right?', ['I combined introduction, routine and a time/place confirmation.', 'I can identify a detail to revisit in days 1–4 if I needed help.'], 'If you needed the model, revisit day 2 for introductions, day 4 for time/place or day 1 for repair, then repeat this checkpoint. Completion is activity, not an A1 certificate.'),
    ],
  }),
  guide(6, {
    canDos: ['I can give a short past account and state something I did not do.', 'I can ask someone to show an existing photo or take a new one.'],
    preparation: 'Reuse routine ます forms from day 5 and place/time details. Learn the specific te-forms in this day before trying unfamiliar verbs.',
    script: 'Recognise 昨日 (きのう), 写真 (しゃしん), 行きました (いきました). Practise small ゃ in しゃ and the long vowel in きのう. Move gradually from kana recognition to supported kanji words.',
    register: 'Keep polite past endings with adult classmates. ください is usable in a cooperative exchange. Get a stranger’s attention first and consider a softer request when imposing on them.',
    review: 'Tomorrow retell yesterday with one changed detail. In three days recall past negative. In seven days combine a past account with a service request.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'What did the speaker NOT do yesterday?', source('昨日、公園に行きました。写真を撮りました。でも、博物館には行きませんでした。', 'きのう、こうえんにいきました。しゃしんをとりました。でも、はくぶつかんにはいきませんでした。', 'Yesterday I went to the park and took photos. But I did not go to the museum.'), ['Visit the museum', 'Go to the park', 'Take photos'], 'Visit the museum', '行きませんでした is past negative. The park and photos are positive past actions.'),
      choose(`${id}.read`, 'reading', 'Your classmate already has photos on a phone. What does this message ask them to do?', source('写真を見せてください。', 'しゃしんをみせてください。', 'Please show me the photos.'), ['Show existing photos', 'Take new photos', 'Delete the photos'], 'Show existing photos', '見せて is show. 撮って would ask someone to take a photo.'),
      script(`${id}.script`, 'Type the hiragana reading of 写真, “photo”. Use small ゃ.', ['しゃしん'], 'hiragana', 'しゃ is one contracted sound with small ゃ. しやしん has a different rhythm.'),
      produce(`${id}.write`, 'write', 'Write a short message about yesterday: a place, two actions in order, a reaction and one thing you did not do.', '昨日、公園に行きました。写真を撮って、それから帰りました。楽しかったです。博物館には行きませんでした。\nYesterday I went to the park. I took photos, then went home. It was enjoyable. I did not go to the museum.', ['My account distinguishes past positive and past negative.', 'I sequenced two actions using a supported te-form or separate sentences.', 'I used 楽しかったです for the past reaction.'], 'Separate sentences with それから also work. Do not invent a te-form by replacing every verb ending in the same way.'),
      produce(`${id}.speak`, 'speak', 'Describe a real or imaginary outing, then ask your classmate to show their photos. Add one follow-up “How was it?”', '昨日、公園に行きました。楽しかったです。どうでしたか。写真を見せてください。\nYesterday I went to the park. It was enjoyable. How was it? Please show me the photos.', ['I gave a past place and reaction.', 'I asked a follow-up and requested the right action for existing photos.'], 'A conversation includes listening space after the follow-up, not only your own report.'),
    ],
    checkpoint: id => [
      choose(`${id}.request`, 'listening', 'The speaker is holding a camera without a photo yet. What help do they request?', source('すみません。写真を撮ってください。', 'すみません。しゃしんをとってください。', 'Excuse me. Please take a photo.'), ['Take a photo', 'Show an existing photo', 'Explain opening hours'], 'Take a photo', '撮って requests taking a new photograph. 見せて asks to show something that exists.'),
      produce(`${id}.transfer`, 'write', 'Write to a classmate about yesterday: say when you went to the station, where you went next and one place you did not visit.', '昨日、九時に駅に行きました。それから、公園に行きました。博物館には行きませんでした。\nYesterday I went to the station at nine. After that I went to the park. I did not visit the museum.', ['I reused clock time and place from days 4–5.', 'I used past forms and an accurate negative.'], 'Review day 4 for time or this day for past forms before the permission task.'),
    ],
  }),
  guide(7, {
    canDos: ['I can state a plan and ask whether an action is allowed.', 'I can distinguish a prohibition from permission in a short notice.'],
    preparation: 'Review day 6 supported te-forms and day 4 times. Learn 行く and 使う as specific dictionary forms. You do not need the entire verb system first.',
    script: 'Read パソコン and recognise 禁止 (きんし) on a supported notice. Notice voiced marks and small kana when typing. Begin reading short rules with kana support.',
    register: 'Ask staff with 〜てもいいですか. Do not treat a plan as permission. Different venues have different rules. The notices here are invented scenarios.',
    review: 'Tomorrow compare 使ってください with 使ってもいいですか. Revisit the rule in three days and explain its practical consequence.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'What is the visitor asking the staff member?', source('ここでパソコンを使ってもいいですか。', 'ここでぱそこんをつかってもいいですか。', 'May I use a computer here?'), ['Whether computer use is allowed', 'For staff to use a computer', 'Whether a computer is broken'], 'Whether computer use is allowed', 'てもいいですか asks permission for the speaker’s action. てください asks the listener to act.'),
      choose(`${id}.read`, 'reading', 'Read this library notice. What should you do with a drink?', source('ここでは飲んではいけません。飲み物はかばんに入れてください。', 'ここではのんではいけません。のみものはかばんにいれてください。', 'You must not drink here. Please put drinks in your bag.'), ['Keep it in your bag. Do not drink here', 'Drink quietly at the desk', 'Ask another visitor to drink it'], 'Keep it in your bag. Do not drink here', '飲んではいけません is a restriction. The next sentence gives the requested action.'),
      script(`${id}.script`, 'Type “computer” in katakana: pasokon.', ['パソコン'], 'katakana', 'パ uses a small circle (handakuten). バソコン changes the initial sound.'),
      produce(`${id}.write`, 'write', 'Write a message to staff: you plan to go to the library tomorrow. Ask whether you may use a computer there.', '明日、図書館に行く予定です。パソコンを使ってもいいですか。\nI plan to go to the library tomorrow. May I use a computer?', ['My plan uses the supported dictionary form 行く予定です.', 'I asked permission instead of claiming it was granted.'], 'A polite outer sentence can contain a dictionary form. 行きます予定です is not the supported pattern.'),
      produce(`${id}.speak`, 'speak', 'At a library, state your plan and ask permission to use a computer. If you do not understand the rule, request repetition.', '明日、ここで勉強する予定です。パソコンを使ってもいいですか。すみません。もう一度お願いします。\nI plan to study here tomorrow. May I use a computer? Excuse me. One more time, please.', ['I separated my plan from the permission question.', 'I can repair an unclear reply using day 1 language.'], '勉強する is a supported additional dictionary form meaning study. A clear permission question matters more than a long introduction.'),
    ],
    checkpoint: id => [
      choose(`${id}.rule`, 'reading', 'You want to drink while studying. Which plan follows this notice?', source('この部屋では飲食禁止です。飲み物は外でお願いします。', 'このへやではいんしょくきんしです。のみものはそとでおねがいします。', 'No eating or drinking in this room. Please have drinks outside.'), ['Drink outside the room', 'Drink at the room’s desk', 'Eat quietly inside'], 'Drink outside the room', '飲食禁止 covers both eating and drinking. 外 means outside. Permission elsewhere is not implied.'),
      produce(`${id}.transfer`, 'speak', 'Tell a classmate yesterday you went to the library. For tomorrow, ask staff permission to use a computer and confirm a 9 a.m. opening.', '昨日、図書館に行きました。明日、パソコンを使ってもいいですか。午前九時からですか。\nYesterday I went to the library. May I use a computer tomorrow? Is it open from 9 a.m.?', ['I kept yesterday’s event and tomorrow’s permission distinct.', 'I reused time confirmation from day 4.'], 'Return to day 6 if the past form slips, or day 4 if morning/afternoon is unclear.'),
    ],
  }),
  guide(8, {
    canDos: ['I can describe an observable service problem and explain its consequence.', 'I can ask politely for a specific action without assigning blame.'],
    preparation: 'Review day 6 action requests and day 7 questions. Practise the supported もらえますか request before adding longer reasons.',
    script: 'Read 部屋 (へや), 寒い (さむい) and 毛布 (もうふ) with readings. Recognise 一枚 (いちまい), a counter for a flat item. Do not generalise it to all objects.',
    register: 'Describe 動きません (does not work) when that is what you observed. 確認してもらえますか is a polite request to check. A calm reason helps staff choose an action.',
    review: 'Tomorrow change the problem while keeping a concrete requested action. After three days, combine a service problem with a proposed alternative.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'Listen to a guest’s message. What action do they request?', source('部屋が寒いので、毛布を一枚お願いします。', 'へやがさむいので、もうふをいちまいおねがいします。', 'The room is cold, so I would like one blanket.'), ['Bring one blanket', 'Change the meeting time', 'Take a photograph'], 'Bring one blanket', '寒いので gives the reason. 毛布を一枚 is the requested item and quantity.'),
      choose(`${id}.read`, 'reading', 'Read a message to reception. What is definitely known?', source('エアコンが動きません。確認してもらえますか。', 'えあこんがうごきません。かくにんしてもらえますか。', 'The air conditioner does not operate. Could you check it?'), ['It does not operate. A check is requested', 'Staff have confirmed it is broken', 'The room has already been changed'], 'It does not operate. A check is requested', 'A reported symptom is not a confirmed diagnosis or completed repair.'),
      script(`${id}.script`, 'Type the hiragana reading of 毛布, “blanket”. Notice the long vowel.', ['もうふ'], 'hiragana', '毛布 is もうふ. The う helps represent the long vowel. もふ is not the target.'),
      produce(`${id}.write`, 'write', 'Write a message to reception with one observable problem, its effect on you and a concrete request.', 'エアコンが動きません。部屋が寒いので、毛布を一枚お願いします。確認してもらえますか。\nThe air conditioner does not operate. The room is cold, so I would like one blanket. Could you check it?', ['I described a symptom rather than blaming someone.', 'I gave a reason and a feasible requested action.'], 'You may use shorter separate sentences. Do not claim a cause that you do not know.'),
      produce(`${id}.speak`, 'speak', 'Call reception in a fictional hotel. Get attention, explain that the room is cold and ask for one blanket. Ask them to repeat their reply if needed.', 'すみません。部屋が寒いので、毛布を一枚お願いします。もう一度、ゆっくりお願いします。\nExcuse me. The room is cold, so I would like one blanket. One more time, slowly, please.', ['I made the problem and request understandable.', 'I included the quantity and could repair an unclear reply.'], 'A clear symptom plus request is enough. You do not need an exaggerated apology.'),
    ],
    checkpoint: id => [
      choose(`${id}.response`, 'listening', 'Reception replies. What will happen next?', source('毛布を一枚お持ちします。エアコンは明日、確認します。', 'もうふをいちまいおもちします。えあこんはあした、かくにんします。', 'We will bring one blanket. We will check the air conditioner tomorrow.'), ['Blanket promised. Air-conditioner check tomorrow', 'Air conditioner already repaired', 'A new room is confirmed'], 'Blanket promised. Air-conditioner check tomorrow', 'The blanket is promised, and 明日 specifies the later check. A repair or room change has not been promised.'),
      produce(`${id}.transfer`, 'write', 'You were cold yesterday and received a blanket. Write a thank-you, then ask whether the air conditioner can be checked today.', '昨日は寒かったですが、毛布をありがとうございました。今日、エアコンを確認してもらえますか。\nIt was cold yesterday, but thank you for the blanket. Could you check the air conditioner today?', ['I distinguished the past problem from today’s request.', 'I reused thanks from day 1 and a polite service request.'], '寒かったです is the polite past of 寒いです. The supported connector ですが means but. Separate sentences also work.'),
    ],
  }),
  guide(9, {
    canDos: ['I can compare two practical options using a relevant feature.', 'I can invite someone, explain a scheduling conflict and suggest an alternative.'],
    preparation: 'Review day 3 prices, day 4 times and day 8 reasons. This day consolidates selected A2 tasks. It is not evidence of complete A2 coverage.',
    script: 'Read 安い (やすい), 便利 (べんり) and the weekdays 土曜日 (どようび), 日曜日 (にちようび). Write supported whole words before attempting isolated kanji recall.',
    register: 'ませんか makes an invitation. ましょう proposes doing something together. A scheduling refusal is clearer with an alternative. ちょっと alone can be indirect for a new learner.',
    review: 'Tomorrow, change a price or day and negotiate again. Revisit days 6–8 in three days. In seven days compare another two realistic choices.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'Listen to the reply to an invitation. Which day is proposed instead?', source('日曜日は都合が悪いです。土曜日はどうですか。', 'にちようびはつごうがわるいです。どようびはどうですか。', 'Sunday does not work for me. How about Saturday?'), ['Saturday', 'Sunday', 'No alternative is given'], 'Saturday', '日曜日 is the conflict. 土曜日 is the proposed alternative. A refusal is not a rejection of meeting altogether.'),
      choose(`${id}.read`, 'reading', 'Read two café notes. You want the cheaper option. Which do you choose?', source('A店：コーヒー三百円。B店：コーヒー五百円。どちらも駅の前です。', 'えーてん：こーひーさんびゃくえん。びーてん：こーひーごひゃくえん。どちらもえきのまえです。', 'Café A: coffee 300 yen. Café B: coffee 500 yen. Both are in front of the station.'), ['Café A', 'Café B', 'Both cost the same'], 'Café A', 'Three hundred is lower than five hundred. Both share the same location, so price decides this stated preference.'),
      script(`${id}.script`, 'Type just the meeting day in Japanese: Saturday. Kana and kanji are both accepted.', ['土曜日', 'どようび'], 'meaning', '土曜日 and どようび give the same day. 日曜日 (にちようび) means Sunday.'),
      produce(`${id}.write`, 'write', 'Write an invitation comparing cafés A and B (300 and 500 yen, both by the station). Suggest Saturday because Sunday does not work.', 'A店はB店より安いです。日曜日は都合が悪いです。土曜日にA店でコーヒーを飲みませんか。\nCafé A is cheaper than café B. Sunday does not work for me. Would you like to have coffee at café A on Saturday?', ['I compared the correct prices.', 'I gave a workable day and an invitation.', 'I did not describe an unconfirmed meeting as agreed.'], 'より follows the comparison standard. An invitation still needs the other person’s agreement.'),
      produce(`${id}.speak`, 'speak', 'Invite a classmate for coffee. Their suggested Sunday does not work: propose Saturday and explain one practical reason for your café choice.', '日曜日は都合が悪いです。土曜日はどうですか。A店は安いので、A店で飲みませんか。\nSunday does not work for me. How about Saturday? Café A is inexpensive, so would you like to have a drink there?', ['I handled the schedule conflict with an alternative.', 'I gave a relevant reason and left room for a reply.'], 'A successful negotiation respects both people’s constraints. Do not simply repeat your first invitation.'),
    ],
    checkpoint: id => [
      choose(`${id}.comparison`, 'listening', 'Which practical advantage does the speaker give?', source('A店は安いですが、B店のほうが静かです。B店で勉強しませんか。', 'えーてんはやすいですが、びーてんのほうがしずかです。びーてんでべんきょうしませんか。', 'Café A is cheap, but café B is quieter. Would you like to study at café B?'), ['B is quieter for study', 'B is cheaper', 'A is quieter'], 'B is quieter for study', 'The speaker acknowledges A’s price, then prioritises B’s quietness. Cheaper does not automatically mean the proposed choice.'),
      produce(`${id}.transfer`, 'speak', 'A2 unit checkpoint: describe yesterday’s café problem, suggest another café for tomorrow, compare one feature and ask whether computer use is allowed.', '昨日、A店は寒かったです。B店のほうが静かなので、明日はB店で勉強しませんか。パソコンを使ってもいいですか。\nYesterday café A was cold. Café B is quieter, so shall we study there tomorrow? May we use computers?', ['I combined a past problem, a reason and an invitation.', 'I distinguished permission from a settled plan.', 'I can choose days 6, 7 or 8 for targeted review.'], 'Review day 6 for past forms, day 7 for permission, day 8 for problem/request language or day 9 for comparison and invitation. Retry later with one detail changed. Self-review does not certify A2.'),
    ],
  }),
  guide(10, {
    canDos: ['I can tell a connected short experience with a setback, response and outcome.', 'I can answer a follow-up using information from the account.'],
    preparation: 'Selected B1 task: build on past forms, reasons and requests from days 6–9. Take more than one session if needed. Do not skip supported reading just because the day has a B1 label.',
    script: 'Read short paragraphs with kana support. Notice connectors 最初 (さいしょ), 途中で (とちゅうで), そこで and おかげで. Track what each sentence adds.',
    register: 'A polite account to a classmate can use ました throughout. 〜てくれました expresses a helpful action for the speaker. Use it where that perspective fits.',
    review: 'Tomorrow retell with a different destination. After three days recall only setback → response → result, then compare with the source. Revisit day 6 if past forms block the account.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'Listen to the account. What action addressed the problem?', source('昨日、京都で道に迷いました。そこで、近くの店で道を聞きました。店の人が教えてくれたので、駅に着きました。', 'きのう、きょうとでみちにまよいました。そこで、ちかくのみせでみちをききました。みせのひとがおしえてくれたので、えきにつきました。', 'Yesterday I got lost in Kyoto. So I asked for directions at a nearby shop. A shop worker helped me, so I reached the station.'), ['Asked for directions at a shop', 'Waited at the station', 'Bought a train ticket'], 'Asked for directions at a shop', 'そこで introduces the response to getting lost. Reaching the station is the result.'),
      choose(`${id}.read`, 'reading', 'Which detail is the outcome, rather than the setback or response?', source('最初は道が分かりませんでした。そこで、店で道を聞きました。おかげで、時間に間に合いました。', 'さいしょはみちがわかりませんでした。そこで、みせでみちをききました。おかげで、じかんにまにあいました。', 'At first I did not know the way. So I asked at a shop. Thanks to that, I arrived in time.'), ['Arrived in time', 'Did not know the way', 'Asked at a shop'], 'Arrived in time', 'おかげで links the helpful response to the positive result. The account needs all three roles.'),
      script(`${id}.script`, 'Type the hiragana reading of 最初, “at first”.', ['さいしょ'], 'hiragana', '最初 is さいしょ with small ょ. It introduces the starting situation, not necessarily the final result.'),
      produce(`${id}.write`, 'write', 'Write a 4–5 sentence account of a real or imaginary trip. Include setting, setback, response and result. Do not only list places.', '昨日、京都に行きました。途中で道に迷いました。そこで、店で道を聞きました。店の人が教えてくれました。おかげで、駅に着きました。\nYesterday I went to Kyoto. On the way I got lost. So I asked for directions at a shop. A shop worker helped me. Thanks to that, I reached the station.', ['My response logically addresses the setback.', 'My final sentence states an outcome.', 'I kept the event sequence and past forms understandable.'], 'A connector cannot replace a logical link. If the response does not solve the problem, change the response or describe an unsuccessful outcome honestly.'),
      produce(`${id}.speak`, 'speak', 'Retell the outing in your own words, then answer: “Where did you ask for help?” Avoid reading the full model.', '昨日、京都で道に迷いました。近くの店で道を聞きました。店の人が教えてくれたので、駅に着きました。\nI got lost in Kyoto yesterday. I asked at a nearby shop. A shop worker helped, so I reached the station.', ['I kept setback, action and result connected.', 'I answered the follow-up with the place of asking, not the destination.'], 'Short notes are useful support. Repeat once with fewer notes to practise connected recall.'),
    ],
    checkpoint: id => [
      choose(`${id}.cause`, 'listening', 'Why did the speaker choose the second café?', source('最初の店は寒かったので、別の店に行きました。そちらは静かで、勉強できました。', 'さいしょのみせはさむかったので、べつのみせにいきました。そちらはしずかで、べんきょうできました。', 'The first café was cold, so I went to another one. It was quiet there, and I was able to study.'), ['The first café was cold', 'The second café was cheaper', 'Computer use was forbidden'], 'The first café was cold', 'Only cold is stated as the reason for changing. Do not infer a price or rule that the account does not give.'),
      produce(`${id}.transfer`, 'write', 'Recombine days 7–9: tell a short account about a study plan, one venue problem, a polite request or alternative and its outcome.', '昨日、A店で勉強する予定でした。でも、店は寒かったです。そこで、B店に行きました。静かだったので、勉強できました。\nYesterday I planned to study at café A. But it was cold. So I went to café B. It was quiet, so I could study.', ['I included an initial plan and a meaningful change.', 'I reported the actual outcome rather than only the intention.'], 'If linking ideas is difficult, first draft one sentence per role, then add only the connectors that help.'),
    ],
  }),
  guide(11, {
    canDos: ['I can state a practical opinion with a reason.', 'I can acknowledge a relevant trade-off and propose a balanced option.'],
    preparation: 'Selected B1 task: reuse comparisons, reasons and connected accounts. Learn the plain clause inside と思います. The whole conversation can remain polite.',
    script: 'Read opinion paragraphs by identifying claim, reason and contrast. Recognise 必要 (ひつよう), 相談 (そうだん) and 時間 (じかん) as whole words with readings.',
    register: 'と思います marks a view rather than presenting it as a universal fact. 確かに acknowledges another point. Disagreement can be clear while still recognising the listener’s concern.',
    review: 'Tomorrow give the opposite preference with a plausible reason. In three days listen again and identify the trade-off before offering your own opinion.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'Which need does the speaker acknowledge despite preferring home working?', source('家は静かなので、家で働くほうがいいと思います。ただ、相談する時間も必要だと思います。', 'いえはしずかなので、いえではたらくほうがいいとおもいます。ただ、そうだんするじかんもひつようだとおもいます。', 'Home is quiet, so I think working at home is better. However, I think time to consult each other is also necessary.'), ['Time to consult each other', 'Working only at the office', 'A lower café price'], 'Time to consult each other', 'ただ introduces a contrasting need. It does not cancel the initial preference.'),
      choose(`${id}.read`, 'reading', 'Read the proposal. Which choice balances the two stated needs?', source('家は静かです。一方で、会って相談する時間も必要です。週に一度、同じ場所で会うのはどうですか。', 'いえはしずかです。いっぽうで、あってそうだんするじかんもひつようです。しゅうにいちど、おなじばしょであうのはどうですか。', 'Home is quiet. On the other hand, time to meet and consult is necessary. How about meeting in the same place once a week?'), ['Meet once a week and keep some home time', 'Everyone must meet every day', 'Never meet in person'], 'Meet once a week and keep some home time', 'The proposal keeps quiet home work while arranging consultation time. Neither extreme reflects the proposal.'),
      script(`${id}.script`, 'Type the reading of 相談, “consultation”.', ['そうだん'], 'hiragana', '相談 is そうだん. Keep the long vowel そう and the voiced だ.'),
      produce(`${id}.write`, 'write', 'Write a short opinion on home or shared-space study. Give a reason, acknowledge a different need and propose a balance.', '家は静かなので、家で勉強するほうがいいと思います。ただ、友達と相談する時間も必要です。週に一度、図書館で会うのはどうですか。\nHome is quiet, so I think studying at home is better. However, time to consult friends is also necessary. How about meeting at the library once a week?', ['I supported my view with a relevant reason.', 'I acknowledged a real competing need.', 'My proposal responds to both needs.'], 'After a noun or na-adjective, use だ before と: 必要だと思います. Do not insert です directly before と思います.'),
      produce(`${id}.speak`, 'speak', 'A study partner values quiet. You value discussion. Acknowledge their need and suggest a study arrangement that allows both.', '確かに、静かな時間は大切です。ただ、相談する時間も必要だと思います。最初は一人で勉強して、それから一緒に話しませんか。\nQuiet time certainly matters. However, I think consultation time is also necessary. Shall we study alone first, then talk together?', ['I acknowledged the other person’s concern.', 'I proposed a concrete sequence rather than an unsupported opinion.'], '大切 (たいせつ) means important here. A clear, feasible proposal helps the listener respond.'),
    ],
    checkpoint: id => [
      choose(`${id}.evidence`, 'reading', 'Which claim has direct support in this short account?', source('昨日、図書館は静かでした。家では工事の音がしました。今日は図書館で勉強するほうがいいと思います。', 'きのう、としょかんはしずかでした。いえではこうじのおとがしました。きょうはとしょかんでべんきょうするほうがいいとおもいます。', 'Yesterday the library was quiet. There was construction noise at home. I think studying at the library today is better.'), ['The library may be better for quiet study today', 'The library is always free of noise', 'Everyone must study at the library'], 'The library may be better for quiet study today', 'A specific experience supports a practical choice. It does not prove an absolute rule for everyone.'),
      produce(`${id}.transfer`, 'speak', 'Use yesterday’s experience as a reason for today’s study choice, acknowledge a friend’s different preference and suggest a time to discuss.', '昨日、家はうるさかったので、今日は図書館がいいと思います。確かに、家のほうが便利です。午後三時に図書館で相談しませんか。\nHome was noisy yesterday, so I think the library is better today. Home is certainly more convenient. Shall we consult at the library at 3 p.m.?', ['I linked a day 10 account to my current opinion.', 'I acknowledged a competing feature and made a specific proposal.'], 'Revisit day 9 for comparing options or day 10 for organising the supporting experience.'),
    ],
  }),
  guide(12, {
    canDos: ['I can pass on the action details of a short practical announcement.', 'I can preserve conditions and ask about missing information instead of guessing.'],
    preparation: 'Selected B1 task: use time/place from day 4, plans from day 7 and connected explanation from days 10–11. Read the full notice once before selecting what to pass on.',
    script: 'Read a short notice as a whole. Recognise 雨 (あめ), 場合 (ばあい), 参加費 (さんかひ) and 確認 (かくにん) with support. Read dates, costs and conditions carefully.',
    register: 'と書いてあります identifies written information. A summary should preserve certainty and uncertainty. Ask staff politely about a missing detail rather than attributing your guess to the notice.',
    review: 'Tomorrow summarise from brief notes, then compare every date, place, cost and condition. In three days, revisit day 11 and distinguish opinion from a reported instruction.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'Listen to a community-event message. What changes if it rains?', source('土曜日、午前十時に公園で集まります。雨の場合は、公民館で行います。参加費は五百円です。', 'どようび、ごぜんじゅうじにこうえんであつまります。あめのばあいは、こうみんかんでおこないます。さんかひはごひゃくえんです。', 'We meet in the park at 10 a.m. on Saturday. If it rains, it will be held at the community centre. The participation fee is 500 yen.'), ['The venue becomes the community centre', 'The event is definitely cancelled', 'The fee becomes free'], 'The venue becomes the community centre', '雨の場合は is a condition affecting the venue. No cancellation or fee change is stated.'),
      choose(`${id}.read`, 'reading', 'Read the notice. Which detail still needs confirmation?', source('土曜日午前十時、公園集合。雨の場合は公民館。参加費五百円。飲み物を持ってきてください。', 'どようびごぜんじゅうじ、こうえんしゅうごう。あめのばあいはこうみんかん。さんかひごひゃくえん。のみものをもってきてください。', 'Meet in the park Saturday at 10 a.m. If it rains: community centre. Fee 500 yen. Please bring a drink.'), ['Whether advance booking is required', 'What time to meet', 'What to bring'], 'Whether advance booking is required', 'Time and bringing a drink are stated. Booking is not mentioned. Silence does not prove booking is unnecessary.'),
      script(`${id}.script`, 'Your note needs the kanji for “confirmation/checking”. Type かくにん and choose the kanji with your IME.', ['確認'], 'kanji', '確認 is the kanji form of かくにん. It is useful when a notice leaves an important detail unstated.'),
      produce(`${id}.write`, 'write', 'Summarise this fictional notice to a friend: Saturday 10 a.m., park. If rain, community centre. 500 yen. Bring a drink. Keep the rain plan conditional.', '土曜日の午前十時に公園で集まります。雨の場合は公民館です。参加費は五百円です。飲み物を持ってくるようにと書いてあります。\nWe meet at the park at 10 a.m. on Saturday. If it rains, the venue is the community centre. The fee is 500 yen. It says to bring a drink.', ['I preserved time, normal place, fee and required item.', 'I kept the rain venue conditional.', 'I did not invent a booking rule.'], 'A useful summary keeps action details accurate even when shorter than the original.'),
      produce(`${id}.speak`, 'speak', 'Pass the event details to someone who has not seen the notice. Then ask staff whether advance booking is required.', '土曜日の午前十時に公園で集まります。雨の場合は公民館です。参加費は五百円です。飲み物を持ってきてください。予約が必要かどうか、確認してもらえますか。\nMeet in the park Saturday at 10 a.m. If rain, at the community centre. The fee is 500 yen. Bring a drink. Could you check whether booking is required?', ['I selected details the listener needs to act.', 'I identified booking as an open question, not a fact.'], '必要かどうか means whether it is necessary. Make the missing detail explicit so staff know what to check.'),
    ],
    checkpoint: id => [
      choose(`${id}.condition`, 'reading', 'Which message accurately passes on the notice?', source('日曜日午後三時、駅前で集合。雨の場合は中止。参加費は無料です。', 'にちようびごごさんじ、えきまえでしゅうごう。あめのばあいはちゅうし。さんかひはむりょうです。', 'Meet in front of the station Sunday at 3 p.m. Cancelled if it rains. Participation is free.'), ['Sunday 3 p.m. Station. Free. Cancelled if rain', 'Sunday 3 a.m. Station. Costs 500 yen', 'Definitely cancelled. Meet at the community centre'], 'Sunday 3 p.m. Station. Free. Cancelled if rain', 'This is a new notice. Do not carry over Saturday, 500 yen or the community centre from the earlier source.'),
      produce(`${id}.transfer`, 'write', 'Summarise the new Sunday notice in the previous checkpoint to a friend, then suggest a way to confirm whether it is going ahead.', '日曜日の午後三時に駅前で集まります。無料です。雨の場合は中止です。当日、行うかどうか確認しましょう。\nMeet Sunday at 3 p.m. in front of the station. It is free. It is cancelled if it rains. Let’s check on the day whether it is going ahead.', ['I used the new details rather than the earlier notice.', 'I preserved the cancellation condition and proposed a check.'], '当日 (とうじつ) is the day of the event. Compare with day 11: a proposal to check is separate from what the notice states.'),
    ],
  }),
  guide(13, {
    canDos: ['I can negotiate a solution within time, cost and availability constraints.', 'I can confirm agreement and state who will do what next, by when.'],
    preparation: 'Selected B1 consolidation: revisit day 9 options, day 11 trade-offs and day 12 uncertainty. Use the specific scenario facts. No real booking or payment is made.',
    script: 'Read a short option list with times and prices. Recognise 予約 (よやく), 全員 (ぜんいん) and 参加 (さんか). Use kana support for longer conditions, then try reading key details unaided.',
    register: 'A proposal with 〜ことにしましょう still needs agreement. Confirm remaining conditions before claiming a booking is done. A practical close names an owner, action and deadline.',
    review: 'Tomorrow repeat the negotiation with one constraint changed. In three days revisit your weakest checkpoint. After seven days combine a notice summary with a new proposal. Continue broader study beyond these selected tasks.',
    tasks: id => [
      choose(`${id}.listen`, 'listening', 'Listen to the reply. What condition makes participation possible?', source('二時は参加できません。三時からなら参加できます。', 'にじはさんかできません。さんじからならさんかできます。', 'I cannot attend at two. I can attend if it starts at three.'), ['A start at three', 'A start at two', 'A completed room booking'], 'A start at three', 'なら makes the three-o’clock start a condition. No room has been booked in this reply.'),
      choose(`${id}.read`, 'reading', 'Your group has a 1,000-yen limit and can all attend from 3 p.m. Choose the feasible room.', source('A室：午後三時から。八百円。空きあり。B室：午後二時から。千二百円。空きあり。', 'えーしつ：ごごさんじから。はっぴゃくえん。あきあり。びーしつ：ごごにじから。せんにひゃくえん。あきあり。', 'Room A: from 3 p.m., 800 yen, available. Room B: from 2 p.m., 1,200 yen, available.'), ['Room A', 'Room B', 'Both meet every constraint'], 'Room A', 'A meets time, budget and availability. B exceeds the budget and starts before everyone can attend.'),
      script(`${id}.script`, 'Type the hiragana reading of 予約, “reservation”.', ['よやく'], 'hiragana', '予約 is よやく. Distinguish deciding to reserve from a reservation already being completed.'),
      produce(`${id}.write`, 'write', 'Draft a group message: A starts at 3 p.m., costs 800 yen and is available. B starts at 2 p.m. and costs 1,200 yen. Propose A and say you will book by noon tomorrow if everyone agrees.', 'A室は三時からで、八百円です。B室より安いので、A室にするのはどうですか。全員が賛成なら、明日の正午までに私が予約します。\nRoom A starts at three and costs 800 yen. It is cheaper than B, so how about A? If everyone agrees, I will book it by noon tomorrow.', ['My proposal meets the stated time and budget.', 'I left agreement conditional.', 'I named who will book and the deadline.'], '賛成 (さんせい) means agreement. 正午 (しょうご) is noon. Use these supported words or say agreement/deadline in simpler separate sentences.'),
      produce(`${id}.speak`, 'speak', 'Negotiate with a partner who cannot attend at two. Propose room A at three for 800 yen, ask for agreement, then confirm your next action.', '三時からなら、A室が使えます。八百円です。A室にするのはどうですか。よろしいですか。では、私が明日の正午までに予約します。\nIf we start at three, room A is available. It is 800 yen. How about choosing A? Is that all right? Then I will book it by noon tomorrow.', ['I responded to the partner’s time constraint.', 'I checked agreement before confirming an action.', 'I gave an owner and deadline.'], 'Pause for the partner’s reply before the final confirmation. A proposal is not an agreed decision until they accept.'),
    ],
    checkpoint: id => [
      choose(`${id}.constraints`, 'listening', 'Which summary preserves the agreement and the remaining condition?', source('三時からA室にしましょう。全員が参加できれば、明日の正午までに森さんが予約します。', 'さんじからえーしつにしましょう。ぜんいんがさんかできれば、あしたのしょうごまでにもりさんがよやくします。', 'Let’s choose room A from three. If everyone can attend, Mori will book it by noon tomorrow.'), ['A at three. Mori books by noon tomorrow if all can attend', 'B at two. Already booked', 'A at three. Alex has already paid'], 'A at three. Mori books by noon tomorrow if all can attend', 'The plan names a person and deadline but keeps attendance conditional. It does not claim an existing booking or payment.'),
      produce(`${id}.transfer`, 'write', 'B1 task checkpoint: summarise the agreement from the previous task for an absent member. Explain one reason for the choice, preserve the attendance condition and ask them to confirm by tonight. Finish with who will book and when.', 'A室は三時から使えて、B室より安いので、A室にする予定です。全員が参加できれば、森さんが明日の正午までに予約します。今夜までに参加できるかどうか教えてください。\nWe plan to choose A because it is available from three and cheaper than B. If everyone can attend, Mori will book by noon tomorrow. Please let us know by tonight whether you can attend.', ['I accurately summarised time, option and reason.', 'I preserved the condition and requested missing information.', 'I recorded who will act and by when.', 'I can choose a specific earlier checkpoint for further review.'], 'Review day 10 for connected sequence, day 11 for reasons/trade-offs, day 12 for accurate conditions or day 13 for owner/deadline. Retry your weakest part before repeating the whole task. This is selected B1 practice, not complete B1 competence.'),
    ],
  }),
];

const byDay = new Map(japaneseDailyGuides.map(guide => [guide.dayId, guide]));
export function getJapaneseDailyGuide(dayId: string): JapaneseDailyGuide | undefined {
  return byDay.get(dayId);
}

/** Presentation-only grouping; it does not revise immutable daily-course payloads. */
export const japaneseDailyUnits = [
  { id: 'ja.daily-unit.everyday', title: 'Foundations and selected A1 tasks',
    outcome: 'Use repair language, introduce yourself, buy items, check places/times and describe a routine.',
    dayIds: japaneseDailyGuides.slice(0, 5).map(guide => guide.dayId) },
  { id: 'ja.daily-unit.cooperate', title: 'Selected A2 situations',
    outcome: 'Report an experience, ask permission, explain a problem and arrange a workable plan.',
    dayIds: japaneseDailyGuides.slice(5, 9).map(guide => guide.dayId) },
  { id: 'ja.daily-unit.connect', title: 'Connected B1 tasks',
    outcome: 'Connect an account, weigh reasons, relay a notice accurately and negotiate an agreed next action.',
    dayIds: japaneseDailyGuides.slice(9, 13).map(guide => guide.dayId) },
];
