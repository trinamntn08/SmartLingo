import { Text, View, useWindowDimensions } from 'react-native';
import { languageNames, targetLanguages, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { styles as s } from '../ui/theme';

const introductions = {
  'fr-FR': { greeting: 'Bonjour !', meaning: 'Hello!', description: 'Feel more at home in everyday life in France.', color: '#E8ECD9' },
  'ja-JP': { greeting: 'こんにちは', meaning: 'Hello!', description: 'Start with Japanese letters, then everyday words and conversations.', color: '#FFF0BB' },
};

export function LanguageChooser({ onChoose }: { onChoose: (language: TargetLanguage) => void }) {
  const compact = useWindowDimensions().width < 600;
  return <View testID="language-chooser" style={{ gap: 28, minWidth: 0, paddingTop: compact ? 8 : 32 }}>
    <View style={{ gap: 14 }}>
      <Text style={s.eyebrow}>A little practice. Every day.</Text>
      <Text accessibilityRole="header" style={[s.hero, compact && { fontSize: 36, lineHeight: 44 }]}>What will you learn today?</Text>
      <Text style={[s.body, { maxWidth: 640 }]}>Choose a language to begin. Short lessons, clear English explanations, and room to go at your own pace.</Text>
    </View>
    <View style={[s.split, { gap: 22 }]}>{targetLanguages.map(language => {
      const introduction = introductions[language];
      return <View key={language} style={[s.card, s.column, { flexBasis: 300, minWidth: 0, padding: compact ? 24 : 32, gap: 20 }]}>
        <View style={{ backgroundColor: introduction.color, borderRadius: 16, padding: 24, gap: 6 }}>
          <Text style={[s.heading, { fontSize: 32, lineHeight: 42 }]}>{introduction.greeting}</Text>
          <Text style={s.muted}>{introduction.meaning}</Text>
        </View>
        <Text accessibilityRole="header" style={s.title}>{languageNames[language]}</Text>
        <Text style={s.body}>{introduction.description}</Text>
        <Button primary onPress={() => onChoose(language)}>Learn {languageNames[language]}</Button>
      </View>;
    })}</View>
    <Text style={s.muted}>No account needed. Switch languages any time; your progress stays in this browser. Lessons are draft previews.</Text>
  </View>;
}
