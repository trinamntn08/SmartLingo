import { Text, View, useWindowDimensions } from 'react-native';
import { languageNames, targetLanguages, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { ContextImage } from '../ui/ContextImage';
import { getContextPhoto } from '../ui/contextPhotos';
import { colors, designTokens, styles as s } from '../ui/theme';

const introductions = {
  'fr-FR': { greeting: 'Bonjour !', description: 'Get comfortable with everyday conversations in France.', tint: colors.goldTint },
  'ja-JP': { greeting: 'こんにちは', description: 'Learn Japanese letters, then use them in everyday conversations.', tint: colors.sageTint },
};

export function LanguageChooser({ onChoose }: { onChoose: (language: TargetLanguage) => void }) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  return <View testID="language-chooser" style={{ gap: compact ? 20 : 30, minWidth: 0, paddingTop: compact ? 4 : 16 }}>
    <View style={{ gap: 8 }}>
      <Text accessibilityRole="header" style={[s.hero, compact && { ...designTokens.typography.target, letterSpacing: -1.2 }]}>Choose a language</Text>
      <Text style={[s.body, { maxWidth: 680 }]}>Learn through everyday situations, with pictures and English explanations.</Text>
    </View>
    <View style={[s.split, { gap: compact ? 16 : 24 }]}>
      {targetLanguages.map(language => {
        const item = introductions[language];
        return <View key={language} style={[s.card, s.column, { flexBasis: compact ? '100%' : '45%', padding: 0, gap: 0, overflow: 'hidden' }]}>
          <ContextImage photo={getContextPhoto(language)} style={{ aspectRatio: compact ? 2.35 : 1.9 }} />
          <View style={{ gap: compact ? 12 : 16, padding: compact ? 17 : 24, flexGrow: 1 }}>
            <View style={[s.row, { justifyContent: 'space-between', gap: 8 }]}>
              <Text accessibilityRole="header" style={[s.heading, { fontSize: compact ? 28 : 32, lineHeight: 40 }]}>{languageNames[language]}</Text>
              <View style={{ borderRadius: 8, backgroundColor: item.tint, paddingVertical: 4, paddingHorizontal: 10 }}>
                <Text style={[s.body, { fontWeight: '600' }]} accessibilityLabel={`${item.greeting} means hello`}>{item.greeting}</Text>
              </View>
            </View>
            <Text style={[s.body, { flexGrow: 1 }]}>{item.description}</Text>
            <View style={s.row}>
              <Button primary trailingIcon="arrow-right" onPress={() => onChoose(language)}>Learn {languageNames[language]}</Button>
            </View>
          </View>
        </View>;
      })}
    </View>
    <Text style={s.muted}>Progress is saved in this browser. You can switch languages any time.</Text>
  </View>;
}
