interface ListeningCard {
  text: string;
  position: number;
}

// Keep frequent expressions together without merging through a spoken pause.
const phrases = [
  's’il vous plaît', 'je n’ai pas compris', 'je ne comprends pas', 'il n’y a pas', 'à quelle heure',
  'plat du jour', 'cours de français', 'prendre rendez-vous', 'il y a',
  'au revoir', 'bonne journée', 'bonne soirée', 'bien sûr', 'je m’appelle', 'et vous',
  'je voudrais', 'vous pouvez', 'plus lentement', 'tout droit', 'à droite', 'à gauche',
  'à emporter', 'en ligne', 'petit déjeuner', 'pièce jointe', 'au téléphone',
].map(phrase => phrase.replaceAll('’', "'").split(' '));

function sentencePieces(sentence: string): string[] {
  // Apostrophes, hyphens and decimal separators can carry spoken information.
  const words = Array.from(sentence.matchAll(/\p{N}+[,.]\p{N}+|[\p{L}\p{N}][\p{L}\p{N}\p{M}]*(?:[’'‐‑-][\p{L}\p{N}][\p{L}\p{N}\p{M}]*)*/gu), match => ({
    text: match[0],
    start: match.index ?? 0,
    key: match[0].toLowerCase().replaceAll('’', "'"),
  }));
  const pieces: string[] = [];
  for (let index = 0; index < words.length;) {
    const phrase = phrases.find(parts => parts.every((part, offset) => {
      const word = words[index + offset];
      if (word?.key !== part) return false;
      if (offset === 0) return true;
      const previous = words[index + offset - 1]!;
      return /^\s+$/u.test(sentence.slice(previous.start + previous.text.length, word.start));
    }));
    const length = phrase?.length ?? 1;
    pieces.push(words.slice(index, index + length).map(word => word.text).join(' '));
    index += length;
  }
  return pieces.length === 1 ? words.map(word => word.text) : pieces;
}

export function buildFrenchListeningCards(sentence: string): readonly ListeningCard[] {
  const normalized = sentence.normalize('NFC');
  const pieces = sentencePieces(normalized);
  if (pieces.length < 2) return [];

  const cards = pieces.map((text, position) => ({ text, position }));
  let seed = 0;
  for (const character of normalized) seed = (Math.imul(seed, 31) + character.codePointAt(0)!) >>> 0;
  for (let index = cards.length - 1; index > 0; index--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const swap = seed % (index + 1);
    [cards[index], cards[swap]] = [cards[swap]!, cards[index]!];
  }

  // Equal cards can trade places without visibly changing the order.
  if (cards.every((card, index) => card.text === pieces[index])) {
    const different = cards.findIndex(card => card.text !== cards[0]!.text);
    if (different > 0) [cards[0], cards[different]] = [cards[different]!, cards[0]!];
  }
  return cards;
}
