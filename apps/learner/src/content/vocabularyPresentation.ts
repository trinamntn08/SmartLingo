import type { Vocabulary } from '@smartlingo/domain';

/** Older publications can still carry the original explicit English noun label. */
export function vocabularyPresentation(entry: Vocabulary): { gender: Vocabulary['gender']; note: string } {
  const legacy = entry.note.match(/^(Masculine|Feminine) noun(?: phrase)?(?:[.;,]\s*|$)/i);
  return {
    gender: entry.gender ?? (legacy ? legacy[1].toLowerCase() === 'masculine' ? 'masculine' : 'feminine' : undefined),
    note: legacy ? entry.note.slice(legacy[0].length).trim() : entry.note,
  };
}

export const genderLabels = {
  masculine: { short: 'm.', accessible: 'Masculine noun' },
  feminine: { short: 'f.', accessible: 'Feminine noun' },
  both: { short: 'm./f.', accessible: 'Masculine or feminine noun' },
} as const;
