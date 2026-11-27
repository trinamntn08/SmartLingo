import type { JapanesePracticeTask } from '@smartlingo/domain';
import type { JapaneseAlphabetLesson, KanaScript } from './japanese-alphabet';

type Word = { text: string; reading: string; meaning: string; note?: string };
const word = (text: string, reading: string, meaning: string, note?: string): Word => ({ text, reading, meaning, ...(note ? { note } : {}) });
const rowWords: Record<KanaScript, Record<string, readonly Word[]>> = {
  hiragana: {
    a: [word('あお', 'ao', 'blue'), word('いえ', 'ie', 'house')],
    k: [word('かお', 'kao', 'face'), word('いけ', 'ike', 'pond')],
    s: [word('すし', 'sushi', 'sushi'), word('あさ', 'asa', 'morning')],
    t: [word('くち', 'kuchi', 'mouth'), word('した', 'shita', 'under / below')],
    n: [word('ねこ', 'neko', 'cat'), word('なに', 'nani', 'what')],
    h: [word('はな', 'hana', 'flower', 'Hana can also mean nose. This example means flower.'), word('ふね', 'fune', 'boat')],
    m: [word('みみ', 'mimi', 'ear'), word('うみ', 'umi', 'sea')],
    y: [word('やま', 'yama', 'mountain'), word('ゆめ', 'yume', 'dream')],
    r: [word('くるま', 'kuruma', 'car'), word('とり', 'tori', 'bird')],
    w: [word('わたし', 'watashi', 'I / me'), word('ほん', 'hon', 'book', 'Ho-n has two beats. N is a beat of its own.')],
  },
  katakana: {
    a: [word('エア', 'ea', 'air', 'A loanword used in compounds such as air conditioning. Keep e-a as two beats.')],
    k: [word('カカオ', 'kakao', 'cacao'), word('ケア', 'kea', 'care')],
    s: [word('アイス', 'aisu', 'ice cream', 'In a café, aisu often means ice cream. In drink names it can mean iced.')],
    t: [word('テスト', 'tesuto', 'test'), word('タコス', 'takosu', 'tacos')],
    n: [word('ネクタイ', 'nekutai', 'necktie')],
    h: [word('ハウス', 'hausu', 'house', 'A loanword often used in names and compounds.')],
    m: [word('メモ', 'memo', 'memo / note'), word('ハム', 'hamu', 'ham')],
    y: [word('タイヤ', 'taiya', 'tire'), word('ヨット', 'yotto', 'yacht', 'Preview: small ッ holds a beat before t. Practise it in the small-tsu group.')],
    r: [word('カメラ', 'kamera', 'camera'), word('ホテル', 'hoteru', 'hotel')],
    w: [word('ワイン', 'wain', 'wine'), word('パン', 'pan', 'bread', 'Preview: ゜ changes ハ to パ. The sound-mark groups explain it.')],
  },
};

function wordTasks(id: string, script: KanaScript, words: readonly Word[]): JapanesePracticeTask[] {
  const first = words[0]!;
  return [
    { id: `${id}.read`, mode: 'choice', skill: 'reading', prompt: 'Read this word. What does it mean?', source: { text: first.text },
      choices: [first.meaning, ...['station', 'water', 'ticket'].filter(meaning => meaning !== first.meaning).slice(0, 2)], answer: first.meaning,
      feedback: `${first.text} (${first.reading}) means ${first.meaning}. Read the kana in order.`, retry: 'Read one sound at a time, then join the sounds.' },
    { id: `${id}.type`, mode: 'text', skill: 'script', focus: script, prompt: `Type ${first.reading} (${first.meaning}) in ${script}.`, answers: [first.text],
      feedback: `${first.text} is the spelling. Keep the script, sound marks and small characters as shown.`, retry: `Use your Japanese keyboard to enter ${script}, then commit the text before checking.` },
  ];
}

export function kanaRowSupport(script: KanaScript, row: string): Pick<JapaneseAlphabetLesson, 'examples' | 'practice'> {
  const examples = rowWords[script][row]!;
  return { examples, practice: wordTasks(`ja.alphabet.${script}.${row}`, script, examples) };
}

interface Pattern {
  key: string; title: string; summary: string; forms: readonly string[]; readings: readonly string[];
  words: readonly Word[]; listening?: { text: string; answer: string; choices: readonly string[]; feedback: string };
}
function katakana(text: string) { return [...text].map(char => { const point = char.codePointAt(0)!; return point >= 0x3041 && point <= 0x3096 ? String.fromCodePoint(point + 0x60) : char; }).join(''); }

