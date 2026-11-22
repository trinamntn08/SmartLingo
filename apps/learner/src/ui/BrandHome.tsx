import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from './Icon';
import { colors, styles as s } from './theme';

export function BrandHome({ onPress }: { onPress: () => void }) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel="SmartLingo home" onPress={onPress}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 9, borderRadius: 9, opacity: pressed ? 0.72 : 1 }, focused && s.focus]}>
    <View style={{ width: 35, height: 35, borderRadius: 11, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="brand" size={23} />
    </View>
    <Text style={s.brand}>SmartLingo</Text>
  </Pressable>;
}
