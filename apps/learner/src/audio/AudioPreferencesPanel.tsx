import { useEffect, useId, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import { audio } from './index';
import { audioPreferences, audioRates, type AudioPreferences } from './preferences';
import { getFrenchVoices, selectFrenchVoice, subscribeVoiceChanges, voiceId } from './voices';

const previewText = 'Bonjour ! Je voudrais un café, s’il vous plaît.';

export function AudioPreferencesPanel() {
  const selectId = useId();
  const [preferences, setPreferences] = useState(audioPreferences.get);
  const [voices, setVoices] = useState(getFrenchVoices);
  const [discovering, setDiscovering] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const supported = Platform.OS === 'web' && typeof globalThis.SpeechSynthesisUtterance !== 'undefined' && !!globalThis.speechSynthesis;
  const selectedVoice = selectFrenchVoice(voices, preferences.voiceId);
  const missingPreference = !!preferences.voiceId && !voices.some(voice => voiceId(voice) === preferences.voiceId);

  useEffect(() => {
    const refresh = () => { setVoices(getFrenchVoices()); };
    const unsubscribe = subscribeVoiceChanges(refresh);
    refresh();
    const timer = setTimeout(() => { refresh(); setDiscovering(false); }, 1500);
    return () => { clearTimeout(timer); unsubscribe(); audio.stop(); };
  }, []);

  function save(next: AudioPreferences) {
    audio.stop(); setPlaying(false); setError('');
    const persisted = audioPreferences.save(next);
    setPreferences(next);
    setNotice(persisted ? 'Audio choice saved in this browser.' : 'Audio choice applies for this visit. Browser storage is unavailable, so it may reset after reload.');
  }

  async function preview() {
    if (playing) { audio.stop(); setPlaying(false); return; }
    setError(''); setPlaying(true);
    try { await audio.speak(previewText); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Voice is unavailable. You can continue with text.'); }
    finally { setPlaying(false); }
  }

  return <View style={s.card}>
    <Text accessibilityRole="header" style={s.heading}>French audio</Text>
    <Text style={s.body}>Choose a synthetic voice offered by your browser and listen before deciding. Voice quality varies by device.</Text>
    {!supported ? <Text style={s.body}>Device speech is unavailable here. All lesson text and translations remain available.</Text> : <>
      {discovering && voices.length === 0 && <Text accessibilityLiveRegion="polite" style={s.muted}>Checking for French voices…</Text>}
      {!discovering && voices.length === 0 && <Text style={s.body}>No French voice is available yet. Add a French speech voice in your device settings, then refresh the voice list.</Text>}
      <View style={{ gap: 8 }}>
        <label htmlFor={selectId} style={{ color: colors.ink, fontSize: 17, fontWeight: 600 }}>French voice</label>
        <select id={selectId} value={preferences.voiceId} onChange={event => save({ ...preferences, voiceId: event.target.value })}
          style={{ width: '100%', minWidth: 0, minHeight: 48, padding: 12, borderRadius: 12, border: '1px solid #8B8D7E', background: colors.card, color: colors.ink, fontSize: 16 }}>
          <option value="">Automatic — prefer France French on this device</option>
          {missingPreference && <option value={preferences.voiceId}>Saved voice unavailable — automatic fallback</option>}
          {voices.map(voice => <option key={voiceId(voice)} value={voiceId(voice)}>{voice.name} · {voice.lang} · {voice.localService ? 'Device' : 'Network'}</option>)}
        </select>
      </View>
      {!!selectedVoice && <Text accessibilityLiveRegion="polite" style={s.muted}>Current voice: {selectedVoice.name} ({selectedVoice.lang}).{missingPreference ? ' Your saved voice is unavailable; this voice will be used until it returns.' : ''}</Text>}
      <Text style={s.body}>Speaking speed</Text>
      <View style={s.row}>{audioRates.map(rate => <Button key={rate} selected={preferences.rate === rate} label={`Speaking speed: ${rate === 0.7 ? 'Slow' : rate === 0.85 ? 'Gentle' : 'Normal'}`} onPress={() => save({ ...preferences, rate })}>{rate === 0.7 ? 'Slow · 0.7×' : rate === 0.85 ? 'Gentle · 0.85×' : 'Normal · 1×'}</Button>)}</View>
      <View style={s.notice}><Text style={s.body}>{previewText}</Text><Text style={s.muted}>Hello! I would like a coffee, please.</Text></View>
      <View style={s.row}>
        <Button primary disabled={!selectedVoice} onPress={() => void preview()}>{playing ? 'Stop voice preview' : 'Preview French voice'}</Button>
        <Button onPress={() => { setVoices(getFrenchVoices()); setDiscovering(false); }}>Refresh voice list</Button>
      </View>
    </>}
    {!!error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{error}</Text>}
    {!!notice && <Text accessibilityLiveRegion="polite" style={s.muted}>{notice}</Text>}
    <Text style={s.muted}>Device voices may work offline after installation. Network voices send the spoken text to your browser’s speech service and need a connection. The offline app download does not include voices. These controls make no SmartLingo AI requests.</Text>
  </View>;
}