const voiced: readonly Pattern[] = [
  { key: 'g', title: 'Voiced K → G', summary: 'Two short marks (dakuten) turn the K row into G. Compare か / が. The vowel stays the same.', forms: [...'がぎぐげご'], readings: ['ga', 'gi', 'gu', 'ge', 'go'], words: [word('かぎ', 'kagi', 'key'), word('ごご', 'gogo', 'afternoon')] },
  { key: 'z', title: 'Voiced S → Z and ji', summary: 'Read za, ji, zu, ze, zo. じ is usually typed ji. Keep the two small marks. し and じ are different spellings.', forms: [...'ざじずぜぞ'], readings: ['za', 'ji', 'zu', 'ze', 'zo'], words: [word('みず', 'mizu', 'water'), word('じかん', 'jikan', 'time')] },
  { key: 'd', title: 'Voiced T → D, ji and zu', summary: 'Read da, ji, zu, de, do. ぢ and づ sound like じ and ず in standard Japanese, but spelling follows the word. An IME commonly uses di and du for ぢ and づ.', forms: [...'だぢづでど'], readings: ['da', 'ji (di to type)', 'zu (du to type)', 'de', 'do'], words: [word('でんわ', 'denwa', 'telephone'), word('つづく', 'tsuzuku', 'to continue', 'Type tsuduku in a romaji IME to keep the spelling つづく.')] },
  { key: 'b', title: 'Voiced H → B', summary: 'Dakuten changes ha, hi, fu, he, ho into ba, bi, bu, be, bo. These are full kana plus two marks.', forms: [...'ばびぶべぼ'], readings: ['ba', 'bi', 'bu', 'be', 'bo'], words: [word('かばん', 'kaban', 'bag'), word('ばんごはん', 'bangohan', 'evening meal')] },
  { key: 'p', title: 'The small circle: P', summary: 'The small circle (handakuten) turns the H row into pa, pi, pu, pe, po. Compare は / ば / ぱ.', forms: [...'ぱぴぷぺぽ'], readings: ['pa', 'pi', 'pu', 'pe', 'po'], words: [word('さんぽ', 'sanpo', 'walk / stroll'), word('てんぷら', 'tenpura', 'tempura')] },
];
const contracted: readonly Pattern[] = [
  { key: 'contracted-k', title: 'Small ya, yu, yo: K and G', summary: 'An i-row kana plus small ゃ, ゅ or ょ makes one beat: きゃ is kya, while full-size きや is ki-ya, two beats. The same rule makes gya, gyu and gyo.', forms: ['きゃ', 'きゅ', 'きょ', 'ぎゃ', 'ぎゅ', 'ぎょ'], readings: ['kya', 'kyu', 'kyo', 'gya', 'gyu', 'gyo'], words: [word('きゃく', 'kyaku', 'guest / customer'), word('ぎゅうにゅう', 'gyūnyū', 'milk', 'Gyu-u-nyu-u: four beats. The long-vowel group explains the extra う.')] },
  { key: 'contracted-s', title: 'Small kana: sha, cha and ja', summary: 'Read sha/shu/sho, cha/chu/cho and ja/ju/jo. Each pair of characters with a small ya, yu or yo forms one beat. Start with sha, cha and ja here. Swap the small ending to make the others.', forms: ['しゃ', 'しゅ', 'しょ', 'ちゃ', 'ちゅ', 'ちょ'], readings: ['sha', 'shu', 'sho', 'cha', 'chu', 'cho'], words: [word('おちゃ', 'ocha', 'tea'), word('じゃま', 'jama', 'obstruction / in the way', 'じゃ is ji plus small ya, pronounced ja.')] },
  { key: 'contracted-j', title: 'Small kana: ja, ju and jo', summary: 'じ plus small ya, yu or yo gives ja, ju or jo. Each pair takes one beat. Compare じょ (jo) with じよ (ji-yo).', forms: ['じゃ', 'じゅ', 'じょ'], readings: ['ja', 'ju', 'jo'], words: [word('じゃま', 'jama', 'obstruction / in the way'), word('じゅんび', 'junbi', 'preparation')] },
  { key: 'contracted-n', title: 'Small kana: N and H', summary: 'に and ひ combine with small ya, yu or yo to make nya/nyu/nyo and hya/hyu/hyo. Each combination is one beat.', forms: ['にゃ', 'にゅ', 'にょ', 'ひゃ', 'ひゅ', 'ひょ'], readings: ['nya', 'nyu', 'nyo', 'hya', 'hyu', 'hyo'], words: [word('ひゃく', 'hyaku', 'one hundred'), word('にゅういん', 'nyūin', 'hospital admission', 'Nyu-u-i-n has four beats.')] },
  { key: 'contracted-b', title: 'Small kana: B and P', summary: 'Sound marks also work with contracted sounds: bya/byu/byo and pya/pyu/pyo. Keep the sound mark on the full-size kana and make the following ya, yu or yo small.', forms: ['びゃ', 'びゅ', 'びょ', 'ぴゃ', 'ぴゅ', 'ぴょ'], readings: ['bya', 'byu', 'byo', 'pya', 'pyu', 'pyo'], words: [word('びょういん', 'byōin', 'hospital'), word('はっぴょう', 'happyō', 'presentation / announcement', 'This word combines a held consonant and a long vowel.')] },
  { key: 'contracted-m', title: 'Small kana: M and R', summary: 'み and り combine with small ya, yu or yo: mya/myu/myo and rya/ryu/ryo. These also take one beat per pair.', forms: ['みゃ', 'みゅ', 'みょ', 'りゃ', 'りゅ', 'りょ'], readings: ['mya', 'myu', 'myo', 'rya', 'ryu', 'ryo'], words: [word('りょかん', 'ryokan', 'Japanese-style inn'), word('みゃく', 'myaku', 'pulse')] },
];
const timing: readonly Pattern[] = [
  { key: 'small-tsu', title: 'Small tsu: hold one beat', summary: 'Small っ does not say tsu. Hold one beat before the next consonant: きって is ki-(hold)-te. Full つ says tsu. Type a doubled consonant (kitte) or use xtsu/ltsu for the small symbol.', forms: ['っ', 'つ'], readings: ['held beat', 'tsu'], words: [word('きって', 'kitte', 'postage stamp'), word('きて', 'kite', 'come (request)', 'Ki-te has two beats. Ki-(hold)-te has three.')], listening: { text: 'きって', answer: 'きって · postage stamp · 3 beats', choices: ['きて · come · 2 beats', 'きって · postage stamp · 3 beats'], feedback: 'Small っ holds the middle beat: ki-(hold)-te. It changes the word.' } },
  { key: 'long-vowels', title: 'Long vowels and mora timing', summary: 'A mora is a short timing unit or beat. A long vowel takes two beats. In hiragana, extra あ/い/う/え/お spell the length: おばあさん is o-ba-a-sa-n. おう often sounds like long ō. えい often sounds like long ē. Keep the written spelling when typing.', forms: ['ああ', 'いい', 'うう', 'えい', 'おう'], readings: ['ā (2 beats)', 'ī (2 beats)', 'ū (2 beats)', 'ē / ei (2 beats)', 'ō / ou (2 beats)'], words: [word('おばあさん', 'obāsan', 'grandmother / elderly woman'), word('おばさん', 'obasan', 'aunt / middle-aged woman', 'Four beats, compared with five in おばあさん.'), word('こうえん', 'kōen', 'park', 'Ko-o-e-n: four beats. Type kouen to preserve こうえん.')], listening: { text: 'おばあさん', answer: 'おばあさん · grandmother · 5 beats', choices: ['おばさん · aunt · 4 beats', 'おばあさん · grandmother · 5 beats'], feedback: 'O-ba-a-sa-n has five beats. The extra あ changes the meaning.' } },
];

