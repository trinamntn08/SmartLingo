import { useState } from 'react';
import { Image, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { colors, styles as s } from './theme';
import type { ContextPhoto } from './contextPhotos';

export function ContextImage({ photo, style, decorative = false }: {
  photo: ContextPhoto; style?: StyleProp<ViewStyle>; decorative?: boolean;
}) {
  const [failedUri, setFailedUri] = useState<string>();
  return <View style={[{ overflow: 'hidden', backgroundColor: colors.sageTint }, style]}>
    {failedUri === photo.uri
      ? <View aria-hidden={decorative} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 14, gap: 6 }}>
        <Icon name="image" size={28} color={colors.primary} />
        {!decorative && <Text style={[s.muted, { textAlign: 'center' }]}>{photo.alt}</Text>}
      </View>
      : <Image accessible={!decorative} aria-hidden={decorative} accessibilityLabel={decorative ? undefined : photo.alt}
        source={{ uri: photo.uri }} resizeMode="cover" onError={() => setFailedUri(photo.uri)}
        style={{ width: '100%', height: '100%' }} />}
  </View>;
}
