// Original introductory drafts. Factual references and review limits:
// docs/curriculum/japanese-alphabet-sources.md
export const kanaScripts = ['hiragana', 'katakana'] as const;
export type KanaScript = typeof kanaScripts[number];

export interface KanaCharacter {
  id: string;
  kana: string;
  romaji: string;
  audioText: string;
  note?: string;
}

export interface JapaneseAlphabetLesson {
  id: string;
  revision: 1;
  status: 'draft';
  script: KanaScript;
  title: string;
  summary: string;
  characters: readonly KanaCharacter[];
}

interface KanaRow {
  id: string;
  title: string;
  summary: string;
  hiragana: string;
  katakana: string;
  readings: readonly string[];
}

const rows: readonly KanaRow[] = [
  {
    id: 'a', title: 'The five vowels',
    summary: 'Start with a, i, u, e, o. Keep each vowel short and steady; listen and repeat without adding an English glide.',
    hiragana: 'あいうえお', katakana: 'アイウエオ', readings: ['a', 'i', 'u', 'e', 'o'],
  },
  {
    id: 'k', title: 'The K row',
    summary: 'Combine k with the five vowels: ka, ki, ku, ke, ko. Follow the same a, i, u, e, o order.',
    hiragana: 'かきくけこ', katakana: 'カキクケコ', readings: ['ka', 'ki', 'ku', 'ke', 'ko'],
  },
  {
    id: 's', title: 'The S row',
    summary: 'Read sa, shi, su, se, so. The second sound is shi, with a sh sound rather than English see.',
    hiragana: 'さしすせそ', katakana: 'サシスセソ', readings: ['sa', 'shi', 'su', 'se', 'so'],
  },
  {
    id: 't', title: 'The T row',
    summary: 'Read ta, chi, tsu, te, to. Notice chi and tsu: their starting sounds change from the other members of this row.',
    hiragana: 'たちつてと', katakana: 'タチツテト', readings: ['ta', 'chi', 'tsu', 'te', 'to'],
  },
  {
    id: 'n', title: 'The N row',
    summary: 'Read na, ni, nu, ne, no. Each character includes a vowel; the separate nasal n comes in the last group.',
    hiragana: 'なにぬねの', katakana: 'ナニヌネノ', readings: ['na', 'ni', 'nu', 'ne', 'no'],
  },
  {
    id: 'h', title: 'The H row',
    summary: 'Read ha, hi, fu, he, ho. For fu, let air pass softly between relaxed lips; avoid pressing your teeth against your lip.',
    hiragana: 'はひふへほ', katakana: 'ハヒフヘホ', readings: ['ha', 'hi', 'fu', 'he', 'ho'],
  },
  {
    id: 'm', title: 'The M row',
    summary: 'Read ma, mi, mu, me, mo. Close your lips for m, then move straight into the vowel.',
    hiragana: 'まみむめも', katakana: 'マミムメモ', readings: ['ma', 'mi', 'mu', 'me', 'mo'],
  },
  {
    id: 'y', title: 'The Y row',
    summary: 'Read ya, yu, yo. This basic row has three characters, with no separate yi or ye character.',
    hiragana: 'やゆよ', katakana: 'ヤユヨ', readings: ['ya', 'yu', 'yo'],
  },
  {
    id: 'r', title: 'The R row',
    summary: 'Read ra, ri, ru, re, ro. Use a brief tongue tap near the ridge behind your upper teeth; listen for a sound different from English r.',
    hiragana: 'らりるれろ', katakana: 'ラリルレロ', readings: ['ra', 'ri', 'ru', 're', 'ro'],
  },
  {
    id: 'w', title: 'Wa, o and nasal n',
    summary: 'Finish with wa, the character labelled o (wo), and nasal n. The last character has no following vowel.',
    hiragana: 'わをん', katakana: 'ワヲン', readings: ['wa', 'wo', 'n'],
  },
];

function characterNote(script: KanaScript, reading: string): string | undefined {
  if (reading === 'wo') return 'Usually pronounced o in modern Japanese. The label wo distinguishes this character from お / オ and is used when typing を / ヲ. Hiragana を commonly marks the object of an action; katakana ヲ is uncommon.';
  if (reading === 'n') return 'A nasal sound with its own beat, without an added vowel. Its sound changes with the following sound; it is different from na, ni, nu, ne and no.';
  if (script === 'hiragana' && reading === 'ha') return 'This character is ha in the basic chart. As the topic particle in a sentence it is pronounced wa; that use comes later.';
  if (script === 'hiragana' && reading === 'he') return 'This character is he in the basic chart. As the direction particle in a sentence it is pronounced e; that use comes later.';
  return undefined;
}

function buildAlphabetLesson(script: KanaScript, row: KanaRow): JapaneseAlphabetLesson {
  const audioKana = [...row.katakana];
  return {
    id: `ja.alphabet.${script}.${row.id}`,
    revision: 1,
    status: 'draft',
    script,
    title: `${script === 'hiragana' ? 'Hiragana' : 'Katakana'}: ${row.title}`,
    summary: row.summary,
    characters: [...row[script]].map((kana, index) => {
      const reading = row.readings[index]!;
      const note = characterNote(script, reading);
      return {
        id: `ja.kana.${script}.${reading}`,
        kana,
        romaji: reading === 'wo' ? 'o (wo)' : reading,
        // Katakana prompts avoid a TTS engine interpreting isolated は / へ
        // as particles. ヲ is explicitly sounded as modern o, not historical wo.
        audioText: reading === 'wo' ? 'オ' : audioKana[index]!,
        ...(note ? { note } : {}),
      };
    }),
  };
}

export const japaneseAlphabetLessons: readonly JapaneseAlphabetLesson[] = kanaScripts.flatMap(script =>
  rows.map(row => buildAlphabetLesson(script, row)),
);

export const japaneseAlphabetNotes: readonly { title: string; body: string }[] = [
  {
    title: 'Start with kana',
    body: 'Hiragana and katakana are two sets of sound symbols called kana. Begin with hiragana, then learn the matching katakana sounds. Romaji uses Latin letters as a temporary reading aid.',
  },
  {
    title: 'Two scripts, matching sounds',
    body: 'Hiragana appears in many everyday words and grammar endings. Katakana often appears in borrowed words and foreign names. Their basic characters represent the same set of sounds.',
  },
  {
    title: 'Short first steps',
    body: 'These 20 short groups cover 46 basic forms in each script. Most characters represent a consonant plus a vowel, or just a vowel; nasal n is separate. Sound marks, small kana, long vowels and kanji come later. This is a beginning, not the whole Japanese writing system.',
  },
  {
    title: 'Read, listen and repeat',
    body: 'Look at each character, use its reading, and repeat the sound if audio is available. English vowel comparisons are only approximate. Recognition and listening are useful first steps; finishing a group does not measure pronunciation or reading proficiency.',
  },
  {
    title: 'Draft for owner review',
    body: 'These original introductory lessons are drafts. Language explanations and generated audio still need owner review; no qualified Japanese-teacher review is claimed.',
  },
];
