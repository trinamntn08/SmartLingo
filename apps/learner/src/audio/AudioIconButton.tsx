import { useState } from 'react';
import { Pressable } from 'react-native';
import { Icon } from '../ui/Icon';
import { colors, designTokens } from '../ui/theme';

export function AudioIconButton({ playing, label, stopLabel = 'Stop audio', onPress }: {
  playing: boolean; label: string; stopLabel?: string; onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={playing ? stopLabel : label}
    onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => ({
      alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center',
      minWidth: designTokens.control.minimumTarget, minHeight: designTokens.control.minimumTarget,
      borderRadius: designTokens.radius.pill, borderWidth: 2, borderColor: focused ? colors.focusRing : 'transparent',
      backgroundColor: pressed ? colors.sand : colors.sageTint,
    })}>
    <Icon name={playing ? 'stop' : 'speaker'} color={colors.audioIcon} size={designTokens.control.audioIconSize} />
  </Pressable>;
}