const kataWords: Record<string, readonly Word[]> = {
  g: [word('ガス', 'gasu', 'gas'), word('ゲーム', 'gēmu', 'game', 'ー extends the previous vowel by one beat.')],
  z: [word('チーズ', 'chīzu', 'cheese', 'Chi-i-zu: three beats. Type the long-vowel bar with the hyphen key.')],
  d: [word('ドア', 'doa', 'door'), word('デザイン', 'dezain', 'design')],
  b: [word('バス', 'basu', 'bus'), word('ビル', 'biru', 'building')],
  p: [word('パン', 'pan', 'bread'), word('ペン', 'pen', 'pen')],
  'contracted-k': [word('キャンプ', 'kyanpu', 'camping'), word('キャベツ', 'kyabetsu', 'cabbage')],
  'contracted-s': [word('シャツ', 'shatsu', 'shirt'), word('チョコ', 'choko', 'chocolate')],
  'contracted-j': [word('ジャム', 'jamu', 'jam'), word('ジュース', 'jūsu', 'juice')],
  'contracted-n': [word('ニュース', 'nyūsu', 'news', 'Nyu-u-su: three beats.')],
  'contracted-b': [word('コンピューター', 'konpyūtā', 'computer'), word('インタビュー', 'intabyū', 'interview')],
  'contracted-m': [word('メニュー', 'menyū', 'menu'), word('リュック', 'ryukku', 'backpack')],
  'small-tsu': [word('チケット', 'chiketto', 'ticket'), word('ベッド', 'beddo', 'bed')],
  'long-vowels': [word('ビール', 'bīru', 'beer'), word('ビル', 'biru', 'building'), word('コーヒー', 'kōhī', 'coffee')],
};

