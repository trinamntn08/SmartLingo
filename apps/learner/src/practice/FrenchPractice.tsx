import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';
import type { Lesson, PracticeContext, PracticeReply } from '@smartlingo/domain';
import { audio } from '../audio';
import { Badge, Button, Speak } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { Conversation, type ConversationState } from './conversation';
import { RecordInput, type RecordInputHandle } from './RecordInput';

export function FrenchPractice({ lessons, model, active = true }: { lessons: Lesson[]; model: LearningModel; active?: boolean }) {
  const [state, setState] = useState<ConversationState>({ busy: false, error: '', notice: '', exchanges: [] });
  const conversation = useRef<Conversation | null>(null);
  if (!conversation.current) conversation.current = new Conversation(setState);
  const practice = conversation.current;
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [lessonId, setLessonId] = useState(lessons[0]?.id ?? '');
  const [level, setLevel] = useState<PracticeContext['level'] | null>(null);
  const [text, setText] = useState('');
  const [englishHelp, setEnglishHelp] = useState(false);
  const [recordingActive, setRecordingActive] = useState(false);
  const recordingGuard = useRef(false);
  const recording = useRef<RecordInputHandle | null>(null);
  const selected = lessons.find(lesson => lesson.id === lessonId) ?? lessons[0];
  const filtered = lessons.filter(lesson => `${lesson.title} ${lesson.topic} ${lesson.role} ${lesson.level}`.toLowerCase().includes(query.trim().toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 5));
  const visiblePage = Math.min(page, pages - 1);
  const usedTurns = state.exchanges.at(-1)?.response.usedTurns ?? 0;
  const limit = state.session?.maxTurns ?? state.status?.maxTurns ?? 8;
  const atLimit = usedTurns >= limit || !!state.usage && state.usage.usedToday >= state.usage.dailyLimit;
  const retryMatches = !!state.failed && state.failed.text === text.trim() && state.failed.englishHelp === englishHelp;

  useEffect(() => {
    if (active) void practice.check();
    else { practice.clear(); setText(''); }
    return () => { practice.clear(false); audio.stop(); };
  }, [active, practice]);
  useEffect(() => { if (state.exchanges.length) setText(''); }, [state.exchanges.length]);
  function stop() { recording.current?.clear(); recordingGuard.current = false; setRecordingActive(false); practice.clear(); setText(''); setEnglishHelp(false); audio.stop(); }

  return <View testID="french-practice" style={s.card}>
    <View style={s.row}><Badge>Optional AI practice</Badge><Badge>Text, recording + device replay</Badge></View>
    <Text accessibilityRole="header" style={s.heading}>French conversation</Text>
    <Text style={s.body}>Try a short everyday conversation. French replies, English meanings and helpful feedback stay visible.</Text>
    <View style={s.notice}>
      <Text style={s.body}>Send message or Retry message sends your text, selected context and conversation to OpenAI through the SmartLingo server. Transcribe recording or Retry transcription separately sends your local microphone clip to OpenAI. These explicit actions may use paid API credits.</Text>
      <Text style={s.muted}>SmartLingo keeps this conversation in memory only and clears it when you stop, leave Practice or reload. Only phrases you explicitly save stay in your notebook. OpenAI processes sent text under the server owner’s API account settings. Avoid private information.</Text>
      <Text style={s.muted}>Starting, checking availability and recording locally use no AI credits. Local clips are cleared after successful transcription or when you discard, stop, leave or reload. A failed transcription keeps the clip temporarily for an explicit retry. Replay uses your device voice.</Text>
    </View>
    {!state.session && <>
      <Text style={s.eyebrow}>Choose a situation</Text>
      <TextInput accessibilityLabel="Search conversation lessons" placeholder="Search lesson, topic or role" value={query} onChangeText={value => { setQuery(value); setPage(0); }} editable={!state.busy} style={s.input} />
      {!filtered.length ? <Text style={s.body}>No lessons match. Try a broader search.</Text> : <>
        <ScrollView style={{ maxHeight: 230 }} contentContainerStyle={{ gap: 8 }}>
          {filtered.slice(visiblePage * 5, visiblePage * 5 + 5).map(lesson => <Button key={lesson.id} selected={selected?.id === lesson.id} disabled={state.busy}
            label={`Use ${lesson.title}, ${lesson.topic}, ${lesson.role}, ${lesson.level}`} onPress={() => { setLessonId(lesson.id); setLevel(null); }}>
            {lesson.title} · {lesson.topic} · {lesson.role} · {lesson.level === 'foundation' ? 'Foundations' : lesson.level}
          </Button>)}
        </ScrollView>
        {pages > 1 && <View style={s.row}><Button disabled={state.busy || visiblePage === 0} onPress={() => setPage(visiblePage - 1)}>Previous situations</Button><Text style={s.muted}>{visiblePage + 1} / {pages}</Text><Button disabled={state.busy || visiblePage === pages - 1} onPress={() => setPage(visiblePage + 1)}>More situations</Button></View>}
      </>}
      {selected && <View style={s.notice}><Text style={s.body}>Topic: {selected.topic}</Text><Text style={s.body}>Your role: {selected.role}</Text><Text style={s.muted}>Selected lesson: {selected.title}</Text></View>}
      <Text style={s.eyebrow}>Conversation level</Text>
      <View style={s.row}>{(['foundation', 'A1', 'A2'] as const).map(choice => <Button key={choice} selected={(level ?? selected?.level) === choice} disabled={state.busy} onPress={() => setLevel(choice)}>{choice === 'foundation' ? 'Foundations' : choice}</Button>)}</View>
      {!lessons.length && <Text style={s.body}>Choose a conversation after lessons finish loading. Ordinary downloaded lessons remain available.</Text>}
      {state.status?.available === false && <View style={s.notice}><Text style={s.body}>AI practice is not configured. The site owner can configure the OpenAI API key and practice model on the server, restart it, then check again. Keep provider credentials out of the browser.</Text></View>}
      <View style={s.row}><Button primary disabled={!active || state.busy || !selected || state.status?.available !== true || atLimit}
        onPress={() => { if (selected) void practice.start({ topic: selected.topic, role: selected.role, level: level ?? selected.level }); }}>Start AI conversation</Button>
        <Button disabled={!active || state.busy} onPress={() => void practice.check()}>Check AI availability</Button></View>
    </>}
    {state.session && <>
      <View style={s.row}><Badge>{usedTurns} / {limit} turns</Badge><Button onPress={stop}>Stop conversation</Button></View>
      {!state.exchanges.length && <View style={[s.notice, { backgroundColor: colors.green }]}><Text style={s.body}>Ready when you are. Write a greeting or a sentence for your situation, then send it. You can ask for English help.</Text></View>}
      {state.exchanges.map(exchange => <View key={exchange.request.requestId} style={{ gap: 14 }}>
        <View style={s.notice}><Text style={s.eyebrow}>You{exchange.request.englishHelp ? ' · English help requested' : ''}</Text><Text style={s.body}>{exchange.request.text}</Text></View>
        <View style={[s.notice, { backgroundColor: colors.green }]}>
          <Text style={s.eyebrow}>AI conversation partner</Text><Text style={s.heading}>{exchange.response.reply.french}</Text><Speak text={exchange.response.reply.french} />
          <Text style={s.body}>{exchange.response.reply.english}</Text>
          {!!exchange.response.reply.feedback && <Text style={s.body}>{exchange.response.reply.feedback}</Text>}
          {exchange.response.reply.phrase && <SuggestedPhrase phrase={exchange.response.reply.phrase} id={`ai.${exchange.request.sessionId}.${exchange.request.requestId}`} model={model} />}
        </View>
      </View>)}
      {atLimit && <Text accessibilityLiveRegion="polite" style={s.body}>You have reached a practice limit. Your replies remain here until you stop or leave. Ordinary lessons are still available.</Text>}
      <Text accessibilityRole="header" style={s.eyebrow}>Your next message</Text>
      <RecordInput ref={recording} sessionId={state.session.sessionId} available={state.status?.transcriptionAvailable === true} disabled={state.busy || atLimit}
        onBusy={busy => { recordingGuard.current = busy; setRecordingActive(busy); }}
        onTranscribed={result => { setText(result.text); practice.reportUsage(result.usage); }} />
      <TextInput accessibilityLabel="Your French message" placeholder="Bonjour !" value={text} onChangeText={value => { if (!recordingGuard.current) setText(value); }} maxLength={1000} multiline editable={!state.busy && !recordingActive && !atLimit} style={[s.input, { minHeight: 100, textAlignVertical: 'top' }]} />
      {recordingActive && <Text accessibilityLiveRegion="polite" style={s.muted}>Message editing and sending are paused during recording or transcription. Stop recording or discard to return to typing; transcription fills this editable message when ready.</Text>}
      <Text style={s.muted}>{text.length} / 1000 characters. English is welcome when you need help.</Text>
      <View style={s.row}><Button selected={englishHelp} disabled={state.busy || atLimit} onPress={() => setEnglishHelp(!englishHelp)} label={`English help ${englishHelp ? 'on' : 'off'}`}>English help: {englishHelp ? 'on' : 'off'}</Button>
        <Button primary disabled={state.busy || recordingActive || atLimit || !text.trim() || retryMatches} onPress={() => { if (!recordingGuard.current) void practice.send(text, englishHelp); }}>Send message</Button>
        {retryMatches && <Button primary disabled={state.busy || recordingActive} onPress={() => { if (!recordingGuard.current) void practice.retry(); }}>Retry message</Button>}
      </View>
      {!!state.failed && <Text style={s.muted}>Retry keeps the same request ID to avoid duplicate processing. Editing the text or help setting creates a new request only when you press Send message.</Text>}
    </>}
    {state.busy && <View style={s.row}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.body}>{state.session ? 'Waiting for the AI reply…' : 'Connecting to practice…'}</Text>{!state.session && <Button onPress={stop}>Cancel connection</Button>}</View>}
    {!!state.error && <View style={s.error}><Text accessibilityRole="alert" style={s.body}>{state.error}</Text></View>}
    {!!state.notice && <Text accessibilityLiveRegion="polite" style={s.muted}>{state.notice}</Text>}
    {state.usage && <Text style={s.muted}>Server daily attempts: {state.usage.usedToday} / {state.usage.dailyLimit}. Reported conversation tokens: {state.usage.inputTokens} input, {state.usage.outputTokens} output. Transcription tokens are not included. Failed attempts can count; this is not a billing total. The conversation allowance resets when the server restarts.</Text>}
    <Text style={s.muted}>AI suggestions can be mistaken. This is supported practice, not a proficiency assessment.</Text>
  </View>;
}

