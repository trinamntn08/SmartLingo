import type { Lesson } from '@smartlingo/domain';

// Explicit, stable aliases for the same sense. Context-specific senses (guichet,
// horaire) retain separate IDs. The first starter's existing IDs never change.
const aliases: Readonly<Record<string, string>> = {
  'fr.people.bonjour': 'fr.bonjour',
  'fr.leisure.a-l-interieur': 'fr.restaurant.inside',
  'fr.health.allergie': 'fr.restaurant.allergy',
  'fr.health.demain': 'fr.bakery.tomorrow',
  'fr.leisure.velo': 'fr.transport.bicycle',
};

export function reuseSharedVocabulary(lessons: readonly Lesson[]): Lesson[] {
  const entries = new Map<string, Lesson['vocabulary'][number]>();
  for (const entry of lessons.flatMap(lesson => lesson.vocabulary)) {
    const previous = entries.get(entry.id);
    if (previous && JSON.stringify(previous) !== JSON.stringify(entry)) throw new Error(`Conflicting vocabulary: ${entry.id}`);
    entries.set(entry.id, entry);
  }
  const resolve = (id: string) => aliases[id] ?? id;
  return lessons.map(lesson => ({
    ...lesson,
    vocabulary: lesson.vocabulary.map(entry => {
      const canonical = entries.get(resolve(entry.id));
      if (!canonical) throw new Error(`Missing shared vocabulary: ${entry.id}`);
      if (canonical.target.normalize('NFC') !== entry.target.normalize('NFC')) throw new Error(`Shared vocabulary target changed: ${entry.id}`);
      return canonical;
    }),
    pictureActivity: { ...lesson.pictureActivity, entryId: resolve(lesson.pictureActivity.entryId),
      choices: lesson.pictureActivity.choices.map(resolve) },
  }));
}
