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
    onPress={() => choose(null)} title="All topics" count={topics.length} />;
  const choices = topics.map(topic => <TopicChoice key={topic.name} label={`Browse topic ${topic.name}`} selected={selected === topic.name}
    disabled={disabled} compact={compact} onPress={() => choose(topic.name)} title={topic.name} count={topic.lessons.length} />);
  const empty = !topics.length && <Text style={[s.muted, { padding: 12 }]}>No topics available</Text>;
  if (compact) return <View testID="topic-navigation" accessibilityLabel="Topics" style={{ gap: 4, minWidth: 0 }}>
    <TopicDisclosure trigger={trigger} expanded={expanded} selected={selected} contentId={contentId} onPress={() => setExpanded(value => !value)} />
    {expanded && <View nativeID={contentId} testID="topic-navigation-strip" style={layout.strip}>
      {all}
      {choices}
      {empty}
    </View>}
  </View>;
  const railChoices = <View style={{ gap: 4 }}>
    {all}
    <View style={layout.railTopics}>
      {choices}
    </View>
    {empty}
  </View>;
  return <View testID="topic-navigation" accessibilityLabel="Topics" style={{ flex: 1, minHeight: 0, backgroundColor: colors.card,
    borderRightWidth: 1, borderColor: colors.line }}>
    <View style={{ padding: 16, paddingTop: 24 }}>
      <Text accessibilityRole="header" style={[s.heading, designTokens.typography.sectionHeading]}>Your library</Text>
    </View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}>
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
    style={{ minHeight: designTokens.control.minimumTarget, flexDirection: 'row', gap: 8, alignItems: 'center',
      paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.line, borderRadius: designTokens.radius.input, backgroundColor: colors.card,
      outlineWidth: focused ? designTokens.focus.outlineWidth : 0, outlineColor: colors.focusRing, outlineStyle: 'solid' }}>
    <Icon name="folder" size={18} color={colors.primary} />
    <Text style={[s.body, { ...designTokens.typography.button, textAlign: 'left', flex: 1, minWidth: 0 }]}>Topics · {selected ?? 'All topics'}</Text>
    <View style={expanded && layout.openChevron}><Icon name="chevron-down" size={18} color={colors.primary} /></View>
  </Pressable>;
}

function TopicChoice({ label, selected, disabled, onPress, title, count, compact }: {
  label: string; selected: boolean; disabled: boolean; onPress: () => void; title: string; count: number; compact: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected, disabled }} aria-selected={selected}
    disabled={disabled} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [layout.choice, compact && layout.stripChoice, {
      backgroundColor: selected || pressed ? colors.sand : compact ? colors.card : 'transparent',
      borderColor: compact ? colors.line : 'transparent', borderLeftColor: selected ? colors.yellow : compact ? colors.line : 'transparent',
      opacity: disabled ? designTokens.opacity.disabled : 1,
      outlineWidth: focused ? designTokens.focus.outlineWidth : 0, outlineColor: colors.focusRing, outlineStyle: 'solid',
    }]}>
    <Text style={[layout.choiceLabel, selected && layout.selectedLabel]}>{title}</Text>
    <Text style={layout.count}>{count}</Text>
  </Pressable>;
}

const layout = StyleSheet.create({
  strip: { gap: 4, padding: 4 },
  railTopics: { marginLeft: 8, paddingLeft: 4, borderLeftWidth: 1, borderColor: colors.line, gap: 4 },
  openChevron: { transform: [{ rotate: '180deg' }] },
  choice: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderLeftWidth: 4 },
  stripChoice: { minHeight: designTokens.control.minimumTarget },
  choiceLabel: { ...designTokens.typography.caption, flex: 1, minWidth: 0, color: colors.ink },
  selectedLabel: { fontWeight: '600' },
  count: { ...designTokens.typography.caption, color: colors.muted, fontVariant: ['tabular-nums'] },
});
