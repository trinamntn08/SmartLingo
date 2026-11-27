import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { japaneseAlphabetLessons, japaneseAlphabetNotes, type JapaneseAlphabetLesson } from '@smartlingo/content';
import { useNavigation, useVisitState } from '../app/WebNavigation';
import { routeHref, topicRouteKey } from '../app/routes';
import { audio } from '../audio';
import { Button } from '../ui/controls';
import { Icon } from '../ui/Icon';
import { colors, designTokens as tokens, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { KanaExamples, KanaWordPractice } from './KanaWords';
import { alphabetLearningPath, alphabetProgress } from './progress';

type Character = JapaneseAlphabetLesson['characters'][number];
const japaneseText = Platform.OS === 'web' ? { lang: 'ja-JP' } : { accessibilityLanguage: 'ja-JP' };
const destinationFocusKey = 'kana.destination-focus';
type DestinationFocus = 'study' | 'recognition' | 'words' | JapaneseAlphabetLesson['script'];

export function JapaneseAlphabet({ model }: { model: LearningModel }) {
  const progress = alphabetProgress(model.events);
  const { route, navigate, backTo } = useNavigation();
  const letters = route.kind === 'letters' ? route : undefined;
  const selected = japaneseAlphabetLessons.find(item => item.id === letters?.rowId);
  const [choosingRow, setChoosingRow] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [destinationFocus, setDestinationFocus] = useVisitState<DestinationFocus | null>(destinationFocusKey, null);
  const headingId = useId();
  const recognitionId = useId();
  const wordsId = useId();
  const chooserId = useId();
  const lesson = selected ?? progress.next ?? japaneseAlphabetLessons[0];
  useEffect(() => {
    if (!letters || letters.rowId || model.loading || !lesson) return;
    const mode = progress.wordResumeId === lesson.id ? 'words' : 'study';
    navigate({ kind: 'letters', language: 'ja-JP', rowId: lesson.id, mode }, { replace: true });
  }, [letters, lesson, model.loading, navigate, progress.wordResumeId]);
  useEffect(() => {
    if (Platform.OS !== 'web' || !destinationFocus) return;
    // Move focus after the learner shell restores the destination's scroll.
    const frame = requestAnimationFrame(() => {
      const chooser = destinationFocus === 'hiragana' || destinationFocus === 'katakana';
      const focusId = destinationFocus === 'recognition' ? recognitionId : destinationFocus === 'words' ? wordsId : headingId;
      const target = document.getElementById(chooser ? `${chooserId}-${destinationFocus}` : focusId);
      if (target && !chooser) target.tabIndex = -1;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: chooser ? 'center' : 'nearest', inline: 'nearest' });
      setDestinationFocus(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [destinationFocus, chooserId, headingId, recognitionId, wordsId, setDestinationFocus]);
  if (!lesson) return <View style={s.card}><Text style={s.heading}>Japanese alphabet</Text><Text style={s.body}>Alphabet lessons are not available yet. You can still explore vocabulary and lessons.</Text></View>;
  const rows = japaneseAlphabetLessons.filter(item => item.script === lesson.script);
  const topicName = lesson.script === 'hiragana' ? 'Hiragana' : 'Katakana';
  const topic = { kind: 'topics', language: 'ja-JP', topic: topicRouteKey(topicName) } as const;
  const next = alphabetLearningPath[alphabetLearningPath.findIndex(item => item.id === lesson.id) + 1];
  function selectRow(id: string, afterSave = false, focus: DestinationFocus = 'study') {
    navigate({ kind: 'letters', language: 'ja-JP', rowId: id, mode: 'study' }, { afterSave, snapshot: { [destinationFocusKey]: focus } });
  }
  function saveRow() {
    if (model.blocked || !lesson || progress.completedIds.has(lesson.id)) return;
    const savedId = lesson.id;
    model.record({ id: crypto.randomUUID(), lessonId: savedId, revision: lesson.revision,
      itemId: `${savedId}.completion`, activity: 'completion', result: 'completed', hints: 0, occurredAt: new Date().toISOString() }, () => {
      if (next) selectRow(next.id, true);
    });
  }
  return <View testID="japanese-alphabet" style={layout.page}>
    <View style={s.row}>
      <Button compact quiet icon="arrow-left" href={routeHref(topic)} onPress={() => backTo(topic, previous => previous.kind === 'topics'
        && previous.language === topic.language && previous.topic?.toLowerCase() === lesson.script, true)}>Back to {topicName}</Button>
    </View>
    {letters?.rowId && !selected && <Text accessibilityLiveRegion="polite" style={s.muted}>That kana row is unavailable. The suggested row is shown below.</Text>}
    <AlphabetRow key={`${lesson.id}:${lesson.revision}`} headingId={headingId} recognitionId={recognitionId} wordsId={wordsId} lesson={lesson} model={model} progress={progress}
      completed={progress.completedIds.has(lesson.id)} onSave={saveRow} onNext={next ? () => selectRow(next.id) : undefined} />
    <View style={layout.footer}>
      <Text style={[s.muted, layout.count]}>{model.loading ? 'Loading saved alphabet progress…' : model.loadError ? 'Saved progress is unavailable. You can still study and practise.' : `${progress.completed} of ${progress.total} rows studied`}</Text>
      <View style={s.row}>
        <Button compact quiet icon="grid" expanded={choosingRow} onPress={() => setChoosingRow(value => !value)}>{choosingRow ? 'Close row chooser' : 'Choose another row'}</Button>
        <Button compact quiet expanded={showNotes} onPress={() => setShowNotes(value => !value)}>{showNotes ? 'Hide kana guide' : 'About Japanese letters'}</Button>
      </View>
      {choosingRow && <View style={layout.chooser}>
        <View style={s.row}>{(['hiragana', 'katakana'] as const).map(script => <Button key={script} nativeID={`${chooserId}-${script}`} compact selected={lesson.script === script} onPress={() => {
          const first = japaneseAlphabetLessons.find(item => item.script === script);
          if (first && lesson.script !== script) selectRow(first.id, false, script);
        }}>{script === 'hiragana' ? 'Hiragana' : 'Katakana'}</Button>)}</View>
        <KanaRowPath rows={rows} current={lesson} completedIds={progress.completedIds} suggested={progress.next} loading={model.loading || !!model.loadError} onSelect={selectRow} />
      </View>}
      {showNotes && <View style={s.card}>
        <Text accessibilityRole="header" style={s.heading}>Getting to know kana</Text>
        {japaneseAlphabetNotes.map(note => <View key={note.title} style={layout.stack}><Text style={[s.body, layout.noteTitle]}>{note.title}</Text><Text style={s.body}>{note.body}</Text></View>)}
      </View>}
    </View>
  </View>;
}

function KanaRowPath({ rows, current, completedIds, suggested, loading, onSelect }: {
  rows: readonly JapaneseAlphabetLesson[]; current: JapaneseAlphabetLesson; completedIds: ReadonlySet<string>;
  suggested: JapaneseAlphabetLesson | undefined; loading: boolean; onSelect: (id: string) => void;
}) {
  const index = rows.findIndex(row => row.id === current.id);
  const studied = rows.filter(row => completedIds.has(row.id)).length;
  const scriptName = current.script === 'hiragana' ? 'Hiragana' : 'Katakana';
  function select(id: string) { audio.stop(); onSelect(id); }
  return <View style={layout.chooser}>
    <Text style={s.muted}>{scriptName} · Row {index + 1} of {rows.length} · {loading ? 'Saved status unavailable' : `${studied} of ${rows.length} rows studied`}</Text>
    <View style={layout.rowList} accessibilityLabel={`${scriptName} lesson rows`}>
      {rows.map(row => <KanaRowOption key={row.id} row={row} selected={row.id === current.id}
        studied={!loading && completedIds.has(row.id)} statusUnavailable={loading} suggested={row.id === suggested?.id} onPress={() => select(row.id)} />)}
    </View>
    <View style={[s.row, layout.rowActions]}>
      <Button compact quiet disabled={index <= 0} onPress={() => { const row = rows[index - 1]; if (row) select(row.id); }}>Previous group</Button>
      <Button compact quiet disabled={index >= rows.length - 1} onPress={() => { const row = rows[index + 1]; if (row) select(row.id); }}>Next group</Button>
    </View>
    {!loading && <View style={{ gap: 8 }}>
      <Text style={s.muted}>{suggested ? suggested.id === current.id ? 'Study the sounds or words, then try the practice.' : `Suggested next: ${suggested.title}` : 'Every alphabet row has been studied. Revisit any row to practise.'}</Text>
      {suggested && suggested.id !== current.id && <Button onPress={() => select(suggested.id)}>Continue suggested row</Button>}
    </View>}
  </View>;
}

function KanaRowOption({ row, selected, studied, statusUnavailable, suggested, onPress }: {
  row: JapaneseAlphabetLesson; selected: boolean; studied: boolean; statusUnavailable: boolean; suggested: boolean; onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const positionStatus = selected ? 'Current row' : suggested ? 'Suggested next' : 'Explore row';
  const studyStatus = statusUnavailable ? 'Status unavailable' : studied ? 'Studied' : 'Not studied';
  return <Pressable testID={`kana-row-${row.id}`} accessibilityRole="button" accessibilityLabel={`Study ${row.title}, ${positionStatus}, ${studyStatus}`}
    aria-selected={selected} accessibilityState={{ selected }} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [layout.rowOption, (pressed || selected) && layout.rowTint, selected && layout.activeRow, focused && layout.focus]}>
    <View style={layout.rowCopy}>
      <Text style={[s.body, layout.noteTitle]}>{row.title}</Text>
      <Text style={s.muted}>{positionStatus} · {studyStatus}</Text>
    </View>
    <Text {...japaneseText} style={layout.rowCharacters}>{row.characters.map(character => character.kana).join('')}</Text>
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
    audio.stop();
    const current = ++request.current;
    setPlaying(character.id); setError('');
    try { await audio.speak(character.audioText, 'ja-JP'); }
    catch { if (current === request.current) setError('Audio could not play. Retry when a Japanese voice is available, or continue with the visible reading.'); }
    finally { if (current === request.current) setPlaying(''); }
  }
  return { playing, error, stop, play };
}

function AlphabetRow({ headingId, recognitionId, wordsId, lesson, model, progress, completed, onSave, onNext }: {
  headingId: string; recognitionId: string; wordsId: string; lesson: JapaneseAlphabetLesson; model: LearningModel;
  progress: ReturnType<typeof alphabetProgress>; completed: boolean; onSave: () => void; onNext?: () => void;
}) {
  const { route, navigate } = useNavigation();
  const addressed = route.kind === 'letters' && route.rowId === lesson.id ? route : undefined;
  const hasCharacters = lesson.characters.length > 0;
  const hasWords = !!lesson.practice?.length;
  const practice = addressed?.mode === 'recognition' && hasCharacters;
  const wordsMode = addressed?.mode === 'words' && hasWords;
  const key = `kana:${lesson.id}:${lesson.revision}`;
  const [round] = useVisitState(`${key}:round`, 0);
  const [tried, setTried] = useVisitState<readonly string[]>(`${key}:tried`, []);
  const playback = useKanaAudio();
  const allTried = lesson.characters.every(character => tried.includes(character.id));
  const savedTaskIds = [...(progress.taskIds.get(lesson.id) ?? [])];
  const requiresWords = lesson.kind !== 'basic';
  const canMarkStudied = requiresWords ? hasWords && savedTaskIds.length === lesson.practice?.length : allTried;
  const rows = japaneseAlphabetLessons.filter(row => row.script === lesson.script);
  const rowNumber = rows.findIndex(row => row.id === lesson.id) + 1;
  const step = wordsMode ? hasCharacters ? 3 : 2 : practice ? 2 : 1;
  const stepTotal = 1 + Number(hasCharacters) + Number(hasWords);
  const earlierRows = (lesson.prerequisites ?? []).filter(id => !progress.completedIds.has(id));
  function openCharacter(character: Character | undefined, repeat = false) {
    if (!character) return;
    navigate({ kind: 'letters', language: 'ja-JP', rowId: lesson.id, mode: 'recognition', characterId: character.id },
      { repeat, snapshot: { [`${key}:round`]: repeat ? round + 1 : round, [`${key}:tried`]: tried, [destinationFocusKey]: 'recognition' } });
  }
  function openStep(mode: 'study' | 'words') {
    playback.stop();
    navigate({ kind: 'letters', language: 'ja-JP', rowId: lesson.id, mode },
      { snapshot: { [`${key}:tried`]: tried, [destinationFocusKey]: mode } });
  }
  const compact = useWindowDimensions().width < tokens.layout.compactBreakpoint;
  const notes = lesson.characters.filter(character => !!character.note);
  return <View style={layout.lesson}>
    <View style={layout.heading}>
      <Text style={[s.muted, layout.count]}>{lesson.script === 'hiragana' ? 'Hiragana' : 'Katakana'} · Row {rowNumber} of {rows.length} · Step {step} of {stepTotal}{completed ? ' · Row studied' : ''}</Text>
      <Text nativeID={headingId} accessibilityRole="header" aria-level={1} style={[s.title, compact && s.compactTitle]}>{lesson.title}</Text>
      <Text style={s.muted}>{lesson.summary}</Text>
    </View>
    {wordsMode ? <>
      <KanaWordPractice lesson={lesson} model={model} completedIds={savedTaskIds} headingId={wordsId} />
      <View style={s.row}><Button compact quiet icon="arrow-left" onPress={() => openStep('study')}>Back to study</Button></View>
    </> : practice ? <>
      <RecognitionRound headingId={recognitionId} lesson={lesson} round={round} characterId={addressed?.characterId} stateKey={key} playback={playback}
        onAttempt={id => setTried(current => current.includes(id) ? current : [...current, id])}
        onNext={openCharacter} onRepeat={() => openCharacter(lesson.characters[0], true)} requiresWords={requiresWords} />
      <View style={s.row}>
        <Button compact quiet icon="arrow-left" onPress={() => openStep('study')}>Study characters</Button>
        {hasWords && <Button accent={requiresWords && allTried} trailingIcon="arrow-right" onPress={() => openStep('words')}>Word recall</Button>}
      </View>
    </> : <>
      {hasCharacters && <View style={[layout.characters, compact && layout.compactCharacters]} accessibilityLabel="Characters and sounds in this row">
        {lesson.characters.map(character => <KanaCharacterCell key={character.id} character={character} compact={compact}
          playing={playback.playing === character.id} onPlay={() => void playback.play(character)} />)}
      </View>}
      <View style={s.row}>
        {hasCharacters && <Button accent={!completed} trailingIcon="arrow-right" onPress={() => openCharacter(lesson.characters[0])}>Recognition practice</Button>}
        {hasWords && <Button quiet={hasCharacters} trailingIcon="arrow-right" onPress={() => openStep('words')}>Word recall</Button>}
      </View>
      {!!notes.length && <View style={layout.notes}>
        {notes.map(character => <Text key={character.id} style={s.muted}><Text {...japaneseText} style={layout.noteTitle}>{character.kana}</Text> · {character.note}</Text>)}
      </View>}
      {!!earlierRows.length && <Text style={s.muted}>Earlier rows · {earlierRows.map(id => japaneseAlphabetLessons.find(item => item.id === id)?.title).filter(Boolean).join(', ')}</Text>}
      {!!lesson.examples?.length && <KanaExamples lesson={lesson} />}
    </>}
    {!!playback.error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{playback.error}</Text>}
    {practice && <Text style={s.muted}>{allTried ? requiresWords ? 'You have tried every character in this row. Continue to word recall.' : 'You have tried every character in this row. Save your practice, or repeat whenever you like.' : `${tried.length}/${lesson.characters.length} characters tried.`}</Text>}
    {model.blocked && <Text style={s.muted}>{model.busy ? 'Saving progress…' : model.saveError ? 'Progress was not saved. Use Retry save above; you can continue practising here.' : model.loading ? 'You can study while saved progress loads.' : 'Browser storage is unavailable. Study and practice still work, but row progress cannot be saved.'}</Text>}
    <View style={s.row}>
      {(practice && !requiresWords || wordsMode && (requiresWords || allTried)) && !completed && <Button primary={canMarkStudied} disabled={!canMarkStudied || model.blocked} onPress={onSave}>Mark row studied</Button>}
      {onNext && completed && <Button primary onPress={() => { playback.stop(); onNext(); }}>Next row</Button>}
    </View>
    {completed && !onNext && <Text style={s.body}>You have reached the last row. Choose another row whenever you want to practise again.</Text>}
  </View>;
}

function KanaCharacterCell({ character, playing, onPlay, compact }: { character: Character; playing: boolean; onPlay: () => void; compact: boolean }) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={playing ? `Stop audio for ${character.kana}` : `Listen to ${character.kana}`}
    onPress={onPlay} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [layout.cell, compact && layout.compactCell, (pressed || playing) && layout.playingCell, focused && layout.focus]}>
    <Text {...japaneseText} style={[layout.kana, compact && layout.compactKana]}>{character.kana}</Text>
    <Text style={layout.reading}>{character.romaji}</Text>
    <View style={layout.audio}><Icon name={playing ? 'stop' : 'speaker'} color={colors.audioIcon} size={tokens.control.audioIconSize} /></View>
  </Pressable>;
}

