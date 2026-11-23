import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, type IconName } from '../ui/Icon';
import { colors, designTokens } from '../ui/theme';
import { routePress } from '../ui/routePress';

export const learnerTabs = ['Today', 'Learn', 'Review', 'Report', 'Profile'] as const;
export type LearnerTab = typeof learnerTabs[number];
const icons: Record<LearnerTab, IconName> = { Today: 'home', Learn: 'book', Review: 'bookmark', Report: 'chart', Profile: 'person' };
const iconColors: Record<LearnerTab, string> = {
  Today: colors.goldTint, Learn: colors.sageTint, Review: colors.lilacTint,
  Report: colors.skyTint, Profile: colors.sand,
};

export const learnerContentId = 'learner-main';
const learnerNavigationId = 'learner-navigation';

export function LearnerSkipLinks({ mobileNavigation }: { mobileNavigation: boolean }) {
  if (Platform.OS !== 'web') return null;
  return <View style={navigation.skipLinks}>
    <SkipLink target={learnerContentId} label="Skip to learner content" />
    {mobileNavigation && <SkipLink target={learnerNavigationId} label="Skip to learning navigation" />}
  </View>;
}

function SkipLink({ target, label }: { target: string; label: string }) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onPress={() => document.getElementById(target)?.focus({ preventScroll: true })}
    style={focused ? navigation.skipFocused : navigation.skipHidden}>
    <Text style={navigation.skipLabel}>{label}</Text>
  </Pressable>;
}

export function LearnerNavigation({ selected, disabled, onSelect, hrefFor, mobile }: {
  selected: LearnerTab; disabled: boolean; onSelect: (tab: LearnerTab) => void; hrefFor?: (tab: LearnerTab) => string; mobile: boolean;
}) {
  return <View role="navigation" accessibilityLabel="Learning navigation" nativeID={learnerNavigationId} tabIndex={-1}
    style={{ flexDirection: 'row', gap: mobile ? 2 : 6, maxWidth: '100%', minWidth: 0, ...(mobile ? { width: '100%' } : {}) }}>
    {learnerTabs.map(tab => <NavigationItem key={tab} tab={tab} selected={selected === tab} disabled={disabled} onPress={() => onSelect(tab)} href={hrefFor?.(tab)} mobile={mobile} />)}
  </View>;
}

function NavigationItem({ tab, selected, disabled, onPress, href, mobile }: {
  tab: LearnerTab; selected: boolean; disabled: boolean; onPress: () => void; href?: string; mobile: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={tab} accessibilityState={{ selected, disabled }}
    aria-selected={selected} aria-current={selected ? 'page' : undefined} disabled={disabled}
    {...routePress(disabled ? undefined : href, onPress)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => ({ flexDirection: mobile ? 'column' : 'row', gap: mobile ? 4 : 8, alignItems: 'center', justifyContent: 'center',
      minHeight: mobile ? 51 : 47, paddingVertical: 5, paddingHorizontal: mobile ? 2 : 11,
      ...(mobile ? { flex: 1, minWidth: 0 } : {}),
      borderRadius: 10, borderWidth: 1, borderColor: selected ? colors.yellow : 'transparent',
      backgroundColor: selected ? colors.goldTint : pressed || hovered ? colors.sand : 'transparent', opacity: disabled ? 0.5 : 1,
      outlineWidth: focused ? 3 : 0, outlineStyle: 'solid', outlineOffset: 2, outlineColor: colors.focusRing })}>
    <View style={{ width: mobile ? 22 : 27, height: mobile ? 22 : 27, borderRadius: 7, alignItems: 'center', justifyContent: 'center',
      backgroundColor: mobile || selected ? 'transparent' : iconColors[tab] }}>
      <Icon name={icons[tab]} size={mobile ? 20 : 17} color={selected ? colors.primary : colors.ink} />
    </View>
    <Text style={{ ...(mobile ? designTokens.typography.caption : designTokens.typography.muted), textAlign: 'center', flexShrink: 1, color: selected ? colors.primary : colors.muted,
      fontWeight: selected ? '700' : '600' }}>{tab}</Text>
  </Pressable>;
}

const navigation = StyleSheet.create({
  skipLinks: { position: 'absolute', top: 8, left: 12, gap: 7, zIndex: 2 },
  skipFocused: { minHeight: designTokens.control.minimumTarget, justifyContent: 'center', paddingHorizontal: 14,
    borderRadius: 9, backgroundColor: colors.primary, outlineColor: colors.focusRing,
    outlineStyle: 'solid', outlineWidth: designTokens.focus.outlineWidth },
  skipHidden: { position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' },
  skipLabel: { ...designTokens.typography.button, color: colors.onPrimary },
});
