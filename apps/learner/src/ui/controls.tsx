import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, designTokens, styles as s } from './theme';

export function Button({ children, onPress, primary, selected, disabled, label }: {
  children: ReactNode; onPress: () => void; primary?: boolean; selected?: boolean; disabled?: boolean; label?: string;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} aria-selected={!!selected} aria-disabled={!!disabled} accessibilityState={{ disabled: !!disabled, selected: !!selected }}
    disabled={disabled} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [s.button, { maxWidth: '100%', minWidth: 0, flexShrink: 1 }, primary && s.buttonPrimary, selected && s.buttonSelected,
      focused && { outlineColor: colors.ink, outlineWidth: designTokens.focus.outlineWidth, outlineStyle: 'solid', outlineOffset: designTokens.focus.outlineOffset }, { opacity: disabled ? designTokens.opacity.disabled : pressed ? designTokens.opacity.pressed : 1 }]}>
    <Text style={[s.buttonText, { maxWidth: '100%', flexShrink: 1 }, (selected || primary) && { color: colors.card }]}>{children}</Text>
  </Pressable>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <View style={s.badge}><Text style={s.badgeText}>{children}</Text></View>;
}
