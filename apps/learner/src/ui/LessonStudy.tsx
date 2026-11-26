import { StyleSheet, View } from 'react-native';
import type { Lesson } from '@smartlingo/domain';
import { BilingualDialogue } from './BilingualDialogue';
import { getLessonDialoguePhoto } from './dialoguePhotos';
import type { ContextPhoto } from './contextPhotos';
import { GrammarNote } from './GrammarNote';
import { VocabularyCard } from './VocabularyCard';
import type { LearningModel } from './useLearning';

export function LessonWords({ lesson, model, compact, phone }: { lesson: Lesson; model: LearningModel; compact: boolean; phone: boolean }) {
  const language = lesson.language === 'ja-JP' ? 'ja-JP' : 'fr-FR';
  return <View style={layout.wordGrid}>
    {lesson.vocabulary.map(entry => <View key={entry.id} style={[layout.word, compact && layout.fullWidth]}>
      <VocabularyCard entry={entry} model={model} language={language} study phoneStudy={phone} />
    </View>)}
  </View>;
}

export function LessonConversation({ lesson, photo = getLessonDialoguePhoto(lesson.id), phone = false }: {
  lesson: Lesson; photo?: ContextPhoto; phone?: boolean;
}) {
  const language = lesson.language === 'ja-JP' ? 'ja-JP' : 'fr-FR';
  return <View style={layout.conversation}>
    <BilingualDialogue turns={lesson.dialogue} language={language} photo={photo} highlightedRole={lesson.role} study phone={phone} />
    <GrammarNote lessonId={lesson.id} note={lesson.grammar} />
  </View>;
}

const layout = StyleSheet.create({
  wordGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, minWidth: 0 },
  word: { flexGrow: 1, flexShrink: 1, flexBasis: '42%', minWidth: 0 },
  fullWidth: { flexBasis: '100%' },
  conversation: { minWidth: 0, gap: 16 },
});
