import { useEffect, useId, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { isAndroidApp } from '../platform/runtime';
import { colors, styles as s } from '../ui/theme';
import { audio, deviceAudio } from './index';
import { androidSpeechAvailable, getAndroidVoices } from './android';
import { preferencesForLanguage, audioRates, type AudioPreferences } from './preferences';
import { getTargetVoices, selectTargetVoice, subscribeVoiceChanges, voiceId } from './voices';
import { JapaneseAudioPreferencesPanel } from './japanese/JapaneseAudioPreferencesPanel';

const previewText = 'Bonjour ! Je voudrais un café, s’il vous plaît.';

export function AudioPreferencesPanel({ language = 'fr-FR' }: { language?: TargetLanguage }) {
  return language === 'ja-JP' && !isAndroidApp() ? <JapaneseAudioPreferencesPanel /> : <DeviceAudioPreferencesPanel language={language} />;
}

function DeviceAudioPreferencesPanel({ language }: { language: TargetLanguage }) {
  const android = isAndroidApp();
  const name = languageNames[language];
  const store = preferencesForLanguage(language);
  const sample = language === 'ja-JP' ? 'こんにちは。コーヒーをください。' : previewText;
  const sampleMeaning = language === 'ja-JP' ? 'Hello. A coffee, please.' : 'Hello! I would like a coffee, please.';
  const selectId = useId();
  const [preferences, setPreferences] = useState(store.get);
  const [voices, setVoices] = useState(() => android ? [] : getTargetVoices(language));
  const [voiceRefresh, setVoiceRefresh] = useState(0);
  const [discovering, setDiscovering] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const supported = android ? androidSpeechAvailable()
    : Platform.OS === 'web' && typeof globalThis.SpeechSynthesisUtterance !== 'undefined' && !!globalThis.speechSynthesis;
  const preferredVoice = voices.find(voice => voiceId(voice) === preferences.voiceId);
  const selectedVoice = android ? preferredVoice ?? voices[0] : selectTargetVoice(voices, language, preferences.voiceId);
  const missingPreference = !!preferences.voiceId && !preferredVoice;

  useEffect(() => {
    if (android) {
      let active = true;
      setDiscovering(true);
      getAndroidVoices(language).then(found => { if (active) setVoices(found); })
        .catch(() => { if (active) setVoices([]); })
        .finally(() => { if (active) setDiscovering(false); });
      return () => { active = false; };
    }
    const refresh = () => { setVoices(getTargetVoices(language)); };
    const unsubscribe = subscribeVoiceChanges(refresh);
    refresh();
    const timer = setTimeout(() => { refresh(); setDiscovering(false); }, 1500);
    return () => { clearTimeout(timer); unsubscribe(); };
  }, [android, language, voiceRefresh]);

  useEffect(() => () => audio.stop(), [language]);

  function save(next: AudioPreferences) {
    audio.stop(); setPlaying(false); setError('');
    const persisted = store.save(next);
    setPreferences(next);
    const location = isAndroidApp() ? 'this app' : 'this browser';
    setNotice(persisted ? `Audio choice saved in ${location}.` : 'Audio choice applies for this visit. Local storage is unavailable, so it may reset after reload.');
  }

  async function preview() {
    if (playing) { audio.stop(); setPlaying(false); return; }
    setError(''); setPlaying(true);
    try { audio.stop(); await deviceAudio.speak(sample, language); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Voice is unavailable. You can continue with text.'); }
    finally { setPlaying(false); }
  }

  return <View style={s.card}>
    <Text accessibilityRole="header" style={s.heading}>{name} audio</Text>
    <Text style={s.body}>Choose a synthetic voice offered by your {isAndroidApp() ? 'device' : 'browser'} and listen before deciding. Voice quality varies by device.</Text>
    {!supported ? <Text style={s.body}>Device speech is unavailable here. All lesson text and translations remain available.</Text> : <>
      {discovering && voices.length === 0 && <Text accessibilityLiveRegion="polite" style={s.muted}>Checking for {name} voices…</Text>}
      {!discovering && voices.length === 0 && <Text style={s.body}>No {name} voice is available yet. {android
        ? `In Android Settings, find Text-to-speech output, install ${name} voice data, then refresh the voice list.`
        : `Add a ${name} speech voice in your device settings, then refresh the voice list.`}</Text>}
      <View style={{ gap: 8 }}>
        <label htmlFor={selectId} style={{ color: colors.ink, fontSize: 17, fontWeight: 600 }}>{name} voice</label>
        <select id={selectId} value={preferences.voiceId} onChange={event => save({ ...preferences, voiceId: event.target.value })}
          style={{ width: '100%', minWidth: 0, minHeight: 48, padding: 12, borderRadius: 12, border: '1px solid #8B8D7E', background: colors.card, color: colors.ink, fontSize: 16 }}>
          <option value="">Automatic — prefer {language === 'ja-JP' ? 'Japan Japanese' : 'France French'} on this device</option>
          {missingPreference && <option value={preferences.voiceId}>Saved voice unavailable — automatic fallback</option>}
          {voices.map(voice => <option key={voiceId(voice)} value={voiceId(voice)}>{voice.name} · {voice.lang} · {voice.localService ? 'Device' : 'Network'}</option>)}
        </select>
      </View>
      {!!selectedVoice && <Text accessibilityLiveRegion="polite" style={s.muted}>Current voice: {selectedVoice.name} ({selectedVoice.lang}).{missingPreference ? ' Your saved voice is unavailable; this voice will be used until it returns.' : ''}</Text>}
      <Text style={s.body}>Speaking speed</Text>
      <View style={s.row}>{audioRates.map(rate => <Button key={rate} selected={preferences.rate === rate} label={`Speaking speed: ${rate === 0.7 ? 'Slow' : rate === 0.85 ? 'Gentle' : 'Normal'}`} onPress={() => save({ ...preferences, rate })}>{rate === 0.7 ? 'Slow · 0.7×' : rate === 0.85 ? 'Gentle · 0.85×' : 'Normal · 1×'}</Button>)}</View>
      <View style={s.notice}><Text style={s.body}>{sample}</Text><Text style={s.muted}>{sampleMeaning}</Text></View>
      <View style={s.row}>
        <Button primary disabled={!selectedVoice} onPress={() => void preview()}>{playing ? 'Stop voice preview' : `Preview ${name} voice`}</Button>
        <Button onPress={() => {
          if (android) setVoiceRefresh(value => value + 1);
          else { setVoices(getTargetVoices(language)); setDiscovering(false); }
        }}>Refresh voice list</Button>
      </View>
    </>}
    {!!error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{error}</Text>}
    {!!notice && <Text accessibilityLiveRegion="polite" style={s.muted}>{notice}</Text>}
    <Text style={s.muted}>Device voices may work offline after installation. Network voices send the spoken text to a speech service and need a connection. {isAndroidApp() ? 'The APK does not include voices.' : 'The offline app download does not include voices.'} These controls make no SmartLingo AI requests.</Text>
  </View>;
}
