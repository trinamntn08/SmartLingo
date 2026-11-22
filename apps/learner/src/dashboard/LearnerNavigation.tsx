import { useState } from 'react';
import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { colors } from '../ui/theme';

export const learnerTabs = ['Today', 'Learn', 'Review', 'Report', 'Profile'] as const;
export type LearnerTab = typeof learnerTabs[number];
const icons: Record<LearnerTab, string> = {
  Today: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
  Learn: 'M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1m0-15c3-2 6-2 10-1v15c-4-1-7-1-10 1V5',
  Review: 'M4 8a9 9 0 1 1-1 7M4 3v5h5',
  Report: 'M4 20V12m8 8V4m8 16V9',
  Profile: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 6 0 0 1 16 0v2',
};

export function LearnerNavigation({ selected, disabled, onSelect, compact }: {
  selected: LearnerTab; disabled: boolean; onSelect: (tab: LearnerTab) => void; compact: boolean;
}) {
  const mobile = useWindowDimensions().width < 600;
  return <View accessibilityLabel="Learning navigation" style={{ flexDirection: compact ? 'row' : 'column', gap: mobile ? 2 : 4, padding: compact ? 0 : 16, maxWidth: '100%', minWidth: 0, flexShrink: 1, ...(mobile ? { width: '100%' } : {}) }}>
    {learnerTabs.map(tab => <NavigationItem key={tab} tab={tab} selected={selected === tab} disabled={disabled} onPress={() => onSelect(tab)} mobile={mobile} />)}
  </View>;
}

function NavigationItem({ tab, selected, disabled, onPress, mobile }: {
  tab: LearnerTab; selected: boolean; disabled: boolean; onPress: () => void; mobile: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={tab} accessibilityState={{ selected, disabled }} aria-selected={selected} disabled={disabled}
    onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => ({ flexDirection: mobile ? 'column' : 'row', gap: 4, alignItems: 'center', justifyContent: 'center', minHeight: mobile ? 56 : 44, paddingVertical: 7, paddingHorizontal: mobile ? 2 : 14,
      ...(mobile ? { flex: 1, minWidth: 0 } : {}),
      borderRadius: 12, backgroundColor: selected || pressed ? colors.sand : 'transparent', opacity: disabled ? 0.5 : 1,
      outlineWidth: focused ? 3 : 0, outlineStyle: 'solid', outlineOffset: 2, outlineColor: colors.ink })}>
    {mobile && <Image accessible={false} source={{ uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="${icons[tab]}" stroke="${selected ? colors.ink : colors.muted}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`)}` }} style={{ width: 20, height: 20 }} />}
    <Text style={{ fontFamily: 'Arial', color: selected ? colors.ink : colors.muted, fontSize: mobile ? 11 : 14, fontWeight: selected ? '800' : '600' }}>{tab}</Text>
  </Pressable>;
}
