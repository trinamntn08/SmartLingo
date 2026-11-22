import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Lesson, TargetLanguage } from '@smartlingo/domain';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { audio } from '../audio';
import { Button } from '../ui/controls';
import { colors, designTokens, styles as s } from '../ui/theme';
import { buildListeningQuestions, type ListeningQuestion } from './comprehension';
import { ScreenHeader } from '../ui/ScreenHeader';
import { Icon } from '../ui/Icon';
import { toolsStyles as t } from '../ui/learnerToolsStyles';

export function ListeningComprehension({ lessons, onBrowse }: { lessons: Lesson[]; onBrowse?: () => void }) {
  const compact = useWindowDimensions().width < 900;
  const questions = useMemo(() => buildListeningQuestions(lessons), [lessons]);
  const available = lessons.filter(lesson => questions.some(question => question.lessonId === lesson.id));
  const [lessonId, setLessonId] = useState('');
  const lesson = available.find(item => item.id === lessonId) ?? available[0];
  const selectId = useId();
  return <View testID="listening-comprehension" style={t.page}>
    <ScreenHeader title="Listening comprehension" subtitle="Listen, choose the English meaning, and check."
      action={onBrowse && <Button quiet compact icon="headphones" onPress={onBrowse}>Browse videos & audio</Button>} />
    {!lesson ? <View style={t.panel}><Text style={s.body}>No sentence questions are available yet. This activity needs three distinct sentence meanings in the same language. You can still study the lessons and their translations.</Text></View> : <View style={t.board}>
      <View style={[t.side, compact ? { gap: 8 } : t.panel]}>
      {!compact && <View style={s.row}><View style={[t.icon, { backgroundColor: colors.skyTint }]}><Icon name="headphones" size={24} /></View><Text accessibilityRole="header" style={t.sectionTitle}>Your listening session</Text></View>}
      {Platform.OS === 'web' ? <label htmlFor={selectId} style={{ color: colors.ink, fontFamily: designTokens.typography.body.fontFamily, fontSize: 15, display: 'grid', gap: 8, minWidth: 0 }}>Listening lesson
        <select id={selectId} value={lesson.id} onChange={event => setLessonId(event.target.value)} style={{ width: '100%', maxWidth: '100%', minWidth: 0, minHeight: 48, padding: 10, border: `1px solid ${colors.inputBorder}`, borderRadius: 12, color: colors.ink, background: colors.card, fontSize: 16 }}>
          {available.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label> : <View style={s.row}>{available.map(item => <Button key={item.id} selected={item.id === lesson.id} onPress={() => setLessonId(item.id)}>{item.title}</Button>)}</View>}
      {!compact && <><Text style={s.body}>{lesson.outcome}</Text>
      <View style={s.divider} />
      <Text style={t.detail}>Replay whenever you like. The transcript is always available for supported text practice.</Text>
      <Text style={t.detail}>Temporary practice only. Answers are not saved or used to assess proficiency.</Text>
      </>}
      </View>
      <View style={[t.main, t.panel, compact && { padding: 18 }]}><SentenceSession key={`${lesson.id}:${lesson.revision}`} questions={questions.filter(question => question.lessonId === lesson.id)} /></View>
    </View>}
    {compact && <Text style={t.detail}>Replay or use the transcript whenever you need it. Temporary practice only: answers are not saved or used to assess proficiency.</Text>}
  </View>;
}

function SentenceSession({ questions }: { questions: ListeningQuestion[] }) {
  const [index, setIndex] = useState(0);
  const position = index % questions.length;
  return <SentenceQuestion key={`${questions[position]!.id}:${index}`} question={questions[position]!} position={position + 1} total={questions.length}
    onNext={() => setIndex(value => value + 1)} />;
}

function SentenceQuestion({ question, position, total, onNext }: { question: ListeningQuestion; position: number; total: number; onNext: () => void }) {
  const compact = useWindowDimensions().width < 900;
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [transcriptOverride, setTranscriptOverride] = useState<boolean | null>(null);
  const transcriptVisible = transcriptOverride ?? checked;
  const [usedTranscript, setUsedTranscript] = useState(false);
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playFocused, setPlayFocused] = useState(false);
  const [error, setError] = useState('');
  const request = useRef(0);
  useEffect(() => () => { request.current++; audio.stop(); }, []);
  function stop() { request.current++; audio.stop(); setPlaying(false); }
  async function play() {
    if (playing) { stop(); return; }
    const current = ++request.current;
    setError(''); setPlaying(true); setPlayed(true);
    try { await audio.speak(question.sentence, question.language as TargetLanguage); }
    catch {
      if (current === request.current) {
        setError('Audio could not play. Try again or use the transcript for text practice.');
        setTranscriptOverride(true);
        if (!checked) setUsedTranscript(true);
      }
    }
    finally { if (current === request.current) setPlaying(false); }
  }
  return <View style={{ gap: 22, minWidth: 0 }}>
    <View style={t.panelHeader}><Text style={s.eyebrow}>Sentence {position} of {total}</Text>{!compact && <Text style={t.label}>Listen → choose → check</Text>}</View>
    <View style={[t.stage, { alignItems: 'center', gap: 8, paddingVertical: compact ? 16 : 24 }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'Stop audio' : played ? 'Replay sentence' : 'Play sentence'}
        onPress={() => void play()} onFocus={() => setPlayFocused(true)} onBlur={() => setPlayFocused(false)}
        style={({ pressed }) => [t.icon, { width: 68, height: 68, borderRadius: 22, backgroundColor: colors.primary,
          opacity: pressed ? designTokens.opacity.pressed : 1 },
        playFocused && { outlineColor: colors.focusRing, outlineWidth: designTokens.focus.outlineWidth,
          outlineStyle: 'solid', outlineOffset: designTokens.focus.outlineOffset }]}>
        <Icon name={playing ? 'stop' : 'speaker'} size={36} color={colors.onPrimary} />
      </Pressable>
      <Button compact={compact} quiet expanded={transcriptVisible} onPress={() => {
        setTranscriptOverride(!transcriptVisible);
        if (!transcriptVisible && !checked) setUsedTranscript(true);
      }}>{transcriptVisible ? 'Hide transcript' : 'Show transcript'}</Button>
    </View>
    {playing && <Text accessibilityLiveRegion="polite" style={s.muted}>Preparing or playing sentence…</Text>}
    {!!error && <Text accessibilityRole="alert" style={[s.body, { color: colors.danger }]}>{error}</Text>}
    {transcriptVisible && <View testID="listening-transcript" style={s.notice}>
      <Text style={s.eyebrow}>Transcript</Text><Text style={[s.heading, { fontWeight: '500' }]}>{question.sentence}</Text>
      {!!question.reading && <Text style={s.muted}>{question.reading}</Text>}
    </View>}
    <Text accessibilityRole="header" style={t.sectionTitle}>What does the sentence mean?</Text>
    <View style={{ gap: 10 }}>{question.choices.map((choice, index) => <Button key={index} selected={selected === index} disabled={checked} onPress={() => setSelected(index)}>{choice}</Button>)}</View>
    {!checked ? <View style={s.row}><Button primary disabled={selected === null} onPress={() => { stop(); setChecked(true); }}>Check answer</Button></View>
      : <View accessibilityLiveRegion="polite" testID="listening-feedback" style={[s.notice, { backgroundColor: selected === question.correctIndex ? colors.green : colors.sand }]}>
        <Text style={s.heading}>{selected === question.correctIndex ? 'That’s the meaning.' : 'Here’s the meaning.'}</Text>
        <Text style={s.body}>{question.meaning}</Text>
        <Text style={s.muted}>{usedTranscript ? 'You used transcript support for this sentence.' : played ? 'Replay and compare the sentence with its meaning.' : 'You answered without playing audio. Try listening on the next sentence.'}</Text>
      </View>}
    <View style={[s.row, { justifyContent: 'flex-end' }]}><Button quiet icon="arrow-right" onPress={() => { stop(); onNext(); }}>Next sentence</Button></View>
  </View>;
}
