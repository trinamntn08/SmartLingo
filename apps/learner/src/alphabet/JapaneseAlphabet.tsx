import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { japaneseAlphabetLessons, japaneseAlphabetNotes, type JapaneseAlphabetLesson } from '@smartlingo/content';
import { useNavigation, useVisitState } from '../app/WebNavigation';
import { audio, speakCourseAudio } from '../audio';
import { isAndroidApp } from '../platform/runtime';
import { Button } from '../ui/controls';
import { colors, designTokens, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { alphabetLearningPath, alphabetLessonTitle, alphabetProgress } from './progress';
import { KanaExamples, KanaWordPractice } from './KanaWords';

type Character = JapaneseAlphabetLesson['characters'][number];

export function JapaneseAlphabet({ model }: { model: LearningModel }) {
  const progress = alphabetProgress(model.events);
  const { route, navigate } = useNavigation();
  const letters = route.kind === 'letters' ? route : undefined;
  const selected = japaneseAlphabetLessons.find(item => item.id === letters?.rowId);
  const [chooserScript, setChooserScript] = useState<JapaneseAlphabetLesson['script'] | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const lesson = selected ?? progress.next ?? japaneseAlphabetLessons[0];
  useEffect(() => {
    if (!letters || letters.rowId || model.loading || !lesson) return;
    navigate({ kind: 'letters', language: 'ja-JP', rowId: lesson.id, mode: 'study' }, { replace: true });
  }, [letters, lesson, model.loading, navigate]);
  if (!lesson) return <Text style={s.body}>No kana lessons available.</Text>;
  const rows = japaneseAlphabetLessons.filter(item => item.script === chooserScript);
  const next = alphabetLearningPath[alphabetLearningPath.findIndex(item => item.id === lesson.id) + 1];
  function selectRow(id: string, afterSave = false) {
    setChooserScript(null);
    navigate({ kind: 'letters', language: 'ja-JP', rowId: id, mode: 'study' }, { afterSave });
  }
  function saveRow() {
    if (model.blocked || !lesson || progress.completedIds.has(lesson.id)) return;
    const savedId = lesson.id;
    model.record({ id: crypto.randomUUID(), lessonId: savedId, revision: lesson.revision,
      itemId: `${savedId}.completion`, activity: 'completion', result: 'completed', hints: 0, occurredAt: new Date().toISOString() }, () => {
      if (next) selectRow(next.id, true);
    });
  }
  return <View testID="japanese-alphabet" style={styles.page}>
    {letters?.rowId && !selected && <Text accessibilityLiveRegion="polite" style={s.muted}>Row unavailable. Showing {alphabetLessonTitle(lesson)}.</Text>}
    <AlphabetRow key={`${lesson.id}:${lesson.revision}`} lesson={lesson} model={model} progress={progress} completed={progress.completedIds.has(lesson.id)} onSave={saveRow} onNext={next ? () => selectRow(next.id) : undefined} />
    <View style={styles.footer}>
      <Text style={s.muted}>{model.loading ? 'Loading progress…' : model.loadError ? 'Saved progress unavailable.' : `${progress.completed} of ${progress.total} rows studied`}</Text>
      <View style={styles.tools}>
        <Button compact quiet icon="grid" expanded={!!chooserScript} onPress={() => setChooserScript(chooserScript ? null : lesson.script)}>{chooserScript ? 'Close row chooser' : 'Choose another row'}</Button>
        <Button compact quiet expanded={showNotes} onPress={() => setShowNotes(value => !value)}>Kana guide</Button>
      </View>
      {chooserScript && <View style={styles.stack}>
        <View style={s.row}>{(['hiragana', 'katakana'] as const).map(script => <Button key={script} selected={chooserScript === script} onPress={() => setChooserScript(script)}>{script === 'hiragana' ? 'Hiragana' : 'Katakana'}</Button>)}</View>
        {rows.map(row => <KanaRowLink key={row.id} row={row} selected={row.id === lesson.id}
          studied={progress.completedIds.has(row.id)} statusUnavailable={model.loading || !!model.loadError}
          suggested={progress.next?.id === row.id} onPress={() => selectRow(row.id)} />)}
      </View>}
      {showNotes && japaneseAlphabetNotes.map(note => <View key={note.title} style={styles.stack}>
        <Text style={s.heading}>{note.title}</Text><Text style={s.body}>{note.body}</Text>
      </View>)}
    </View>
  </View>;
}

function KanaRowLink({ row, selected, studied, statusUnavailable, suggested, onPress }: {
  row: JapaneseAlphabetLesson; selected: boolean; studied: boolean; statusUnavailable: boolean; suggested: boolean; onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const position = selected ? 'Current row' : suggested ? 'Suggested next' : 'Explore row';
  const status = statusUnavailable ? 'Status unavailable' : studied ? 'Studied' : 'Not studied';
  return <Pressable testID={`kana-row-${row.id}`} accessibilityRole="button" accessibilityLabel={`Study ${row.title}, ${position}, ${status}`}
    aria-selected={selected} accessibilityState={{ selected }} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [styles.rowLink, (pressed || selected) && { backgroundColor: colors.sageTint }, focused && styles.focus]}>
    <Text style={[s.body, { fontWeight: '600' }]}>{alphabetLessonTitle(row)}</Text>
    {(selected || suggested || studied) && <Text style={s.muted}>{[selected || suggested ? position : '', studied ? status : ''].filter(Boolean).join(' · ')}</Text>}
  </Pressable>;
}

function useKanaAudio() {
  const { visit } = useNavigation();
  const request = useRef(0);
  const [playing, setPlaying] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    setPlaying(''); setError('');
    return () => { request.current++; audio.stop(); };
  }, [visit]);
  function stop() { request.current++; audio.stop(); setPlaying(''); setError(''); }
  async function play(character: Character) {
    if (playing === character.id) { stop(); return; }
    const current = ++request.current;
    setPlaying(character.id); setError('');
    try { await speakCourseAudio(character.audioText, 'ja-JP'); }
    catch (failure) {
      if (current === request.current) setError(isAndroidApp() && failure instanceof Error ? failure.message : 'Audio unavailable. Try again.');
    }
    finally { if (current === request.current) setPlaying(''); }
  }
  return { playing, error, stop, play };
}

