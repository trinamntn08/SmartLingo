import { useEffect, useId, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { audio } from '../index';
import { audioRates, japaneseAudioPreferences, type AudioPreferences } from '../preferences';
import { getTargetVoices, selectTargetVoice, subscribeVoiceChanges, voiceId } from '../voices';
import { Button } from '../../ui/controls';
import { colors, styles as s } from '../../ui/theme';
import { japaneseSource, type JapaneseSource } from './preferences';
import { japaneseAudioStore, japaneseSpeechClient } from './runtime';
import { japaneseCredit, japaneseHelp, type JapaneseStatus } from './client';

export function JapaneseAudioPreferencesPanel() {
  const sourceId = useId();
  const voiceSelectId = useId();
  const [source, setSource] = useState(japaneseSource.get);
  const [preferences, setPreferences] = useState(japaneseAudioPreferences.get);
  const [voices, setVoices] = useState(() => getTargetVoices('ja-JP'));
  const [status, setStatus] = useState<JapaneseStatus>();
  const [checking, setChecking] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const statusRequest = useRef<AbortController | undefined>(undefined);
  const mounted = useRef(true);
  const previewSequence = useRef(0);
  const selectedVoice = selectTargetVoice(voices, 'ja-JP', preferences.voiceId);
  const missingPreference = !!preferences.voiceId && !voices.some(voice => voiceId(voice) === preferences.voiceId);

  async function refreshStatus() {
    statusRequest.current?.abort();
    const controller = new AbortController();
    statusRequest.current = controller;
    setChecking(true); setStatusError('');
    try {
      const next = await japaneseSpeechClient.status(controller.signal);
      if (!controller.signal.aborted) setStatus(next);
    } catch (failure) {
      if (!controller.signal.aborted) { setStatus(undefined); setStatusError(failure instanceof Error ? failure.message : japaneseHelp); }
    } finally { if (!controller.signal.aborted) setChecking(false); }
  }
  useEffect(() => {
    mounted.current = true;
    const refreshVoices = () => setVoices(getTargetVoices('ja-JP'));
    const unsubscribe = subscribeVoiceChanges(refreshVoices);
    const timer = setTimeout(refreshVoices, 1500);
    void refreshStatus();
    return () => { mounted.current = false; clearTimeout(timer); unsubscribe(); statusRequest.current?.abort(); previewSequence.current++; audio.stop(); };
  }, []);

  function stopPreview() { previewSequence.current++; audio.stop(); setPlaying(false); setError(''); }
  function saved(persisted: boolean) {
    setNotice(persisted ? 'Audio choice saved in this browser.' : 'Audio choice applies for this visit. Browser storage is unavailable, so it may reset after reload.');
  }
  function saveSource(next: JapaneseSource) { stopPreview(); setSource(next); saved(japaneseSource.save(next)); }
  function savePreferences(next: AudioPreferences) { stopPreview(); setPreferences(next); saved(japaneseAudioPreferences.save(next)); }
  async function preview() {
    if (playing) { stopPreview(); return; }
    const sequence = ++previewSequence.current;
    setPlaying(true); setError('');
    try { await audio.speak('こんにちは。コーヒーをください。', 'ja-JP'); }
    catch (failure) { if (sequence === previewSequence.current && mounted.current) setError(failure instanceof Error ? failure.message : japaneseHelp); }
    finally { if (sequence === previewSequence.current && mounted.current) setPlaying(false); }
  }
  async function clearSaved() {
    stopPreview(); setClearing(true); setNotice('');
    try { await japaneseAudioStore.clear(); if (mounted.current) setNotice('Saved Japanese audio removed from this browser. New speaker clicks can save clips again.'); }
    catch { if (mounted.current) setError('Saved Japanese audio could not be removed. Browser storage may be unavailable; retry.'); }
    finally { if (mounted.current) setClearing(false); }
  }
  const selectStyle = { width: '100%', minWidth: 0, minHeight: 48, padding: 12, borderRadius: 12, border: '1px solid #8B8D7E', background: colors.card, color: colors.ink, fontSize: 16 };
  return <View style={s.card}>
    <Text accessibilityRole="header" style={s.heading}>Japanese audio</Text>
    <Text style={s.body}>Automatic uses native-speaker recordings where available. Other words can use a Japanese device voice or free local speech.</Text>
    <View style={{ gap: 8 }}>
      <label htmlFor={sourceId} style={{ color: colors.ink, fontSize: 17, fontWeight: 600 }}>Japanese audio source</label>
      <select id={sourceId} value={source} onChange={event => saveSource(event.target.value as JapaneseSource)} style={selectStyle}>
        <option value="auto">Automatic — recordings and voices</option>
        <option value="device">Device voice only</option>
        <option value="voicevox">Free local voice — Shikoku Metan</option>
      </select>
    </View>
    <Text accessibilityLiveRegion="polite" style={s.muted}>{checking ? 'Checking the free local Japanese voice…' : status?.available ? 'Free local voice ready: Shikoku Metan.' : 'Free local voice is not connected.'}</Text>
    <Text style={s.muted}>{japaneseCredit} · Synthetic speech · No API key or usage credits.</Text>
    {!!statusError && <Text style={s.muted}>{statusError}</Text>}
    {!checking && !status?.available && <Text style={s.body}>Install VOICEVOX from voicevox.hiroshiba.jp, start its local engine on this computer, and start the SmartLingo local API. Then refresh availability. Saved clips may still play offline.</Text>}
    <Button disabled={checking} onPress={() => void refreshStatus()}>Refresh Japanese voice availability</Button>
    <View style={{ gap: 8 }}>
      <label htmlFor={voiceSelectId} style={{ color: colors.ink, fontSize: 17, fontWeight: 600 }}>Japanese voice</label>
      <select id={voiceSelectId} value={preferences.voiceId} onChange={event => savePreferences({ ...preferences, voiceId: event.target.value })} style={selectStyle}>
        <option value="">Automatic — prefer Japan Japanese on this device</option>
        {missingPreference && <option value={preferences.voiceId}>Saved voice unavailable — automatic fallback</option>}
        {voices.map(voice => <option key={voiceId(voice)} value={voiceId(voice)}>{voice.name} · {voice.lang} · {voice.localService ? 'Device' : 'Network'}</option>)}
      </select>
    </View>
    <Text style={s.muted}>{selectedVoice ? `Current device voice: ${selectedVoice.name} (${selectedVoice.lang}).` : 'No Japanese device voice is available. Automatic and Free local voice can use VOICEVOX or saved Japanese audio.'}</Text>
    <Text style={s.body}>Speaking speed</Text>
    <View style={s.row}>{audioRates.map(rate => <Button key={rate} selected={preferences.rate === rate} label={`Speaking speed: ${rate === 0.7 ? 'Slow' : rate === 0.85 ? 'Gentle' : 'Normal'}`} onPress={() => savePreferences({ ...preferences, rate })}>{rate === 0.7 ? 'Slow · 0.7×' : rate === 0.85 ? 'Gentle · 0.85×' : 'Normal · 1×'}</Button>)}</View>
    <View style={s.notice}><Text style={s.body}>こんにちは。コーヒーをください。</Text><Text style={s.muted}>Hello. A coffee, please.</Text></View>
    <View style={s.row}>
      <Button primary disabled={clearing} onPress={() => void preview()}>{playing ? 'Stop voice preview' : 'Preview Japanese voice'}</Button>
      <Button onPress={() => setVoices(getTargetVoices('ja-JP'))}>Refresh voice list</Button>
      <Button disabled={clearing} onPress={() => void clearSaved()}>{clearing ? 'Removing Japanese audio…' : 'Remove saved Japanese audio'}</Button>
    </View>
    {!!error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{error}</Text>}
    {!!notice && <Text accessibilityLiveRegion="polite" style={s.muted}>{notice}</Text>}
    <Text style={s.muted}>With Free local voice, spoken text goes only to the local API and VOICEVOX engine on this computer. A speaker click may save its clip in this browser for offline replay (up to 100 clips / 32 MB); browser storage can be unavailable or evicted. Clearing Japanese audio cancels this preview and keeps lesson history and French audio.</Text>
    <Text style={s.muted}>Device network voices may send text to your browser’s speech service. Installed device voices and saved clips may work offline. The app download does not install VOICEVOX. All lesson text and translations remain available.</Text>
  </View>;
}
