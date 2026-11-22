import { useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandHome } from './BrandHome';
import { Icon, type IconName } from './Icon';
import { colors, styles as s } from './theme';

const tabIcons = { Today: 'home', Explore: 'explore', Practice: 'practice', Review: 'review', Profile: 'profile' } as const;
const tabs = Object.keys(tabIcons) as LearnerTab[];
export type LearnerTab = keyof typeof tabIcons;
export const learnerNavigationId = 'learner-navigation';

export function LearnerHeader({ compact, tab, topicsOpen, onTopics, onHome, onNavigate, onSkip, onSkipNavigation }: {
  compact: boolean; tab: LearnerTab; topicsOpen: boolean; onTopics: () => void; onHome: () => void;
  onNavigate: (tab: LearnerTab) => void; onSkip: () => void; onSkipNavigation: () => void;
}) {
  return <View style={[s.header, compact && navigation.compactHeader]}>
    <View style={[s.headerInner, navigation.headerRow]}>
      {Platform.OS === 'web' && <>
        <SkipControl onPress={onSkip}>Skip to content</SkipControl>
        {compact && <SkipControl onPress={onSkipNavigation}>Skip to navigation</SkipControl>}
      </>}
      <BrandHome onPress={onHome} />
      {compact ? <NavControl label="Browse course topics" expanded={topicsOpen} onPress={onTopics}>
        <Icon name={topicsOpen ? 'close' : 'topics'} size={17} /><Text style={navigation.label}>Topics</Text>
      </NavControl> : <>
        <PrimaryNavigation tab={tab} onNavigate={onNavigate} compact={false} />
        <View style={navigation.course}>
          <View aria-hidden style={navigation.flag}>
            <View style={[navigation.flagStripe, { backgroundColor: '#31548B' }]} />
            <View style={[navigation.flagStripe, { backgroundColor: colors.white }]} />
            <View style={[navigation.flagStripe, { backgroundColor: '#C95650' }]} />
          </View>
          <Text style={navigation.label}>French course</Text>
        </View>
      </>}
    </View>
  </View>;
}

export function PrimaryNavigation({ tab, onNavigate, compact }: {
  tab: LearnerTab; onNavigate: (tab: LearnerTab) => void; compact: boolean;
}) {
  return <View role="navigation" nativeID={learnerNavigationId} accessibilityLabel="Learner navigation" style={compact ? navigation.bottomBar : navigation.tabRow}>
    {tabs.map(name => <NavControl key={name} label={name} current={tab === name} compact={compact} onPress={() => onNavigate(name)}>
      <Icon name={tabIcons[name] satisfies IconName} size={compact ? 20 : 17} color={tab === name ? colors.ink : colors.muted} />
      <Text numberOfLines={1} style={[navigation.label, compact && navigation.compactLabel, tab === name && { color: colors.ink }]}>{name}</Text>
    </NavControl>)}
  </View>;
}

function SkipControl({ children, onPress }: { children: string; onPress: () => void }) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={[s.button, navigation.skip, focused ? s.focus : navigation.visuallyHidden]}>
    <Text style={s.buttonText}>{children}</Text>
  </Pressable>;
}

function NavControl({ label, current, expanded, compact, onPress, children }: {
  label: string; current?: boolean; expanded?: boolean; compact?: boolean; onPress: () => void; children: ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} aria-current={current ? 'page' : undefined} aria-expanded={expanded}
    onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => [navigation.control, compact && navigation.compactControl,
      (pressed || hovered) && { backgroundColor: colors.sand }, (current || expanded) && navigation.current, focused && s.focus]}>
    {children}
  </Pressable>;
}

const navigation = StyleSheet.create({
  compactHeader: { paddingHorizontal: 14, paddingVertical: 6 },
  headerRow: { flexWrap: 'nowrap' },
  skip: { position: 'absolute', top: 0, left: 0, zIndex: 5 },
  visuallyHidden: { width: 1, height: 1, minHeight: 0, opacity: 0, padding: 0, overflow: 'hidden' },
  tabRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bottomBar: { flexDirection: 'row', backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.line, paddingHorizontal: 8, paddingTop: 5, paddingBottom: 6, gap: 4 },
  control: { flexDirection: 'row', gap: 7, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, borderRadius: 9 },
  compactControl: { flex: 1, minWidth: 0, minHeight: 48, flexDirection: 'column', gap: 2, paddingHorizontal: 0 },
  current: { backgroundColor: colors.goldSoft },
  label: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: '700' },
  compactLabel: { fontSize: 11, lineHeight: 16 },
  course: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.sand, borderRadius: 20 },
  flag: { width: 16, height: 16, borderRadius: 8, overflow: 'hidden', flexDirection: 'row' },
  flagStripe: { flex: 1 },
});
