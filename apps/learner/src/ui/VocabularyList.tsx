import { useState, type ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { Vocabulary, TargetLanguage } from '@smartlingo/domain';
import { Button } from './controls';
import { Speak } from '../audio/Speak';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { WordIllustration } from './WordIllustration';
import { JapaneseWordReading } from './JapaneseWordReading';
import { genderLabels, vocabularyPresentation } from '../content/vocabularyPresentation';

type ListProps = {
  entries: readonly Vocabulary[];
  model: LearningModel;
  language: TargetLanguage;
  romanization?: boolean;
  courseClip?: boolean;
  children?: ReactNode;
};

export function VocabularyList({ entries, children, ...props }: ListProps) {
  if (!entries.length) return null;
  return <View style={layout.list}>
    <View>{entries.map(entry => <VocabularyRow key={entry.id} entry={entry} {...props} />)}</View>
    {children}
    <View>
      <Text accessibilityRole="header" style={s.heading}>In context</Text>
      {entries.map(entry => <VocabularyExample key={entry.id} entry={entry} language={props.language} />)}
    </View>
  </View>;
}

function VocabularyRow({ entry, model, language, romanization = true, courseClip = false }:
  Omit<ListProps, 'entries' | 'children'> & { entry: Vocabulary }) {
  const [message, setMessage] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const saved = model.notebook.some(note => note.sourceEntryId === entry.id || note.id === `notebook.${entry.id}`);
  const presentation = vocabularyPresentation(entry);
  const gender = presentation.gender ? genderLabels[presentation.gender] : undefined;
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };

  function saveWord() {
    setMessage('');
    model.captureEntry({ id: `notebook.${entry.id}`, sourceEntryId: entry.id, language, reading: entry.reading, exampleReading: entry.exampleReading, target: entry.target,
      meaning: entry.meaning, example: entry.example, updatedAt: new Date().toISOString() },
    () => setMessage(`Saved ${entry.target} to your notebook.`));
  }

  return <View testID={`vocabulary-${entry.id}`} style={layout.row}>
    <View style={layout.head}>
      <View style={layout.definition}>
        <Text {...languageProps} accessibilityRole="header" style={[s.target, layout.term]}>{entry.target}</Text>
        {language === 'ja-JP'
          ? <JapaneseWordReading target={entry.target} reading={entry.reading} romanization={romanization} />
          : !!entry.reading && <Text style={s.muted}>{entry.reading}</Text>}
      </View>
      <View style={layout.actions}>
        <Speak language={language} courseClip={courseClip} text={entry.target} onError={setVoiceError} />
        <Button compact quiet iconOnly icon={saved ? 'check' : 'bookmark'} toggle selected={saved}
          label={`Save ${entry.target}`} disabled={model.blocked || saved} onPress={saveWord} />
      </View>
    </View>
    <View style={[s.row, layout.meaning]}>
      {gender && <Text accessibilityLabel={gender.accessible} style={s.muted}>{gender.short}</Text>}
      <Text style={[s.body, layout.translation]}>{entry.meaning}</Text>
    </View>
    {!!voiceError && <Text accessibilityRole="alert" style={[s.muted, layout.error]}>{voiceError}</Text>}
    {!!message && <Text accessibilityLiveRegion="polite" style={s.muted}>{message}</Text>}
  </View>;
}

function VocabularyExample({ entry, language }: { entry: Vocabulary; language: TargetLanguage }) {
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };
  const { note } = vocabularyPresentation(entry);
  return <View testID={`example-${entry.id}`} style={[layout.row, layout.support]}>
    <View style={layout.example}>
      <Text {...languageProps} style={[s.body, layout.exampleTarget]}>{entry.target}</Text>
      <Text {...languageProps} style={s.body}>{entry.example}</Text>
      {!!entry.exampleReading && entry.exampleReading !== entry.example && <Text {...languageProps} style={s.muted}>{entry.exampleReading}</Text>}
      <Text style={s.muted}>{entry.exampleMeaning}</Text>
      {!!note && <Text style={s.muted}>{note}</Text>}
    </View>
    <WordIllustration entry={entry} size={80} />
  </View>;
}

const layout = StyleSheet.create({
  list: { gap: 16, minWidth: 0 },
  row: { width: '100%', minWidth: 0, paddingVertical: 12, gap: 2, borderBottomWidth: 1, borderColor: colors.line },
  head: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  definition: { flexGrow: 1, flexShrink: 1, flexBasis: 150, minWidth: 0, gap: 2 },
  term: { fontSize: 26, lineHeight: 34 },
  meaning: { alignItems: 'baseline', gap: 6 },
  translation: { flexShrink: 1, minWidth: 0 },
  exampleTarget: { fontWeight: '600' },
  actions: { flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', maxWidth: '100%', gap: 2 },
  support: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  example: { minWidth: 0, flex: 1, gap: 2 },
  error: { color: colors.danger },
});
