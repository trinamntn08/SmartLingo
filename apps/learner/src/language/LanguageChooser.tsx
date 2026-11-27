import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { languageNames, targetLanguages, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { ContextImage } from '../ui/ContextImage';
import { getContextPhoto } from '../ui/contextPhotos';
import { colors, designTokens, styles as s } from '../ui/theme';

const introductions = {
  'fr-FR': 'Greetings, errands and conversations in France',
  'ja-JP': 'Hiragana, katakana and everyday conversation',
};

export function LanguageChooser({ onChoose }: { onChoose: (language: TargetLanguage) => void }) {
  const { width } = useWindowDimensions();
  const compact = width < designTokens.layout.compactBreakpoint;
  const split = width >= 1060;
  return <View testID="language-chooser" style={[chooser.page, split && chooser.splitPage, compact && chooser.compactPage]}>
    <View style={[chooser.intro, split && chooser.sideIntro]}>
      <View aria-hidden style={chooser.marker} />
      <Text accessibilityRole="header" aria-level={1} style={[s.hero, !split && chooser.smallHero]}>French and Japanese for everyday life</Text>
      <Text style={chooser.description}>Study useful words, listen to real-life dialogues and practise what to say.</Text>
    </View>
    <View style={split && chooser.sideOptions}>
      <View style={[chooser.grid, compact && chooser.compactGrid]}>
        {targetLanguages.map(language => <View key={language} style={[chooser.card, compact && chooser.compactCard]}>
          <ContextImage photo={getContextPhoto(language)} style={compact ? chooser.compactPhoto : [chooser.photo, split && chooser.desktopPhoto]} />
          <View style={[chooser.content, compact && chooser.compactContent]}>
            <View style={chooser.language}>
              <Text accessibilityRole="header" aria-level={2} style={[s.heading, compact && chooser.compactHeading]}>{languageNames[language]}</Text>
              <Text style={chooser.details}>{introductions[language]}</Text>
            </View>
            <View style={chooser.action}>
              <Button compact accent trailingIcon="arrow-right" onPress={() => onChoose(language)}>Learn {languageNames[language]}</Button>
            </View>
          </View>
        </View>)}
      </View>
    </View>
  </View>;
}

const chooser = StyleSheet.create({
  page: { gap: 32, minWidth: 0, paddingTop: 24 },
  splitPage: { flexDirection: 'row', alignItems: 'center', gap: 48, paddingTop: 64 },
  compactPage: { gap: 24, paddingTop: 16 },
  intro: { alignItems: 'flex-start', gap: 16 },
  sideIntro: { flex: 0.95, minWidth: 0, paddingBottom: 32 },
  marker: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.yellow },
  smallHero: { fontSize: 40, lineHeight: 44, letterSpacing: -0.8, maxWidth: 600 },
  description: { ...designTokens.typography.body, color: colors.muted, maxWidth: 420 },
  sideOptions: { flex: 1.8, minWidth: 0 },
  grid: { flexDirection: 'row', gap: 16 },
  compactGrid: { flexDirection: 'column', gap: 12 },
  card: { flex: 1, minWidth: 0, borderRadius: designTokens.radius.card, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  compactCard: { flexDirection: 'row-reverse' },
  photo: { aspectRatio: 1.55, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  desktopPhoto: { aspectRatio: 1.12 },
  compactPhoto: { width: '30%', minHeight: 136, borderTopRightRadius: 15, borderBottomRightRadius: 15 },
  content: { flexGrow: 1, justifyContent: 'space-between', gap: 16, padding: 20 },
  compactContent: { flex: 1, minWidth: 0, gap: 12, padding: 12 },
  language: { gap: 4 },
  action: { alignItems: 'flex-start' },
  details: { ...designTokens.typography.caption, color: colors.muted },
  compactHeading: { ...designTokens.typography.compactHeading },
});