function patternLesson(script: KanaScript, pattern: Pattern, previous: string): JapaneseAlphabetLesson {
  const id = `ja.alphabet.${script}.pattern.${pattern.key}`;
  const isKata = script === 'katakana';
  const examples = isKata ? kataWords[pattern.key]! : pattern.words;
  const forms = isKata ? pattern.forms.map(katakana) : pattern.forms;
  const isLongKata = isKata && pattern.key === 'long-vowels';
  const practice = wordTasks(id, script, examples);
  const listening = isKata && pattern.key === 'small-tsu' ? { text: 'チケット', answer: 'チケット · 4 beats', choices: ['チケット · 3 beats', 'チケット · 4 beats'], feedback: 'Chi-ke-(hold)-to has four beats. Small ッ holds one beat before t.' } : isKata && pattern.key === 'long-vowels' ? { text: 'ビール', answer: 'ビール · beer · 3 beats', choices: ['ビル · building · 2 beats', 'ビール · beer · 3 beats'], feedback: 'Bi-i-ru has three beats. Keep the long vowel to ask for beer.' } : pattern.listening;
  if (listening) practice.push({ id: `${id}.listen`, mode: 'choice', skill: 'listening', prompt: 'Listen, count the beats and choose the word. You can reveal the transcript if audio is unavailable.', source: { text: isKata ? katakana(listening.text) : listening.text }, choices: listening.choices.map(choice => isKata ? katakana(choice) : choice), answer: isKata ? katakana(listening.answer) : listening.answer, feedback: listening.feedback, retry: 'Replay at a comfortable speed. Tap once for each short beat, including a held beat, long vowel or nasal n.' });
  return { id, revision: 1, status: 'draft', script, kind: 'pattern', prerequisites: [previous], title: `${isKata ? 'Katakana' : 'Hiragana'}: ${pattern.title}`,
    summary: isLongKata ? 'Katakana usually uses ー to lengthen the previous vowel: ビール is bi-i-ru, three beats. ビル is bi-ru, two. The mark follows the vowel you just read. Type the long-vowel bar with the hyphen key in a Japanese IME.' : isKata ? katakana(pattern.summary) : pattern.summary,
    characters: (isLongKata ? ['ー'] : forms).map((kana, index) => ({ id: `${id}.form.${index + 1}`, kana, romaji: isLongKata ? 'one more vowel beat' : pattern.readings[index]!, audioText: isLongKata ? 'ビール' : kana === 'っ' || kana === 'ッ' ? (isKata ? 'チケット' : 'きって') : isKata ? kana : katakana(kana), ...(isLongKata || kana === 'っ' || kana === 'ッ' ? { note: 'This timing sign has no isolated spoken sound. Playback uses a complete example word so you can hear its effect.' } : {}) })), examples, practice };
}

