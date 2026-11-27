import { useEffect, useId, useRef, useState } from 'react';
import type { Lesson, TargetLanguage } from '@smartlingo/domain';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation, useVisitState } from '../app/WebNavigation';
import { audio } from '../audio';
import { AudioIconButton } from '../audio/AudioIconButton';
import { Button } from '../ui/controls';
import { colors, designTokens, styles as s } from '../ui/theme';
import { ScreenHeader } from '../ui/ScreenHeader';
import { toolsStyles as t } from '../ui/learnerToolsStyles';

export function GuidedSpeaking({ lessons }: { lessons: Lesson[] }) {
  const compact = useWindowDimensions().width < 900;
  const { route, navigate } = useNavigation();
  const speaking = route.kind === 'speaking' ? route : undefined;
  const available = lessons.filter(lesson => lesson.dialogue.length > 0);
  const selected = available.find(item => item.id === speaking?.lessonId);
  const lesson = selected ?? available[0];
  const selectId = useId();
  function chooseLesson(id: string) {
    const choice = available.find(item => item.id === id);
    if (!choice) return;
    navigate({ kind: 'speaking', language: choice.language as TargetLanguage, topic: speaking?.topic, lessonId: id, revision: choice.revision, line: 1 });
  }
  return <View testID="guided-speaking" style={t.page}>
    <ScreenHeader title="Speaking practice" subtitle="Listen to your partner, then try your reply aloud." />
    {speaking?.lessonId && !selected && lesson && <Text accessibilityLiveRegion="polite" style={s.muted}>That dialogue is unavailable. An available dialogue is shown instead.</Text>}
    {!lesson ? <View style={t.panel}><Text style={s.body}>No scripted dialogues are available for these lessons.</Text></View> : <View style={t.board}>
      <View style={[t.side, compact ? { gap: 8 } : t.panel]}>
      {Platform.OS === 'web' ? <label htmlFor={selectId} style={{ color: colors.ink, fontFamily: designTokens.typography.body.fontFamily, fontSize: designTokens.typography.label.fontSize, display: 'grid', gap: 8, minWidth: 0 }}>Speaking lesson
        <select id={selectId} value={lesson.id} onChange={event => chooseLesson(event.target.value)} style={{ width: '100%', maxWidth: '100%', minWidth: 0, minHeight: 48, padding: 8, border: `1px solid ${colors.inputBorder}`, borderRadius: designTokens.radius.input, color: colors.ink, background: colors.card, font: 'inherit' }}>
          {available.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label> : <View style={s.row}>{available.map(item => <Button key={item.id} selected={item.id === lesson.id} onPress={() => chooseLesson(item.id)}>{item.title}</Button>)}</View>}
      {!compact && <><Text style={s.muted}>{lesson.outcome}</Text>
      <Text style={t.detail}>Scripted practice stays in this session. It uses no microphone or recording.</Text>
      </>}
      </View>
      <DialoguePractice key={`${lesson.id}:${lesson.revision}`} lesson={lesson} />
    </View>}
    {compact && <Text style={t.detail}>Scripted practice stays in this session. It uses no microphone or recording.</Text>}
  </View>;
}

function DialoguePractice({ lesson }: { lesson: Lesson }) {
  const compact = useWindowDimensions().width < 900;
  const { route, navigate, visit } = useNavigation();
  const speaking = route.kind === 'speaking' ? route : undefined;
  const roles = [...new Set(lesson.dialogue.map(line => line.role))];
  const stateKey = `speaking:${lesson.id}:${lesson.revision}`;
  const [savedRole] = useVisitState(`${stateKey}:role`, roles[0]!);
  const role = roles.includes(savedRole) ? savedRole : roles[0]!;
  const requested = speaking?.lessonId === lesson.id ? speaking.line : undefined;
  const valid = requested !== undefined && speaking?.revision === lesson.revision && requested <= lesson.dialogue.length;
  const index = valid ? requested - 1 : 0;
  function openLine(position: number, selectedRole: string, options: { reading?: boolean; repeat?: boolean } = {}) {
    navigate({ kind: 'speaking', language: lesson.language as TargetLanguage, topic: speaking?.topic, lessonId: lesson.id, revision: lesson.revision, line: position + 1 },
      { repeat: options.repeat, snapshot: { [`${stateKey}:role`]: selectedRole, [`${stateKey}:reading`]: options.reading ?? false } });
  }
  return <View style={[t.main, t.panel, compact && { padding: 16, gap: 12 }]}>
    <Text style={s.eyebrow}>Choose your role</Text>
    <View style={s.row}>{roles.map(choice => <Button compact={compact} key={choice} selected={choice === role} label={`Practise as ${choice}`} onPress={() => {
      if (choice !== role || index !== 0) openLine(0, choice, { repeat: true });
    }}>{choice}</Button>)}</View>
    <View style={s.divider} />
    {requested !== undefined && !valid && <Text accessibilityLiveRegion="polite" style={s.muted}>That line is unavailable in this revision. The first line is shown below.</Text>}
    <DialogueRound key={visit} lesson={lesson} role={role} index={index} stateKey={stateKey}
      onNext={reading => openLine(index + 1, role, { reading })} onRepeat={() => openLine(0, role, { repeat: true })} />
  </View>;
}

function DialogueRound({ lesson, role, index, stateKey, onNext, onRepeat }: {
  lesson: Lesson; role: string; index: number; stateKey: string; onNext: (reading: boolean) => void; onRepeat: () => void;
}) {
  const compact = useWindowDimensions().width < 900;
  const [reading, setReading] = useVisitState(`${stateKey}:reading`, false);
  const [revealed, setRevealed] = useVisitState(`${stateKey}:revealed`, false);
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
  return <View style={{ gap: compact ? 12 : 20, minWidth: 0 }}>
    <View style={t.panelHeader}><Text accessibilityLiveRegion="polite" style={speakingStyles.counter}>Line {index + 1} of {lesson.dialogue.length}</Text><Text style={t.label}>{ownLine ? 'Your turn' : 'Your partner'} · {line.role}</Text></View>
    <View aria-hidden style={s.progressTrack}><View style={[s.progressFill, { width: `${(index + 1) / lesson.dialogue.length * 100}%` }]} /></View>
    <View testID="speaking-line" style={[t.stage, speakingStyles.line, ownLine && speakingStyles.ownLine, compact && speakingStyles.lineCompact]}>
      <Text style={t.label}>English meaning</Text><Text style={s.body}>{line.meaning}</Text>
      {(!ownLine || revealed) ? <>
        <View style={s.row}>
          <Text testID="speaking-target" {...(Platform.OS === 'web' ? { lang: lesson.language } : { accessibilityLanguage: lesson.language })}
            style={[s.target, speakingStyles.target]}>{line.target}</Text>
          <AudioIconButton playing={playing} label={ownLine ? 'Listen to model reply' : 'Listen to partner'} onPress={() => void play()} />
        </View>
        {!!line.reading && <>
          <View style={s.row}><Button selected={reading} onPress={() => setReading(value => !value)}>{reading ? 'Hide reading' : 'Show reading'}</Button></View>
          {reading && <Text style={s.body}>{line.reading}</Text>}
        </>}
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
      {index < lesson.dialogue.length - 1 && <Button primary onPress={() => onNext(reading)}>Next line</Button>}
      <Button onPress={onRepeat}>Repeat this role</Button>
    </View>
  </View>;
}

const speakingStyles = StyleSheet.create({
  counter: { ...designTokens.typography.caption, color: colors.muted, fontVariant: ['tabular-nums'] },
  line: { borderLeftWidth: 4, borderLeftColor: colors.line, backgroundColor: colors.paper },
  ownLine: { borderLeftColor: colors.yellow },
  lineCompact: { padding: 16, gap: 12 },
  target: { minWidth: 0, flexShrink: 1, fontSize: 32, lineHeight: 44, fontWeight: '500' },
});
