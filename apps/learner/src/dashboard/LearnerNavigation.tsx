import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../ui/theme';

export const learnerTabs = ['Today', 'Explore', 'Practice', 'Review', 'Report', 'Profile'] as const;
export type LearnerTab = typeof learnerTabs[number];
const icons: Record<LearnerTab, string> = { Today: '⌂', Explore: '◇', Practice: '✎', Review: '↻', Report: '▥', Profile: '☺' };

export function LearnerNavigation({ selected, disabled, onSelect, compact }: {
  selected: LearnerTab; disabled: boolean; onSelect: (tab: LearnerTab) => void; compact: boolean;
}) {
  return <View accessibilityLabel="Learning navigation" style={{ flexDirection: compact ? 'row' : 'column', flexWrap: compact ? 'wrap' : 'nowrap', gap: 7, padding: compact ? 0 : 16, maxWidth: '100%', minWidth: 0, flexShrink: 1, ...(compact ? { width: '100%' } : {}) }}>
    {learnerTabs.map(tab => <NavigationItem key={tab} tab={tab} selected={selected === tab} disabled={disabled} onPress={() => onSelect(tab)} compact={compact} />)}
  </View>;
}

function NavigationItem({ tab, selected, disabled, onPress, compact }: {
  tab: LearnerTab; selected: boolean; disabled: boolean; onPress: () => void; compact: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={tab} accessibilityState={{ selected, disabled }} aria-selected={selected} disabled={disabled}
    onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => ({ flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 48, paddingVertical: 9, paddingHorizontal: compact ? 12 : 16,
      borderRadius: 18, backgroundColor: selected ? colors.ink : pressed ? colors.sand : 'transparent', opacity: disabled ? 0.5 : 1,
      outlineWidth: focused ? 3 : 0, outlineStyle: 'solid', outlineOffset: 2, outlineColor: colors.ink })}>
    {!compact && <View style={{ width: 31, height: 31, borderRadius: 11, backgroundColor: selected ? '#71434D' : colors.sand, alignItems: 'center', justifyContent: 'center' }}>
      <Text accessible={false} style={{ color: selected ? colors.yellow : colors.ink, fontSize: 22 }}>{icons[tab]}</Text>
    </View>}
    <Text style={{ color: selected ? colors.card : colors.ink, fontSize: 15, fontWeight: '700' }}>{tab}</Text>
  </Pressable>;
}
