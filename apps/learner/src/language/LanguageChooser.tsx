import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { languageNames, targetLanguages, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { ContextImage } from '../ui/ContextImage';
import { getContextPhoto } from '../ui/contextPhotos';
import { colors, designTokens, styles as s } from '../ui/theme';

const introductions = {
  'fr-FR': 'Practise everyday conversations in France.',
  'ja-JP': 'Learn hiragana and everyday phrases.',
};

export function LanguageChooser({ onChoose }: { onChoose: (language: TargetLanguage) => void }) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  return <View testID="language-chooser" style={[chooser.page, compact && chooser.compactPage]}>
    <View style={chooser.intro}>
      <Text accessibilityRole="header" aria-level={1} style={[s.hero, compact && s.compactTitle]}>Choose a language</Text>
      <Text style={chooser.description}>Your next lesson will be ready as soon as you choose.</Text>
    </View>
    <View style={[s.split, compact && chooser.compactGrid]}>
      {targetLanguages.map(language => <View key={language} style={[s.card, s.column, chooser.card, compact && chooser.compactCard]}>
        <ContextImage photo={getContextPhoto(language)} style={compact ? chooser.compactPhoto : chooser.photo} />
        <View style={[chooser.content, compact && chooser.compactContent]}>
          <Text accessibilityRole="header" aria-level={2} style={[s.heading, compact && chooser.compactHeading]}>{languageNames[language]}</Text>
          <Text style={chooser.description}>{introductions[language]}</Text>
          <View style={s.row}>
            <Button accent compact={compact} trailingIcon={compact ? undefined : 'arrow-right'}
              onPress={() => onChoose(language)}>Learn {languageNames[language]}</Button>
          </View>
        </View>
      </View>)}
    </View>
    <Text style={s.muted}>Progress is saved in this browser. You can switch languages any time.</Text>
  </View>;
}

const chooser = StyleSheet.create({
  page: { gap: 24, minWidth: 0, paddingTop: 12 },
  compactPage: { gap: 14, paddingTop: 4 },
  intro: { gap: 6 },
  description: { ...designTokens.typography.muted, color: colors.muted, maxWidth: 620 },
  compactGrid: { gap: 12 },
  card: { flexBasis: '45%', padding: 0, gap: 0, overflow: 'hidden' },
  compactCard: { flexBasis: '100%', flexDirection: 'row-reverse', alignItems: 'flex-start', padding: 13, gap: 12 },
  photo: { aspectRatio: 1.9 },
  compactPhoto: { width: 73, height: 86, borderRadius: 10 },
  content: { flexGrow: 1, gap: 12, padding: 20 },
  compactContent: { flex: 1, minWidth: 0, gap: 8, padding: 0 },
  compactHeading: { ...designTokens.typography.compactHeading },
});