function RecognitionRound({ headingId, lesson, round, characterId, stateKey, playback, onAttempt, onNext, onRepeat, requiresWords }: {
  headingId: string; lesson: JapaneseAlphabetLesson; round: number; characterId?: string; stateKey: string; playback: ReturnType<typeof useKanaAudio>;
  onAttempt: (id: string) => void; onNext: (character: Character | undefined) => void; onRepeat: () => void; requiresWords: boolean;
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
  return <View testID="kana-recognition" style={[s.card, layout.recognition]}>
    {characterId && located < 0 && <Text accessibilityLiveRegion="polite" style={s.muted}>That character is unavailable. The first character in this row is shown below.</Text>}
    <Text style={s.eyebrow}>Recognition · {index + 1} of {lesson.characters.length}</Text>
    <Text nativeID={headingId} accessibilityRole="header" aria-level={2} accessibilityLiveRegion="polite" style={s.heading}>
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
      {last ? <Text style={s.body}>{requiresWords ? 'Continue with word recall to save this row.' : 'You can save the row after trying every character.'}</Text> : <Button primary onPress={() => onNext(lesson.characters[index + 1])}>Next character</Button>}
    </View>}
    <View style={s.row}><Button compact quiet onPress={onRepeat}>Repeat this row</Button></View>
  </View>;
}

