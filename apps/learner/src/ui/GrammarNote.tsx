import { Platform, StyleSheet, Text, View } from 'react-native';
import type { Lesson } from '@smartlingo/domain';
import { colors, designTokens as tokens, styles as s } from './theme';

const repeatNote = {
  id: 'fr.essentials.repair',
  title: 'A question you can reuse',
  explanation: 'Vous pouvez + a verb asks can you…? Keep répéter in its dictionary form after pouvez. These phrases work with strangers and staff.',
};

const sentenceSegmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter('en', { granularity: 'sentence' })
  : undefined;

export function GrammarNote({ lessonId, note }: { lessonId: string; note: Lesson['grammar'] }) {
  // A different authored note must display its own wording, including in the editor preview.
  const showRepeatPattern = lessonId === repeatNote.id && note.title === repeatNote.title
    && note.explanation === repeatNote.explanation;

  return <View style={layout.card} testID="grammar-note">
    <View style={layout.header}>
      <Text style={[s.eyebrow, layout.label]}>Grammar</Text>
      <Text accessibilityRole="header" style={[s.heading, layout.title]}>{note.title}</Text>
    </View>
    {showRepeatPattern ? <RepeatPattern /> : <GrammarExplanation explanation={note.explanation} />}
  </View>;
}

function RepeatPattern() {
  const french = Platform.OS === 'web' ? { lang: 'fr-FR' } : { accessibilityLanguage: 'fr-FR' };
  return <View style={layout.patternRow}>
    <View style={[layout.column, layout.example]}>
      <Text style={[s.eyebrow, layout.label]}>Example</Text>
      <Text {...french} style={[s.heading, layout.french]}>Vous pouvez répéter ?</Text>
      <Text style={s.body}>Can you repeat that?</Text>
    </View>
    <View style={[layout.column, layout.rule]}>
      <Text style={[s.eyebrow, layout.label]}>Pattern</Text>
      <Text style={[s.heading, layout.formula]}><Text {...french} style={layout.label}>Vous pouvez</Text> + a verb</Text>
      <Text style={s.body}>Use the dictionary form of the verb.</Text>
      <Text style={s.muted}>Use this polite question with strangers and staff.</Text>
    </View>
  </View>;
}

function GrammarExplanation({ explanation }: { explanation: string }) {
  const lines = explanation.split(/\r?\n/u).flatMap(line => sentenceSegmenter
    ? Array.from(sentenceSegmenter.segment(line), ({ segment }) => segment.trim())
    : [line.trim()]).filter(Boolean);

  return <View testID="grammar-explanation" style={layout.explanation}>
    {lines.map((line, index) => <View key={index} style={layout.point}>
      <Text style={s.body}>{line}</Text>
    </View>)}
  </View>;
}

const layout = StyleSheet.create({
  card: {
    minWidth: 0, backgroundColor: colors.card, borderRadius: tokens.radius.lg,
    borderWidth: 1, borderColor: colors.line, overflow: 'hidden',
  },
  header: { paddingHorizontal: tokens.space.lg, paddingVertical: tokens.space.md, gap: tokens.space.xs, backgroundColor: colors.sageTint },
  label: { color: colors.primary },
  title: { fontSize: 21, lineHeight: 28 },
  patternRow: { padding: tokens.space.md, gap: tokens.space.md, flexDirection: 'row', flexWrap: 'wrap' },
  column: { flexGrow: 1, flexShrink: 1, flexBasis: 240, minWidth: 0, padding: tokens.space.lg, borderRadius: tokens.radius.md, gap: tokens.space.xs },
  example: { backgroundColor: colors.goldTint },
  french: { fontSize: 25, lineHeight: 32 },
  rule: { backgroundColor: colors.paper },
  formula: { fontSize: 21, lineHeight: 28 },
  explanation: { padding: tokens.space.lg, gap: tokens.space.md },
  point: { maxWidth: 690, borderLeftWidth: 3, borderColor: colors.green, paddingLeft: tokens.space.md },
});
