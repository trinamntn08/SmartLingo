import type { PreferenceStorage } from '../preferences';

export const japaneseSources = ['auto', 'device', 'voicevox'] as const;
export type JapaneseSource = typeof japaneseSources[number];
const key = 'smartlingo.japanese-audio-source.v1';
export function createJapaneseSourceStore(storage: () => PreferenceStorage | undefined) {
  let current: JapaneseSource = 'auto';
  let loaded = false;
  return {
    get(): JapaneseSource {
      if (!loaded) {
        loaded = true;
        try {
          const value = JSON.parse(storage()?.getItem(key) ?? 'null') as { version?: number; source?: JapaneseSource } | null;
          if (value?.version === 1 && japaneseSources.includes(value.source!)) current = value.source!;
        } catch { /* Default also works when storage is unavailable. */ }
      }
      return current;
    },
    save(source: JapaneseSource): boolean {
      if (!japaneseSources.includes(source)) return false;
      current = source; loaded = true;
      try {
        const target = storage();
        if (!target) return false;
        target.setItem(key, JSON.stringify({ version: 1, source }));
        return true;
      } catch { return false; }
    },
  };
}
export const japaneseSource = createJapaneseSourceStore(() => globalThis.localStorage);
