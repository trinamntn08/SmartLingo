import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, designTokens, styles as s } from './theme';
import { Icon, type IconName } from './Icon';
import { routePress } from './routePress';

export function Button({ children, onPress, href, primary, selected, toggle, disabled, label, expanded, controls, compact, quiet, icon, iconOnly, trailingIcon, marker, nativeID }: {
  children?: ReactNode; onPress: () => void; primary?: boolean; selected?: boolean; disabled?: boolean; label?: string;
  toggle?: boolean; expanded?: boolean; controls?: string; compact?: boolean; quiet?: boolean; icon?: IconName; trailingIcon?: IconName; href?: string; marker?: string; nativeID?: string;
  iconOnly?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const foreground = selected ? colors.primary : primary ? colors.onPrimary : colors.ink;
  const selectedState = toggle ? undefined : selected;
  return <Pressable nativeID={nativeID} accessibilityRole="button" accessibilityLabel={label} aria-selected={selectedState}
    aria-pressed={toggle ? !!selected : undefined} aria-disabled={!!disabled}
    aria-expanded={expanded} aria-controls={controls} accessibilityState={{ disabled: !!disabled, selected: selectedState, expanded }}
    disabled={disabled} {...routePress(disabled ? undefined : href, onPress)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [s.button, { maxWidth: '100%', minWidth: 0, flexShrink: 1 }, compact && s.buttonCompact, quiet && s.buttonQuiet,
      primary && s.buttonPrimary, selected && s.buttonSelected, !!marker && s.buttonMarked,
      iconOnly && { minWidth: designTokens.control.minimumTarget, paddingHorizontal: 0 },
      focused && !disabled && { outlineColor: colors.focusRing, outlineWidth: designTokens.focus.outlineWidth, outlineStyle: 'solid', outlineOffset: designTokens.focus.outlineOffset },
      { opacity: disabled ? designTokens.opacity.disabled : pressed ? designTokens.opacity.pressed : 1 }]}>
    {icon && <Icon name={icon} size={18} color={foreground} />}
    {!!marker && <View style={[s.buttonMarker, selected && { backgroundColor: colors.primary }]}>
      <Text style={[s.buttonMarkerText, { color: selected ? colors.onPrimary : colors.primary }]}>{marker}</Text>
    </View>}
    {!iconOnly && <Text style={[s.buttonText, { minWidth: 0, maxWidth: '100%', flexShrink: 1, color: foreground }, !!marker && s.buttonMarkedText]}>{children}</Text>}
    {trailingIcon && <Icon name={trailingIcon} size={18} color={foreground} />}
  </Pressable>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <View style={s.badge}><Text style={s.badgeText}>{children}</Text></View>;
}
