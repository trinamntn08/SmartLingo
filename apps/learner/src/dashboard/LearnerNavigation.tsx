import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TargetLanguage } from '@smartlingo/domain';
import { Icon, type IconName } from '../ui/Icon';
import { colors, designTokens } from '../ui/theme';
import { routePress } from '../ui/routePress';

export const learnerTabs = ['Today', 'Learn', 'Slang', 'Review', 'Report', 'Profile'] as const;
export type LearnerTab = typeof learnerTabs[number];
const japaneseTabs = learnerTabs.filter(tab => tab !== 'Slang');
const icons: Record<LearnerTab, IconName> = { Today: 'home', Learn: 'book', Slang: 'grid', Review: 'bookmark', Report: 'chart', Profile: 'person' };
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

export function LearnerNavigation({ language, selected, disabled, onSelect, hrefFor, mobile }: {
  language: TargetLanguage; selected: LearnerTab; disabled: boolean; onSelect: (tab: LearnerTab) => void; hrefFor?: (tab: LearnerTab) => string; mobile: boolean;
}) {
  const tabs = language === 'fr-FR' ? learnerTabs : japaneseTabs;
  return <View role="navigation" accessibilityLabel="Learning navigation" nativeID={learnerNavigationId} tabIndex={-1}
    style={[navigation.tabs, mobile && navigation.mobileTabs]}>
    {tabs.map(tab => <NavigationItem key={tab} tab={tab} selected={selected === tab} disabled={disabled} onPress={() => onSelect(tab)} href={hrefFor?.(tab)} mobile={mobile} />)}
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
    style={({ pressed }) => [navigation.item, mobile && navigation.mobileItem, selected && navigation.selected,
      (pressed || hovered) && navigation.hovered, disabled && navigation.disabled, focused && navigation.focused]}>
    <Icon name={icons[tab]} size={18} color={selected ? colors.primary : colors.muted} />
    <Text style={[navigation.label, mobile && navigation.mobileLabel, selected && navigation.selectedLabel]}>{tab}</Text>
    {selected && <View aria-hidden style={navigation.marker} />}
  </Pressable>;
}

const navigation = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 4, maxWidth: '100%', minWidth: 0 },
  mobileTabs: { width: '100%', gap: 2 },
  item: { flexDirection: 'row', minHeight: 44, justifyContent: 'center', alignItems: 'center', gap: 8, paddingHorizontal: 12, borderRadius: 8 },
  mobileItem: { flex: 1, minWidth: 0, flexDirection: 'column', minHeight: 52, paddingHorizontal: 0, gap: 4 },
  label: { ...designTokens.typography.caption, textAlign: 'center', color: colors.muted, fontWeight: '500' },
  mobileLabel: { fontSize: 12, lineHeight: 16 },
  selectedLabel: { color: colors.ink, fontWeight: '600' },
  selected: { backgroundColor: colors.paper },
  hovered: { backgroundColor: colors.sand },
  marker: { position: 'absolute', bottom: 0, width: 20, height: 3, borderRadius: 2, backgroundColor: colors.yellow },
  disabled: { opacity: designTokens.opacity.disabled },
  focused: { outlineWidth: designTokens.focus.outlineWidth, outlineStyle: 'solid', outlineOffset: 2, outlineColor: colors.focusRing },
  skipLinks: { position: 'absolute', top: 8, left: 12, gap: 7, zIndex: 2 },
  skipFocused: { minHeight: designTokens.control.minimumTarget, justifyContent: 'center', paddingHorizontal: 14,
    borderRadius: 9, backgroundColor: colors.primary, outlineColor: colors.focusRing,
    outlineStyle: 'solid', outlineWidth: designTokens.focus.outlineWidth },
  skipHidden: { position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' },
  skipLabel: { ...designTokens.typography.button, color: colors.onPrimary },
});
