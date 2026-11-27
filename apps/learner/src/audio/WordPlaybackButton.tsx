import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';
import type { TargetLanguage } from '@smartlingo/domain';
import { Icon } from '../ui/Icon';
import { colors, designTokens } from '../ui/theme';

export function WordPlaybackButton({ text, language, playing, onPress, label, textStyle, headingLevel }: {
  text: string; language: TargetLanguage; playing: boolean; onPress: () => void; label: string;
  textStyle: StyleProp<TextStyle>; headingLevel?: 2 | 3;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };
  return <View {...languageProps} accessibilityRole={headingLevel ? 'header' : undefined}
    accessibilityLabel={headingLevel ? text : undefined} aria-level={headingLevel} style={layout.container}>
    <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Stop audio' : label}
      onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
      style={layout.button}>
      <Text style={[textStyle, layout.text, (hovered || focused) && layout.underline]}>{text}</Text>
      <View style={[layout.icon, focused && layout.focus, playing && layout.playing]}>
        <Icon name={playing ? 'stop' : 'speaker'} color={colors.audioIcon} size={designTokens.control.audioIconSize} />
      </View>
    </Pressable>
  </View>;
}

const layout = StyleSheet.create({
  container: { flexShrink: 1, minWidth: 0, maxWidth: '100%' },
  button: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 0, maxWidth: '100%' },
  text: { flexShrink: 1, minWidth: 0 },
  underline: { textDecorationLine: 'underline' },
  icon: { alignItems: 'center', justifyContent: 'center', borderRadius: designTokens.radius.sm, borderWidth: 2,
    borderColor: 'transparent', backgroundColor: colors.sageTint,
    minWidth: designTokens.control.minimumTarget, minHeight: designTokens.control.minimumTarget },
  focus: { borderColor: colors.focusRing },
  playing: { backgroundColor: colors.sand },
});
