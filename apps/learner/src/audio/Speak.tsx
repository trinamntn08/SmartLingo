import { useEffect, useState } from 'react';
import type { TargetLanguage } from '@smartlingo/domain';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { audio } from './index';
import { generatedPreferences } from './generated/preferences';
import { subscribeAudioNotice, subscribeGeneratedPreferences } from './generated/runtime';
import { GeneratedPhraseOptions } from './generated/GeneratedPhraseOptions';
import { Button } from '../ui/controls';
import { colors, designTokens, styles as s } from '../ui/theme';

export function Speak({ text, onError, language = 'fr-FR' }: { text: string; onError?: (message: string) => void; language?: TargetLanguage }) {
  const [state, setState] = useState<'idle' | 'playing'>('idle');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  useEffect(() => () => audio.stop(), [text, language]);
  const [neuralEnabled, setNeuralEnabled] = useState(() => generatedPreferences.get().enabled);
  const canGenerate = language === 'fr-FR' && neuralEnabled;
  const [options, setOptions] = useState(false);
  const [optionsFocused, setOptionsFocused] = useState(false);
  useEffect(() => subscribeGeneratedPreferences(() => setNeuralEnabled(generatedPreferences.get().enabled)), []);
  useEffect(() => subscribeAudioNotice(message => { if (state === 'playing') { setError(message); onError?.(message); } }), [state, onError]);
  useEffect(() => { setOptions(false); setError(''); }, [text, neuralEnabled, language]);
  useEffect(() => {
    if (!options || typeof document === 'undefined') return;
    // React Native Web activates its Escape handler after the modal's show lifecycle.
    // Handle the first keydown too, so dismissal never depends on an animation finishing.
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault(); event.stopPropagation(); setOptions(false);
    };
    document.addEventListener('keydown', closeOnEscape, true);
    return () => document.removeEventListener('keydown', closeOnEscape, true);
  }, [options]);
  async function play() {
    if (state === 'playing') { audio.stop(); setState('idle'); return; }
    setError(''); onError?.(''); setState('playing');
    try { await audio.speak(text, language); } catch (failure) {
      const message = failure instanceof Error ? failure.message : 'Voice is unavailable. You can continue using the text.';
      setError(message); onError?.(message);
    }
    finally { setState('idle'); }
  }
  const drawing = state === 'playing' ? `<rect x="6" y="6" width="12" height="12" rx="1" fill="${colors.audioIcon}"/>`
    : `<path d="M3 9h4l5-4v14l-5-4H3z" fill="none" stroke="${colors.audioIcon}" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 8q4 4 0 8m3-11q7 7 0 14" fill="none" stroke="${colors.audioIcon}" stroke-width="1.8" stroke-linecap="round"/>`;
  const icon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${drawing}</svg>`)}`;
  return <View style={{ gap: 6, maxWidth: '100%' }}>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}><Pressable accessibilityRole="button" accessibilityLabel={state === 'playing' ? 'Stop audio' : `Listen to ${text}`}
      onPress={() => void play()} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={({ pressed }) => ({ minWidth: designTokens.control.minimumTarget, minHeight: designTokens.control.minimumTarget, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center',
        borderRadius: 22, borderWidth: 2, borderColor: focused ? colors.focusRing : 'transparent', backgroundColor: pressed ? colors.sand : 'transparent' })}>
      <Image accessible={false} source={{ uri: icon }} style={{ width: designTokens.control.audioIconSize, height: designTokens.control.audioIconSize }} />
    </Pressable>
    {canGenerate && <Pressable accessibilityRole="button" accessibilityLabel={`Audio options for ${text}`} aria-expanded={options} onPress={() => setOptions(value => !value)}
      onFocus={() => setOptionsFocused(true)} onBlur={() => setOptionsFocused(false)}
      style={({ pressed }) => ({ minWidth: designTokens.control.minimumTarget, minHeight: designTokens.control.minimumTarget, justifyContent: 'center', alignItems: 'center', borderRadius: 22, borderWidth: 2, borderColor: optionsFocused ? colors.focusRing : 'transparent', backgroundColor: pressed ? colors.sand : 'transparent' })}><Text style={{ fontSize: 22, color: colors.ink }}>⋯</Text></Pressable>}</View>
    {canGenerate && options && <Modal transparent visible animationType="none" onRequestClose={() => setOptions(false)}>
      <View style={{ flex: 1, padding: 16, backgroundColor: colors.modalScrim, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView style={{ width: '100%', maxWidth: 520, maxHeight: '90%', backgroundColor: colors.card, borderRadius: 20 }} contentContainerStyle={{ padding: 18, gap: 14 }}>
          <Text accessibilityRole="header" style={s.heading}>Audio options</Text>
          <GeneratedPhraseOptions text={text} />
          <Button onPress={() => setOptions(false)}>Close audio options</Button>
        </ScrollView>
      </View>
    </Modal>}
    {!onError && !!error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{error}</Text>}</View>;
}
