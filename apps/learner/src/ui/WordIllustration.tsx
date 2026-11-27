import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import type { Vocabulary } from '@smartlingo/domain';
import { getVocabularyPhoto, getWordVisual } from '@smartlingo/content';
import { Illustration } from './Illustration';
import { colors, styles as s } from './theme';

export function WordIllustration({ entry, size = 230 }: { entry: Vocabulary; size?: number }) {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const photo = getVocabularyPhoto(entry.id, entry.target);
  if (photo && failedPhoto !== photo.uri) {
    return <View style={{ width: '100%', maxWidth: size, alignSelf: 'center', gap: 4 }}>
      <Image accessibilityRole="img" accessibilityLabel={photo.alt} source={{ uri: photo.uri }}
        onError={() => setFailedPhoto(photo.uri)}
        style={{ width: '100%', aspectRatio: 16 / 10, borderRadius: 12, backgroundColor: colors.sand }} resizeMode="cover" />
      {photo.kind === 'context' && <Text style={[s.muted, { fontSize: 14, lineHeight: 20 }]}>Situation photo</Text>}
    </View>;
  }
  const visual = getWordVisual(entry);
  if (visual) {
    return <Image accessibilityRole="img" accessibilityLabel={visual.alt} source={{ uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(visual.svg)}` }} style={{ width: size, aspectRatio: 16 / 10, maxWidth: '100%', alignSelf: 'center', borderRadius: 12, backgroundColor: colors.soft }} resizeMode="contain" />;
  }
  if (entry.picture !== 'context') {
    return <Illustration picture={entry.picture} alt={entry.pictureAlt} size={size} />;
  }
  return null;
}
