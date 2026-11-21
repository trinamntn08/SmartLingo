import { Text, View, useWindowDimensions } from 'react-native';
import { languageNames, targetLanguages, type TargetLanguage } from '@smartlingo/domain';
import { Badge, Button } from '../ui/controls';
import { styles as s } from '../ui/theme';

const introductions = {
  'fr-FR': { greeting: 'Bonjour !', meaning: 'Hello!', description: 'Feel more at home in everyday life in France.', color: '#E8ECD9' },
  'ja-JP': { greeting: 'こんにちは', meaning: 'Hello! · こんにちは', description: 'Build everyday Japanese, with kana readings beside your words.', color: '#FFF0BB' },
};

export function LanguageChooser({ onChoose }: { onChoose: (language: TargetLanguage) => void }) {
  const compact = useWindowDimensions().width < 600;
  return <View testID="language-chooser" style={{ gap: 28, minWidth: 0 }}>
    <Text style={s.eyebrow}>Small steps. Real conversations.</Text>
    <Text accessibilityRole="header" style={[s.hero, compact && { fontSize: 38, lineHeight: 44 }]}>Which language will you explore?</Text>
    <Text style={[s.body, { maxWidth: 640 }]}>Make a little room for something new. Study useful words, read a conversation, and put a sentence together — at your own pace, with English explanations.</Text>
    <View style={[s.split, { gap: 22 }]}>{targetLanguages.map(language => {
      const introduction = introductions[language];
      return <View key={language} style={[s.card, s.column, { flexBasis: 300, minWidth: 0, padding: compact ? 20 : 30, backgroundColor: introduction.color, gap: 18 }]}>
        <Badge>English explanations</Badge>
        <Text accessibilityRole="header" style={s.title}>{languageNames[language]}</Text>
        <View style={[s.notice, { gap: 8 }]}><Text style={[s.heading, { fontSize: 30 }]}>{introduction.greeting}</Text><Text style={s.body}>{introduction.meaning}</Text></View>
        <Text style={s.body}>{introduction.description}</Text>
        <Text style={s.muted}>Vocabulary · Dialogues · Sentence building · Personal notebook</Text>
        <Button primary onPress={() => onChoose(language)}>Learn {languageNames[language]}</Button>
      </View>;
    })}</View>
    <Text style={s.muted}>You can change language any time. Your saved progress and words stay separate, and private backups include both languages. Draft content awaits owner review.</Text>
  </View>;
}
