import { ScrollView, Text, View } from 'react-native';
import type { LessonTopic } from '@smartlingo/domain';
import { Button } from './controls';
import { colors, styles as s } from './theme';

export function TopicSidebar({ topics, selected, onSelect, compact }: {
  topics: LessonTopic[]; selected: string | null; onSelect: (name: string | null) => void; compact: boolean;
}) {
  const choices = <>
    <Button label="All topics" selected={selected === null} onPress={() => onSelect(null)}>All topics</Button>
    {topics.map(topic => <Button key={topic.name} label={`Topic ${topic.name}`} selected={selected === topic.name}
      onPress={() => onSelect(topic.name)}>{topic.name} · {topic.vocabulary.length}</Button>)}
  </>;
  if (compact) return <View testID="topic-navigation" accessibilityLabel="Topics" style={{ backgroundColor: colors.card, borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 10 }}>
    <ScrollView horizontal showsHorizontalScrollIndicator keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}>
      {choices}
    </ScrollView>
  </View>;
  return <View testID="topic-navigation" accessibilityLabel="Topics" style={{ flex: 1, minHeight: 0, backgroundColor: colors.card }}>
    <Text accessibilityRole="header" style={[s.eyebrow, { padding: 20, paddingBottom: 12, borderTopWidth: 1, borderColor: colors.line }]}>Topics</Text>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 32, gap: 8 }}>{choices}</ScrollView>
  </View>;
}
