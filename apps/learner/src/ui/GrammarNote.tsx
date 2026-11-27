import { Platform, StyleSheet, Text, View } from 'react-native';
import type { LearnerGrammarNote } from '@smartlingo/content';
import type { TargetLanguage } from '@smartlingo/domain';
import { colors, designTokens as tokens, styles as s } from './theme';

export function GrammarNote({ note, language }: { note: LearnerGrammarNote; language: TargetLanguage }) {
  const { explanation, exampleTarget } = note;
  const start = exampleTarget ? explanation.indexOf(exampleTarget) : -1;
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };
  return <View style={layout.card} testID="grammar-note">
    <Text accessibilityRole="header" aria-level={3} style={s.heading}>{note.title}</Text>
    <Text testID="grammar-explanation" style={s.body}>
      {exampleTarget && start >= 0
        ? <>{explanation.slice(0, start)}<Text {...languageProps}>{exampleTarget}</Text>{explanation.slice(start + exampleTarget.length)}</>
        : explanation}
    </Text>
  </View>;
}

const layout = StyleSheet.create({
  card: {
    width: '100%', maxWidth: 680, minWidth: 0, padding: tokens.space.lg, gap: tokens.space.sm,
    backgroundColor: colors.card, borderRadius: tokens.radius.lg, borderWidth: 1, borderColor: colors.line,
  },
});
