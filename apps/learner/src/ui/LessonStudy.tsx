import { StyleSheet, View } from 'react-native';
import type { Lesson } from '@smartlingo/domain';
import { BilingualDialogue } from './BilingualDialogue';
import { getLessonDialoguePhoto } from './dialoguePhotos';
import { GrammarNote } from './GrammarNote';
import { VocabularyCard } from './VocabularyCard';
import type { LearningModel } from './useLearning';

export function LessonWords({ lesson, model, compact }: { lesson: Lesson; model: LearningModel; compact: boolean }) {
  const language = lesson.language === 'ja-JP' ? 'ja-JP' : 'fr-FR';
  return <View style={layout.wordGrid}>
    {lesson.vocabulary.map(entry => <View key={entry.id} style={[layout.word, compact && layout.fullWidth]}>
      <VocabularyCard entry={entry} model={model} language={language} study />
    </View>)}
  </View>;
}

export function LessonConversation({ lesson }: { lesson: Lesson }) {
  const language = lesson.language === 'ja-JP' ? 'ja-JP' : 'fr-FR';
  return <View style={layout.conversation}>
    <BilingualDialogue turns={lesson.dialogue} language={language} photo={getLessonDialoguePhoto(lesson.id)} highlightedRole={lesson.role} study />
    <GrammarNote lessonId={lesson.id} note={lesson.grammar} />
  </View>;
}

const layout = StyleSheet.create({
  wordGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, minWidth: 0 },
  word: { flexGrow: 1, flexShrink: 1, flexBasis: '42%', minWidth: 0 },
  fullWidth: { flexBasis: '100%' },
  conversation: { minWidth: 0, gap: 16 },
});
