import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Lesson } from '@smartlingo/domain';
import { BilingualDialogue } from './BilingualDialogue';
import { getLessonDialoguePhoto } from './dialoguePhotos';
import type { ContextPhoto } from './contextPhotos';
import { GrammarNote } from './GrammarNote';
import { Button } from './controls';
import { styles as s } from './theme';
import { VocabularyList } from './VocabularyList';
import type { LearningModel } from './useLearning';

export function LessonWords({ lesson, model, guided, children }: { lesson: Lesson; model: LearningModel; guided?: boolean; children: ReactNode }) {
  const language = lesson.language === 'ja-JP' ? 'ja-JP' : 'fr-FR';
  const [showRomanization, setShowRomanization] = useState(false);
  const optionalRomanization = language === 'ja-JP' && lesson.level === 'A1';
  const romanization = lesson.level === 'foundation' || (optionalRomanization && showRomanization);
  return <View style={{ gap: 12 }}>
    {optionalRomanization && <View style={s.row}><Button quiet compact expanded={showRomanization}
      onPress={() => setShowRomanization(value => !value)}>{showRomanization ? 'Hide rōmaji' : 'Show rōmaji'}</Button></View>}
    <VocabularyList entries={lesson.vocabulary} model={model} language={language} romanization={romanization} courseClip={guided}>
      {children}
    </VocabularyList>
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
  conversation: { minWidth: 0, gap: 16 },
});
