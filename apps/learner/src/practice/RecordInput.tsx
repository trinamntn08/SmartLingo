import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import type { PracticeTranscriptionResponse } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import { RecordedInput, recordingBusy, type RecordedInputState } from './recorded-input';
import { Icon } from '../ui/Icon';
import { toolsStyles as t } from '../ui/learnerToolsStyles';

export type RecordInputHandle = { clear(): void };
export const RecordInput = forwardRef<RecordInputHandle, {
  sessionId: string; available: boolean; disabled: boolean; onBusy(busy: boolean): void;
  onTranscribed(result: PracticeTranscriptionResponse): void;
}>(function RecordInput({ sessionId, available, disabled, onBusy, onTranscribed }, ref) {
  const [state, setState] = useState<RecordedInputState>({ recording: { phase: 'idle', error: '', notice: '' }, transcribing: false, canRetry: false, error: '', notice: '' });
  const callbacks = useRef({ onBusy, onTranscribed }); callbacks.current = { onBusy, onTranscribed };
  const input = useRef<RecordedInput | null>(null);
  if (!input.current) input.current = new RecordedInput(next => { setState(next); callbacks.current.onBusy(recordingBusy(next)); }, result => callbacks.current.onTranscribed(result));
  const recorder = input.current;
  useImperativeHandle(ref, () => ({ clear() { recorder.clear(); } }), [recorder]);
  useEffect(() => {
    const pageHidden = () => { recorder.clear(); };
    const visibilityChanged = () => { if (document.visibilityState === 'hidden') pageHidden(); };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', visibilityChanged);
    globalThis.addEventListener?.('pagehide', pageHidden);
    return () => {
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', visibilityChanged);
      globalThis.removeEventListener?.('pagehide', pageHidden);
      recorder.clear(false); callbacks.current.onBusy(false);
    };
  }, [recorder, sessionId]);
  const phase = state.recording.phase;
  const hasClip = phase === 'ready';
  return <View testID="practice-recording" style={[t.inset, { backgroundColor: colors.soft }]}>
    <View style={t.panelHeader}><View style={[s.row, { flexShrink: 1, minWidth: 0, maxWidth: '100%' }]}><Icon name="mic" size={22} /><Text accessibilityRole="header" style={[t.sectionTitle, { flexShrink: 1 }]}>Record a French message</Text></View><Text style={t.label}>Optional · up to 30 seconds</Text></View>
    <Text style={t.detail}>Or use your voice. The clip stays on this page (up to 2 MiB). Only Transcribe recording or Retry transcription sends it to OpenAI and may use API credits. Review the text before a separate Send message.</Text>
    {!available && <Text style={t.detail}>Transcription is not configured. You can type your message instead. Stop the conversation and check availability again when your local AI service is ready.</Text>}
    <View style={s.row}>
      <Button compact icon="mic" disabled={!available || disabled || phase !== 'idle' || state.transcribing} onPress={() => void recorder.record()}>Record French</Button>
      {phase === 'recording' && <Button primary onPress={() => recorder.stop()}>Stop recording</Button>}
      {hasClip && !state.canRetry && <Button primary disabled={disabled || state.transcribing || !available} onPress={() => void recorder.transcribe(sessionId)}>Transcribe recording</Button>}
      {state.canRetry && <Button primary disabled={disabled || state.transcribing} onPress={() => void recorder.retry()}>Retry transcription</Button>}
      {(phase !== 'idle' || state.transcribing || !!state.error || !!state.recording.error) && <Button onPress={() => recorder.clear()}>Discard recording</Button>}
    </View>
    {phase === 'permission' && <Text accessibilityLiveRegion="polite" style={s.body}>Waiting for microphone permission. You can discard while the browser prompt is open.</Text>}
    {phase === 'recording' && <Text accessibilityLiveRegion="polite" style={s.body}>Recording locally… Stop when you finish. Recording stops automatically after 30 seconds.</Text>}
    {phase === 'stopping' && <Text accessibilityLiveRegion="polite" style={s.body}>Finishing your local recording…</Text>}
    {hasClip && <Text style={s.body}>Local clip ready: {Math.ceil((state.recording.clip?.size ?? 0) / 1024)} KiB. Nothing has been uploaded automatically.</Text>}
    {state.transcribing && <View style={s.row}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.body}>Transcribing your recording…</Text></View>}
    {!!(state.error || state.recording.error) && <Text accessibilityRole="alert" style={[s.body, { color: colors.danger }]}>{state.error || state.recording.error}</Text>}
    {!!(state.notice || state.recording.notice) && <Text accessibilityLiveRegion="polite" style={s.muted}>{state.notice || state.recording.notice}</Text>}
    {state.canRetry && <Text style={s.muted}>Retry uses the same recording and request ID. Nothing is retried automatically. Discarding removes this local clip.</Text>}
    <Text style={s.muted}>A transcript can contain mistakes. Correcting it helps the conversation; this does not assess pronunciation.</Text>
  </View>;
});
