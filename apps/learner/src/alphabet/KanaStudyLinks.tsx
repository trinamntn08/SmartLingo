import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '../app/WebNavigation';
import { routeHref } from '../app/routes';
import { sidebarStyles } from '../ui/SidebarRow';
import { routePress } from '../ui/routePress';
import { colors, designTokens as tokens } from '../ui/theme';
import { kanaTopics, type KanaTopic } from './kanaTopics';

export function KanaStudyLinks({ disabled }: { disabled?: boolean }) {
  return <View role="navigation" accessibilityLabel="Japanese writing" style={sidebarStyles.group}>
    <Text style={sidebarStyles.sectionLabel}>Japanese writing</Text>
    <View style={writing.links}>
      {kanaTopics.map(topic => <KanaTopicLink key={topic.script} name={topic.name} disabled={disabled} />)}
    </View>
  </View>;
}

function KanaTopicLink({ name, disabled }: { name: KanaTopic['name']; disabled?: boolean }) {
  const { navigate } = useNavigation();
  const [focused, setFocused] = useState(false);
  const route = { kind: 'topics', language: 'ja-JP', topic: name } as const;

  return <Pressable accessibilityRole="link" accessibilityState={{ disabled }} disabled={disabled}
    {...routePress(disabled ? undefined : routeHref(route), () => navigate(route))}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [writing.link, pressed && writing.pressed,
      focused && writing.focused, disabled && writing.disabled]}>
    <Text style={writing.label}>{name}</Text>
  </Pressable>;
}

const writing = StyleSheet.create({
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.space.sm },
  link: { flexBasis: 88, flexGrow: 1, maxWidth: 144, minHeight: tokens.control.minimumTarget,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: tokens.space.sm,
    paddingVertical: tokens.space.sm, backgroundColor: colors.card, borderRadius: tokens.radius.sm,
    borderWidth: 1, borderColor: colors.line },
  focused: { outlineWidth: tokens.focus.outlineWidth, outlineColor: colors.focusRing, outlineStyle: 'solid', outlineOffset: -3 },
  pressed: { backgroundColor: colors.sand },
  disabled: { opacity: tokens.opacity.disabled },
  label: { ...tokens.typography.smallLabel, color: colors.primary },
});
