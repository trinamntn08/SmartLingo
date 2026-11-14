import { Image } from 'react-native';
import type { Vocabulary } from '@smartlingo/domain';
import { getWordVisual } from '@smartlingo/content';
import { Illustration } from './Illustration';

export function WordIllustration({ entry, size = 230 }: { entry: Vocabulary; size?: number }) {
  const visual = getWordVisual(entry);
  if (visual) {
    return <Image accessibilityRole="img" accessibilityLabel={visual.alt} source={{ uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(visual.svg)}` }} style={{ width: size, height: size * 0.75, maxWidth: '100%', alignSelf: 'center' }} resizeMode="contain" />;
  }
  if (entry.picture !== 'context') {
    return <Illustration picture={entry.picture} alt={entry.pictureAlt} size={size} />;
  }
  return null;
}
