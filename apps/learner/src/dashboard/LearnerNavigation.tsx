import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon, type IconName } from '../ui/Icon';
import { colors, designTokens } from '../ui/theme';

export const learnerTabs = ['Today', 'Learn', 'Review', 'Report', 'Profile'] as const;
export type LearnerTab = typeof learnerTabs[number];
const icons: Record<LearnerTab, IconName> = { Today: 'home', Learn: 'book', Review: 'bookmark', Report: 'chart', Profile: 'person' };
const iconColors: Record<LearnerTab, string> = {
  Today: colors.goldTint, Learn: colors.sageTint, Review: colors.lilacTint,
  Report: colors.skyTint, Profile: colors.sand,
};

export function LearnerNavigation({ selected, disabled, onSelect, mobile }: {
  selected: LearnerTab; disabled: boolean; onSelect: (tab: LearnerTab) => void; mobile: boolean;
}) {
  return <View accessibilityLabel="Learning navigation" style={{ flexDirection: 'row', gap: mobile ? 2 : 6, maxWidth: '100%', minWidth: 0, ...(mobile ? { width: '100%' } : {}) }}>
    {learnerTabs.map(tab => <NavigationItem key={tab} tab={tab} selected={selected === tab} disabled={disabled} onPress={() => onSelect(tab)} mobile={mobile} />)}
  </View>;
}

function NavigationItem({ tab, selected, disabled, onPress, mobile }: {
  tab: LearnerTab; selected: boolean; disabled: boolean; onPress: () => void; mobile: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={tab} accessibilityState={{ selected, disabled }} aria-selected={selected} disabled={disabled}
    onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => ({ flexDirection: mobile ? 'column' : 'row', gap: mobile ? 4 : 8, alignItems: 'center', justifyContent: 'center',
      minHeight: mobile ? 51 : 47, paddingVertical: 5, paddingHorizontal: mobile ? 2 : 11,
      ...(mobile ? { flex: 1, minWidth: 0 } : {}),
      borderRadius: 10, borderWidth: 1, borderColor: selected ? '#C4DACB' : 'transparent',
      backgroundColor: selected ? colors.sageTint : pressed ? colors.sand : 'transparent', opacity: disabled ? 0.5 : 1,
      outlineWidth: focused ? 3 : 0, outlineStyle: 'solid', outlineOffset: 2, outlineColor: colors.focusRing })}>
    <View style={{ width: mobile ? 22 : 27, height: mobile ? 22 : 27, borderRadius: 7, alignItems: 'center', justifyContent: 'center',
      backgroundColor: mobile ? 'transparent' : selected ? colors.green : iconColors[tab] }}>
      <Icon name={icons[tab]} size={mobile ? 20 : 17} color={selected ? colors.primary : colors.ink} />
    </View>
    <Text style={{ ...(mobile ? designTokens.typography.caption : designTokens.typography.muted), textAlign: 'center', flexShrink: 1, color: selected ? colors.primary : colors.muted,
      fontWeight: selected ? '700' : '600' }}>{tab}</Text>
  </Pressable>;
}
