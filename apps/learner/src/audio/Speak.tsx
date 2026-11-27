import { useEffect, useState } from 'react';
import type { TargetLanguage } from '@smartlingo/domain';
import { Modal, Pressable, ScrollView, Text, View, type StyleProp, type TextStyle } from 'react-native';
import { audio, playAudio } from './index';
import { generatedPreferences } from './generated/preferences';
import { subscribeAudioNotice, subscribeGeneratedPreferences } from './generated/runtime';
import { GeneratedPhraseOptions } from './generated/GeneratedPhraseOptions';
import { AudioIconButton } from './AudioIconButton';
import { WordPlaybackButton } from './WordPlaybackButton';
import { Button } from '../ui/controls';
import { colors, designTokens, styles as s } from '../ui/theme';

export function Speak({ text, onError, onPlayed, language = 'fr-FR', label = `Listen to ${text}`, wordStyle, headingLevel }: {
  text: string; onError?: (message: string) => void; onPlayed?: () => void; language?: TargetLanguage; label?: string;
  wordStyle?: StyleProp<TextStyle>; headingLevel?: 2 | 3;
}) {
  const [state, setState] = useState<'idle' | 'playing'>('idle');
  const [error, setError] = useState('');
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
    try { if (await playAudio(text, language)) onPlayed?.(); } catch (failure) {
      const message = failure instanceof Error ? failure.message : 'Voice is unavailable. You can continue using the text.';
      setError(message); onError?.(message);
    }
    finally { setState('idle'); }
  }
  return <View style={{ gap: 6, minWidth: 0, maxWidth: '100%', flexShrink: 1 }}>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
    {wordStyle
      ? <WordPlaybackButton text={text} language={language} playing={state === 'playing'} onPress={() => void play()}
        label={label} textStyle={wordStyle} headingLevel={headingLevel} />
      : <AudioIconButton playing={state === 'playing'} label={label} onPress={() => void play()} />}
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
