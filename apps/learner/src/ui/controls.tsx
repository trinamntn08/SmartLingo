import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, designTokens, styles as s } from './theme';
import { Icon, type IconName } from './Icon';

export function Button({ children, onPress, primary, accent, selected, disabled, label, expanded, controls, compact, quiet, icon, trailingIcon }: {
  children: ReactNode; onPress: () => void; primary?: boolean; selected?: boolean; disabled?: boolean; label?: string;
  accent?: boolean; expanded?: boolean; controls?: string; compact?: boolean; quiet?: boolean; icon?: IconName; trailingIcon?: IconName;
}) {
  const [focused, setFocused] = useState(false);
  const foreground = selected ? colors.primary : primary && !accent ? colors.onPrimary : colors.ink;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} aria-selected={!!selected} aria-disabled={!!disabled}
    aria-expanded={expanded} aria-controls={controls} accessibilityState={{ disabled: !!disabled, selected: !!selected, expanded }}
    disabled={disabled} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [s.button, { maxWidth: '100%', minWidth: 0, flexShrink: 1 }, compact && s.buttonCompact, quiet && s.buttonQuiet,
      primary && s.buttonPrimary, accent && s.buttonAccent, selected && s.buttonSelected,
      focused && { outlineColor: colors.focusRing, outlineWidth: designTokens.focus.outlineWidth, outlineStyle: 'solid', outlineOffset: designTokens.focus.outlineOffset },
      { opacity: disabled ? designTokens.opacity.disabled : pressed ? designTokens.opacity.pressed : 1 }]}>
    {icon && <Icon name={icon} size={18} color={foreground} />}
    <Text style={[s.buttonText, { maxWidth: '100%', flexShrink: 1, color: foreground }]}>{children}</Text>
    {trailingIcon && <Icon name={trailingIcon} size={18} color={foreground} />}
  </Pressable>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <View style={s.badge}><Text style={s.badgeText}>{children}</Text></View>;
}
