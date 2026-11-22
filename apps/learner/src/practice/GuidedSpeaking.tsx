import { useEffect, useId, useRef, useState } from 'react';
import type { Lesson, TargetLanguage } from '@smartlingo/domain';
import { Platform, Text, View, useWindowDimensions } from 'react-native';
import { audio } from '../audio';
import { Button } from '../ui/controls';
import { colors, designTokens, styles as s } from '../ui/theme';
import { ScreenHeader } from '../ui/ScreenHeader';
import { Icon } from '../ui/Icon';
import { toolsStyles as t } from '../ui/learnerToolsStyles';

export function GuidedSpeaking({ lessons }: { lessons: Lesson[] }) {
  const compact = useWindowDimensions().width < 900;
  const available = lessons.filter(lesson => lesson.dialogue.length > 0);
  const [lessonId, setLessonId] = useState('');
  const lesson = available.find(item => item.id === lessonId) ?? available[0];
  const selectId = useId();
  return <View testID="guided-speaking" style={t.page}>
    <ScreenHeader eyebrow="Say it in context" title="Speaking practice" subtitle={compact ? 'Listen to your partner. Try your reply aloud.' : 'Take a part in an everyday conversation. Listen to your partner, then try your own reply.'} />
    {!lesson ? <View style={t.panel}><Text style={s.body}>No scripted dialogues are available yet. Choose another language or return to vocabulary and lessons to study useful phrases.</Text></View> : <View style={t.board}>
      <View style={[t.side, compact ? { gap: 8 } : t.panel]}>
      {!compact && <View style={s.row}><View style={[t.icon, { backgroundColor: colors.sageTint }]}><Icon name="mic" size={24} /></View><Text accessibilityRole="header" style={t.sectionTitle}>Set the scene</Text></View>}
      {Platform.OS === 'web' ? <label htmlFor={selectId} style={{ color: colors.ink, fontFamily: designTokens.typography.body.fontFamily, fontSize: 15, display: 'grid', gap: 8, minWidth: 0 }}>Speaking lesson
        <select id={selectId} value={lesson.id} onChange={event => setLessonId(event.target.value)} style={{ width: '100%', maxWidth: '100%', minWidth: 0, minHeight: 48, padding: 10, border: `1px solid ${colors.inputBorder}`, borderRadius: 12, color: colors.ink, background: colors.card, fontSize: 16 }}>
          {available.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label> : <View style={s.row}>{available.map(item => <Button key={item.id} selected={item.id === lesson.id} onPress={() => setLessonId(item.id)}>{item.title}</Button>)}</View>}
      {!compact && <><Text style={s.body}>{lesson.outcome}</Text>
      <View style={s.divider} />
      <Text style={t.detail}>Use the English meaning to plan your line. Compare with the model whenever you need it.</Text>
      <Text style={t.detail}>No microphone, recording or scoring. This practice stays in this session.</Text>
      </>}
      </View>
      <DialoguePractice key={`${lesson.id}:${lesson.revision}`} lesson={lesson} />
    </View>}
    {compact && <Text style={t.detail}>Use the English meaning and model reply whenever you need them. No microphone, recording or scoring. This practice stays in this session.</Text>}
  </View>;
}

function DialoguePractice({ lesson }: { lesson: Lesson }) {
  const compact = useWindowDimensions().width < 900;
  const roles = [...new Set(lesson.dialogue.map(line => line.role))];
  const [role, setRole] = useState(roles[0]!);
  const [round, setRound] = useState(0);
  return <View style={[t.main, t.panel, compact && { padding: 18, gap: 14 }]}>
    <Text style={s.eyebrow}>Choose your role</Text>
    <View style={s.row}>{roles.map(choice => <Button compact={compact} key={choice} selected={choice === role} label={`Practise as ${choice}`} onPress={() => { setRole(choice); setRound(0); }}>{choice}</Button>)}</View>
    <View style={s.divider} />
    <DialogueRound key={`${role}:${round}`} lesson={lesson} role={role} onRepeat={() => setRound(value => value + 1)} />
  </View>;
}

function DialogueRound({ lesson, role, onRepeat }: { lesson: Lesson; role: string; onRepeat: () => void }) {
  const compact = useWindowDimensions().width < 900;
  const [index, setIndex] = useState(0);
  const [reading, setReading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const request = useRef(0);
  useEffect(() => () => { request.current++; audio.stop(); }, []);
  const line = lesson.dialogue[index]!;
  const ownLine = line.role === role;
  function stop() { request.current++; audio.stop(); setPlaying(false); }
  async function play() {
    if (playing) { stop(); return; }
    const current = ++request.current;
    setError(''); setPlaying(true);
    try { await audio.speak(line.target, lesson.language as TargetLanguage); }
    catch { if (current === request.current) setError('Audio could not play. You can retry, read the text and continue speaking aloud.'); }
    finally { if (current === request.current) setPlaying(false); }
  }
  function next() { stop(); setIndex(value => value + 1); setRevealed(false); setError(''); }
  return <View style={{ gap: compact ? 14 : 22, minWidth: 0 }}>
    <View style={t.panelHeader}><Text style={s.eyebrow}>Line {index + 1} of {lesson.dialogue.length}</Text><Text style={t.label}>{ownLine ? 'Your turn' : 'Your partner'} · {line.role}</Text></View>
    <View style={s.progressTrack}><View style={[s.progressFill, { width: `${(index + 1) / lesson.dialogue.length * 100}%` }]} /></View>
    <View testID="speaking-line" style={[t.stage, { backgroundColor: ownLine ? colors.goldTint : colors.skyTint, paddingVertical: compact ? 18 : 30 }, compact && { paddingHorizontal: 18, gap: 14 }]}>
      {!compact && <View style={s.row}><Icon name={ownLine ? 'mic' : 'headphones'} size={24} /><Text style={s.eyebrow}>{ownLine ? 'Your reply' : 'Listen to your partner'}</Text></View>}
      <Text style={t.label}>English meaning</Text><Text style={s.body}>{line.meaning}</Text>
      {(!ownLine || revealed) ? <>
        <Text testID="speaking-target" style={[s.target, { fontSize: 29, lineHeight: 40, fontWeight: '500' }]}>{line.target}</Text>
        {!!line.reading && <>
          <View style={s.row}><Button selected={reading} onPress={() => setReading(value => !value)}>{reading ? 'Hide reading' : 'Show reading'}</Button></View>
          {reading && <Text style={s.body}>{line.reading}</Text>}
        </>}
        <View style={s.row}><Button icon="play" onPress={() => void play()}>{playing ? 'Stop audio' : ownLine ? 'Listen to model reply' : 'Listen to partner'}</Button></View>
      </> : <>
        <Text style={s.muted}>Try saying this meaning in your own words, then compare with the model.</Text>
        <View style={s.row}><Button onPress={() => setRevealed(true)}>Show model reply</Button></View>
      </>}
      {ownLine && revealed && <Text style={s.muted}>Model-supported practice. Other suitable replies may also work.</Text>}
    </View>
    {playing && <Text accessibilityLiveRegion="polite" style={s.muted}>Preparing or playing dialogue audio…</Text>}
    {!!error && <Text accessibilityRole="alert" style={[s.body, { color: colors.danger }]}>{error}</Text>}
    {index === lesson.dialogue.length - 1 && <Text accessibilityLiveRegion="polite" style={s.body}>You have reached the last line. Repeat this role or try the other side of the dialogue.</Text>}
    <View style={s.row}>
      {index < lesson.dialogue.length - 1 && <Button primary onPress={next}>Next line</Button>}
      <Button onPress={() => { stop(); onRepeat(); }}>Repeat this role</Button>
    </View>
  </View>;
}
