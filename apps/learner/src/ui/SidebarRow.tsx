import { useId, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { routePress } from './routePress';
import { colors, designTokens as tokens } from './theme';

interface SidebarRowProps {
  title: string;
  onPress: () => void;
  href?: string;
  description?: string;
  icon?: IconName;
  marker?: string;
  trailingIcon?: IconName | null;
  current?: boolean;
  prominent?: boolean;
  disabled?: boolean;
  label?: string;
  expanded?: boolean;
  controls?: string;
}

export function SidebarRow({ title, onPress, href, description, icon, marker, trailingIcon,
  current, prominent, disabled, label, expanded, controls }: SidebarRowProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const descriptionId = useId();
  const trailing = trailingIcon === undefined
    ? (expanded === undefined ? href && 'chevron' : expanded ? 'chevron-up' : 'chevron-down')
    : trailingIcon;

  return <Pressable accessibilityRole={href ? 'link' : 'button'} accessibilityLabel={label ?? title}
    accessibilityState={{ disabled, expanded }} aria-expanded={expanded} aria-controls={controls}
    aria-current={current ? 'true' : undefined}
    aria-describedby={description ? descriptionId : undefined} disabled={disabled}
    {...routePress(disabled ? undefined : href, onPress)}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => [row.control, prominent && row.prominent, current && row.current,
      !current && (hovered || pressed) && row.hovered, focused && row.focused, disabled && row.disabled]}>
    {(marker || icon) && <View aria-hidden style={row.leading}>
      {marker ? <Text style={[row.marker, current && row.currentMarker]}>{marker}</Text>
        : icon && <Icon name={icon} size={16} color={colors.muted} />}
    </View>}
    <View style={row.content}>
      <Text style={[row.title, (current || prominent || expanded !== undefined) && row.strong]}>{title}</Text>
      {description && <Text nativeID={descriptionId} style={row.description}>{description}</Text>}
    </View>
    {(trailing || href) && <View style={row.trailing}>
      {trailing && <Icon name={trailing} size={16} color={colors.muted} />}
    </View>}
  </Pressable>;
}

export const sidebarStyles = StyleSheet.create({
  title: { ...tokens.typography.sectionHeading, color: colors.ink },
  sectionLabel: { ...tokens.typography.smallLabel, color: colors.ink },
  meta: { ...tokens.typography.caption, color: colors.muted },
  group: { gap: tokens.space.xs, minWidth: 0 },
  panel: { backgroundColor: colors.card, borderRadius: tokens.radius.md, borderWidth: 1, borderColor: colors.line,
    padding: tokens.space.md, gap: tokens.space.lg, minWidth: 0 },
});

const row = StyleSheet.create({
  control: { minHeight: tokens.control.minimumTarget, flexDirection: 'row', alignItems: 'center', gap: tokens.space.sm,
    paddingVertical: tokens.space.sm, paddingHorizontal: tokens.space.sm, borderLeftWidth: 2,
    borderLeftColor: 'transparent', borderRadius: tokens.radius.sm, minWidth: 0 },
  prominent: { backgroundColor: colors.sageTint },
  current: { backgroundColor: colors.goldTint, borderLeftColor: colors.yellow },
  hovered: { backgroundColor: colors.sand },
  focused: { outlineWidth: tokens.focus.outlineWidth, outlineStyle: 'solid', outlineColor: colors.focusRing, outlineOffset: -3 },
  disabled: { opacity: tokens.opacity.disabled },
  leading: { width: 24, alignItems: 'center', flexShrink: 0 },
  content: { flex: 1, minWidth: 0 },
  title: { ...tokens.typography.caption, color: colors.ink },
  strong: { fontWeight: '600' },
  description: { ...tokens.typography.caption, fontSize: 12, lineHeight: 16, color: colors.muted },
  marker: { ...tokens.typography.smallLabel, fontSize: 12, lineHeight: 20, minWidth: 24, paddingHorizontal: 2,
    textAlign: 'center', fontVariant: ['tabular-nums'], color: colors.primary, backgroundColor: colors.sageTint, borderRadius: 4 },
  currentMarker: { color: colors.onPrimary, backgroundColor: colors.primary },
  trailing: { width: 16, flexShrink: 0 },
});
