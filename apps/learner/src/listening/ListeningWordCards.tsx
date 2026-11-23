import { useId, useLayoutEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '../ui/controls';
import { colors, designTokens as tokens, styles as s } from '../ui/theme';

export function ListeningWordCards({ cards, selected, onToggle }: {
  cards: readonly { text: string }[]; selected: readonly number[]; onToggle: (index: number) => void;
}) {
  const language = Platform.OS === 'web' ? { lang: 'fr-FR' } : { accessibilityLanguage: 'fr-FR' };
  const id = useId();
  const focusTarget = useRef<string | null>(null);
  const cardId = (index: number, inTray: boolean) => `${id}-${index}-${inTray ? 'tray' : 'bank'}`;

  useLayoutEffect(() => {
    if (Platform.OS !== 'web' || !focusTarget.current) return;
    document.getElementById(focusTarget.current)?.focus();
    focusTarget.current = null;
  }, [selected]);

  function moveCard(index: number, toTray: boolean) {
    if (Platform.OS === 'web' && document.activeElement?.matches(':focus-visible')) focusTarget.current = cardId(index, toTray);
    onToggle(index);
  }

  return <View style={layout.exercise}>
    <Text accessibilityRole="header" aria-level={3} style={layout.heading}>Build the sentence you hear</Text>
    <View role="group" accessibilityLabel="Your sentence" testID="listening-card-tray" style={layout.tray}>
      {selected.length ? <View style={layout.cards}>
        {selected.map(index => <Button key={index} nativeID={cardId(index, true)} compact selected label={`Remove ${cards[index]!.text}`}
          onPress={() => moveCard(index, false)}>
          <Text {...language}>{cards[index]!.text}</Text><Text aria-hidden> ×</Text>
        </Button>)}
      </View> : <Text style={s.muted}>Tap the cards in the order you hear them.</Text>}
    </View>
    <View role="group" accessibilityLabel="Word cards" testID="listening-card-bank" style={layout.cards}>
      {cards.map(({ text }, index) => <Button key={index} nativeID={cardId(index, false)} compact disabled={selected.includes(index)}
        onPress={() => moveCard(index, true)}>
        <Text {...language}>{text}</Text>
      </Button>)}
    </View>
  </View>;
}

const layout = StyleSheet.create({
  exercise: { gap: tokens.space.md, minWidth: 0 },
  heading: { ...tokens.typography.sectionHeading, fontSize: 21, lineHeight: 27, color: colors.ink },
  cards: { ...s.row, gap: tokens.space.sm },
  tray: { justifyContent: 'center', minHeight: 60, padding: tokens.space.sm, borderRadius: tokens.radius.md,
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.inputBorder, backgroundColor: colors.paper },
});
