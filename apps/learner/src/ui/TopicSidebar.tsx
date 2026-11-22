import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { LessonTopic } from '@smartlingo/domain';
import { Icon } from './Icon';
import { colors, styles as s } from './theme';

export function TopicSidebar({ topics, selected, onSelect, compact, exploring }: {
  topics: LessonTopic[]; selected: string | null; onSelect: (name: string | null) => void; compact: boolean; exploring: boolean;
}) {
  return <View testID="topic-navigation" role="navigation" accessibilityLabel="Course topics" style={[rail.container, compact && rail.compact]}>
    <View style={[rail.title, compact && rail.compactTitle]}><Text accessibilityRole="header" style={s.eyebrow}>Course topics</Text>
      <Text style={rail.count}>{topics.length}</Text>
    </View>
    <ScrollView horizontal={compact} keyboardShouldPersistTaps="handled" contentContainerStyle={[rail.list, compact && rail.compactList]}>
      <TopicChoice title="All topics" label="All topics" active={exploring && selected === null} onPress={() => onSelect(null)} all compact={compact} />
      {topics.map(topic => <TopicChoice key={topic.name} title={topic.name} label={`Topic ${topic.name}`} active={exploring && selected === topic.name}
        count={topic.vocabulary.length} compact={compact} onPress={() => onSelect(topic.name)} />)}
    </ScrollView>
  </View>;
}

function TopicChoice({ title, label, active, count, all, compact, onPress }: {
  title: string; label: string; active: boolean; count?: number; all?: boolean; compact: boolean; onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} aria-current={active ? 'page' : undefined}
    onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => [rail.choice, all && rail.all, compact && [rail.compactChoice, all && rail.compactAll], (pressed || hovered) && { backgroundColor: colors.sand },
      active && { backgroundColor: colors.greenSoft, borderColor: colors.green }, focused && s.focus]}>
    {all && <Icon name="topics" size={16} color={colors.forest} />}
    <Text style={[rail.name, (active || all) && rail.emphasis]}>{title}</Text>
    {count !== undefined && <Text aria-hidden style={rail.count}>{count}</Text>}
  </Pressable>;
}

const rail = StyleSheet.create({
  container: { width: 234, flexShrink: 0, borderRightWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  compact: { width: '100%', borderRightWidth: 0, borderBottomWidth: 1 },
  title: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  compactTitle: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 7 },
  list: { paddingHorizontal: 12, paddingBottom: 18, gap: 2 },
  compactList: { paddingHorizontal: 14, paddingBottom: 10, gap: 7 },
  choice: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 9, borderWidth: 1, borderColor: 'transparent', paddingHorizontal: 9, paddingVertical: 6 },
  all: { marginBottom: 6, backgroundColor: colors.paper },
  compactChoice: { width: 164, backgroundColor: colors.paper, borderColor: colors.line },
  compactAll: { width: 106, marginBottom: 0 },
  name: { flex: 1, minWidth: 0, color: colors.ink, fontSize: 13, lineHeight: 17, fontWeight: '500' },
  emphasis: { fontWeight: '700', color: colors.forest },
  count: { color: colors.muted, fontSize: 11, lineHeight: 16, fontVariant: ['tabular-nums'] },
});
