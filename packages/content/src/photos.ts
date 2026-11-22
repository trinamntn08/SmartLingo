import assets from './photos/catalogue.json';

export type VocabularyPhoto = Readonly<{ uri: string; alt: string; kind: 'literal' | 'context' }>;

const catalogue = new Map<string, Map<string, VocabularyPhoto>>();
for (const { key, alt, bindings } of assets) {
  const uri = `/generated-vocabulary-photos/${key}.jpg`;
  for (const { id, target, context } of bindings) {
    let targets = catalogue.get(id);
    if (!targets) {
      targets = new Map();
      catalogue.set(id, targets);
    }
    targets.set(target, context
      ? { uri, alt: `Context photograph: ${alt}`, kind: 'context' }
      : { uri, alt: `${alt.charAt(0).toUpperCase()}${alt.slice(1)}`, kind: 'literal' });
  }
}

export function getVocabularyPhoto(id: string, target: string): VocabularyPhoto | undefined {
  return catalogue.get(id)?.get(target);
}
