const kana: Readonly<Record<string, string>> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'o', ん: 'n', ゔ: 'vu',
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo', ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho', じゃ: 'ja', じゅ: 'ju', じょ: 'jo',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho', ぢゃ: 'ja', ぢゅ: 'ju', ぢょ: 'jo',
  にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo', ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
  びゃ: 'bya', びゅ: 'byu', びょ: 'byo', ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo', りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  うぃ: 'wi', うぇ: 'we', うぉ: 'wo', しぇ: 'she', じぇ: 'je', ちぇ: 'che',
  つぁ: 'tsa', つぃ: 'tsi', つぇ: 'tse', つぉ: 'tso', てぃ: 'ti', でぃ: 'di',
  とぅ: 'tu', どぅ: 'du', てゅ: 'tyu', でゅ: 'dyu',
  ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo', ふゅ: 'fyu',
  ゔぁ: 'va', ゔぃ: 'vi', ゔぇ: 've', ゔぉ: 'vo', ゔゅ: 'vyu',
  ' ': ' ', '・': ' ', '、': ', ', '。': '.', '！': '!', '？': '?', '!': '!', '?': '?',
};

// Vocabulary phrases whose sounds or word boundaries are ambiguous in unspaced kana.
const phrases: Readonly<Record<string, string>> = {
  こんにちは: 'konnichiwa',
  こんばんは: 'konbanwa',
  ありがとうございます: 'arigatou gozaimasu',
  おはようございます: 'ohayou gozaimasu',
  よろしくおねがいします: 'yoroshiku onegai shimasu',
  おねがいします: 'onegai shimasu',
  もういちど: 'mou ichido',
  いっしょに: 'issho ni',
  ほうが: 'hou ga',
  こわれています: 'kowarete imasu',
  おぼえていません: 'oboete imasen',
  どういういみですか: 'dou iu imi desu ka',
  つかってもいいですか: 'tsukatte mo ii desu ka',
  かりてもいいですか: 'karite mo ii desu ka',
};

/** Read authored vocabulary kana using familiar romaji spellings and repeated long vowels. */
export function japanesePronunciation(reading: string | undefined): string | undefined {
  const input = (reading ?? '').trim().normalize('NFKC').replace(/[ァ-ヶ]/g,
    letter => String.fromCharCode(letter.charCodeAt(0) - 0x60));
  if (!input) return undefined;
  if (Object.hasOwn(phrases, input)) return phrases[input];
  const spaced = input.replace(/(?<=[ぁ-ゖ])ください$/u, ' ください');
  const sounds: string[] = [];
  for (let index = 0; index < spaced.length; index++) {
    const current = spaced[index]!;
    const next = spaced[index + 1] ?? '';
    const pair = kana[current + next];
    if (next && pair) {
      sounds.push(pair);
      index++;
    } else if (current === 'っ') {
      const following = kana[next + (spaced[index + 2] ?? '')] ?? kana[next];
      const consonant = following?.match(/^(?:ch|[bcdfghjklmpqrstvwxyz])/u)?.[0];
      if (!consonant) return undefined;
      sounds.push(consonant === 'ch' ? 't' : consonant);
    } else if (current === 'ー') {
      const vowel = sounds.at(-1)?.at(-1);
      if (!vowel || !/[aeiou]/.test(vowel)) return undefined;
      sounds.push(vowel);
    } else if (current === 'ん' && /^[あいうえおやゆよ]$/u.test(next)) {
      sounds.push("n'");
    } else {
      const sound = kana[current];
      if (!sound) return undefined;
      sounds.push(sound);
    }
  }
  return sounds.join('');
}