const layout = StyleSheet.create({
  page: { width: '100%', maxWidth: 880, alignSelf: 'center', gap: 24, minWidth: 0 },
  lesson: { minWidth: 0, gap: 16 },
  heading: { gap: 4, borderLeftWidth: 3, borderColor: colors.yellow, paddingLeft: 12 },
  count: { fontVariant: ['tabular-nums'] },
  stack: { gap: 4 },
  noteTitle: { fontWeight: '600' },
  notes: { gap: 4, borderLeftWidth: 1, borderColor: colors.line, paddingLeft: 12 },
  characters: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  compactCharacters: { gap: 4 },
  cell: { flexBasis: '18%', flexGrow: 1, flexShrink: 1, minWidth: tokens.control.minimumTarget + 4, maxWidth: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 12,
    gap: 4, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  compactCell: { paddingVertical: 8, borderRadius: 8 },
  playingCell: { backgroundColor: colors.sageTint },
  kana: { ...tokens.typography.target, color: colors.ink, fontSize: 52, lineHeight: 64, fontWeight: '400', textAlign: 'center' },
  compactKana: { fontSize: 32, lineHeight: 40 },
  reading: { ...tokens.typography.caption, color: colors.muted, textAlign: 'center' },
  audio: { alignSelf: 'center', justifyContent: 'center', minHeight: tokens.control.minimumTarget },
  footer: { gap: 8, paddingTop: 12, borderTopWidth: 1, borderColor: colors.line },
  chooser: { minWidth: 0, gap: 12 },
  rowList: { borderTopWidth: 1, borderColor: colors.line },
  rowOption: { minHeight: 48, paddingHorizontal: 12, paddingVertical: 8, gap: 8, flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: colors.line, borderLeftWidth: 3, borderLeftColor: 'transparent' },
  rowCopy: { flex: 1, minWidth: 0 },
  rowCharacters: { ...tokens.typography.label, color: colors.ink, textAlign: 'right' },
  rowTint: { backgroundColor: colors.card },
  activeRow: { borderLeftColor: colors.yellow },
  focus: { outlineColor: colors.focusRing, outlineWidth: tokens.focus.outlineWidth, outlineStyle: 'solid', outlineOffset: 1, zIndex: 1 },
  rowActions: { justifyContent: 'space-between' },
  recognition: { minWidth: 0, gap: 16 },
});