function AlphabetRow({ lesson, model, progress, completed, onSave, onNext }: {
  lesson: JapaneseAlphabetLesson; model: LearningModel; progress: ReturnType<typeof alphabetProgress>; completed: boolean; onSave: () => void; onNext?: () => void;
}) {
  const { route, navigate } = useNavigation();
  const addressed = route.kind === 'letters' && route.rowId === lesson.id ? route : undefined;
  const practice = addressed?.mode === 'recognition' && !!lesson.characters.length;
  const wordsMode = addressed?.mode === 'words';
  const savedTaskIds = [...(progress.taskIds.get(lesson.id) ?? [])];
  const requiresWords = lesson.kind !== 'basic';
  const missingPrerequisites = (lesson.prerequisites ?? []).filter(id => !progress.completedIds.has(id));
  const wordsDone = !!lesson.practice?.length && lesson.practice.every(task => savedTaskIds.includes(task.id));
  const key = `kana:${lesson.id}:${lesson.revision}`;
  const [round] = useVisitState(`${key}:round`, 0);
  const [tried, setTried] = useVisitState<readonly string[]>(`${key}:tried`, []);
  const playback = useKanaAudio();
  const allTried = lesson.characters.every(character => tried.includes(character.id));
  const rows = japaneseAlphabetLessons.filter(row => row.script === lesson.script);
  const rowNumber = rows.findIndex(row => row.id === lesson.id) + 1;
  function openCharacter(character: Character | undefined, repeat = false) {
    if (!character) return;
    navigate({ kind: 'letters', language: 'ja-JP', rowId: lesson.id, mode: 'recognition', characterId: character.id },
      { repeat, snapshot: { [`${key}:round`]: repeat ? round + 1 : round, [`${key}:tried`]: tried } });
  }
  function openWords() { playback.stop(); navigate({ kind: 'letters', language: 'ja-JP', rowId: lesson.id, mode: 'words' }, { snapshot: { [`${key}:tried`]: tried } }); }
  const compact = useWindowDimensions().width < 600;
  const [showTip, setShowTip] = useState(false);
  const hasCharacters = lesson.characters.length > 0;
  const script = lesson.script === 'hiragana' ? 'Hiragana' : 'Katakana';
  const title = alphabetLessonTitle(lesson);
  function study() {
    navigate({ kind: 'letters', language: 'ja-JP', rowId: lesson.id, mode: 'study' }, { snapshot: { [`${key}:tried`]: tried } });
  }
  return <View style={styles.lesson}>
    <View style={styles.stack}>
      <Text style={styles.meta}>{script} · Row {rowNumber} of {rows.length}{completed ? ' · Studied' : ''}</Text>
      <Text accessibilityRole="header" style={[s.title, compact && s.compactTitle]}>{title}</Text>
    </View>
    {wordsMode ? <KanaWordPractice lesson={lesson} model={model} completedIds={savedTaskIds} /> : practice ?
      <RecognitionRound lesson={lesson} round={round} characterId={addressed?.characterId} stateKey={key} playback={playback}
        onAttempt={id => setTried(current => current.includes(id) ? current : [...current, id])}
        onNext={openCharacter} onRepeat={() => openCharacter(lesson.characters[0], true)} /> :
      <>
        {hasCharacters && <View testID="kana-grid" accessibilityLabel="Characters and sounds" style={[styles.grid, { columnGap: compact ? '2.5%' : '1.25%' }]}>
          {lesson.characters.map(character => <KanaCell key={character.id} character={character} compact={compact}
            playing={playback.playing === character.id} onPlay={() => void playback.play(character)} />)}
        </View>}
        {!hasCharacters && <KanaExamples lesson={lesson} />}
        <View style={styles.studyActions}>
          <Button primary icon="play" onPress={() => hasCharacters ? openCharacter(lesson.characters[0]) : openWords()}>Practice</Button>
          {hasCharacters && <Button compact quiet expanded={showTip} trailingIcon="chevron-down" onPress={() => setShowTip(value => !value)}>Pronunciation tip</Button>}
        </View>
        {showTip && <View style={styles.tip}>
          <Text style={s.body}>{title === 'Vowels' ? 'Keep each vowel short and steady, without adding an English glide.' : lesson.summary}</Text>
          {lesson.characters.filter(character => character.note).map(character => <Text key={character.id} style={s.body}>{character.kana} · {character.note}</Text>)}
          {!!missingPrerequisites.length && <Text style={s.muted}>Earlier rows · {missingPrerequisites.map(id => japaneseAlphabetLessons.find(item => item.id === id)).filter(item => !!item).map(alphabetLessonTitle).join(', ')}</Text>}
        </View>}
        {hasCharacters && !!lesson.examples?.length && <KanaExamples lesson={lesson} />}
      </>}
    {!!playback.error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{playback.error}</Text>}
    {model.blocked && !model.loading && <Text style={s.muted}>{model.busy ? 'Saving…' : model.saveError ? 'Progress not saved.' : 'Storage unavailable. Progress cannot be saved.'}</Text>}
    {(practice || wordsMode) && <View style={styles.tools}>
      {!completed && <Button primary={requiresWords ? wordsDone : allTried} disabled={(requiresWords ? !wordsDone : !allTried) || model.blocked} onPress={onSave}>Mark row studied</Button>}
      {practice && !!lesson.practice?.length && <Button quiet={!requiresWords || !allTried} primary={requiresWords && allTried && !wordsDone} onPress={openWords}>Word recall</Button>}
      <Button quiet onPress={study}>Back to study</Button>
    </View>}
    {onNext && completed && <Button quiet icon="book" onPress={() => { playback.stop(); onNext(); }}>Next row</Button>}
  </View>;
}

