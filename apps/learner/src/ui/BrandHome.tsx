import { useState } from 'react';
import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { colors, designTokens, styles as s } from './theme';

export function BrandHome({ onPress }: { onPress: () => void }) {
  const [focused, setFocused] = useState(false);
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  return <Pressable accessibilityRole="button" accessibilityLabel="SmartLingo home" onPress={onPress}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => ({ minHeight: 44, justifyContent: 'center', borderRadius: 10,
      outlineWidth: focused ? 3 : 0, outlineStyle: 'solid', outlineColor: colors.focusRing, outlineOffset: 3,
      opacity: pressed ? designTokens.opacity.pressed : 1 })}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <Image accessible={false} aria-hidden source={{ uri: '/icon.svg' }} style={{ width: compact ? 34 : 40, height: compact ? 34 : 40 }} />
      <Text style={[s.brand, compact && { fontSize: 21, lineHeight: 28 }]}>SmartLingo</Text>
    </View>
  </Pressable>;
}