function checkpoint(script: KanaScript, previous: string, phase: 'basic' | 'voiced' | 'practical' = 'practical'): JapaneseAlphabetLesson {
  const id = `ja.alphabet.${script}.checkpoint${phase === 'practical' ? '' : `.${phase}`}`;
  const isKata = script === 'katakana';
  const examples = phase === 'basic' ? (isKata ? [word('アイス', 'aisu', 'ice cream'), word('テスト', 'tesuto', 'test'), word('ホテル', 'hoteru', 'hotel')] : [word('すし', 'sushi', 'sushi'), word('ねこ', 'neko', 'cat'), word('ほん', 'hon', 'book')]) : phase === 'voiced' ? (isKata ? [word('ガス', 'gasu', 'gas'), word('バス', 'basu', 'bus'), word('パン', 'pan', 'bread')] : [word('かぎ', 'kagi', 'key'), word('みず', 'mizu', 'water'), word('かばん', 'kaban', 'bag')]) : isKata ? [word('コーヒー', 'kōhī', 'coffee'), word('チケット', 'chiketto', 'ticket'), word('メニュー', 'menyū', 'menu')] : [word('きっぷ', 'kippu', 'ticket'), word('びょういん', 'byōin', 'hospital'), word('ぎんこう', 'ginkō', 'bank')];
  const practice: JapanesePracticeTask[] = [
    ...examples.flatMap((example, index) => wordTasks(`${id}.word.${index + 1}`, script, [example])),
    { id: `${id}.speak`, mode: 'self', response: 'speak', skill: 'speaking', prompt: 'Read the three useful words aloud without the Latin-letter guide. Replay each model and compare.', model: examples.map(example => example.text).join('、'), criteria: [phase === 'practical' ? 'Keep small kana together as one beat.' : 'Read every full-size kana and sound mark carefully.', phase === 'practical' ? 'Give a held consonant, long vowel and nasal n their own timing unit.' : 'Keep each short vowel and nasal n steady, without adding English sounds.', 'Retry any word you could not read without the guide.'], feedback: 'This is your own comparison with a model. It is not pronunciation scoring.', retry: 'Return to the matching pattern, then say the word again.' },
  ];
  return { id, revision: 1, status: 'draft', script, kind: 'checkpoint', title: `${isKata ? 'Katakana' : 'Hiragana'}: ${phase === 'practical' ? 'practical reading' : phase === 'basic' ? 'basic words' : 'sound marks'} checkpoint`, summary: `${phase === 'practical' ? 'Use the basic forms, sound marks, small kana and timing patterns together.' : phase === 'basic' ? 'Combine the ten basic groups in real words before adding sound marks.' : 'Recycle the basic forms together with dakuten and handakuten.'} Read useful signs or menu words, type them from memory, then compare your spoken reading. Every task must be successfully checked or explicitly self-reviewed before saving this checkpoint.`, prerequisites: [previous], characters: [], examples, practice };
}

function scriptPatterns(script: KanaScript): JapaneseAlphabetLesson[] {
  const result: JapaneseAlphabetLesson[] = [];
  let previous = `ja.alphabet.${script}.w`;
  const basics = checkpoint(script, previous, 'basic'); result.push(basics); previous = basics.id;
  for (const pattern of [...voiced, ...contracted, ...timing]) {
    const lesson = patternLesson(script, pattern, previous); result.push(lesson); previous = lesson.id;
    if (pattern.key === 'p') { const marks = checkpoint(script, previous, 'voiced'); result.push(marks); previous = marks.id; }
  }
  if (script === 'katakana') {
    const id = 'ja.alphabet.katakana.pattern.loan-combinations';
    const examples = [word('カフェ', 'kafe', 'café'), word('パーティー', 'pātī', 'party'), word('ファイル', 'fairu', 'file')];
    result.push({ id, revision: 1, status: 'draft', script, kind: 'pattern', title: 'Katakana: borrowed sounds and familiar lookalikes', prerequisites: [previous], summary: 'Small vowel kana extend the sound set: ファ/フィ/フェ/フォ and ティ/ディ. Borrowed words follow Japanese timing and may differ from English. Compare シ/ツ and ソ/ン carefully. Do not guess a word from its English spelling.', characters: ['ファ', 'フィ', 'フェ', 'フォ', 'ティ', 'ディ'].map((kana, index) => ({ id: `${id}.form.${index + 1}`, kana, romaji: ['fa', 'fi', 'fe', 'fo', 'ti', 'di'][index]!, audioText: kana })), examples, practice: [...wordTasks(id, script, examples), { id: `${id}.lookalikes`, mode: 'choice', skill: 'script', prompt: 'Which katakana spells shatsu (shirt)? Compare シ and ツ.', choices: ['シャツ', 'ツャシ', 'シャシ'], answer: 'シャツ', feedback: 'シャツ is sha-tsu. シ starts sha. Full ツ ends the word with tsu.', retry: 'Read the first and last kana separately, then look at their stroke directions.' }] });
    previous = id;
  }
  result.push(checkpoint(script, previous));
  return result;
}

export const kanaPatternLessons: readonly JapaneseAlphabetLesson[] = [...scriptPatterns('hiragana'), ...scriptPatterns('katakana')];
