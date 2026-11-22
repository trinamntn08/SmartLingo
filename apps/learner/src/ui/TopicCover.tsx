import { useState } from 'react';
import { Image, View } from 'react-native';
import { getVocabularyPhoto } from '@smartlingo/content';
import type { LessonTopic } from '@smartlingo/domain';
import { colors } from './theme';
import { getContextPhoto } from './contextPhotos';
import { ContextImage } from './ContextImage';

const featuredWords = new Map([
  ['Restaurant', 'fr.restaurant.book-table'],
  ['Bakery', 'fr.bakery.country-loaf'],
]);

/** Decorative topic media never participates in vocabulary or practice bindings. */
export function TopicCover({ topic, hero = false }: { topic: LessonTopic; hero?: boolean }) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const candidates = topic.lessons[0]?.language === 'ja-JP' ? [] : topic.vocabulary
    .map(entry => ({ id: entry.id, photo: getVocabularyPhoto(entry.id, entry.target) }));
  const featuredId = featuredWords.get(topic.name);
  const photo = candidates.find(candidate => candidate.id === featuredId)?.photo
    ?? candidates.find(candidate => candidate.photo?.kind === 'context')?.photo
    ?? candidates.find(candidate => candidate.photo)?.photo;
  const fallback = getContextPhoto(topic.lessons[0]?.language === 'ja-JP' ? 'ja-JP' : 'fr-FR', topic.name);
  const uri = photo?.uri;
  return <View style={{ width: '100%', aspectRatio: hero ? 2.7 : 2, maxHeight: hero ? 168 : 180,
    backgroundColor: colors.green, overflow: 'hidden' }}>
    {uri && failedUri !== uri ? <Image accessibilityLabel={`Topic context: ${photo.alt}`}
      source={{ uri }} resizeMode="cover" onError={() => setFailedUri(uri)} style={{ width: '100%', height: '100%' }} />
      : <ContextImage photo={{ uri: fallback.uri, alt: `Topic context: ${fallback.alt}` }} style={{ width: '100%', height: '100%' }} />}
  </View>;
}
