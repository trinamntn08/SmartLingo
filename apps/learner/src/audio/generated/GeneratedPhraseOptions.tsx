import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../../ui/controls';
import { colors, styles as s } from '../../ui/theme';
import { generatedPreferences } from './preferences';
import { generatedAudioStore } from './store';
import { useGeneratedPhrase } from './usePhrase';
import { subscribeGeneratedPreferences } from './runtime';

export function GeneratedPhraseOptions({ text }: { text: string }) {
  const [settings, setSettings] = useState(generatedPreferences.get);
  useEffect(() => subscribeGeneratedPreferences(() => setSettings(generatedPreferences.get())), []);
  const phrase = useGeneratedPhrase({ text, voice: settings.voice, pace: settings.pace });
  const supported = generatedAudioStore.supported();
  return <View style={{ gap: 8, maxWidth: '100%', padding: 10, backgroundColor: colors.sand, borderRadius: 12 }}>
    <Text style={s.muted}>{settings.voice.includes('Denise') ? 'Denise' : 'Henri'} · {settings.pace}. Sends this French text to Azure through the local server. Generation may use API credits.</Text>
    <Text style={s.body}>{text}</Text>
    {!supported && <Text style={s.muted}>Saving audio is unavailable in this browser. Device speech and text remain available.</Text>}
    <View style={s.row}>
      <Button disabled={!supported || phrase.busy || text.trim().length === 0 || text.trim().length > 500} onPress={() => void phrase.save()}>{phrase.busy ? 'Generating…' : 'Generate and save (may use credits)'}</Button>
      {phrase.busy && <Button onPress={phrase.cancel}>Cancel generation</Button>}
    </View>
    {phrase.saved && <Text accessibilityLiveRegion="polite" style={s.muted}>Saved audio is available for this text and voice.</Text>}
    {!!phrase.notice && <Text accessibilityLiveRegion="polite" style={s.muted}>{phrase.notice}</Text>}
    {!!phrase.error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{phrase.error}</Text>}
    {!!phrase.error && <Text style={s.muted}>Use Generate and save again to retry explicitly. An uncertain attempt reuses its request ID; an ended attempt starts a new one.</Text>}
  </View>;
}
