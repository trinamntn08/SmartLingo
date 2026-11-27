import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { NotebookEntry } from '@smartlingo/domain';
import { Icon } from './Icon';
import { colors, designTokens as tokens } from './theme';
import type { LearningModel } from './useLearning';

export function NotebookStar({ entry, model, onChange }: {
  entry: Omit<NotebookEntry, 'updatedAt'>;
  model: LearningModel;
  onChange?: (saved: boolean) => void;
}) {
  const [focused, setFocused] = useState(false);
  const savedEntries = model.notebook.filter(note => note.id === entry.id || note.sourceEntryId === entry.sourceEntryId);
  const saved = savedEntries.length > 0;

  function toggle() {
    if (saved) {
      model.removeEntries(savedEntries.map(note => note.id), () => onChange?.(false));
    } else {
      model.captureEntry({ ...entry, updatedAt: new Date().toISOString() }, () => onChange?.(true));
    }
  }

  return <Pressable accessibilityRole="button" accessibilityLabel={`${saved ? 'Unsave' : 'Save'} ${entry.target}`}
    aria-pressed={saved} accessibilityState={{ disabled: model.blocked }} disabled={model.blocked} onPress={toggle}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [styles.star, saved && styles.saved, pressed && styles.pressed,
      focused && !model.blocked && styles.focused, model.blocked && styles.disabled]}>
    <Icon name={saved ? 'star-filled' : 'star'} color={saved ? colors.primary : colors.ink} />
  </Pressable>;
}

const styles = StyleSheet.create({
  star: { minWidth: tokens.control.minimumTarget, minHeight: tokens.control.minimumTarget, alignItems: 'center',
    justifyContent: 'center', borderRadius: tokens.radius.sm, borderWidth: 2, borderColor: colors.line },
  saved: { backgroundColor: colors.goldTint, borderColor: 'transparent' },
  pressed: { backgroundColor: colors.sand },
  focused: { borderColor: colors.focusRing },
  disabled: { opacity: tokens.opacity.disabled },
});
