import { useEffect, useId, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { speechVoices, type SpeechInput, type SpeechStatus } from '@smartlingo/domain';
import { Button } from '../../ui/controls';
import { colors, styles as s } from '../../ui/theme';
import { audio } from '../index';
import { speechClient } from './client';
import { generatedPreferences, type GeneratedPreferences } from './preferences';
import { savedClipPlayer, subscribeGeneratedPreferences } from './runtime';
import { generatedAudioStore } from './store';
import { useGeneratedPhrase } from './usePhrase';

const sample = 'Bonjour ! Je voudrais un café, s’il vous plaît.';
export function GeneratedSpeechPanel() {
  const voiceId = useId(); const paceId = useId();
  const [settings, setSettings] = useState(generatedPreferences.get);
  const [text, setText] = useState(sample);
  const [status, setStatus] = useState<SpeechStatus>();
  const [checking, setChecking] = useState(true);
  const [availabilityError, setAvailabilityError] = useState('');
  const [notice, setNotice] = useState('');
  const [playError, setPlayError] = useState('');
  const [playing, setPlaying] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removalVersion, setRemovalVersion] = useState(0);
  const playbackVersion = useRef(0);
  const input: SpeechInput = { text, voice: settings.voice, pace: settings.pace };
  const phrase = useGeneratedPhrase(input);
  const supported = generatedAudioStore.supported();
  useEffect(() => subscribeGeneratedPreferences(() => setSettings(generatedPreferences.get())), []);
  useEffect(() => {
    const controller = new AbortController();
    setChecking(true); setAvailabilityError('');
    void speechClient.status(controller.signal).then(value => { if (!controller.signal.aborted) setStatus(value); })
      .catch(() => { if (!controller.signal.aborted) { setStatus(undefined); setAvailabilityError('The local audio server is unavailable. Saved browser audio still plays offline.'); } })
      .finally(() => { if (!controller.signal.aborted) setChecking(false); });
    return () => controller.abort();
  }, [removalVersion]);
  useEffect(() => () => { playbackVersion.current++; audio.stop(); savedClipPlayer.stop(); }, [text, settings.voice, settings.pace]);
  function save(next: GeneratedPreferences) {
    playbackVersion.current++; audio.stop(); savedClipPlayer.stop(); setPlaying(false); setPlayError('');
    const persisted = generatedPreferences.save(next); setSettings(next);
    setNotice(persisted ? 'Neural audio choice saved in this browser.' : 'This audio choice applies for this visit. Browser preferences could not be saved.');
  }
  async function play() {
    const version = ++playbackVersion.current;
    if (playing) { savedClipPlayer.stop(); setPlaying(false); return; }
    setPlaying(true); setPlayError(''); audio.stop();
    try {
      const clip = await generatedAudioStore.get(input);
      if (version !== playbackVersion.current) return;
      if (!clip) throw new Error('No saved sample for this exact text, voice and pace. Generate and save explicitly first.');
      await savedClipPlayer.play(clip.bytes);
    } catch (failure) { if (version === playbackVersion.current) setPlayError(failure instanceof Error ? failure.message : 'Saved audio is unavailable.'); }
    finally { if (version === playbackVersion.current) setPlaying(false); }
  }
  async function remove() {
    phrase.cancel(); playbackVersion.current++; audio.stop(); savedClipPlayer.stop(); setPlaying(false); setRemoving(true); setPlayError('');
    try { await generatedAudioStore.remove(); phrase.reset(); save({ ...settings, enabled: false }); setNotice('Saved browser audio removed. Learner history, downloads and the separate server cache are unchanged.'); setConfirm(false); }
    catch (failure) { setPlayError(failure instanceof Error ? failure.message : 'Saved audio could not be removed.'); }
    finally { setRemoving(false); }
  }
  return <View style={s.card}>
    <Text accessibilityRole="header" style={s.heading}>Neural French audio</Text>
    <Text style={s.body}>Audition synthetic France French from Azure. Denise and Henri are candidates; listen to decide which feels calm and clear.</Text>
    <View style={{ gap: 8 }}><label htmlFor={voiceId} style={{ color: colors.ink, fontSize: 17 }}>Neural French voice</label>
      <select id={voiceId} value={settings.voice} disabled={phrase.busy} onChange={event => save({ ...settings, voice: event.target.value as SpeechInput['voice'] })}
        style={{ minHeight: 48, width: '100%', minWidth: 0, padding: 12, fontSize: 16, borderRadius: 12, background: colors.card, color: colors.ink }}>
        {speechVoices.map(voice => <option key={voice} value={voice}>{voice.includes('Denise') ? 'Denise · France French' : 'Henri · France French'}</option>)}
      </select></View>
    <View style={{ gap: 8 }}><label htmlFor={paceId} style={{ color: colors.ink, fontSize: 17 }}>Neural speaking pace</label>
      <select id={paceId} value={settings.pace} disabled={phrase.busy} onChange={event => save({ ...settings, pace: event.target.value as SpeechInput['pace'] })}
        style={{ minHeight: 48, width: '100%', minWidth: 0, padding: 12, fontSize: 16, borderRadius: 12, background: colors.card, color: colors.ink }}>
        <option value="gentle">Gentle · slower neutral delivery</option><option value="normal">Normal</option>
      </select></View>
    <View style={s.notice}><Text style={s.body}>{sample}</Text><Text style={s.muted}>Hello! I would like a coffee, please.</Text></View>
    <Text style={s.body}>French phrase for neural audio (up to 500 characters)</Text>
    <TextInput accessibilityLabel="French phrase for neural audio" multiline value={text} maxLength={500} editable={!phrase.busy} onChangeText={value => { savedClipPlayer.stop(); setPlaying(false); setText(value); }} style={s.input} />
    <Text style={s.muted}>Generate sends this text to Azure through your local server and may use API credits. Avoid private details. Your local server keeps generated clips and their French text in a separate cache. Removing browser audio does not clear that server cache. Browser clips are separate from learner backups; Azure processing is separate from local storage.</Text>
    {supported && <Text accessibilityLiveRegion="polite" style={s.muted}>{phrase.saved ? 'Saved audio is available for this text, voice and pace.' : 'No saved audio found for this text, voice and pace. Generate explicitly to save a clip.'}</Text>}
    {!supported && <Text style={s.body}>Saving audio needs CacheStorage, Web Crypto and Web Locks in this browser. Device speech and lesson text remain available.</Text>}
    {checking && <Text accessibilityLiveRegion="polite" style={s.muted}>Checking neural audio availability…</Text>}
    {!!status && <Text accessibilityLiveRegion="polite" style={s.muted}>{status.available ? 'Local generation is configured.' : 'Neural generation is not configured on the local API server.'} At last availability check, attempts reserved today: {status.usage.usedToday}/{status.usage.dailyLimit}. Refresh to update; this counter is not a billing total.</Text>}
    {!!availabilityError && <Text style={s.muted}>{availabilityError}</Text>}
    <View style={s.row}>
      <Button primary disabled={!supported || phrase.busy || removing || !text.trim()} onPress={() => void phrase.save()}>{phrase.busy ? 'Generating…' : 'Generate and save (may use credits)'}</Button>
      {phrase.busy && <Button onPress={phrase.cancel}>Cancel generation</Button>}
      <Button disabled={!supported || removing} onPress={() => void play()}>{playing ? 'Stop saved audio' : 'Play saved sample'}</Button>
      <Button disabled={checking} onPress={() => setRemovalVersion(value => value + 1)}>Refresh neural availability</Button>
    </View>
    <Button selected={settings.enabled} disabled={(!supported && !settings.enabled) || removing} onPress={() => save({ ...settings, enabled: !settings.enabled })}>Use saved neural audio</Button>
    <Text style={s.muted}>{settings.enabled ? 'Speaker buttons use saved audio for the exact text, voice and pace; otherwise they use your device voice. Open Audio options beside a speaker to explicitly save a phrase.' : 'Speaker buttons use your device voice. Enable saved neural audio to use locally saved clips.'} Playback never generates audio.</Text>
    <Button disabled={!supported || phrase.busy || removing} onPress={() => setConfirm(true)}>Remove saved browser audio</Button>
    {confirm && <View style={s.notice}><Text style={s.body}>Remove all saved neural audio from this browser? This preserves learner history and app downloads. The separate server audio cache is not removed.</Text><View style={s.row}><Button disabled={removing} onPress={() => void remove()}>{removing ? 'Removing…' : 'Confirm removal'}</Button><Button disabled={removing} onPress={() => setConfirm(false)}>Keep saved audio</Button></View></View>}
    {!!phrase.notice && <Text accessibilityLiveRegion="polite" style={s.muted}>{phrase.notice}</Text>}
    {!!notice && <Text accessibilityLiveRegion="polite" style={s.muted}>{notice}</Text>}
    {!!phrase.error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{phrase.error} Press Generate and save to retry explicitly.</Text>}
    {!!playError && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{playError}</Text>}
  </View>;
}