function KanaCell({ character, playing, onPlay, compact }: { character: Character; playing: boolean; onPlay: () => void; compact: boolean }) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button"
    accessibilityLabel={playing ? `Stop audio for ${character.kana}` : `Listen to ${character.kana}`}
    onPress={onPlay} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [styles.cell, { flexBasis: compact ? '31.66%' : '19%' },
      (playing || pressed) && styles.playingCell, focused && styles.focus]}>
    <Text {...{ lang: 'ja', accessibilityLanguage: 'ja-JP' }} style={[styles.kana, character.kana.length > 1 && styles.kanaPair]}>{character.kana}</Text>
    <Text style={styles.reading}>{character.romaji}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  page: { width: '100%', maxWidth: 880, alignSelf: 'center', gap: 24, minWidth: 0 },
  lesson: { gap: 16, minWidth: 0 },
  stack: { gap: 4, minWidth: 0 },
  meta: { ...designTokens.typography.smallLabel, color: colors.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8, alignItems: 'stretch' },
  cell: { minWidth: 0, maxWidth: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 8,
    borderRadius: 10, backgroundColor: colors.sageTint },
  kana: { color: colors.ink, fontFamily: '"Yu Mincho", "Hiragino Mincho ProN", "Noto Serif CJK JP", serif',
    fontSize: 46, lineHeight: 60, maxWidth: '100%', textAlign: 'center' },
  kanaPair: { fontSize: 34, lineHeight: 54 },
  playingCell: { backgroundColor: colors.green },
  reading: { ...designTokens.typography.label, color: colors.primary, textAlign: 'center', maxWidth: '100%', paddingHorizontal: 3 },
  studyActions: { gap: 4, alignItems: 'stretch' },
  tip: { gap: 8, borderLeftWidth: 2, borderColor: colors.primary, paddingLeft: 12 },
  tools: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  footer: { gap: 8, paddingVertical: 16, borderTopWidth: 1, borderColor: colors.line },
  rowLink: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 48, justifyContent: 'center', borderBottomWidth: 1, borderColor: colors.line },
  focus: { outlineWidth: 3, outlineOffset: 2, outlineColor: colors.focusRing, outlineStyle: 'solid' },
});