function SuggestedPhrase({ phrase, id, model }: { phrase: NonNullable<PracticeReply['phrase']>; id: string; model: LearningModel }) {
  const [saved, setSaved] = useState(false);
  const saving = useRef(false);
  const captured = saved || model.notebook.some(entry => entry.id === id);
  function save() {
    if (saving.current || model.blocked || captured) return;
    saving.current = true;
    model.captureEntry({ id, sourceEntryId: id, target: phrase.target, meaning: phrase.meaning, example: '', updatedAt: new Date().toISOString() }, () => { saving.current = false; setSaved(true); });
  }
  useEffect(() => { if (!model.busy) saving.current = false; }, [model.busy]);
  return <View style={{ gap: 8 }}><View style={s.divider} /><Text style={s.eyebrow}>Suggested phrase</Text><Text style={s.body}>{phrase.target}</Text><Text style={s.body}>{phrase.meaning}</Text>
    <Button disabled={model.blocked || captured} onPress={save}>Save suggested phrase</Button>
    {captured && <Text accessibilityLiveRegion="polite" style={s.muted}>Saved to your notebook. You can edit it there.</Text>}
    {!!model.saveError && <><Text accessibilityRole="alert" style={s.body}>{model.saveError}</Text><Button disabled={model.busy} onPress={model.retry}>Retry notebook save</Button></>}
    {!!model.loadError && <Text style={s.muted}>Notebook unavailable: {model.loadError}</Text>}
  </View>;
}
