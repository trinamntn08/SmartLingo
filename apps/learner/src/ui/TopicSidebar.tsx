import { useId, useRef, useState, type ComponentRef, type RefObject } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { LessonTopic } from '@smartlingo/domain';
import { Icon } from './Icon';
import { colors, designTokens, styles as s } from './theme';

type TopicTrigger = ComponentRef<typeof Pressable>;

export function TopicSidebar({ topics, selected, onSelect, compact, disabled }: {
  topics: LessonTopic[]; selected: string | null; onSelect: (name: string | null) => void; compact: boolean; disabled: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const trigger = useRef<TopicTrigger>(null);

  function choose(name: string | null) {
    onSelect(name);
    if (compact) {
      setExpanded(false);
      trigger.current?.focus();
    }
  }

  const all = <TopicChoice label="Browse all topics" selected={selected === null} disabled={disabled} compact={compact}
    onPress={() => choose(null)} title="All topics" count={topics.length} all />;
  const choices = topics.map(topic => <TopicChoice key={topic.name} label={`Browse topic ${topic.name}`} selected={selected === topic.name}
    disabled={disabled} compact={compact} onPress={() => choose(topic.name)} title={topic.name} count={topic.lessons.length} />);
  const empty = !topics.length && <Text style={[s.muted, { padding: 12 }]}>No topics available yet.</Text>;
  if (compact) return <View testID="topic-navigation" accessibilityLabel="Topics" style={{ gap: 6, minWidth: 0 }}>
    <TopicDisclosure trigger={trigger} expanded={expanded} selected={selected} contentId={contentId} onPress={() => setExpanded(value => !value)} />
    {expanded && <ScrollView horizontal nativeID={contentId} keyboardShouldPersistTaps="handled" testID="topic-navigation-strip"
      contentContainerStyle={layout.strip}>
      {all}
      {choices}
      {empty}
    </ScrollView>}
  </View>;
  const railChoices = <View style={{ gap: 3 }}>
    {all}
    <View style={{ marginLeft: 13, paddingLeft: 9, borderLeftWidth: 1, borderColor: colors.line, gap: 3 }}>
      {choices}
    </View>
    {empty}
  </View>;
  return <View testID="topic-navigation" accessibilityLabel="Topics" style={{ flex: 1, minHeight: 0, backgroundColor: colors.card,
    borderRightWidth: 1, borderColor: colors.line }}>
    <View style={{ padding: 18, paddingTop: 22, gap: 5 }}>
      <Text accessibilityRole="header" style={[s.heading, designTokens.typography.sectionHeading]}>Your library</Text>
      <Text style={s.muted}>Everyday situations</Text>
    </View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 10, paddingTop: 0, paddingBottom: 24 }}>
      {railChoices}
    </ScrollView>
  </View>;
}

function TopicDisclosure({ trigger, expanded, selected, contentId, onPress }: {
  trigger: RefObject<TopicTrigger | null>; expanded: boolean; selected: string | null; contentId: string; onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable ref={trigger} accessibilityRole="button" accessibilityLabel="Topics" accessibilityState={{ expanded }} aria-expanded={expanded} aria-controls={expanded ? contentId : undefined}
    onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={{ minHeight: designTokens.control.minimumTarget, flexDirection: 'row', gap: 10, alignItems: 'center',
      paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: colors.line, borderRadius: 10, backgroundColor: colors.card,
      outlineWidth: focused ? designTokens.focus.outlineWidth : 0, outlineColor: colors.focusRing, outlineStyle: 'solid' }}>
    <Icon name="folder" size={18} color={colors.primary} />
    <Text style={[s.body, { ...designTokens.typography.button, textAlign: 'left', flex: 1, minWidth: 0 }]}>Topics · {selected ?? 'All topics'}</Text>
    <View style={expanded && layout.openChevron}><Icon name="chevron-down" size={18} color={colors.primary} /></View>
  </Pressable>;
}

function TopicChoice({ label, selected, disabled, onPress, title, count, compact, all }: {
  label: string; selected: boolean; disabled: boolean; onPress: () => void; title: string; count: number; compact: boolean; all?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected, disabled }} aria-selected={selected}
    disabled={disabled} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [layout.choice, compact && (all ? layout.stripAll : layout.stripChoice), {
      backgroundColor: selected ? colors.sageTint : pressed ? colors.sand : compact ? colors.card : 'transparent',
      borderColor: selected || compact ? colors.line : 'transparent', opacity: disabled ? designTokens.opacity.disabled : 1,
      outlineWidth: focused ? designTokens.focus.outlineWidth : 0, outlineColor: colors.focusRing, outlineStyle: 'solid',
    }]}>
    <Text numberOfLines={compact ? 2 : undefined} style={[s.body, { flex: 1, minWidth: 0, ...designTokens.typography.button,
      textAlign: 'left', fontWeight: selected ? '700' : '400' }, compact && designTokens.typography.caption]}>{title}</Text>
    <Text style={[s.muted, compact ? designTokens.typography.caption : designTokens.typography.label]}>{count}</Text>
  </Pressable>;
}

const layout = StyleSheet.create({
  strip: { flexDirection: 'row', gap: 7, paddingHorizontal: 4, paddingVertical: 5 },
  openChevron: { transform: [{ rotate: '180deg' }] },
  choice: { minHeight: designTokens.control.minimumTarget, flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 10, borderRadius: 9, borderWidth: 1 },
  stripChoice: { flexShrink: 0, width: 172 },
  stripAll: { flexShrink: 0, width: 116 },
});
