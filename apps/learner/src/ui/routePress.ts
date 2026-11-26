import { Platform, type GestureResponderEvent } from 'react-native';
import { learnerDocumentHref } from '../platform/runtime';

/** Keep browser link actions available while ordinary clicks use in-page navigation. */
export function routePress(href: string | undefined, onPress: () => void) {
  if (!href || Platform.OS !== 'web') return { onPress };
  return {
    href: learnerDocumentHref(href),
    onPress: (event: GestureResponderEvent) => {
      const click = event.nativeEvent as unknown as MouseEvent;
      if (click.metaKey || click.ctrlKey || click.shiftKey || click.altKey || click.button > 0) return;
      event.preventDefault();
      onPress();
    },
  };
}
