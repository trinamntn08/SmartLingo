import { useId, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, designTokens, styles as s } from './theme';

/** Mount settings on first use, then retain their state while collapsed. */
export function Disclosure({ title, description, children, keepMounted = true }: { title: string; description?: string; children: ReactNode; keepMounted?: boolean }) {
  const contentId = useId();
  const [expanded, setExpanded] = useState(false);
  const [visited, setVisited] = useState(false);
  const [focused, setFocused] = useState(false);

  function toggle() {
    setVisited(true);
    setExpanded(value => !value);
  }

  return <View style={[s.card, { padding: 0, gap: 0, minWidth: 0 }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityHint={description}
      accessibilityState={{ expanded }} aria-expanded={expanded} aria-controls={contentId}
      onPress={toggle} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={({ pressed }) => [{ padding: 22, minHeight: 88, borderRadius: designTokens.radius.card,
        flexDirection: 'row', gap: 16, alignItems: 'center',
        backgroundColor: pressed ? colors.sand : colors.card }, focused && {
        outlineColor: colors.ink, outlineWidth: designTokens.focus.outlineWidth,
        outlineStyle: 'solid', outlineOffset: designTokens.focus.outlineOffset,
      }]}>
      <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
        <Text style={[s.heading, designTokens.typography.compactHeading]}>{title}</Text>
        {!!description && <Text style={s.muted}>{description}</Text>}
      </View>
      <Text accessible={false} style={{ fontSize: 25, color: colors.ink }}>{expanded ? '−' : '+'}</Text>
    </Pressable>
    <View nativeID={contentId} accessibilityElementsHidden={!expanded} importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
      style={{ display: expanded ? 'flex' : 'none', gap: 18, padding: 14, paddingTop: 0, minWidth: 0 }}>
      {(expanded || (keepMounted && visited)) && children}
    </View>
  </View>;
}
