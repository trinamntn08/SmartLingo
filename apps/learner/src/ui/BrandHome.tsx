import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, styles as s } from './theme';

export function BrandHome({ onPress }: { onPress: () => void }) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel="SmartLingo home" onPress={onPress}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => ({ minHeight: 44, justifyContent: 'center', borderWidth: 2,
      borderRadius: 8, borderColor: focused ? '#246944' : 'transparent', opacity: pressed ? 0.7 : 1 })}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ width: 38, height: 38, borderRadius: 14, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 28, color: colors.ink }}>✳</Text></View><Text style={s.brand}>SmartLingo</Text>
    </View>
  </Pressable>;
}
