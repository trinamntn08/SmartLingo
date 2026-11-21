import { useEffect, useId, useRef, useState } from 'react';
import type { Lesson, TargetLanguage } from '@smartlingo/domain';
import { Platform, Text, View } from 'react-native';
import { audio } from '../audio';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';

export function GuidedSpeaking({ lessons }: { lessons: Lesson[] }) {
  const available = lessons.filter(lesson => lesson.dialogue.length > 0);
  const [lessonId, setLessonId] = useState('');
  const lesson = available.find(item => item.id === lessonId) ?? available[0];
  const selectId = useId();
  return <View testID="guided-speaking" style={s.card}>
    <Text accessibilityRole="header" style={s.heading}>Speaking practice</Text>
    <Text style={s.body}>Choose a role in a scripted dialogue. Listen to your partner, then say your lines aloud. Use the English meaning and reveal a model reply whenever you need it.</Text>
    <Text style={s.muted}>No microphone, recording or scoring. This practice stays in this session.</Text>
    {!lesson ? <Text style={s.body}>No scripted dialogues are available yet. Choose another language or return to vocabulary and lessons to study useful phrases.</Text> : <>
      {Platform.OS === 'web' ? <label htmlFor={selectId} style={{ color: colors.ink, display: 'grid', gap: 8, minWidth: 0 }}>Speaking lesson
        <select id={selectId} value={lesson.id} onChange={event => setLessonId(event.target.value)} style={{ width: '100%', minWidth: 0, minHeight: 48, padding: 10, borderRadius: 12, color: colors.ink, background: colors.paper, fontSize: 16 }}>
          {available.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label> : <View style={s.row}>{available.map(item => <Button key={item.id} selected={item.id === lesson.id} onPress={() => setLessonId(item.id)}>{item.title}</Button>)}</View>}
      <DialoguePractice key={`${lesson.id}:${lesson.revision}`} lesson={lesson} />
    </>}
  </View>;
}

function DialoguePractice({ lesson }: { lesson: Lesson }) {
  const roles = [...new Set(lesson.dialogue.map(line => line.role))];
  const [role, setRole] = useState(roles[0]!);
  const [round, setRound] = useState(0);
  return <View style={{ gap: 16 }}>
    <Text style={s.eyebrow}>Choose your role</Text>
    <View style={s.row}>{roles.map(choice => <Button key={choice} selected={choice === role} label={`Practise as ${choice}`} onPress={() => { setRole(choice); setRound(0); }}>{choice}</Button>)}</View>
    <Text style={s.body}>{lesson.outcome}</Text>
    <DialogueRound key={`${role}:${round}`} lesson={lesson} role={role} onRepeat={() => setRound(value => value + 1)} />
  </View>;
}

function DialogueRound({ lesson, role, onRepeat }: { lesson: Lesson; role: string; onRepeat: () => void }) {
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
  return <View style={{ gap: 16 }}>
    <Text style={s.eyebrow}>Line {index + 1} of {lesson.dialogue.length} · {ownLine ? 'Your turn' : 'Your partner'} · {line.role}</Text>
    <View testID="speaking-line" style={[s.notice, { backgroundColor: ownLine ? colors.yellow : colors.sand }]}>
      <Text style={s.body}>{line.meaning}</Text>
      {(!ownLine || revealed) ? <>
        <Text testID="speaking-target" style={s.heading}>{line.target}</Text>
        {!!line.reading && <>
          <View style={s.row}><Button selected={reading} onPress={() => setReading(value => !value)}>{reading ? 'Hide reading' : 'Show reading'}</Button></View>
          {reading && <Text style={s.body}>{line.reading}</Text>}
        </>}
        <View style={s.row}><Button onPress={() => void play()}>{playing ? 'Stop audio' : ownLine ? 'Listen to model reply' : 'Listen to partner'}</Button></View>
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
