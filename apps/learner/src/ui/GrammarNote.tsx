import { Platform, StyleSheet, Text, View } from 'react-native';
import type { GrammarExample, LearnerGrammarNote } from '@smartlingo/content';
import type { TargetLanguage } from '@smartlingo/domain';
import { colors, designTokens as tokens, styles as s } from './theme';

function ExampleLines({ example, language }: { example: GrammarExample; language: TargetLanguage }) {
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };
  return <View style={layout.example}>
    <Text testID="grammar-target" {...languageProps} style={layout.target}>{example.target}</Text>
    <Text testID="grammar-meaning" style={s.muted}>{example.meaning}</Text>
  </View>;
}

export function GrammarNote({ note, language, compact }: {
  note: LearnerGrammarNote; language: TargetLanguage; compact: boolean;
}) {
  const { example, detail } = note;
  return <View style={layout.card} testID="grammar-note">
    <Text accessibilityRole="header" aria-level={3} style={[layout.pattern, compact && tokens.typography.compactHeading]}>
      {note.title}
    </Text>
    {example
      ? <ExampleLines example={example} language={language} />
      : <Text testID="grammar-explanation" style={s.body}>{note.explanation}</Text>}
    {example && detail && <View testID="grammar-detail" style={layout.detail}>
      {typeof detail === 'string'
        ? <Text style={s.muted}>{detail}</Text>
        : <>
          {detail.label && <Text style={layout.detailLabel}>{detail.label}</Text>}
          <ExampleLines example={detail} language={language} />
        </>}
    </View>}
  </View>;
}

const layout = StyleSheet.create({
  card: {
    width: '100%', maxWidth: 680, minWidth: 0, padding: tokens.space.lg, gap: tokens.space.lg,
    backgroundColor: colors.card, borderRadius: tokens.radius.lg, borderWidth: 1, borderColor: colors.line,
  },
  pattern: { ...tokens.typography.heading, color: colors.primary },
  example: { gap: tokens.space.xs, minWidth: 0 },
  target: { ...tokens.typography.label, color: colors.ink },
  detail: { gap: tokens.space.sm, paddingTop: tokens.space.md, borderTopWidth: 1, borderColor: colors.line },
  detailLabel: { ...tokens.typography.smallLabel, color: colors.ink },
});