function RecognitionRound({ lesson, round, characterId, stateKey, playback, onAttempt, onNext, onRepeat }: {
  lesson: JapaneseAlphabetLesson; round: number; characterId?: string; stateKey: string; playback: ReturnType<typeof useKanaAudio>;
  onAttempt: (id: string) => void; onNext: (character: Character | undefined) => void; onRepeat: () => void;
}) {
  const located = lesson.characters.findIndex(character => character.id === characterId);
  const index = Math.max(0, located);
  const character = lesson.characters[index];
  const [answer, setAnswer] = useVisitState(`${stateKey}:${character?.id}:answer`, '');
  const [showReading, setShowReading] = useVisitState(`${stateKey}:${character?.id}:reading`, false);
  const choices = useMemo(() => {
    if (!character) return [];
    const pool = [...lesson.characters];
    if (pool.length < 3) {
      for (const row of japaneseAlphabetLessons.filter(item => item.script === lesson.script && item.id !== lesson.id)) {
        for (const extra of row.characters) { if (pool.length < 3) pool.push(extra); }
      }
    }
    // Change the answer position across characters and repeated rounds without shuffling on rerenders.
    const offset = (index * 2 + round + 1) % pool.length;
    return [...pool.slice(offset), ...pool.slice(0, offset)];
  }, [character, lesson, index, round]);
  if (!character) return <Text style={s.body}>No characters are available in this row.</Text>;
  const last = index === lesson.characters.length - 1;
  const playing = playback.playing === character.id;
  const readingVisible = showReading || !!playback.error;
  return <View testID="kana-recognition" style={{ gap: 16 }}>
    {characterId && located < 0 && <Text accessibilityLiveRegion="polite" style={s.muted}>Character unavailable. Showing the first one.</Text>}
    <Text style={s.eyebrow}>Recognition · {index + 1} of {lesson.characters.length}</Text>
    <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={s.heading}>
      {readingVisible ? `Which character is “${character.romaji}”?` : 'Which kana matches the sound?'}
    </Text>
    <View style={s.row}>
      <Button compact icon={playing ? 'stop' : 'speaker'} onPress={() => void playback.play(character)}>{playing ? 'Stop sound' : 'Play sound'}</Button>
      {!readingVisible && !answer && <Button compact quiet onPress={() => setShowReading(true)}>Show reading</Button>}
    </View>
    <View style={s.row}>{choices.map(choice => <Button key={choice.id} label={`Choose ${choice.kana}`} selected={answer === choice.id} disabled={!!answer} onPress={() => { setAnswer(choice.id); onAttempt(character.id); }}>{<Text style={{ fontSize: 48, lineHeight: 64 }}>{choice.kana}</Text>}</Button>)}</View>
    {!!answer && <View accessibilityLiveRegion="polite" style={s.notice}>
      <Text style={s.body}>{answer === character.id ? 'Yes.' : 'Keep practising.'} {character.kana} is read “{character.romaji}”.</Text>
      {!!character.note && <Text style={s.body}>{character.note}</Text>}
      {!last && <Button primary onPress={() => onNext(lesson.characters[index + 1])}>Next character</Button>}
    </View>}
    <Button onPress={onRepeat}>Repeat this row</Button>
  </View>;
}
