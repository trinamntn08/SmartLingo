import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { japaneseAlphabetLessons, japaneseAlphabetNotes, type JapaneseAlphabetLesson } from '@smartlingo/content';
import { audio } from '../audio';
import { AudioIconButton } from '../audio/AudioIconButton';
import { Badge, Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { alphabetProgress } from './progress';

type Character = JapaneseAlphabetLesson['characters'][number];

export function JapaneseAlphabet({ model }: { model: LearningModel }) {
  const progress = alphabetProgress(model.events);
  const [selectedId, setSelectedId] = useState('');
  const [choosingRow, setChoosingRow] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const compact = useWindowDimensions().width < 600;
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  const lesson = japaneseAlphabetLessons.find(item => item.id === selectedId) ?? progress.next ?? japaneseAlphabetLessons[0];
  useEffect(() => {
    if (!model.loading && !selectedId && lesson) setSelectedId(lesson.id);
  }, [model.loading, selectedId, lesson]);
  if (!lesson) return <View style={s.card}><Text style={s.heading}>Japanese alphabet</Text><Text style={s.body}>Alphabet lessons are not available yet. You can still explore vocabulary and lessons.</Text></View>;
  const rows = japaneseAlphabetLessons.filter(item => item.script === lesson.script);
  const next = japaneseAlphabetLessons[japaneseAlphabetLessons.findIndex(item => item.id === lesson.id) + 1];
  function saveRow() {
    if (model.blocked || !lesson || progress.completedIds.has(lesson.id)) return;
    const savedId = lesson.id;
    model.record({ id: crypto.randomUUID(), lessonId: savedId, revision: lesson.revision,
      itemId: `${savedId}.completion`, activity: 'completion', result: 'completed', hints: 0, occurredAt: new Date().toISOString() }, () => {
      if (selectedRef.current === savedId && next) setSelectedId(next.id);
    });
  }
  return <View testID="japanese-alphabet" style={{ gap: 24, minWidth: 0 }}>
    <View style={{ gap: 12 }}>
      <View style={[s.row, { justifyContent: 'space-between' }]}>
        <View style={{ gap: 8, flexShrink: 1 }}><Text style={s.eyebrow}>Kana studio · Read, listen, recognise</Text><Text accessibilityRole="header" style={[s.title, compact && s.compactTitle]}>Japanese alphabet</Text>
          <Text style={s.muted}>{model.loading ? 'Loading saved alphabet progress…' : model.loadError ? 'Saved progress is unavailable. You can still study and practise.' : `${progress.completed} of ${progress.total} rows studied`}</Text></View>
        <Button expanded={choosingRow} onPress={() => setChoosingRow(value => !value)}>{choosingRow ? 'Close row chooser' : 'Choose another row'}</Button>
      </View>
      {choosingRow && <View style={[s.notice, { gap: 16 }]}>
      <View style={s.row}>{(['hiragana', 'katakana'] as const).map(script => <Button key={script} selected={lesson.script === script} onPress={() => {
        const first = japaneseAlphabetLessons.find(item => item.script === script);
        if (first) { audio.stop(); setSelectedId(first.id); }
      }}>{script === 'hiragana' ? '1 · Hiragana' : '2 · Katakana'}</Button>)}</View>
      <KanaRowPath rows={rows} current={lesson} completedIds={progress.completedIds} suggested={progress.next} loading={model.loading || !!model.loadError} onSelect={setSelectedId} />
      </View>}
    </View>
    <AlphabetRow key={lesson.id} lesson={lesson} model={model} completed={progress.completedIds.has(lesson.id)} onSave={saveRow} onNext={next ? () => setSelectedId(next.id) : undefined} />
    <View style={{ gap: 14 }}>
      <View style={s.row}><Button onPress={() => setShowNotes(value => !value)}>{showNotes ? 'Hide kana guide' : 'About Japanese letters'}</Button><Text style={s.muted}>Draft · Studied rows record practice, not mastery.</Text></View>
      {showNotes && <View style={s.card}>
      <Text accessibilityRole="header" style={s.heading}>Getting to know kana</Text>
      {japaneseAlphabetNotes.map(note => <View key={note.title} style={{ gap: 6 }}><Text style={[s.body, { fontWeight: '700' }]}>{note.title}</Text><Text style={s.body}>{note.body}</Text></View>)}
      </View>}
    </View>
  </View>;
}

function KanaRowPath({ rows, current, completedIds, suggested, loading, onSelect }: {
  rows: readonly JapaneseAlphabetLesson[]; current: JapaneseAlphabetLesson; completedIds: ReadonlySet<string>;
  suggested: JapaneseAlphabetLesson | undefined; loading: boolean; onSelect: (id: string) => void;
}) {
  const rail = useRef<ComponentRef<typeof ScrollView>>(null);
  const index = rows.findIndex(row => row.id === current.id);
  const studied = rows.filter(row => completedIds.has(row.id)).length;
  const scriptName = current.script === 'hiragana' ? 'Hiragana' : 'Katakana';
  useEffect(() => { rail.current?.scrollTo({ x: Math.max(0, index * 186), animated: false }); }, [index, current.script]);
  function select(id: string) { audio.stop(); onSelect(id); }
  return <View style={{ gap: 12, minWidth: 0 }}>
    <Text style={s.muted}>{scriptName} · Row {index + 1} of {rows.length} · {loading ? 'Saved status unavailable' : `${studied} of ${rows.length} rows studied`}</Text>
    <ScrollView ref={rail} horizontal showsHorizontalScrollIndicator style={{ maxWidth: '100%' }} contentContainerStyle={{ gap: 10, padding: 4, paddingBottom: 12 }} accessibilityLabel={`${scriptName} lesson rows`}>
      {rows.map((row, rowIndex) => <KanaRowCard key={row.id} row={row} number={rowIndex + 1} selected={row.id === current.id}
        studied={!loading && completedIds.has(row.id)} statusUnavailable={loading} suggested={row.id === suggested?.id} onPress={() => select(row.id)} />)}
    </ScrollView>
    <View style={[s.row, { justifyContent: 'space-between' }]}>
      <Button disabled={index <= 0} onPress={() => { const row = rows[index - 1]; if (row) select(row.id); }}>Previous group</Button>
      <Button disabled={index >= rows.length - 1} onPress={() => { const row = rows[index + 1]; if (row) select(row.id); }}>Next group</Button>
    </View>
    {!loading && <View style={{ gap: 8 }}>
      <Text style={s.muted}>{suggested ? suggested.id === current.id ? 'Next step: study these characters, then try recognising them.' : `Suggested next: ${suggested.title}` : 'Every alphabet row has been studied. Revisit any row to practise.'}</Text>
      {suggested && suggested.id !== current.id && <Button onPress={() => select(suggested.id)}>Continue suggested row</Button>}
    </View>}
  </View>;
}

function KanaRowCard({ row, number, selected, studied, statusUnavailable, suggested, onPress }: {
  row: JapaneseAlphabetLesson; number: number; selected: boolean; studied: boolean; statusUnavailable: boolean; suggested: boolean; onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const positionStatus = selected ? 'Current row' : suggested ? 'Suggested next' : 'Explore row';
  const studyStatus = statusUnavailable ? 'Status unavailable' : studied ? 'Studied' : 'Not studied';
  return <Pressable testID={`kana-row-${row.id}`} accessibilityRole="button" accessibilityLabel={`Study ${row.title}, ${positionStatus}, ${studyStatus}`}
    aria-selected={selected} accessibilityState={{ selected }} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => ({ width: 176, minHeight: 150, padding: 14, gap: 6, borderRadius: 14, borderWidth: 2,
      borderColor: selected ? colors.ink : colors.line, backgroundColor: selected ? colors.goldTint : colors.card,
      opacity: pressed ? 0.8 : 1, ...(focused ? { outlineColor: colors.ink, outlineWidth: 3, outlineStyle: 'solid', outlineOffset: 2 } : {}) })}>
    <Text style={[s.eyebrow, { letterSpacing: 0.5, color: colors.ink }]}>{number.toString().padStart(2, '0')} · {positionStatus}</Text>
    <Text style={[s.target, { fontSize: 28, lineHeight: 40 }]}>{row.characters.map(character => character.kana).join('')}</Text>
    <Text style={[s.body, { fontWeight: '700' }]}>{row.title}</Text>
    <Text style={s.muted}>{studyStatus}</Text>
  </Pressable>;
}

function useKanaAudio() {
  const request = useRef(0);
  const [playing, setPlaying] = useState('');
  const [error, setError] = useState('');
  useEffect(() => () => { request.current++; audio.stop(); }, []);
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

function AlphabetRow({ lesson, model, completed, onSave, onNext }: {
  lesson: JapaneseAlphabetLesson; model: LearningModel; completed: boolean; onSave: () => void; onNext?: () => void;
}) {
  const [practice, setPractice] = useState(false);
  const [round, setRound] = useState(0);
  const [tried, setTried] = useState<Set<string>>(() => new Set());
  const playback = useKanaAudio();
  const allTried = lesson.characters.every(character => tried.has(character.id));
  const rows = japaneseAlphabetLessons.filter(row => row.script === lesson.script);
  const rowNumber = rows.findIndex(row => row.id === lesson.id) + 1;
  function switchMode(value: boolean) { playback.stop(); setPractice(value); }
  const compact = useWindowDimensions().width < 600;
  return <View style={[s.card, { padding: compact ? 18 : 32, gap: 22, minWidth: 0, borderTopWidth: 4, borderTopColor: colors.yellow }]}>
    <View style={s.row}><Text style={s.eyebrow}>{lesson.script === 'hiragana' ? 'Hiragana' : 'Katakana'} · Row {rowNumber} of {rows.length} · Step {practice ? '2' : '1'} of 2</Text>{completed && <Badge>Row studied</Badge>}</View>
    <View style={{ gap: 12 }}><Text accessibilityRole="header" style={[s.title, { fontWeight: '500' }, compact && s.compactTitle]}>{lesson.title}</Text>
    <Text style={[s.body, { maxWidth: 760 }]}>{lesson.summary}</Text></View>
    <View style={s.row}><Button selected={!practice} onPress={() => switchMode(false)}>Study characters</Button><Button selected={practice} onPress={() => switchMode(true)}>Recognition practice</Button></View>
    {!practice ? <>
      <Text style={s.muted}>Read each character and its romaji (Latin-letter reading). Listen whenever you like.{compact ? ' Swipe across to explore this row.' : ''}</Text>
      {compact ? <ScrollView horizontal showsHorizontalScrollIndicator accessibilityLabel="Characters and sounds in this row" style={{ maxWidth: '100%' }} contentContainerStyle={{ gap: 14, padding: 4, paddingBottom: 16 }}>
        {lesson.characters.map(character => <KanaCharacterCard key={character.id} character={character} compact playing={playback.playing === character.id} onPlay={() => void playback.play(character)} />)}
      </ScrollView> : <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
        {lesson.characters.map(character => <KanaCharacterCard key={character.id} character={character} playing={playback.playing === character.id} onPlay={() => void playback.play(character)} />)}
      </View>}
      <Button primary={!completed} onPress={() => switchMode(true)}>Try recognising this row</Button>
    </> : <RecognitionRound key={round} lesson={lesson} round={round} playback={playback} onAttempt={id => setTried(current => new Set([...current, id]))} onRepeat={() => { playback.stop(); setRound(value => value + 1); }} />}
    {!!playback.error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{playback.error}</Text>}
    {practice && <Text style={s.muted}>{allTried ? 'You have tried every character in this row. Save your practice, or repeat whenever you like.' : `${tried.size}/${lesson.characters.length} characters tried. Try each one before saving this row.`}</Text>}
    {model.blocked && <Text style={s.muted}>{model.busy ? 'Saving progress…' : model.saveError ? 'Progress was not saved. Use Retry save above; you can continue practising here.' : model.loading ? 'You can study while saved progress loads.' : 'Browser storage is unavailable. Study and practice still work, but row progress cannot be saved.'}</Text>}
    <View style={s.row}>
      {practice && !completed && <Button primary={allTried} disabled={!allTried || model.blocked} onPress={onSave}>Mark row studied</Button>}
      {onNext && completed && <Button primary onPress={() => { playback.stop(); onNext(); }}>Next row</Button>}
    </View>
    {completed && !onNext && <Text style={s.body}>You have reached the last row. Choose another row whenever you want to practise again.</Text>}
  </View>;
}

function KanaCharacterCard({ character, playing, onPlay, compact = false }: { character: Character; playing: boolean; onPlay: () => void; compact?: boolean }) {
  return <View style={{ width: compact ? 210 : undefined, flexGrow: compact ? 0 : 1, flexBasis: compact ? undefined : 150,
    minWidth: 0, maxWidth: '100%', backgroundColor: colors.paper, borderRadius: 16, padding: 18, gap: 14, borderWidth: 1, borderColor: colors.line }}>
    <Text style={[s.target, { fontSize: 82, lineHeight: 108, textAlign: 'center', fontWeight: '400' }]}>{character.kana}</Text>
    <View style={[s.row, { justifyContent: 'center' }]}>
      <Text style={s.heading}>{character.romaji}</Text>
      <AudioIconButton playing={playing} label={`Listen to ${character.kana}`} stopLabel={`Stop audio for ${character.kana}`} onPress={onPlay} />
    </View>
    {!!character.note && <Text style={s.muted}>{character.note}</Text>}
  </View>;
}

function RecognitionRound({ lesson, round, playback, onAttempt, onRepeat }: {
  lesson: JapaneseAlphabetLesson; round: number; playback: ReturnType<typeof useKanaAudio>; onAttempt: (id: string) => void; onRepeat: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const character = lesson.characters[index];
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
  return <View testID="kana-recognition" style={{ gap: 16 }}>
    <Text style={s.eyebrow}>Recognition · {index + 1} of {lesson.characters.length}</Text>
    <Text accessibilityRole="header" style={s.heading}>Which character is “{character.romaji}”?</Text>
    <Text style={s.muted}>Choose a kana. Its reading and any notes appear after you answer.</Text>
    <View style={s.row}>{choices.map(choice => <Button key={choice.id} label={`Choose ${choice.kana}`} selected={answer === choice.id} disabled={!!answer} onPress={() => { setAnswer(choice.id); onAttempt(character.id); }}>{<Text style={{ fontSize: 48, lineHeight: 64 }}>{choice.kana}</Text>}</Button>)}</View>
    {!!answer && <View accessibilityLiveRegion="polite" style={s.notice}>
      <Text style={s.body}>{answer === character.id ? 'Yes.' : 'Keep practising.'} {character.kana} is read “{character.romaji}”.</Text>
      {!!character.note && <Text style={s.body}>{character.note}</Text>}
      <AudioIconButton playing={playback.playing === character.id} label={`Listen to ${character.kana}`}
        stopLabel={`Stop audio for ${character.kana}`} onPress={() => void playback.play(character)} />
      {last ? <Text style={s.body}>You have tried this row. Save it as studied below, or repeat.</Text> : <Button primary onPress={() => { playback.stop(); setAnswer(''); setIndex(value => value + 1); }}>Next character</Button>}
    </View>}
    <Button onPress={onRepeat}>Repeat this row</Button>
  </View>;
}
