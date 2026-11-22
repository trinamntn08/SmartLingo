import { useId, useRef, useState, type ComponentRef, type RefObject } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { LessonTopic } from '@smartlingo/domain';
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

  const choices = <View style={{ gap: 6 }}>
    <TopicChoice label="Browse all topics" selected={selected === null} disabled={disabled} onPress={() => choose(null)} title="All topics" count={topics.length} />
    {topics.map(topic => <TopicChoice key={topic.name} label={`Browse topic ${topic.name}`} selected={selected === topic.name}
      disabled={disabled} onPress={() => choose(topic.name)} title={topic.name} count={topic.lessons.length} />)}
    {!topics.length && <Text style={[s.muted, { padding: 12 }]}>No topics available yet.</Text>}
  </View>;
  if (compact) return <View testID="topic-navigation" accessibilityLabel="Topics" style={{ backgroundColor: colors.paper,
    borderBottomWidth: 1, borderColor: colors.line, padding: 16, gap: 12 }}>
    <TopicDisclosure trigger={trigger} expanded={expanded} selected={selected} contentId={contentId} onPress={() => setExpanded(value => !value)} />
    {expanded && <View nativeID={contentId}>{choices}</View>}
  </View>;
  return <View testID="topic-navigation" accessibilityLabel="Topics" style={{ flex: 1, minHeight: 0, backgroundColor: colors.paper,
    borderRightWidth: 1, borderColor: colors.line }}>
    <View style={{ padding: 20, paddingTop: 30, gap: 6 }}>
      <Text accessibilityRole="header" style={s.heading}>Your library</Text>
      <Text style={s.muted}>Choose a topic</Text>
    </View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 12, paddingTop: 0, paddingBottom: 32 }}>
      {choices}
    </ScrollView>
  </View>;
}

function TopicDisclosure({ trigger, expanded, selected, contentId, onPress }: {
  trigger: RefObject<TopicTrigger | null>; expanded: boolean; selected: string | null; contentId: string; onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable ref={trigger} accessibilityRole="button" accessibilityLabel="Topics" accessibilityState={{ expanded }} aria-expanded={expanded} aria-controls={expanded ? contentId : undefined}
    onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={{ minHeight: 48, flexDirection: 'row', gap: 12, justifyContent: 'space-between', alignItems: 'center',
      padding: 14, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 14, backgroundColor: colors.card,
      outlineWidth: focused ? designTokens.focus.outlineWidth : 0, outlineColor: colors.focusRing, outlineStyle: 'solid' }}>
    <Text style={[s.body, { fontWeight: '700', flexShrink: 1 }]}>Topics · {selected ?? 'All topics'}</Text>
    <Text style={s.body}>{expanded ? '−' : '+'}</Text>
  </Pressable>;
}

function TopicChoice({ label, selected, disabled, onPress, title, count }: {
  label: string; selected: boolean; disabled: boolean; onPress: () => void; title: string; count: number;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected, disabled }} aria-selected={selected}
    disabled={disabled} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => ({ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10,
      padding: 12, borderRadius: 12, backgroundColor: selected ? colors.green : pressed ? colors.sand : 'transparent',
      borderWidth: 1, borderColor: selected ? colors.line : 'transparent', opacity: disabled ? designTokens.opacity.disabled : 1,
      outlineWidth: focused ? designTokens.focus.outlineWidth : 0, outlineColor: colors.focusRing, outlineStyle: 'solid' })}>
    <Text style={[s.body, { flex: 1, minWidth: 0, fontSize: 16, lineHeight: 23, fontWeight: selected ? '700' : '400' }]}>{title}</Text>
    <Text style={[s.muted, { fontSize: 14 }]}>{count}</Text>
  </Pressable>;
}
