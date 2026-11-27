import { StyleSheet, View } from 'react-native';
import type { Lesson } from '@smartlingo/domain';
import { BilingualDialogue } from './BilingualDialogue';
import { VocabularyCard } from './VocabularyCard';
import { colors, designTokens as tokens } from './theme';
import type { LearningModel } from './useLearning';

export function LessonWords({ lesson, model }: { lesson: Lesson; model: LearningModel }) {
  const language = lesson.language === 'ja-JP' ? 'ja-JP' : 'fr-FR';
  return <View style={layout.wordList}>
    {lesson.vocabulary.map((entry, index) => <View key={entry.id} style={index > 0 && layout.rule}>
      <VocabularyCard entry={entry} model={model} language={language} study />
    </View>)}
  </View>;
}

export function LessonConversation({ lesson }: { lesson: Lesson }) {
  const language = lesson.language === 'ja-JP' ? 'ja-JP' : 'fr-FR';
  return <BilingualDialogue turns={lesson.dialogue} language={language} highlightedRole={lesson.role} study />;
}

const layout = StyleSheet.create({
  wordList: { minWidth: 0, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: tokens.radius.lg },
  rule: { borderTopWidth: 1, borderTopColor: colors.line },
});
