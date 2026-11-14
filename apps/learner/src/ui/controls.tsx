import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { audio } from '../audio';
import { colors, styles as s } from './theme';

export function Button({ children, onPress, primary, selected, disabled, label }: {
  children: ReactNode; onPress: () => void; primary?: boolean; selected?: boolean; disabled?: boolean; label?: string;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} aria-selected={!!selected} aria-disabled={!!disabled} accessibilityState={{ disabled: !!disabled, selected: !!selected }}
    disabled={disabled} onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [s.button, primary && s.buttonPrimary, selected && s.buttonSelected,
      focused && { borderColor: '#246944', borderWidth: 3 }, { opacity: disabled ? 0.5 : pressed ? 0.75 : 1 }]}>
    <Text style={[s.buttonText, selected && { color: colors.card }]}>{children}</Text>
  </Pressable>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <View style={s.badge}><Text style={s.badgeText}>{children}</Text></View>;
}

export function Speak({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'playing'>('idle');
  const [error, setError] = useState('');
  useEffect(() => () => audio.stop(), [text]);
  async function play() {
    if (state === 'playing') { audio.stop(); setState('idle'); return; }
    setError(''); setState('playing');
    try { await audio.speak(text); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Voice is unavailable. Read the French text instead.'); }
    finally { setState('idle'); }
  }
  return <View style={{ gap: 6 }}><View style={s.row}><Button onPress={() => void play()} label={state === 'playing' ? 'Stop device voice' : `Listen to ${text}`}>
    {state === 'playing' ? '■ Stop' : '▷ Listen'}</Button></View>
    {!!error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>{error}</Text>}</View>;
}
