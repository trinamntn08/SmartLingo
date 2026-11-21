import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Lesson, TargetLanguage } from '@smartlingo/domain';
import { Platform, Text, View } from 'react-native';
import { audio } from '../audio';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import { buildListeningQuestions, type ListeningQuestion } from './comprehension';

export function ListeningComprehension({ lessons }: { lessons: Lesson[] }) {
  const questions = useMemo(() => buildListeningQuestions(lessons), [lessons]);
  const available = lessons.filter(lesson => questions.some(question => question.lessonId === lesson.id));
  const [lessonId, setLessonId] = useState('');
  const lesson = available.find(item => item.id === lessonId) ?? available[0];
  const selectId = useId();
  return <View testID="listening-comprehension" style={s.card}>
    <Text accessibilityRole="header" style={s.heading}>Listening comprehension</Text>
    <Text style={s.body}>Listen to a sentence, then choose its English meaning. Replay whenever you like, or use the transcript for supported text practice.</Text>
    <Text style={s.muted}>Temporary practice only. Answers are not saved or used to assess proficiency.</Text>
    {!lesson ? <Text style={s.body}>No sentence questions are available yet. This activity needs three distinct sentence meanings in the same language. You can still study the lessons and their translations.</Text> : <>
      {Platform.OS === 'web' ? <label htmlFor={selectId} style={{ color: colors.ink, display: 'grid', gap: 8, minWidth: 0 }}>Listening lesson
        <select id={selectId} value={lesson.id} onChange={event => setLessonId(event.target.value)} style={{ width: '100%', minWidth: 0, minHeight: 48, padding: 10, borderRadius: 12, color: colors.ink, background: colors.paper, fontSize: 16 }}>
          {available.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label> : <View style={s.row}>{available.map(item => <Button key={item.id} selected={item.id === lesson.id} onPress={() => setLessonId(item.id)}>{item.title}</Button>)}</View>}
      <SentenceSession key={`${lesson.id}:${lesson.revision}`} questions={questions.filter(question => question.lessonId === lesson.id)} />
    </>}
  </View>;
}

function SentenceSession({ questions }: { questions: ListeningQuestion[] }) {
  const [index, setIndex] = useState(0);
  const position = index % questions.length;
  return <SentenceQuestion key={`${questions[position]!.id}:${index}`} question={questions[position]!} position={position + 1} total={questions.length}
    onNext={() => setIndex(value => value + 1)} />;
}

function SentenceQuestion({ question, position, total, onNext }: { question: ListeningQuestion; position: number; total: number; onNext: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [transcript, setTranscript] = useState(false);
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const request = useRef(0);
  useEffect(() => () => { request.current++; audio.stop(); }, []);
  function stop() { request.current++; audio.stop(); setPlaying(false); }
  async function play() {
    if (playing) { stop(); return; }
    const current = ++request.current;
    setError(''); setPlaying(true); setPlayed(true);
    try { await audio.speak(question.sentence, question.language as TargetLanguage); }
    catch { if (current === request.current) { setError('Audio could not play. Retry playback or use the visible transcript for text practice.'); setTranscript(true); } }
    finally { if (current === request.current) setPlaying(false); }
  }
  return <View style={{ gap: 16 }}>
    <Text style={s.eyebrow}>Sentence {position} of {total}</Text>
    <View style={s.row}>
      <Button primary onPress={() => void play()}>{playing ? 'Stop audio' : played ? 'Replay sentence' : 'Play sentence'}</Button>
      {!transcript && !checked && <Button onPress={() => setTranscript(true)}>Show transcript</Button>}
    </View>
    {playing && <Text accessibilityLiveRegion="polite" style={s.muted}>Preparing or playing sentence…</Text>}
    {!!error && <Text accessibilityRole="alert" style={[s.body, { color: colors.danger }]}>{error}</Text>}
    {(transcript || checked) && <View testID="listening-transcript" style={s.notice}>
      <Text style={s.eyebrow}>Transcript</Text><Text style={s.body}>{question.sentence}</Text>
      {!!question.reading && <Text style={s.muted}>{question.reading}</Text>}
      {transcript && !checked && <Text style={s.muted}>Text-supported practice: the transcript is visible.</Text>}
    </View>}
    <Text style={s.body}>What does the sentence mean?</Text>
    <View style={{ gap: 10 }}>{question.choices.map((choice, index) => <Button key={index} selected={selected === index} disabled={checked} onPress={() => setSelected(index)}>{choice}</Button>)}</View>
    {!checked ? <View style={s.row}><Button primary disabled={selected === null} onPress={() => { stop(); setChecked(true); }}>Check answer</Button></View>
      : <View accessibilityLiveRegion="polite" testID="listening-feedback" style={[s.notice, { backgroundColor: selected === question.correctIndex ? colors.green : colors.sand }]}>
        <Text style={s.heading}>{selected === question.correctIndex ? 'That’s the meaning.' : 'Here’s the meaning.'}</Text>
        <Text style={s.body}>{question.meaning}</Text>
        <Text style={s.muted}>{transcript ? 'You used transcript support for this sentence.' : played ? 'Replay and compare the sentence with its meaning.' : 'You answered without playing audio. Try listening on the next sentence.'}</Text>
      </View>}
    <View style={s.row}><Button onPress={() => { stop(); onNext(); }}>Next sentence</Button></View>
  </View>;
}
