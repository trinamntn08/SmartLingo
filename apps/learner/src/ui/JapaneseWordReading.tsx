import { Text, View } from 'react-native';
import { japanesePronunciation } from '../content/japanesePronunciation';
import { styles as s } from './theme';

export function JapaneseWordReading({ target, reading }: { target: string; reading?: string }) {
  const pronunciation = japanesePronunciation(reading);
  if (!reading || (reading === target && !pronunciation)) return null;
  return <View style={[s.row, { minWidth: 0, maxWidth: '100%', flexShrink: 1, columnGap: 6, rowGap: 0 }]}>
    {reading !== target && <Text style={[s.muted, { minWidth: 0, maxWidth: '100%', flexShrink: 1 }]}>{reading}</Text>}
    {!!pronunciation && <Text testID="word-pronunciation" style={[s.body, { minWidth: 0, maxWidth: '100%', flexShrink: 1, fontWeight: '600' }]}>{pronunciation}</Text>}
  </View>;
}
