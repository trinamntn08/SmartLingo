import { BrowserClipPlayer } from './player';
import { generatedPreferences } from './preferences';
export const savedClipPlayer = new BrowserClipPlayer();
const listeners = new Set<(message: string) => void>();
export function reportAudioNotice(message: string) { listeners.forEach(listener => listener(message)); }
export function subscribeAudioNotice(listener: (message: string) => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function subscribeGeneratedPreferences(listener: () => void) {
  const unsubscribe = generatedPreferences.subscribe(listener);
  const refresh = () => listener();
  globalThis.addEventListener?.('storage', refresh);
  return () => { unsubscribe(); globalThis.removeEventListener?.('storage', refresh); };
}
