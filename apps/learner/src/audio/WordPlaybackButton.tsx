import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';
import type { TargetLanguage } from '@smartlingo/domain';
import { colors, designTokens, styles as s } from '../ui/theme';

export function WordPlaybackButton({ text, language, playing, onPress, textStyle, label, testID, heading = false }: {
  text: string; language: TargetLanguage; playing: boolean; onPress: () => void;
  textStyle?: StyleProp<TextStyle>; label?: string; testID?: string; heading?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };
  return <View {...(heading ? languageProps : {})} accessibilityRole={heading ? 'header' : undefined} accessibilityLabel={heading ? text : undefined} style={layout.container}>
    <Pressable accessibilityRole="button" accessibilityLabel={playing ? `Stop audio for ${text}` : label ?? `Listen to ${text}`}
      onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [layout.button, focused && layout.focus, (pressed || playing) && layout.playing]}>
      <Text testID={testID} {...languageProps} style={[s.body, textStyle, layout.word, (hovered || focused) && layout.underline]}>{text}</Text>
    </Pressable>
  </View>;
}

const layout = StyleSheet.create({
  container: { minWidth: 0, maxWidth: '100%', flexShrink: 1 },
  button: { minWidth: designTokens.control.minimumTarget, minHeight: designTokens.control.minimumTarget,
    maxWidth: '100%', justifyContent: 'center', alignSelf: 'flex-start', borderRadius: designTokens.radius.sm },
  word: { color: colors.primary, maxWidth: '100%', flexShrink: 1 },
  underline: { textDecorationLine: 'underline' },
  playing: { backgroundColor: colors.sageTint },
  focus: { outlineColor: colors.focusRing, outlineWidth: designTokens.focus.outlineWidth,
    outlineStyle: 'solid', outlineOffset: 2 },
});
