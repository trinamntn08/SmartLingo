import { useEffect, useState, type ReactNode } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { audio } from '../audio';
import { generatedPreferences } from '../audio/generated/preferences';
import { subscribeAudioNotice, subscribeGeneratedPreferences } from '../audio/generated/runtime';
import { GeneratedPhraseOptions } from '../audio/generated/GeneratedPhraseOptions';
import { colors, styles as s } from './theme';

export function Button({ children, onPress, primary, selected, disabled, label }: {
  children: ReactNode; onPress: () => void; primary?: boolean; selected?: boolean; disabled?: boolean; label?: string;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} aria-selected={!!selected} aria-disabled={!!disabled} accessibilityState={{ disabled: !!disabled, selected: !!selected }}
    disabled={disabled} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [s.button, { maxWidth: '100%', minWidth: 0, flexShrink: 1 }, primary && s.buttonPrimary, selected && s.buttonSelected,
      focused && { borderColor: '#246944', borderWidth: 3 }, { opacity: disabled ? 0.5 : pressed ? 0.75 : 1 }]}>
    <Text style={[s.buttonText, { maxWidth: '100%', flexShrink: 1 }, selected && { color: colors.card }]}>{children}</Text>
  </Pressable>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <View style={s.badge}><Text style={s.badgeText}>{children}</Text></View>;
}

export function Speak({ text, onError }: { text: string; onError?: (message: string) => void }) {
  const [state, setState] = useState<'idle' | 'playing'>('idle');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  useEffect(() => () => audio.stop(), [text]);
  const [neuralEnabled, setNeuralEnabled] = useState(() => generatedPreferences.get().enabled);
  const [options, setOptions] = useState(false);
  const [optionsFocused, setOptionsFocused] = useState(false);
  useEffect(() => subscribeGeneratedPreferences(() => setNeuralEnabled(generatedPreferences.get().enabled)), []);
  useEffect(() => subscribeAudioNotice(message => { if (state === 'playing') { setError(message); onError?.(message); } }), [state, onError]);
  useEffect(() => { setOptions(false); }, [text, neuralEnabled]);
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
    try { await audio.speak(text); } catch (failure) {
      const message = failure instanceof Error ? failure.message : 'Voice is unavailable. Read the French text instead.';
      setError(message); onError?.(message);
    }
    finally { setState('idle'); }
  }
  const drawing = state === 'playing' ? '<rect x="6" y="6" width="12" height="12" rx="1" fill="#19201D"/>'
    : '<path d="M3 9h4l5-4v14l-5-4H3z" fill="none" stroke="#19201D" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 8q4 4 0 8m3-11q7 7 0 14" fill="none" stroke="#19201D" stroke-width="1.8" stroke-linecap="round"/>';
  const icon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${drawing}</svg>`)}`;
  return <View style={{ gap: 6, maxWidth: '100%' }}>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}><Pressable accessibilityRole="button" accessibilityLabel={state === 'playing' ? 'Stop audio' : `Listen to ${text}`}
      onPress={() => void play()} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={({ pressed }) => ({ minWidth: 44, minHeight: 44, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center',
        borderRadius: 22, borderWidth: 2, borderColor: focused ? '#246944' : 'transparent', backgroundColor: pressed ? colors.sand : 'transparent' })}>
      <Image accessible={false} source={{ uri: icon }} style={{ width: 22, height: 22 }} />
    </Pressable>
    {neuralEnabled && <Pressable accessibilityRole="button" accessibilityLabel={`Audio options for ${text}`} aria-expanded={options} onPress={() => setOptions(value => !value)}
      onFocus={() => setOptionsFocused(true)} onBlur={() => setOptionsFocused(false)}
      style={({ pressed }) => ({ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 22, borderWidth: 2, borderColor: optionsFocused ? '#246944' : 'transparent', backgroundColor: pressed ? colors.sand : 'transparent' })}><Text style={{ fontSize: 22, color: colors.ink }}>⋯</Text></Pressable>}</View>
    {neuralEnabled && options && <Modal transparent visible animationType="none" onRequestClose={() => setOptions(false)}>
      <View style={{ flex: 1, padding: 16, backgroundColor: 'rgba(25,32,29,0.35)', justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView style={{ width: '100%', maxWidth: 520, maxHeight: '90%', backgroundColor: colors.card, borderRadius: 20 }} contentContainerStyle={{ padding: 18, gap: 14 }}>
          <Text accessibilityRole="header" style={s.heading}>Audio options</Text>
          <GeneratedPhraseOptions text={text} />
          <Button onPress={() => setOptions(false)}>Close audio options</Button>
        </ScrollView>
      </View>
    </Modal>}
    {!onError && !!error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{error}</Text>}</View>;
}
